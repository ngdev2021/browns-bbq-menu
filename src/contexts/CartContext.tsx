import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItemOption {
  group_id: string;
  group_name: string;
  option_id: string;
  option_name: string;
  price: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  options?: CartItemOption[];
  special_instructions?: string;
  isCombo?: boolean;
  combo_items?: any[];
  isMultiMeatPlate?: boolean;
  secondMeat?: {
    id: string;
    name: string;
    price: number;
  } | null;
  selectedSides?: {
    id: string;
    name: string;
    price: number;
  }[];
  selectedDessert?: {
    id: string;
    name: string;
    price: number;
  } | null;
  bundleAccepted?: boolean;
  bundleItems?: {
    side: {
      id: string;
      name: string;
      price: number;
    } | null;
    drink: {
      id: string;
      name: string;
      price: number;
    } | null;
    bundlePrice: number;
  } | null;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: any, options?: any[], specialInstructions?: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  editItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  totalItems: number;
  subtotal: number;
  addCombo: (combo: any) => void;
  addPlate: (plate: any) => void;
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
  const addItem = (item: any, options?: any[], specialInstructions?: string) => {
    // Generate a unique ID for customized items
    const itemId = options && options.length > 0 
      ? `${item.id}-${Date.now()}` // Custom items get unique IDs
      : item.id;
    
    // Check if the item has customizations (sides, second meat, dessert, etc.)
    const hasCustomizations = 
      (item.selectedSides && item.selectedSides.length > 0) ||
      item.secondMeat ||
      item.selectedDessert ||
      item.isMultiMeatPlate ||
      item.bundleAccepted;
    
    // For items with sides or other customizations, always add as new
    if (hasCustomizations) {
      // Create a new unique ID for customized items
      const customItemId = `${item.id}-${Date.now()}`;
      
      setItems(prev => [
        ...prev, 
        {
          id: customItemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          image_url: item.image_url,
          special_instructions: item.specialInstructions || specialInstructions,
          // Preserve customizations
          isMultiMeatPlate: item.isMultiMeatPlate,
          secondMeat: item.secondMeat,
          selectedSides: item.selectedSides,
          selectedDessert: item.selectedDessert,
          bundleAccepted: item.bundleAccepted
        }
      ]);
      return;
    }
    
    // Calculate total price including options
    let totalPrice = item.price;
    if (options && options.length > 0) {
      totalPrice += options.reduce((sum, option) => sum + (option.price || 0), 0);
    }
    
    setItems(prev => {
      // For customized items with options, always add as new
      if (options && options.length > 0) {
        return [...prev, {
          id: itemId,
          name: item.name,
          price: totalPrice,
          quantity: 1,
          image_url: item.image_url,
          options: options,
          special_instructions: specialInstructions
        }];
      }
      
      // For regular items, check if already in cart
      const existingItem = prev.find(cartItem => 
        cartItem.id === itemId && 
        !cartItem.options && 
        !cartItem.special_instructions
      );
      
      if (existingItem) {
        // Update quantity
        return prev.map(cartItem => 
          cartItem.id === itemId && !cartItem.options
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        // Add new item
        return [...prev, {
          id: itemId,
          name: item.name,
          price: totalPrice,
          quantity: 1,
          image_url: item.image_url,
          special_instructions: specialInstructions
        }];
      }
    });
  };
  
  // Add combo to cart
  const addCombo = (combo: any) => {
    const comboId = `combo-${combo.template_id}-${Date.now()}`;
    
    setItems(prev => [
      ...prev,
      {
        id: comboId,
        name: combo.name,
        price: combo.total_price / combo.quantity,
        quantity: combo.quantity,
        image_url: combo.image_url,
        special_instructions: combo.special_instructions,
        isCombo: true,
        combo_items: combo.items
      }
    ]);
  };
  
  // Add plate to cart (with meat selections and sides)
  const addPlate = (plate: any) => {
    const plateId = `plate-${plate.plateSize}-${Date.now()}`;
    
    setItems(prev => [
      ...prev,
      {
        id: plateId,
        name: plate.name,
        price: plate.price,
        quantity: plate.quantity || 1,
        image_url: plate.image_url,
        special_instructions: plate.special_instructions,
        isPlate: true,
        plateSize: plate.plateSize,
        selectedMeats: plate.selectedMeats,
        selectedSides: plate.selectedSides
      }
    ]);
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

  // Edit cart item
  const editItem = (id: string, updates: Partial<CartItem>) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
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
    editItem,
    clearCart,
    isOpen,
    setIsOpen,
    totalItems,
    subtotal,
    addCombo,
    addPlate
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
