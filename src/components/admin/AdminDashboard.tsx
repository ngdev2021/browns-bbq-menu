import React, { useState, useEffect } from 'react';
import MenuItemEditor from './MenuItemEditor';
import MenuItemsList from './MenuItemsList';
import { SAMPLE_MENU_ITEMS } from '../../data/sampleData';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('menu');
  const [menuItems, setMenuItems] = useState(SAMPLE_MENU_ITEMS);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isNewItem, setIsNewItem] = useState(false);

  // Load menu items from local storage if available
  useEffect(() => {
    const storedItems = localStorage.getItem('bbq_menu_items');
    if (storedItems) {
      try {
        setMenuItems(JSON.parse(storedItems));
      } catch (error) {
        console.error('Failed to parse stored menu items:', error);
      }
    }
  }, []);

  // Save menu items to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('bbq_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  const handleAddNewItem = () => {
    const newId = String(Math.max(...menuItems.map(item => parseInt(item.id))) + 1);
    setEditingItem({
      id: newId,
      name: '',
      description: '',
      price: 0,
      category: 'plates',
      image_url: '',
      tags: [],
      stock: 10,
      featured: false,
      ingredients: [],
      nutritionalInfo: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      },
      reviews: []
    });
    setIsNewItem(true);
  };

  const handleEditItem = (item: any) => {
    setEditingItem({ ...item });
    setIsNewItem(false);
  };

  const handleSaveItem = (item: any) => {
    if (isNewItem) {
      setMenuItems([...menuItems, item]);
    } else {
      setMenuItems(menuItems.map(i => i.id === item.id ? item : i));
    }
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMenuItems(menuItems.filter(item => item.id !== id));
      if (editingItem && editingItem.id === id) {
        setEditingItem(null);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(menuItems, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'menu-items.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedItems = JSON.parse(content);
        
        if (Array.isArray(importedItems)) {
          setMenuItems(importedItems);
          alert('Menu items imported successfully!');
        } else {
          alert('Invalid format. Please import a valid JSON array.');
        }
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-500">Brown's Bar-B-Cue Admin</h1>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 rounded text-white"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'menu' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('menu')}
          >
            Menu Items
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'digital' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('digital')}
          >
            Digital Menu Settings
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'settings' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('settings')}
          >
            General Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'menu' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Menu Items Management</h2>
              <div className="flex space-x-4">
                <button
                  onClick={handleAddNewItem}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white flex items-center"
                >
                  <span className="mr-1">+</span> Add New Item
                </button>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                >
                  Export Data
                </button>
                <label className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white cursor-pointer">
                  Import Data
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportData}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Menu Items List */}
              <div className="lg:col-span-1 bg-gray-900 rounded-lg p-4 overflow-auto max-h-[calc(100vh-250px)]">
                <MenuItemsList
                  items={menuItems}
                  onEditItem={handleEditItem}
                  onDeleteItem={handleDeleteItem}
                />
              </div>

              {/* Item Editor */}
              <div className="lg:col-span-2 bg-gray-900 rounded-lg p-4 overflow-auto max-h-[calc(100vh-250px)]">
                {editingItem ? (
                  <MenuItemEditor
                    item={editingItem}
                    onSave={handleSaveItem}
                    onCancel={handleCancelEdit}
                    isNew={isNewItem}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <p className="text-lg">Select an item to edit or create a new one</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'digital' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Digital Menu Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-amber-500 mb-4">Display Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Default View</label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white">
                      <option value="menu">Full Menu</option>
                      <option value="specials">Today's Specials</option>
                      <option value="combos">Combo Deals</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Rotation Interval (seconds)</label>
                    <input type="number" min="5" max="60" defaultValue="8" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                  </div>
                  
                  <div className="flex items-center">
                    <input type="checkbox" id="autoFullscreen" className="mr-2" />
                    <label htmlFor="autoFullscreen" className="text-gray-300">Auto-enter fullscreen mode</label>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-amber-500 mb-4">Featured Items</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Featured Items to Display</label>
                    <select multiple className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white h-48">
                      {menuItems.map(item => (
                        <option key={item.id} value={item.id} selected={item.featured}>
                          {item.name} (${item.price.toFixed(2)})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple items</p>
                  </div>
                  
                  <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded text-white w-full">
                    Save Display Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">General Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-amber-500 mb-4">Business Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Business Name</label>
                    <input type="text" defaultValue="Brown's Bar-B-Cue" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Phone Number</label>
                    <input type="text" defaultValue="(682) 352-8545" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Website</label>
                    <input type="text" defaultValue="brownsbarbcue.com" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">CashApp</label>
                    <input type="text" defaultValue="$brownroscoe" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-amber-500 mb-4">Order Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Tax Rate (%)</label>
                    <input type="number" step="0.01" min="0" max="20" defaultValue="8.25" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                  </div>
                  
                  <div className="flex items-center">
                    <input type="checkbox" id="enableOnlineOrdering" className="mr-2" checked />
                    <label htmlFor="enableOnlineOrdering" className="text-gray-300">Enable Online Ordering</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input type="checkbox" id="requirePhoneNumber" className="mr-2" checked />
                    <label htmlFor="requirePhoneNumber" className="text-gray-300">Require Phone Number for Orders</label>
                  </div>
                  
                  <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded text-white w-full mt-4">
                    Save General Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
