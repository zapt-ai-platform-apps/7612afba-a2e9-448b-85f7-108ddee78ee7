import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaUpload, FaTimes } from 'react-icons/fa';
import * as Sentry from '@sentry/browser';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import toast from 'react-hot-toast';

export default function EditItemForm() {
  const { itemId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [itemLoading, setItemLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [formFields, setFormFields] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    purchasePrice: '',
    currentValue: '',
    purchaseDate: '',
    purchasePlace: '',
    condition: '',
    attributes: {},
    images: [],
    forSale: false,
    askingPrice: ''
  });
  
  // Fetch item details
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setItemLoading(true);
        
        // In a real app, this would be an API call
        // Simulating API call with timeout
        setTimeout(() => {
          // Mock item data
          const mockItem = {
            id: itemId,
            name: '1967 Chevrolet Camaro SS',
            description: 'Die-cast model of 1967 Chevrolet Camaro SS in mint condition with original packaging.',
            collectionId: '1',
            collectionName: 'Model Cars Collection',
            purchasePrice: 89.99,
            currentValue: 126.50,
            purchaseDate: '2022-06-15',
            purchasePlace: 'Vintage Die-cast Convention',
            condition: 'Excellent',
            attributes: { 
              make: 'Chevrolet', 
              model: 'Camaro SS', 
              year: 1967, 
              scale: '1:18',
              color: 'Red',
              manufacturer: 'GMP',
              box_condition: 'Good',
              limited_edition: true,
              series: 'Muscle Car Classics'
            },
            images: [
              'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3ECamaro Image 1%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
              'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3ECamaro Image 2%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'
            ],
            forSale: false,
            askingPrice: null,
            typeFields: {
              required: ['make', 'model', 'year', 'scale', 'manufacturer'],
              optional: ['color', 'condition', 'box_condition', 'limited_edition', 'series']
            }
          };
          
          setItem(mockItem);
          
          // Set up form fields based on item type
          const fields = [
            ...mockItem.typeFields.required.map(field => ({
              name: field,
              required: true
            })),
            ...mockItem.typeFields.optional.map(field => ({
              name: field,
              required: false
            }))
          ];
          
          setFormFields(fields);
          
          // Initialize form data from item
          setFormData({
            name: mockItem.name,
            description: mockItem.description || '',
            purchasePrice: mockItem.purchasePrice?.toString() || '',
            currentValue: mockItem.currentValue?.toString() || '',
            purchaseDate: mockItem.purchaseDate || '',
            purchasePlace: mockItem.purchasePlace || '',
            condition: mockItem.condition || '',
            attributes: mockItem.attributes || {},
            images: mockItem.images || [],
            forSale: mockItem.forSale || false,
            askingPrice: mockItem.askingPrice?.toString() || ''
          });
          
          setItemLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching item details:', error);
        Sentry.captureException(error);
        setItemLoading(false);
      }
    };
    
    fetchItemDetails();
  }, [itemId]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'purchasePrice' || name === 'currentValue' || name === 'askingPrice') {
      // Only allow numbers and decimal point
      const numericValue = value.replace(/[^0-9.]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
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
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      // In a real app, we would upload these to a storage service
      // and get back URLs. For now, we'll use data URLs.
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, reader.result]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please provide an item name');
      return;
    }
    
    // Validate required attributes
    const requiredFields = item?.typeFields?.required || [];
    
    for (const field of requiredFields) {
      if (!formData.attributes[field]) {
        toast.error(`Please complete the required field: ${field.replace('_', ' ')}`);
        return;
      }
    }
    
    // If item is for sale, asking price is required
    if (formData.forSale && !formData.askingPrice) {
      toast.error('Please provide an asking price');
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real app, this would be an API call to update the item
      // Simulating API call with timeout
      setTimeout(() => {
        toast.success('Item updated successfully');
        navigate(`/items/${itemId}`);
      }, 1000);
    } catch (error) {
      console.error('Error updating item:', error);
      Sentry.captureException(error);
      toast.error('Failed to update item');
      setLoading(false);
    }
  };
  
  if (itemLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!item) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Item not found</h2>
        <p className="text-gray-600 mb-4">The item you're trying to edit doesn't exist or you don't have permission to access it.</p>
        <Link to="/collections" className="btn btn-primary cursor-pointer">
          <FaArrowLeft className="mr-2" />
          Back to Collections
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex items-center">
        <Link to={`/items/${itemId}`} className="mr-4 text-gray-500 hover:text-gray-700">
          <FaArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Item</h1>
          <p className="text-gray-600">Update the details of your {item.collectionName} item</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Item Information */}
          <div className="card">
            <div className="card-header">Basic Information</div>
            <div className="card-body">
              <div className="form-control">
                <label htmlFor="name" className="form-label">Item Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input box-border"
                  placeholder="Enter item name"
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
                  placeholder="Describe your item"
                />
              </div>
              
              <div className="form-control">
                <label htmlFor="condition" className="form-label">Condition</label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="form-input box-border"
                >
                  <option value="">Select condition...</option>
                  <option value="Mint">Mint</option>
                  <option value="Near Mint">Near Mint</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Purchase and Value Information */}
          <div className="card">
            <div className="card-header">Purchase & Value</div>
            <div className="card-body">
              <div className="form-control">
                <label htmlFor="purchasePrice" className="form-label">Purchase Price</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                  <input
                    type="text"
                    id="purchasePrice"
                    name="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    className="form-input pl-7 box-border"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="form-control">
                <label htmlFor="currentValue" className="form-label">Current Value</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                  <input
                    type="text"
                    id="currentValue"
                    name="currentValue"
                    value={formData.currentValue}
                    onChange={handleChange}
                    className="form-input pl-7 box-border"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="form-control">
                <label htmlFor="purchaseDate" className="form-label">Purchase Date</label>
                <input
                  type="date"
                  id="purchaseDate"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="form-input box-border"
                />
              </div>
              
              <div className="form-control">
                <label htmlFor="purchasePlace" className="form-label">Purchase Location</label>
                <input
                  type="text"
                  id="purchasePlace"
                  name="purchasePlace"
                  value={formData.purchasePlace}
                  onChange={handleChange}
                  className="form-input box-border"
                  placeholder="Where did you buy this item?"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* For Sale Options */}
        <div className="card">
          <div className="card-header">Marketplace Listing</div>
          <div className="card-body">
            <div className="form-control flex items-center">
              <input
                type="checkbox"
                id="forSale"
                name="forSale"
                checked={formData.forSale}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="forSale" className="ml-2 text-sm text-gray-700">
                List this item for sale in the marketplace
              </label>
            </div>
            
            {formData.forSale && (
              <div className="form-control mt-4">
                <label htmlFor="askingPrice" className="form-label">Asking Price</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                  <input
                    type="text"
                    id="askingPrice"
                    name="askingPrice"
                    value={formData.askingPrice}
                    onChange={handleChange}
                    className="form-input pl-7 box-border"
                    placeholder="0.00"
                    required={formData.forSale}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Collection-specific Attributes */}
        <div className="card">
          <div className="card-header">Item Attributes</div>
          <div className="card-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {formFields.map((field) => (
                <div key={field.name} className="form-control">
                  <label htmlFor={field.name} className="form-label">
                    {field.name.replace('_', ' ')}{field.required ? ' *' : ''}
                  </label>
                  {field.name === 'limited_edition' ? (
                    <div className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        id={field.name}
                        name={field.name}
                        checked={formData.attributes[field.name]}
                        onChange={handleAttributeChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={field.name} className="ml-2 text-sm text-gray-700">
                        Yes, this is a limited edition
                      </label>
                    </div>
                  ) : (
                    <input
                      type="text"
                      id={field.name}
                      name={field.name}
                      value={formData.attributes[field.name] || ''}
                      onChange={handleAttributeChange}
                      className="form-input box-border"
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Item Images */}
        <div className="card">
          <div className="card-header">Images</div>
          <div className="card-body">
            <div className="form-control">
              <label className="form-label">Current Images</label>
              
              {formData.images.length > 0 ? (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Item preview ${index + 1}`}
                        className="h-24 w-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 cursor-pointer"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mt-2">No images uploaded</p>
              )}
              
              <div className="mt-6">
                <label className="block relative">
                  <span className="btn btn-outline inline-flex items-center cursor-pointer">
                    <FaUpload className="mr-2" />
                    Add More Images
                  </span>
                  <input
                    type="file"
                    multiple
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                </label>
                <p className="mt-1 text-sm text-gray-500">Upload up to 5 images of your item</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <Link
            to={`/items/${itemId}`}
            className="btn btn-outline cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </div>
            ) : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}