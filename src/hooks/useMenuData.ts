import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { MenuItem } from '../lib/menuService';

// Using MenuItem from menuService

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
    const channel = supabase.channel('menu_changes');
    
    // Handle UPDATE events
    channel.on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'menu_items' },
      (payload: RealtimePostgresChangesPayload<Record<string, any>>) => {
        console.log('Menu item updated:', payload);
        // Update the specific item in the state
        if (payload.new && 'id' in payload.new) {
          const newItem = payload.new as Record<string, any>;
          setMenuItems(currentItems => {
            return currentItems.map(item => {
              if (item.id === newItem.id) {
                return { ...item, ...newItem } as MenuItem;
              }
              return item;
            });
          });
        }
      }
    );
    
    // Handle INSERT events
    channel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'menu_items' },
      (payload: RealtimePostgresChangesPayload<Record<string, any>>) => {
        console.log('Menu item added:', payload);
        if (payload.new) {
          setMenuItems(currentItems => [...currentItems, payload.new as MenuItem]);
        }
      }
    );
    
    // Handle DELETE events
    channel.on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'menu_items' },
      (payload: RealtimePostgresChangesPayload<Record<string, any>>) => {
        console.log('Menu item deleted:', payload);
        if (payload.old && 'id' in payload.old) {
          const oldItem = payload.old as Record<string, any>;
          setMenuItems(currentItems => 
            currentItems.filter(item => item.id !== oldItem.id)
          );
        }
      }
    );
    
    // Subscribe to the channel
    const subscription = channel.subscribe();

    // Cleanup subscription on unmount
    return () => {
      // Use type assertion to bypass TypeScript errors
      (supabase as any).removeChannel(channel);
    };
  }, []);

  return {
    menuItems,
    loading,
    error,
    fetchMenu
  };
}