import React, { useState, useEffect } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import * as Sentry from '@sentry/browser';
import toast from 'react-hot-toast';

export default function CreateCollectionForm({ onClose, onSuccess }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [collectionTypes, setCollectionTypes] = useState([]);
  const [typesLoading, setTypesLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    typeId: '',
    isPrivate: false,
    coverImage: null
  });
  
  useEffect(() => {
    const fetchCollectionTypes = async () => {
      try {
        setTypesLoading(true);
        
        // This would be replaced with an API call
        setTimeout(() => {
          const mockTypes = [
            { id: 1, name: 'Model Cars', slug: 'model-cars' },
            { id: 2, name: 'Pokemon Cards', slug: 'pokemon-cards' },
            { id: 3, name: 'LEGO Sets', slug: 'lego-sets' },
            { id: 4, name: 'Coins', slug: 'coins' },
            { id: 5, name: 'Stamps', slug: 'stamps' },
            { id: 6, name: 'Comic Books', slug: 'comics' },
            { id: 7, name: 'Vinyl Records', slug: 'vinyl-records' },
            { id: 8, name: 'Action Figures', slug: 'action-figures' }
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
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, we would upload this to a storage service
      // and get back a URL. For now, we'll use a data URL.
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          coverImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please provide a collection name');
      return;
    }
    
    if (!formData.typeId) {
      toast.error('Please select a collection type');
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real app, this would be an API call to create the collection
      // Simulating API call with timeout
      setTimeout(() => {
        const selectedType = collectionTypes.find(type => type.id === parseInt(formData.typeId));
        
        const newCollection = {
          id: Math.random().toString(36).substring(2, 11),
          userId: user.id,
          name: formData.name,
          description: formData.description,
          typeId: parseInt(formData.typeId),
          typeName: selectedType.name,
          isPrivate: formData.isPrivate,
          coverImage: formData.coverImage || 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3ECollection%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
          itemCount: 0,
          totalValue: '0.00',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        toast.success('Collection created successfully!');
        onSuccess(newCollection);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error creating collection:', error);
      Sentry.captureException(error);
      toast.error('Failed to create collection. Please try again.');
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
        <label htmlFor="name" className="form-label">Collection Name</label>
        <input 
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-input box-border"
          placeholder="My Awesome Collection"
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
          className="form-input box-border min-h-[100px]"
          placeholder="Describe your collection..."
        />
      </div>
      
      <div className="form-control">
        <label htmlFor="typeId" className="form-label">Collection Type</label>
        <select 
          id="typeId"
          name="typeId"
          value={formData.typeId}
          onChange={handleChange}
          className="form-input box-border"
          disabled={typesLoading}
          required
        >
          <option value="">Select a collection type...</option>
          {collectionTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        {typesLoading && (
          <div className="mt-1 text-sm text-gray-500">Loading collection types...</div>
        )}
      </div>
      
      <div className="form-control">
        <label htmlFor="coverImage" className="form-label">Cover Image</label>
        <div className="mt-1 flex items-center">
          <label className="block relative">
            <span className="btn btn-outline inline-flex items-center cursor-pointer">
              <FaUpload className="mr-2" />
              {formData.coverImage ? 'Change Image' : 'Upload Image'}
            </span>
            <input
              type="file"
              id="coverImage"
              name="coverImage"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
            />
          </label>
          {formData.coverImage && (
            <div className="ml-4">
              <img 
                src={formData.coverImage} 
                alt="Cover preview" 
                className="h-16 w-24 object-cover rounded"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="form-control flex items-center">
        <input
          type="checkbox"
          id="isPrivate"
          name="isPrivate"
          checked={formData.isPrivate}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="isPrivate" className="ml-2 text-sm text-gray-700">
          Make this collection private (only visible to you)
        </label>
      </div>
      
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
              Creating...
            </div>
          ) : 'Create Collection'}
        </button>
      </div>
    </form>
  );
}