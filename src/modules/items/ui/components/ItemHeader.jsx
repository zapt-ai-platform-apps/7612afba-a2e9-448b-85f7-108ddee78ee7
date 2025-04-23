import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTag, FaTrash } from 'react-icons/fa';

export function ItemHeader({ 
  item, 
  onEdit, 
  onDelete, 
  onToggleForSale 
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4">
      <div className="flex items-start">
        <Link to={`/collections/${item.collectionId}`} className="mr-4 text-gray-500 hover:text-gray-700">
          <FaArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
          <div className="flex items-center mt-1 mb-2">
            <Link to={`/collections/${item.collectionId}`} className="badge badge-blue mr-2">
              {item.collectionName}
            </Link>
            {item.forSale && (
              <span className="badge badge-green">For Sale: ${item.askingPrice}</span>
            )}
          </div>
          <p className="text-gray-600">{item.description}</p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Link 
          to={`/items/${item.id}/edit`}
          className="btn btn-outline flex items-center cursor-pointer"
        >
          <FaEdit className="mr-2" />
          Edit
        </Link>
        
        <button 
          onClick={onToggleForSale}
          className={`btn ${item.forSale ? 'btn-outline' : 'btn-secondary'} flex items-center cursor-pointer`}
        >
          {item.forSale ? (
            <>
              <FaTag className="mr-2" />
              Remove Listing
            </>
          ) : (
            <>
              <FaTag className="mr-2" />
              Sell Item
            </>
          )}
        </button>
        
        <button 
          onClick={onDelete}
          className="btn btn-outline flex items-center cursor-pointer"
        >
          <FaTrash className="mr-2 text-red-600" />
          Delete
        </button>
      </div>
    </div>
  );
}

export default ItemHeader;