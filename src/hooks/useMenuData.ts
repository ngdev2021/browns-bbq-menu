import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  tags: string[];
  stock: number;
  featured: boolean;
}

export function useMenuData() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        setMenuItems(data as MenuItem[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error fetching menu data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchMenu();

    // Set up real-time subscription
    const subscription = supabase
      .channel('menu_changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'menu_items' }, 
        (payload) => {
          console.log('Menu item updated:', payload);
          // Update the specific item in the state
          setMenuItems(currentItems => {
            return currentItems.map(item => {
              if (item.id === payload.new.id) {
                return { ...item, ...payload.new };
              }
              return item;
            });
          });
        }
      )
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'menu_items' }, 
        (payload) => {
          console.log('Menu item added:', payload);
          setMenuItems(currentItems => [...currentItems, payload.new as MenuItem]);
        }
      )
      .on('postgres_changes', 
        { event: 'DELETE', schema: 'public', table: 'menu_items' }, 
        (payload) => {
          console.log('Menu item deleted:', payload);
          setMenuItems(currentItems => 
            currentItems.filter(item => item.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    menuItems,
    loading,
    error,
    fetchMenu
  };
}