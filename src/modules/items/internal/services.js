import { eventBus } from '@/modules/core/utils/eventBus';
import { events } from '../events';
import { validateItem } from '../validators';
import * as Sentry from '@sentry/browser';

export async function fetchItem(itemId) {
  try {
    // In a real app, this would fetch from an API
    // Simulating API call with timeout and mock data for now
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockItem = {
          id: itemId,
          name: '1967 Chevrolet Camaro SS',
          description: 'Die-cast model of 1967 Chevrolet Camaro SS in mint condition with original packaging.',
          collectionId: '1',
          collectionName: 'Model Cars Collection',
          userId: 'user123',
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
          createdAt: new Date(2022, 5, 15).toISOString(),
          updatedAt: new Date(2022, 5, 15).toISOString(),
          currency: 'USD'
        };
        
        // Validate item before returning
        const validatedItem = validateItem(mockItem, {
          actionName: 'fetchItem',
          location: 'items/internal/services.js',
          direction: 'outgoing',
          moduleFrom: 'items',
          moduleTo: 'client'
        });
        
        resolve(validatedItem);
      }, 1000);
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    Sentry.captureException(error);
    throw error;
  }
}

export async function updateItem(item) {
  try {
    // In a real app, this would be an API call to update the item
    // Simulating API call with timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        // Validate item before "saving"
        const validatedItem = validateItem(
          { ...item, updatedAt: new Date().toISOString() },
          {
            actionName: 'updateItem',
            location: 'items/internal/services.js',
            direction: 'outgoing',
            moduleFrom: 'items',
            moduleTo: 'database'
          }
        );
        
        // Publish item updated event
        eventBus.publish(events.ITEM_UPDATED, { item: validatedItem });
        
        resolve(validatedItem);
      }, 1000);
    });
  } catch (error) {
    console.error('Error updating item:', error);
    Sentry.captureException(error);
    throw error;
  }
}

export async function deleteItem(itemId) {
  try {
    // In a real app, this would be an API call to delete the item
    // Simulating API call with timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        // Publish item deleted event
        eventBus.publish(events.ITEM_DELETED, { itemId });
        
        resolve({ success: true });
      }, 1000);
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    Sentry.captureException(error);
    throw error;
  }
}

export async function toggleForSale(item, forSale, askingPrice = null) {
  try {
    const updatedItem = {
      ...item,
      forSale,
      askingPrice: forSale ? askingPrice || item.currentValue : null,
      updatedAt: new Date().toISOString()
    };
    
    // Validate the updated item
    const validatedItem = validateItem(updatedItem, {
      actionName: 'toggleForSale',
      location: 'items/internal/services.js',
      direction: 'internal',
      moduleFrom: 'items',
      moduleTo: 'items'
    });
    
    // Publish appropriate event
    if (forSale) {
      eventBus.publish(events.ITEM_LISTED_FOR_SALE, { item: validatedItem });
    } else {
      eventBus.publish(events.ITEM_REMOVED_FROM_SALE, { item: validatedItem });
    }
    
    return validatedItem;
  } catch (error) {
    console.error('Error toggling item for sale status:', error);
    Sentry.captureException(error);
    throw error;
  }
}