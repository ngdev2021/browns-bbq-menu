import React, { useState, useRef } from 'react';

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10); // Start progress

    const formDataObj = new FormData();
    formDataObj.append('image', file);

    try {
      // Set initial progress
      setUploadProgress(20);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataObj,
      });

      // Update progress after server responds
      setUploadProgress(80);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      setUploadProgress(100);
      
      // Update the form data with the new image URL
      setFormData((prevData: any) => ({
        ...prevData,
        image_url: data.url
      }));

      // Reset after a short delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
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
              <label className="block text-gray-300 mb-1">Image</label>
              <div className="space-y-4">
                {/* URL Input */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Enter Image URL</label>
                  <input
                    type="text"
                    name="image_url"
                    value={formData.image_url || ''}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                  />
                </div>
                
                {/* OR Divider */}
                <div className="flex items-center">
                  <div className="flex-grow border-t border-gray-600"></div>
                  <span className="mx-4 text-gray-400">OR</span>
                  <div className="flex-grow border-t border-gray-600"></div>
                </div>
                
                {/* File Upload */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Upload Image</label>
                  <div className="flex items-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded text-white mr-2 flex-shrink-0"
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Choose File'}
                    </button>
                    <span className="text-gray-400 text-sm">
                      {isUploading ? `${uploadProgress}%` : 'Max 5MB (JPEG, PNG, GIF, WEBP)'}
                    </span>
                  </div>
                  
                  {/* Upload Progress Bar */}
                  {isUploading && (
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                      <div 
                        className="bg-amber-600 h-2.5 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Image Preview */}
              {formData.image_url && (
                <div className="mt-4 flex items-start">
                  <div className="w-24 h-24 rounded overflow-hidden bg-gray-600 mr-3">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-300 font-medium">Image Preview</span>
                    <span className="text-gray-400 text-sm break-all">{formData.image_url}</span>
                  </div>
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
