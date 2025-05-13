import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { getMenuItemsSync, MenuItem as MenuServiceItem } from '../../lib/menuService';
import { useCart } from '../../contexts/CartContext';
import { getModifiersForMenuItem } from '../../data/menuCustomizationData';
import { getUpsellRecommendations, getRelatedItems } from '../../lib/upsellEngine';
import MultiMeatUpgrade from '../../components/MultiMeatUpgrade';
import SpecialBundleOffer from '../../components/SpecialBundleOffer';
import CartDrawer from '../../components/CartDrawer';
import Toast from '../../components/Toast';
import NetworkStatus from '../../components/NetworkStatus';

// Get menu items
const menuItems = getMenuItemsSync();

// Use MenuItem type from menuService
type MenuItem = MenuServiceItem & {
  images?: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface Option {
  id: string;
  name: string;
  price: number;
  description?: string;
}

interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  min_selections: number;
  max_selections: number;
  options: Option[];
}

interface SelectedOption {
  group_id: string;
  group_name: string;
  option_id: string;
  option_name: string;
  price: number;
}

interface ItemConfiguration {
  selectedOptions: SelectedOption[];
  specialInstructions: string;
  quantity: number;
  totalPrice: number;
}

// Define configuration steps
enum ConfigStep {
  MEAT_SELECTION = 'meat',
  SIDES_SELECTION = 'sides',
  ADDONS = 'addons',
  SPECIAL_INSTRUCTIONS = 'instructions',
  REVIEW = 'review'
}

const ItemConfigurationPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  
  // Cart context
  const { addItem, editItem, updateQuantity, items: cartItems, isOpen: isCartOpen, setIsOpen: setIsCartOpen } = useCart();
  
  // State for item and configuration
  const [item, setItem] = useState<MenuItem | null>(null);
  const [currentStep, setCurrentStep] = useState<ConfigStep>(ConfigStep.MEAT_SELECTION);
  const [configuration, setConfiguration] = useState<ItemConfiguration>({
    selectedOptions: [],
    specialInstructions: '',
    quantity: 1,
    totalPrice: 0
  });
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>([]);
  const [upsellRecommendations, setUpsellRecommendations] = useState<{id: string, items: MenuItem[]}[]>([]);
  const [relatedItems, setRelatedItems] = useState<MenuItem[]>([]);
  
  // Multi-meat upgrade and bundle offer states
  const [showMultiMeatUpgrade, setShowMultiMeatUpgrade] = useState<boolean>(false);
  const [showBundleOffer, setShowBundleOffer] = useState<boolean>(false);
  const [availableMeats, setAvailableMeats] = useState<MenuItem[]>([]);
  const [secondMeat, setSecondMeat] = useState<MenuItem | null>(null);
  const [isMultiMeatPlate, setIsMultiMeatPlate] = useState<boolean>(false);
  const [bundleAccepted, setBundleAccepted] = useState<boolean>(false);
  const [selectedBundleSide, setSelectedBundleSide] = useState<any>(null);
  const [selectedBundleDrink, setSelectedBundleDrink] = useState<any>(null);
  const [bundleProps, setBundleProps] = useState<any>({
    title: "Special Bundle Offer",
    description: "Get a drink and a side with your meal at a special discounted price!",
    savings: "SAVE $3",
    imageUrl: "/images/menu-items/combo-special.jpg",
    originalPrice: 8.98,
    discountedPrice: 5.99
  });
  
  // Side selection state
  const [selectedSides, setSelectedSides] = useState<MenuItem[]>([]);
  const [maxSides, setMaxSides] = useState<number>(2);
  
  // Dessert upsell state
  const [showDessertUpsell, setShowDessertUpsell] = useState<boolean>(false);
  const [selectedDessert, setSelectedDessert] = useState<MenuItem | null>(null);
  
  // Toast notification
  const [toast, setToast] = useState({ message: '', visible: false });
  
  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };
  
  // Load item data
  useEffect(() => {
    if (id) {
      const foundItem = menuItems.find(item => item.id === id) as MenuItem;
      if (foundItem) {
        setItem(foundItem);
        setConfiguration(prev => ({
          ...prev,
          totalPrice: foundItem.price
        }));
        
        // Set sides requirements based on item category
        if (foundItem.category === 'plates') {
          // Plates require sides
          setMaxSides(2);
        } else if (foundItem.category === 'sandwiches') {
          // Sandwiches don't require sides
          setMaxSides(0);
        }
        
        // Get modifier groups for this item
        const groups = getModifiersForMenuItem(id as string) as ModifierGroup[];
        if (groups) {
          setModifierGroups(groups);
        }
        
        // Get related items
        const related = getRelatedItems(foundItem, menuItems, 3);
        setRelatedItems(related);
        
        // Get upsell recommendations
        const recommendations = getUpsellRecommendations([], menuItems, 2);
        setUpsellRecommendations(recommendations);
        
        // Check if this is a single meat plate (for multi-meat upgrade)
        const isSingleMeatPlate = 
          foundItem.category === 'plates' && 
          foundItem.name.toLowerCase().includes('plate') &&
          !foundItem.name.toLowerCase().includes('2-meat') && 
          !foundItem.name.toLowerCase().includes('two meat') &&
          !foundItem.name.toLowerCase().includes('multi meat');
        
        // Find available meats for second meat option (excluding the current meat)
        const currentMeatTypes = ['brisket', 'ribs', 'sausage', 'turkey', 'chicken', 'pulled pork'];
        const currentMeatType = currentMeatTypes.find(meat => 
          foundItem.name.toLowerCase().includes(meat)
        );
        
        if (isSingleMeatPlate && currentMeatType) {
          // Filter available meats to exclude the current meat type
          const meatItems = menuItems.filter(item => 
            item.category === 'meats' && 
            currentMeatTypes.some(meat => item.name.toLowerCase().includes(meat)) &&
            !item.name.toLowerCase().includes(currentMeatType)
          );
          
          if (meatItems.length > 0) {
            setAvailableMeats(meatItems);
            // Show multi-meat upgrade after a short delay
            setTimeout(() => setShowMultiMeatUpgrade(true), 1000);
          }
        }
        
        // Determine if the current item is a main dish
        const isMainDish = ['plates', 'sandwiches', 'meats'].includes(foundItem.category);
        
        // Check what's already in the cart to make contextual offers based on cart items from the component state
        const hasDrink = cartItems.some(item => 
          item.name.toLowerCase().includes('drink') || 
          item.name.toLowerCase().includes('soda') || 
          item.name.toLowerCase().includes('tea')
        );
        
        const hasSide = cartItems.some(item => 
          item.name.toLowerCase().includes('side') || 
          item.name.toLowerCase().includes('beans') || 
          item.name.toLowerCase().includes('potato') || 
          item.name.toLowerCase().includes('slaw')
        );
        
        // Only show bundle if they don't already have both a drink and side
        // and they're ordering a main dish, and we're not showing the multi-meat upgrade
        const shouldShowBundle = 
          isMainDish && 
          (!hasDrink || !hasSide) && 
          !isSingleMeatPlate;
        
        if (shouldShowBundle) {
          // Customize bundle offer based on what's missing
          const bundleTitle = !hasDrink && !hasSide
            ? "Complete Your Meal Bundle"
            : !hasDrink
              ? "Add a Drink to Your Meal"
              : "Add a Side to Your Meal";
              
          const bundleDescription = !hasDrink && !hasSide
            ? "Add a drink and a side to complete your meal!"
            : !hasDrink
              ? "Wash down your BBQ with a refreshing drink!"
              : "Round out your meal with a delicious side!";
              
          const bundleSavings = !hasDrink && !hasSide ? "SAVE $3" : "SAVE $1.50";
          const originalPrice = !hasDrink && !hasSide ? 8.98 : 4.49;
          const discountedPrice = !hasDrink && !hasSide ? 5.99 : 2.99;
          
          // Set bundle props
          setBundleProps({
            title: bundleTitle,
            description: bundleDescription,
            savings: bundleSavings,
            imageUrl: !hasDrink 
              ? "/images/menu-items/drinks.jpg" 
              : "/images/menu-items/sides.jpg",
            originalPrice,
            discountedPrice
          });
          
          // Show bundle offer after a short delay
          setTimeout(() => setShowBundleOffer(true), 1500);
        }
      }
    }
  }, [id]);
  
  // Handle multi-meat upgrade selection
  const handleMultiMeatUpgrade = (selectedMeat: MenuItem) => {
    setSecondMeat(selectedMeat);
    setIsMultiMeatPlate(true);
    setShowMultiMeatUpgrade(false);
    
    // Update price (add $4 for the upgrade)
    setConfiguration(prev => ({
      ...prev,
      totalPrice: prev.totalPrice + 4.00
    }));
    
    // Increase max sides to 3 for multi-meat plates
    setMaxSides(3);
    
    // Show toast notification
    setToast({ 
      message: `Added ${selectedMeat.name} as your second meat!`, 
      visible: true 
    });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    
    // Move to sides selection
    setCurrentStep(ConfigStep.SIDES_SELECTION);
  };
  
  // Handle declining multi-meat upgrade
  const handleDeclineMultiMeatUpgrade = () => {
    setShowMultiMeatUpgrade(false);
    setCurrentStep(ConfigStep.SIDES_SELECTION);
  };
  
  // Handle accepting bundle offer
  const handleAcceptBundleOffer = (selectedSide: any, selectedDrink: any) => {
    setBundleAccepted(true);
    setShowBundleOffer(false);
    setSelectedBundleSide(selectedSide);
    setSelectedBundleDrink(selectedDrink);
    
    // Update price (add bundle price)
    const bundlePrice = bundleProps.discountedPrice || 5.99;
    setConfiguration(prev => ({
      ...prev,
      totalPrice: prev.totalPrice + bundlePrice
    }));
    
    // Show toast notification
    setToast({ 
      message: `Added ${selectedDrink.name} and ${selectedSide.name} to your order!`, 
      visible: true 
    });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };
  
  // Handle declining bundle offer
  const handleDeclineBundleOffer = () => {
    setShowBundleOffer(false);
  };
  
  // Handle side selection
  const handleSideSelect = (side: MenuItem) => {
    // Check if already selected
    const isAlreadySelected = selectedSides.some(s => s.id === side.id);
    
    if (isAlreadySelected) {
      // Remove from selection
      setSelectedSides(prev => prev.filter(s => s.id !== side.id));
    } else if (selectedSides.length < maxSides) {
      // Add to selection
      setSelectedSides(prev => [...prev, side]);
    } else {
      // Replace the first side with the new one
      setSelectedSides(prev => [prev[1], side]);
      
      // Show toast notification
      setToast({ 
        message: `Replaced ${selectedSides[0].name} with ${side.name}`, 
        visible: true 
      });
      setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    }
  };
  
  // Handle dessert selection
  const handleDessertSelect = (dessert: MenuItem) => {
    setSelectedDessert(dessert);
    setShowDessertUpsell(false);
    
    // Update price
    setConfiguration(prev => ({
      ...prev,
      totalPrice: prev.totalPrice + dessert.price
    }));
    
    // Show toast notification
    setToast({ 
      message: `Added ${dessert.name} to your order!`, 
      visible: true 
    });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    
    // Move to special instructions
    setCurrentStep(ConfigStep.SPECIAL_INSTRUCTIONS);
  };
  
  // Handle declining dessert
  const handleDeclineDessert = () => {
    setShowDessertUpsell(false);
    setCurrentStep(ConfigStep.SPECIAL_INSTRUCTIONS);
  };
  
  // Handle special instructions
  const handleSpecialInstructions = (instructions: string) => {
    setConfiguration(prev => ({
      ...prev,
      specialInstructions: instructions
    }));
  };
  
  // Handle quantity change
  const handleQuantityChange = (quantity: number) => {
    setConfiguration(prev => ({
      ...prev,
      quantity
    }));
  };
  
  // Go to next step
  const goToNextStep = () => {
    switch (currentStep) {
      case ConfigStep.MEAT_SELECTION:
        // Skip sides selection for items that don't require sides
        if (maxSides === 0) {
          setCurrentStep(ConfigStep.SPECIAL_INSTRUCTIONS);
        } else {
          setCurrentStep(ConfigStep.SIDES_SELECTION);
        }
        break;
      case ConfigStep.SIDES_SELECTION:
        // If sides are required, check if the correct number is selected
        if (maxSides > 0 && selectedSides.length < maxSides) {
          setToast({ 
            message: `Please select ${maxSides} sides`, 
            visible: true 
          });
          setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
        } else {
          // Proceed to dessert upsell or next step
          setShowDessertUpsell(true);
        }
        break;
      case ConfigStep.ADDONS:
        setCurrentStep(ConfigStep.SPECIAL_INSTRUCTIONS);
        break;
      case ConfigStep.SPECIAL_INSTRUCTIONS:
        setCurrentStep(ConfigStep.REVIEW);
        break;
      case ConfigStep.REVIEW:
        handleAddToCart();
        break;
    }
  };
  
  // Go to previous step
  const goToPreviousStep = () => {
    switch (currentStep) {
      case ConfigStep.SIDES_SELECTION:
        setCurrentStep(ConfigStep.MEAT_SELECTION);
        break;
      case ConfigStep.ADDONS:
        setCurrentStep(ConfigStep.SIDES_SELECTION);
        break;
      case ConfigStep.SPECIAL_INSTRUCTIONS:
        setCurrentStep(ConfigStep.ADDONS);
        break;
      case ConfigStep.REVIEW:
        setCurrentStep(ConfigStep.SPECIAL_INSTRUCTIONS);
        break;
    }
  };
  
  // Add configured item to cart
  const handleAddToCart = () => {
    if (!item) return;
    
    // Create a complete item with all configurations
    const configuredItem = {
      ...item,
      price: configuration.totalPrice,
      quantity: configuration.quantity,
      specialInstructions: configuration.specialInstructions,
      selectedOptions: configuration.selectedOptions,
      isMultiMeatPlate,
      secondMeat: secondMeat ? {
        id: secondMeat.id,
        name: secondMeat.name,
        price: 4.00
      } : null,
      // Only include sides if they've been selected
      selectedSides: selectedSides.length > 0 ? 
        selectedSides.map(side => ({
          id: side.id,
          name: side.name,
          price: side.price
        })) : 
        undefined,
      selectedDessert: selectedDessert ? {
        id: selectedDessert.id,
        name: selectedDessert.name,
        price: selectedDessert.price
      } : null,
      bundleAccepted,
      // Include bundle items if bundle was accepted
      bundleItems: bundleAccepted ? {
        side: selectedBundleSide ? {
          id: selectedBundleSide.id,
          name: selectedBundleSide.name,
          price: selectedBundleSide.price
        } : null,
        drink: selectedBundleDrink ? {
          id: selectedBundleDrink.id,
          name: selectedBundleDrink.name,
          price: selectedBundleDrink.price
        } : null,
        bundlePrice: bundleProps.discountedPrice || 5.99
      } : null
    };
    
    // Add to cart
    addItem(configuredItem);
    
    // Show success toast
    setToast({ 
      message: `${item.name} added to cart!`, 
      visible: true 
    });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    
    // Navigate back to menu
    router.push('/menu');
  };
  
  // Get sides items
  const getSides = () => {
    return menuItems.filter(item => item.category === 'sides');
  };
  
  // Get desserts
  const getDesserts = () => {
    return menuItems.filter(item => item.category === 'desserts');
  };
  // Render functions for each step
  const renderMeatSelection = () => {
    if (!item) return null;
    
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{item.name}</h2>
        
        <div className="bg-charcoal-800 rounded-lg overflow-hidden mb-6">
          <div className="h-64 relative">
            <img 
              src={item.image_url || '/images/placeholder-food.jpg'} 
              alt={item.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
              }}
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold">{item.name}</h3>
              <span className="text-amber-400 font-bold">${item.price.toFixed(2)}</span>
            </div>
            <p className="text-gray-400 mb-4">{item.description}</p>
          </div>
        </div>
      </div>
    );
  };
  
  const renderSidesSelection = () => {
    const sides = getSides();
    
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Select Your Sides</h2>
        <p className="text-gray-400 mb-6">Choose {maxSides} sides to accompany your meal</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {sides.map((side) => (
            <div 
              key={side.id}
              className={`bg-charcoal-800 rounded-lg p-3 flex items-center cursor-pointer transition-colors ${
                selectedSides.some(s => s.id === side.id) 
                  ? 'border-2 border-amber-500' 
                  : 'border-2 border-transparent hover:bg-charcoal-700'
              }`}
              onClick={() => handleSideSelect(side)}
            >
              <div className="w-16 h-16 rounded-md overflow-hidden mr-3 bg-charcoal-700">
                <img 
                  src={side.image_url || '/images/placeholder-food.jpg'} 
                  alt={side.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                  }}
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{side.name}</h4>
                <p className="text-sm text-gray-400 line-clamp-1">{side.description}</p>
              </div>
              {selectedSides.some(s => s.id === side.id) && (
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center ml-2">
                  <svg className="w-4 h-4 text-charcoal-900" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="bg-charcoal-800 rounded-lg p-4 mb-4">
          <h3 className="font-bold mb-2">Selected Sides ({selectedSides.length}/{maxSides})</h3>
          {selectedSides.length > 0 ? (
            <div className="space-y-2">
              {selectedSides.map((side) => (
                <div key={side.id} className="flex justify-between items-center">
                  <span>{side.name}</span>
                  <button 
                    onClick={() => handleSideSelect(side)}
                    className="text-red-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No sides selected yet</p>
          )}
        </div>
      </div>
    );
  };
  
  const renderSpecialInstructions = () => {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Special Instructions</h2>
        <p className="text-gray-400 mb-6">Any special requests for your order?</p>
        
        <div className="bg-charcoal-800 rounded-lg p-4 mb-6">
          <textarea
            value={configuration.specialInstructions}
            onChange={(e) => handleSpecialInstructions(e.target.value)}
            placeholder="E.g., Extra sauce on the side, No onions, etc."
            className="w-full bg-charcoal-700 text-white border border-charcoal-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[100px]"
          />
        </div>
        
        <div className="bg-charcoal-800 rounded-lg p-4 mb-4">
          <h3 className="font-bold mb-2">Quantity</h3>
          <div className="flex items-center">
            <button 
              onClick={() => handleQuantityChange(Math.max(1, configuration.quantity - 1))}
              className="w-10 h-10 bg-charcoal-700 rounded-l-lg flex items-center justify-center hover:bg-charcoal-600"
              disabled={configuration.quantity <= 1}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <div className="w-12 h-10 bg-charcoal-700 flex items-center justify-center border-l border-r border-charcoal-600">
              {configuration.quantity}
            </div>
            <button 
              onClick={() => handleQuantityChange(configuration.quantity + 1)}
              className="w-10 h-10 bg-charcoal-700 rounded-r-lg flex items-center justify-center hover:bg-charcoal-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderOrderReview = () => {
    if (!item) return null;
    
    // Calculate total price
    const totalPrice = configuration.totalPrice * configuration.quantity;
    
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Review Your Order</h2>
        
        <div className="bg-charcoal-800 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-20 h-20 rounded-md overflow-hidden mr-4 bg-charcoal-700">
              <img 
                src={item.image_url || '/images/placeholder-food.jpg'} 
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                }}
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-gray-400">{isMultiMeatPlate ? '2-Meat Plate' : '1-Meat Plate'}</p>
            </div>
          </div>
          
          {isMultiMeatPlate && secondMeat && (
            <div className="mb-4 pl-4 border-l-2 border-amber-500">
              <h4 className="font-medium">Second Meat Selection</h4>
              <p className="text-gray-400">{secondMeat.name} (+$4.00)</p>
            </div>
          )}
          
          {selectedSides.length > 0 && (
            <div className="mb-4 pl-4 border-l-2 border-amber-500">
              <h4 className="font-medium">Selected Sides</h4>
              <ul className="text-gray-400">
                {selectedSides.map((side) => (
                  <li key={side.id}>{side.name}</li>
                ))}
              </ul>
            </div>
          )}
          
          {selectedDessert && (
            <div className="mb-4 pl-4 border-l-2 border-amber-500">
              <h4 className="font-medium">Dessert</h4>
              <p className="text-gray-400">{selectedDessert.name} (+${selectedDessert.price.toFixed(2)})</p>
            </div>
          )}
          
          {bundleAccepted && (
            <div className="mb-4 pl-4 border-l-2 border-amber-500">
              <h4 className="font-medium">Bundle Deal</h4>
              <p className="text-gray-400">+${bundleProps.discountedPrice?.toFixed(2) || '5.99'}</p>
              {selectedBundleSide && (
                <p className="text-gray-400 text-sm ml-2">• {selectedBundleSide.name} (Side)</p>
              )}
              {selectedBundleDrink && (
                <p className="text-gray-400 text-sm ml-2">• {selectedBundleDrink.name} (Drink)</p>
              )}
            </div>
          )}
          
          {configuration.specialInstructions && (
            <div className="mb-4 pl-4 border-l-2 border-amber-500">
              <h4 className="font-medium">Special Instructions</h4>
              <p className="text-gray-400">{configuration.specialInstructions}</p>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-charcoal-700">
            <div className="flex justify-between mb-2">
              <span>Quantity</span>
              <span>{configuration.quantity}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Price per item</span>
              <span>${configuration.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-amber-400">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Determine which step content to render
  const renderStepContent = () => {
    switch (currentStep) {
      case ConfigStep.MEAT_SELECTION:
        return renderMeatSelection();
      case ConfigStep.SIDES_SELECTION:
        return renderSidesSelection();
      case ConfigStep.SPECIAL_INSTRUCTIONS:
        return renderSpecialInstructions();
      case ConfigStep.REVIEW:
        return renderOrderReview();
      default:
        return null;
    }
  };
  
  if (!item) {
    return (
      <div className="min-h-screen bg-charcoal-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Customize {item.name} | Brown's Bar-B-Cue</title>
        <meta name="description" content={`Customize your ${item.name} order from Brown's Bar-B-Cue.`} />
      </Head>
      
      <NetworkStatus />
      
      <div className="min-h-screen bg-charcoal-900 text-white">
        {/* Back Button */}
        <div className="bg-charcoal-800 py-4 px-4">
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={() => router.push('/menu')}
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Menu
            </button>
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="bg-charcoal-800 py-4 px-4 border-t border-charcoal-700">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between">
              {[
                { step: ConfigStep.MEAT_SELECTION, label: 'Item' },
                { step: ConfigStep.SIDES_SELECTION, label: 'Sides' },
                { step: ConfigStep.SPECIAL_INSTRUCTIONS, label: 'Options' },
                { step: ConfigStep.REVIEW, label: 'Review' }
              ].map((stepInfo, index) => (
                <div key={stepInfo.step} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === stepInfo.step
                        ? 'bg-amber-500 text-charcoal-900'
                        : index < Object.values(ConfigStep).indexOf(currentStep)
                          ? 'bg-green-600 text-white'
                          : 'bg-charcoal-700 text-gray-400'
                    }`}
                  >
                    {index < Object.values(ConfigStep).indexOf(currentStep) ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`text-xs mt-1 ${
                    currentStep === stepInfo.step
                      ? 'text-amber-500 font-bold'
                      : 'text-gray-400'
                  }`}>
                    {stepInfo.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              className="mb-6"
            >
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={goToPreviousStep}
                  className="px-6 py-2 bg-charcoal-700 hover:bg-charcoal-600 rounded-lg transition-colors"
                  disabled={currentStep === ConfigStep.MEAT_SELECTION}
                >
                  Back
                </button>
                
                <button
                  onClick={goToNextStep}
                  className="px-6 py-2 bg-red-700 hover:bg-red-600 rounded-lg font-bold transition-colors"
                >
                  {currentStep === ConfigStep.REVIEW ? 'Add to Cart' : 'Continue'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Multi-Meat Upgrade Modal */}
        <AnimatePresence>
          {showMultiMeatUpgrade && (
            <MultiMeatUpgrade
              baseItem={item}
              availableMeats={availableMeats}
              onUpgradeSelect={handleMultiMeatUpgrade}
              onDecline={handleDeclineMultiMeatUpgrade}
            />
          )}
        </AnimatePresence>
        
        {/* Bundle Offer Modal */}
        <AnimatePresence>
          {showBundleOffer && (
            <SpecialBundleOffer
              title={bundleProps.title}
              description={bundleProps.description}
              savings={bundleProps.savings}
              imageUrl={bundleProps.imageUrl}
              originalPrice={bundleProps.originalPrice}
              discountedPrice={bundleProps.discountedPrice}
              onAccept={handleAcceptBundleOffer}
              onDecline={handleDeclineBundleOffer}
            />
          )}
        </AnimatePresence>
        
        {/* Dessert Upsell Modal */}
        <AnimatePresence>
          {showDessertUpsell && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-charcoal-800 rounded-lg max-w-md w-full p-6"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <h3 className="text-xl font-bold mb-2">Add a Dessert?</h3>
                <p className="text-gray-400 mb-4">Complete your meal with something sweet</p>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {getDesserts().slice(0, 4).map((dessert) => (
                    <div
                      key={dessert.id}
                      className="bg-charcoal-700 rounded-lg p-3 cursor-pointer hover:bg-charcoal-600 transition-colors"
                      onClick={() => handleDessertSelect(dessert)}
                    >
                      <div className="h-24 rounded-md overflow-hidden mb-2">
                        <img 
                          src={dessert.image_url || '/images/placeholder-food.jpg'} 
                          alt={dessert.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                          }}
                        />
                      </div>
                      <h4 className="font-medium text-sm">{dessert.name}</h4>
                      <p className="text-amber-500 text-sm">${dessert.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleDeclineDessert}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors mr-2"
                  >
                    No Thanks
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Toast Notification */}
        <Toast 
          message={toast.message}
          visible={toast.visible}
          onClose={() => setToast(prev => ({ ...prev, visible: false }))}
        />
        
        {/* Cart Drawer */}
        <CartDrawer 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onEditItem={editItem}
          onCheckout={() => router.push('/checkout')}
        />
      </div>
    </>
  );
};

export default ItemConfigurationPage;
