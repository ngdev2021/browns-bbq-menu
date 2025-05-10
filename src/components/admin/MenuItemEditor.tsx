import React, { useState } from 'react';

interface MenuItemEditorProps {
  item: any;
  onSave: (item: any) => void;
  onCancel: () => void;
  isNew: boolean;
}

const MenuItemEditor: React.FC<MenuItemEditorProps> = ({ item, onSave, onCancel, isNew }) => {
  const [formData, setFormData] = useState({ ...item });
  const [newTag, setNewTag] = useState('');
  const [newIngredient, setNewIngredient] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties like nutritionalInfo.calories
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'number' ? parseFloat(value) : value
        }
      });
    } else {
      // Handle regular properties
      setFormData({
        ...formData,
        [name]: type === 'number' ? parseFloat(value) : value
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t: string) => t !== tag)
    });
  };

  const handleAddIngredient = () => {
    if (newIngredient && !formData.ingredients.includes(newIngredient)) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, newIngredient]
      });
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((i: string) => i !== ingredient)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">
        {isNew ? 'Add New Menu Item' : 'Edit Menu Item'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-amber-500 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              >
                <option value="plates">BBQ Plates</option>
                <option value="sandwiches">Sandwiches</option>
                <option value="sides">Sides</option>
                <option value="combos">Combos</option>
                <option value="drinks">Drinks</option>
                <option value="desserts">Desserts</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-1">Image URL</label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
              {formData.image_url && (
                <div className="mt-2 flex items-center">
                  <div className="w-12 h-12 rounded overflow-hidden bg-gray-600 mr-2">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">Image Preview</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label htmlFor="featured" className="text-gray-300">Featured Item</label>
            </div>
          </div>
        </div>
        
        {/* Tags */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-amber-500 mb-4">Tags</h3>
          
          <div className="flex mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag..."
              className="flex-grow bg-gray-700 border border-gray-600 rounded-l p-2 text-white"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="bg-amber-600 hover:bg-amber-700 px-4 rounded-r text-white"
            >
              Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag: string) => (
              <div key={tag} className="bg-gray-700 px-3 py-1 rounded-full flex items-center">
                <span className="text-white mr-2">{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              </div>
            ))}
            {formData.tags.length === 0 && (
              <p className="text-gray-400 text-sm">No tags added yet</p>
            )}
          </div>
        </div>
        
        {/* Ingredients */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-amber-500 mb-4">Ingredients</h3>
          
          <div className="flex mb-2">
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="Add an ingredient..."
              className="flex-grow bg-gray-700 border border-gray-600 rounded-l p-2 text-white"
            />
            <button
              type="button"
              onClick={handleAddIngredient}
              className="bg-amber-600 hover:bg-amber-700 px-4 rounded-r text-white"
            >
              Add
            </button>
          </div>
          
          <ul className="list-disc list-inside space-y-1 mt-2">
            {formData.ingredients.map((ingredient: string, index: number) => (
              <li key={index} className="text-white flex items-center">
                <span className="mr-2">{ingredient}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(ingredient)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  (remove)
                </button>
              </li>
            ))}
            {formData.ingredients.length === 0 && (
              <p className="text-gray-400 text-sm">No ingredients added yet</p>
            )}
          </ul>
        </div>
        
        {/* Nutritional Information */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-amber-500 mb-4">Nutritional Information</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-300 mb-1">Calories</label>
              <input
                type="number"
                name="nutritionalInfo.calories"
                value={formData.nutritionalInfo.calories}
                onChange={handleChange}
                min="0"
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Protein (g)</label>
              <input
                type="number"
                name="nutritionalInfo.protein"
                value={formData.nutritionalInfo.protein}
                onChange={handleChange}
                min="0"
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Carbs (g)</label>
              <input
                type="number"
                name="nutritionalInfo.carbs"
                value={formData.nutritionalInfo.carbs}
                onChange={handleChange}
                min="0"
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Fat (g)</label>
              <input
                type="number"
                name="nutritionalInfo.fat"
                value={formData.nutritionalInfo.fat}
                onChange={handleChange}
                min="0"
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
          >
            {isNew ? 'Create Item' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MenuItemEditor;
