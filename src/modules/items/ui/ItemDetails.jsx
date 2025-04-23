import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import * as Sentry from '@sentry/browser';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import toast from 'react-hot-toast';
import { api } from '../api';
import ItemHeader from './components/ItemHeader';
import ItemImages from './components/ItemImages';
import ItemAttributes from './components/ItemAttributes';
import ItemValueInfo from './components/ItemValueInfo';
import ItemPurchaseDetails from './components/ItemPurchaseDetails';
import DeleteItemModal from './components/DeleteItemModal';

export function ItemDetails() {
  const { itemId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true);
        const itemData = await api.fetchItem(itemId);
        setItem(itemData);
      } catch (error) {
        console.error('Error fetching item details:', error);
        Sentry.captureException(error);
        toast.error('Failed to load item details');
      } finally {
        setLoading(false);
      }
    };
    
    loadItem();
  }, [itemId]);
  
  const handleDeleteItem = async () => {
    try {
      await api.deleteItem(itemId);
      toast.success('Item deleted successfully');
      navigate(`/collections/${item.collectionId}`);
    } catch (error) {
      console.error('Error deleting item:', error);
      Sentry.captureException(error);
      toast.error('Failed to delete item');
    }
  };
  
  const handleToggleForSale = async () => {
    try {
      const updatedItem = await api.toggleForSale(item, !item.forSale);
      setItem(updatedItem);
      
      toast.success(updatedItem.forSale ? 'Item listed for sale' : 'Item removed from marketplace');
    } catch (error) {
      console.error('Error updating item:', error);
      Sentry.captureException(error);
      toast.error('Failed to update item');
    }
  };
  
  if (loading) {
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
        <p className="text-gray-600 mb-4">The item you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link to="/collections" className="btn btn-primary cursor-pointer">
          <FaArrowLeft className="mr-2" />
          Back to Collections
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      {/* Item Header */}
      <ItemHeader 
        item={item}
        onEdit={() => navigate(`/items/${itemId}/edit`)}
        onDelete={() => setShowDeleteModal(true)}
        onToggleForSale={handleToggleForSale}
      />
      
      {/* Item Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Item Images and Attributes */}
        <div className="md:col-span-2">
          <ItemImages images={item.images} />
          <ItemAttributes attributes={item.attributes} />
        </div>
        
        {/* Item Details Sidebar */}
        <div className="space-y-6">
          <ItemValueInfo item={item} />
          <ItemPurchaseDetails item={item} />
        </div>
      </div>
      
      {/* Delete Modal */}
      <DeleteItemModal 
        isOpen={showDeleteModal}
        itemName={item.name}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteItem}
      />
    </div>
  );
}

export default ItemDetails;