import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import * as Sentry from '@sentry/browser';
import toast from 'react-hot-toast';

export default function AddWishlistItemForm({ onClose, onSuccess }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [collectionTypes, setCollectionTypes] = useState([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [dynamicFields, setDynamicFields] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    typeId: '',
    maxPrice: '',
    attributes: {}
  });
  
  useEffect(() => {
    const fetchCollectionTypes = async () => {
      try {
        setTypesLoading(true);
        
        // This would be replaced with an API call
        setTimeout(() => {
          const mockTypes = [
            { 
              id: 1, 
              name: 'Model Cars', 
              slug: 'model-cars',
              fields: {
                required: ['make', 'model', 'year', 'scale'],
                optional: ['color', 'condition', 'manufacturer']
              }
            },
            { 
              id: 2, 
              name: 'Pokemon Cards', 
              slug: 'pokemon-cards',
              fields: {
                required: ['card_name', 'set_name', 'card_number', 'rarity'],
                optional: ['condition', 'graded', 'grade', 'edition', 'language']
              }
            },
            { 
              id: 3, 
              name: 'LEGO Sets', 
              slug: 'lego-sets',
              fields: {
                required: ['set_number', 'name', 'theme', 'piece_count'],
                optional: ['year', 'condition', 'minifigures', 'complete']
              }
            },
            { 
              id: 4, 
              name: 'Coins', 
              slug: 'coins',
              fields: {
                required: ['country', 'denomination', 'year', 'mint_mark'],
                optional: ['grade', 'material', 'error_type', 'certification']
              }
            },
            { 
              id: 5, 
              name: 'Stamps', 
              slug: 'stamps',
              fields: {
                required: ['country', 'denomination', 'year', 'issue'],
                optional: ['condition', 'perforated', 'color', 'errors', 'certification']
              }
            }
          ];
          
          setCollectionTypes(mockTypes);
          setTypesLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching collection types:', error);
        Sentry.captureException(error);
        setTypesLoading(false);
      }
    };
    
    fetchCollectionTypes();
  }, []);
  
  useEffect(() => {
    if (formData.typeId) {
      const selectedType = collectionTypes.find(type => type.id === parseInt(formData.typeId));
      
      if (selectedType && selectedType.fields) {
        const fields = [
          ...selectedType.fields.required.map(field => ({
            name: field,
            required: true
          })),
          ...selectedType.fields.optional.map(field => ({
            name: field,
            required: false
          }))
        ];
        
        setDynamicFields(fields);
        
        // Initialize attributes with empty values
        const initialAttributes = fields.reduce((acc, field) => {
          acc[field.name] = '';
          return acc;
        }, {});
        
        setFormData(prev => ({
          ...prev,
          attributes: initialAttributes
        }));
      }
    } else {
      setDynamicFields([]);
      setFormData(prev => ({
        ...prev,
        attributes: {}
      }));
    }
  }, [formData.typeId, collectionTypes]);
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name === 'maxPrice') {
      // Only allow numbers and decimal point
      const numericValue = value.replace(/[^0-9.]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleAttributeChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please provide an item name');
      return;
    }
    
    if (!formData.typeId) {
      toast.error('Please select a collection type');
      return;
    }
    
    if (!formData.maxPrice) {
      toast.error('Please enter a maximum price');
      return;
    }
    
    // Validate required attributes
    const selectedType = collectionTypes.find(type => type.id === parseInt(formData.typeId));
    const requiredFields = selectedType?.fields?.required || [];
    
    for (const field of requiredFields) {
      if (!formData.attributes[field]) {
        toast.error(`Please complete the required field: ${field.replace('_', ' ')}`);
        return;
      }
    }
    
    try {
      setLoading(true);
      
      // In a real app, this would be an API call to create the wishlist item
      // Simulating API call with timeout
      setTimeout(() => {
        const selectedType = collectionTypes.find(type => type.id === parseInt(formData.typeId));
        
        const newWishlistItem = {
          id: Math.random().toString(36).substring(2, 11),
          userId: user.id,
          name: formData.name,
          description: formData.description,
          type: {
            id: parseInt(formData.typeId),
            name: selectedType.name
          },
          maxPrice: parseFloat(formData.maxPrice),
          attributes: formData.attributes,
          createdAt: new Date().toISOString(),
          matchCount: 0,
          notificationsEnabled: true
        };
        
        toast.success('Item added to your wishlist!');
        onSuccess(newWishlistItem);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error adding wishlist item:', error);
      Sentry.captureException(error);
      toast.error('Failed to add item to wishlist. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="absolute top-4 right-4">
        <button 
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <FaTimes size={20} />
        </button>
      </div>
      
      <div className="form-control">
        <label htmlFor="name" className="form-label">Item Name</label>
        <input 
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-input box-border"
          placeholder="What are you looking for?"
          required
        />
      </div>
      
      <div className="form-control">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea 
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-input box-border min-h-[80px]"
          placeholder="Describe the item you're looking for..."
        />
      </div>
      
      <div className="form-control">
        <label htmlFor="typeId" className="form-label">Item Type</label>
        <select 
          id="typeId"
          name="typeId"
          value={formData.typeId}
          onChange={handleChange}
          className="form-input box-border"
          disabled={typesLoading}
          required
        >
          <option value="">Select an item type...</option>
          {collectionTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        {typesLoading && (
          <div className="mt-1 text-sm text-gray-500">Loading item types...</div>
        )}
      </div>
      
      <div className="form-control">
        <label htmlFor="maxPrice" className="form-label">Maximum Price ($)</label>
        <input 
          type="text"
          id="maxPrice"
          name="maxPrice"
          value={formData.maxPrice}
          onChange={handleChange}
          className="form-input box-border"
          placeholder="Maximum price you're willing to pay"
          required
        />
      </div>
      
      {dynamicFields.length > 0 && (
        <div className="mt-4 mb-2">
          <h3 className="text-md font-medium text-gray-900 mb-2">Item Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dynamicFields.map(field => (
              <div key={field.name} className="form-control">
                <label htmlFor={field.name} className="form-label">
                  {field.name.replace('_', ' ')}{field.required ? ' *' : ''}
                </label>
                <input 
                  type="text"
                  id={field.name}
                  name={field.name}
                  value={formData.attributes[field.name] || ''}
                  onChange={handleAttributeChange}
                  className="form-input box-border"
                  required={field.required}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-outline cursor-pointer"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Adding...
            </div>
          ) : 'Add to Wishlist'}
        </button>
      </div>
    </form>
  );
}