import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaUpload, FaCamera, FaFolderOpen } from 'react-icons/fa';
import * as Sentry from '@sentry/browser';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import toast from 'react-hot-toast';
import CurrencySelector from '@/modules/shared/components/CurrencySelector';
import FileUploader from '@/modules/shared/components/FileUploader';

export default function AddItemForm() {
  const { collectionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [collection, setCollection] = useState(null);
  const [collectionLoading, setCollectionLoading] = useState(true);
  const [formFields, setFormFields] = useState([]);
  const [filesUploading, setFilesUploading] = useState(false);
  
  // Separate images by category
  const [itemImages, setItemImages] = useState([]);
  const [packagingImages, setPackagingImages] = useState([]);
  const [certificateImages, setCertificateImages] = useState([]);
  const [proofOfPurchaseFiles, setProofOfPurchaseFiles] = useState([]);
  
  const [activeImageTab, setActiveImageTab] = useState('item');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    purchasePrice: '',
    currentValue: '',
    purchaseDate: '',
    purchasePlace: '',
    condition: '',
    currency: 'USD',
    attributes: {}
  });
  
  // Fetch collection details
  useEffect(() => {
    const fetchCollectionDetails = async () => {
      try {
        setCollectionLoading(true);
        
        // In a real app, this would be an API call
        // Simulating API call with timeout
        setTimeout(() => {
          // Mock collection data based on the collectionId
          const mockCollection = {
            id: collectionId,
            name: 'Model Cars Collection',
            typeId: 1,
            typeName: 'Model Cars',
            fields: {
              required: ['make', 'model', 'year', 'scale', 'manufacturer'],
              optional: ['color', 'condition', 'box_condition', 'limited_edition', 'series']
            }
          };
          
          setCollection(mockCollection);
          
          // Set up form fields based on collection type
          const fields = [
            ...mockCollection.fields.required.map(field => ({
              name: field,
              required: true
            })),
            ...mockCollection.fields.optional.map(field => ({
              name: field,
              required: false
            }))
          ];
          
          setFormFields(fields);
          
          // Initialize attributes with empty values
          const initialAttributes = fields.reduce((acc, field) => {
            acc[field.name] = '';
            return acc;
          }, {});
          
          setFormData(prev => ({
            ...prev,
            attributes: initialAttributes
          }));
          
          setCollectionLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching collection details:', error);
        Sentry.captureException(error);
        setCollectionLoading(false);
      }
    };
    
    fetchCollectionDetails();
  }, [collectionId]);
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name === 'purchasePrice' || name === 'currentValue') {
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
    
    // Validate required attributes
    const requiredFields = collection?.fields?.required || [];
    
    for (const field of requiredFields) {
      if (!formData.attributes[field]) {
        toast.error(`Please complete the required field: ${field.replace('_', ' ')}`);
        return;
      }
    }
    
    try {
      setLoading(true);
      
      // Combine all images
      const allImages = [
        ...itemImages.map(img => ({ category: 'item', url: img.preview || img })),
        ...packagingImages.map(img => ({ category: 'packaging', url: img.preview || img })),
        ...certificateImages.map(img => ({ category: 'certificate', url: img.preview || img }))
      ];
      
      // In a real app, we would upload images to a storage service
      
      // Prepare proof of purchase files (in a real app, we would upload these files)
      const proofOfPurchase = proofOfPurchaseFiles.map(file => ({
        name: file.name,
        type: file.type,
        url: file.preview || file
      }));
      
      // In a real app, this would be an API call to create the item
      // Simulating API call with timeout
      setTimeout(() => {
        toast.success('Item added to collection');
        navigate(`/collections/${collectionId}`);
      }, 1000);
    } catch (error) {
      console.error('Error adding item:', error);
      Sentry.captureException(error);
      toast.error('Failed to add item');
      setLoading(false);
    }
  };
  
  if (collectionLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!collection) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Collection not found</h2>
        <p className="text-gray-600 mb-4">The collection you're trying to add an item to doesn't exist or you don't have permission to access it.</p>
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
        <Link to={`/collections/${collectionId}`} className="mr-4 text-gray-500 hover:text-gray-700">
          <FaArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Item to {collection.name}</h1>
          <p className="text-gray-600">Enter the details of your new {collection.typeName.slice(0, -1)}</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label htmlFor="currency" className="form-label">Currency</label>
                  <CurrencySelector
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="form-control">
                  <label htmlFor="purchasePrice" className="form-label">Purchase Price</label>
                  <div className="relative">
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
              </div>
              
              <div className="form-control mt-4">
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
              
              <div className="form-control mt-4">
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
        
        {/* Collection-specific Attributes */}
        <div className="card">
          <div className="card-header">{collection.typeName} Attributes</div>
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
            <div className="mb-4">
              <div className="flex border-b border-gray-200">
                <button
                  type="button"
                  className={`py-2 px-4 font-medium text-sm ${
                    activeImageTab === 'item'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  } cursor-pointer`}
                  onClick={() => setActiveImageTab('item')}
                >
                  Item Images
                </button>
                <button
                  type="button"
                  className={`py-2 px-4 font-medium text-sm ${
                    activeImageTab === 'packaging'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  } cursor-pointer`}
                  onClick={() => setActiveImageTab('packaging')}
                >
                  Packaging
                </button>
                <button
                  type="button"
                  className={`py-2 px-4 font-medium text-sm ${
                    activeImageTab === 'certificate'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  } cursor-pointer`}
                  onClick={() => setActiveImageTab('certificate')}
                >
                  Certificate of Authenticity
                </button>
              </div>
            </div>
            
            {activeImageTab === 'item' && (
              <div>
                <p className="text-sm text-gray-600 mb-4">Upload images of your item from different angles</p>
                <FileUploader
                  files={itemImages}
                  onFilesChange={setItemImages}
                  allowCamera={true}
                  allowMultiple={true}
                  maxFiles={10}
                  acceptedFileTypes={{
                    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
                  }}
                  label="Upload Item Images"
                  dropzoneText="Drag & drop item images here, or click to select files"
                />
              </div>
            )}
            
            {activeImageTab === 'packaging' && (
              <div>
                <p className="text-sm text-gray-600 mb-4">Upload images of the packaging or box</p>
                <FileUploader
                  files={packagingImages}
                  onFilesChange={setPackagingImages}
                  allowCamera={true}
                  allowMultiple={true}
                  maxFiles={5}
                  acceptedFileTypes={{
                    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
                  }}
                  label="Upload Packaging Images"
                  dropzoneText="Drag & drop packaging images here, or click to select files"
                />
              </div>
            )}
            
            {activeImageTab === 'certificate' && (
              <div>
                <p className="text-sm text-gray-600 mb-4">Upload images of the certificate of authenticity or other documentation</p>
                <FileUploader
                  files={certificateImages}
                  onFilesChange={setCertificateImages}
                  allowCamera={true}
                  allowMultiple={true}
                  maxFiles={5}
                  acceptedFileTypes={{
                    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
                  }}
                  label="Upload Certificate Images"
                  dropzoneText="Drag & drop certificate images here, or click to select files"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Proof of Purchase */}
        <div className="card">
          <div className="card-header">Proof of Purchase</div>
          <div className="card-body">
            <p className="text-sm text-gray-600 mb-4">
              Upload receipts, invoices, or other proof of purchase documents (optional)
            </p>
            <FileUploader
              files={proofOfPurchaseFiles}
              onFilesChange={setProofOfPurchaseFiles}
              allowCamera={true}
              allowMultiple={true}
              maxFiles={5}
              acceptedFileTypes={{
                'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
                'application/pdf': ['.pdf'],
                'application/msword': ['.doc'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
              }}
              label="Upload Proof of Purchase"
              dropzoneText="Drag & drop files here, or click to select files"
            />
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <Link
            to={`/collections/${collectionId}`}
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
            ) : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
}