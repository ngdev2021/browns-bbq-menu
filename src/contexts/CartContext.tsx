import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: any) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Add item to cart
  const addItem = (item: any) => {
    setItems(prev => {
      // Check if item is already in cart
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Update quantity
        return prev.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        // Add new item
        return [...prev, {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image_url: item.image_url
        }];
      }
    });
  };

  // Update cart item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      setItems(prev => prev.filter(item => item.id !== id));
    } else {
      // Update quantity
      setItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
  };

  // Calculate total items in cart
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // Calculate subtotal
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const value = {
    items,
    addItem,
    updateQuantity,
    clearCart,
    isOpen,
    setIsOpen,
    totalItems,
    subtotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
