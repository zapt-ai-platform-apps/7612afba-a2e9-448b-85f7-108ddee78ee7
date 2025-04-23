import { eventBus } from '@/modules/core/utils/eventBus';
import { events } from '../events';
import { validateCollection, validateCollectionType } from '../validators';
import * as Sentry from '@sentry/browser';

export async function fetchCollections(userId) {
  try {
    // In a real app, this would be an API call to fetch collections
    // Simulating API call with timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockCollections = [
          { 
            id: '1', 
            userId: userId,
            name: 'Model Cars', 
            typeId: 1,
            typeName: 'Model Cars',
            description: 'My collection of scale model cars',
            itemCount: 12,
            totalValue: 1575.00,
            coverImage: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3EModel Cars%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
            isPrivate: false,
            createdAt: new Date(2023, 2, 15).toISOString(),
            updatedAt: new Date(2023, 5, 10).toISOString()
          },
          { 
            id: '2', 
            userId: userId,
            name: 'Pokemon Cards', 
            typeId: 2,
            typeName: 'Pokemon Cards',
            description: 'Pokemon trading card collection',
            itemCount: 78,
            totalValue: 12460.00,
            coverImage: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3EPokemon Cards%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
            updatedAt: new Date(2023, 5, 2).toISOString(),
            createdAt: new Date(2023, 1, 5).toISOString()
          },
          { 
            id: '3', 
            userId: userId,
            name: 'LEGO Sets', 
            typeId: 3,
            typeName: 'LEGO Sets',
            description: 'Star Wars and Harry Potter LEGO sets',
            itemCount: 8,
            totalValue: 3250.00,
            coverImage: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3ELEGO Sets%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
            updatedAt: new Date(2023, 4, 28).toISOString(),
            createdAt: new Date(2023, 4, 28).toISOString()
          }
        ];
        
        resolve(mockCollections);
      }, 1000);
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    Sentry.captureException(error);
    throw error;
  }
}

export async function fetchCollectionTypes() {
  try {
    // This would be replaced with an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockTypes = [
          { 
            id: 1, 
            name: 'Model Cars', 
            slug: 'model-cars',
            fields: {
              required: ['make', 'model', 'year', 'scale', 'manufacturer'],
              optional: ['color', 'condition', 'box_condition', 'limited_edition', 'series']
            }
          },
          { 
            id: 2, 
            name: 'Pokemon Cards', 
            slug: 'pokemon-cards',
            fields: {
              required: ['card_name', 'set_name', 'card_number', 'rarity'],
              optional: ['condition', 'graded', 'grade', 'edition', 'language', 'holographic']
            }
          },
          { 
            id: 3, 
            name: 'LEGO Sets', 
            slug: 'lego-sets',
            fields: {
              required: ['set_number', 'name', 'piece_count', 'theme', 'year'],
              optional: ['condition', 'box_condition', 'complete', 'minifigures', 'instructions']
            }
          },
          { 
            id: 4, 
            name: 'Coins', 
            slug: 'coins',
            fields: {
              required: ['country', 'denomination', 'year', 'mint_mark'],
              optional: ['grade', 'certification', 'material', 'weight', 'diameter', 'error_type', 'commemorative']
            }
          },
          { 
            id: 5, 
            name: 'Stamps', 
            slug: 'stamps',
            fields: {
              required: ['country', 'denomination', 'year', 'issue'],
              optional: ['condition', 'perforated', 'color', 'errors', 'certification', 'series']
            }
          }
        ];
        
        resolve(mockTypes);
      }, 500);
    });
  } catch (error) {
    console.error('Error fetching collection types:', error);
    Sentry.captureException(error);
    throw error;
  }
}

export async function fetchCollectionDetails(collectionId) {
  try {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock collection data based on the collectionId
        const mockCollection = {
          id: collectionId,
          name: 'Model Cars Collection',
          description: 'My collection of scale model cars from various manufacturers',
          typeId: 1,
          typeName: 'Model Cars',
          itemCount: 12,
          totalValue: 1575.00,
          coverImage: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3EModel Cars%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
          isPrivate: false,
          userId: 'user123',
          createdAt: new Date(2023, 2, 15).toISOString(),
          updatedAt: new Date(2023, 5, 10).toISOString()
        };
        
        // Mock items in this collection
        const mockItems = [
          { 
            id: '1', 
            name: '1967 Chevrolet Camaro SS', 
            description: 'Die-cast model of 1967 Chevrolet Camaro SS', 
            purchasePrice: 89.99,
            currentValue: 126.50,
            condition: 'Excellent',
            attributes: { 
              make: 'Chevrolet', 
              model: 'Camaro SS', 
              year: 1967, 
              scale: '1:18',
              color: 'Red',
              manufacturer: 'GMP'
            },
            images: ['data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3ECamaro%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'],
            forSale: false,
            purchaseDate: new Date(2022, 5, 15).toISOString(),
            createdAt: new Date(2022, 5, 15).toISOString(),
            updatedAt: new Date(2022, 5, 15).toISOString()
          },
          { 
            id: '2', 
            name: '1965 Shelby Cobra 427 S/C', 
            description: 'Highly detailed replica of the classic Shelby Cobra', 
            purchasePrice: 135.00,
            currentValue: 175.00,
            condition: 'Mint',
            attributes: { 
              make: 'Shelby', 
              model: 'Cobra 427 S/C', 
              year: 1965, 
              scale: '1:18',
              color: 'Blue with white stripes',
              manufacturer: 'Exoto'
            },
            images: ['data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3ECobra%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'],
            forSale: true,
            askingPrice: 175.00,
            purchaseDate: new Date(2021, 10, 3).toISOString(),
            createdAt: new Date(2021, 10, 3).toISOString(),
            updatedAt: new Date(2023, 2, 15).toISOString()
          },
          { 
            id: '3', 
            name: '1957 Chevrolet Bel Air', 
            description: 'Classic 1957 Chevy Bel Air in turquoise and white', 
            purchasePrice: 45.99,
            currentValue: 62.75,
            condition: 'Good',
            attributes: { 
              make: 'Chevrolet', 
              model: 'Bel Air', 
              year: 1957, 
              scale: '1:24',
              color: 'Turquoise/White',
              manufacturer: 'Danbury Mint'
            },
            images: ['data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3EBel Air%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'],
            forSale: false,
            purchaseDate: new Date(2020, 7, 22).toISOString(),
            createdAt: new Date(2020, 7, 22).toISOString(),
            updatedAt: new Date(2020, 7, 22).toISOString()
          },
        ];
        
        resolve({ collection: mockCollection, items: mockItems });
      }, 1000);
    });
  } catch (error) {
    console.error('Error fetching collection details:', error);
    Sentry.captureException(error);
    throw error;
  }
}

export async function createCollection(collectionData, userId) {
  try {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const selectedType = collectionData.type;
        
        const newCollection = {
          id: `col-${Math.random().toString(36).substring(2, 11)}`,
          userId: userId,
          name: collectionData.name,
          description: collectionData.description || '',
          typeId: parseInt(collectionData.typeId),
          typeName: selectedType?.name || 'Unknown Type',
          isPrivate: collectionData.isPrivate || false,
          coverImage: collectionData.coverImage || 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a6e06bd75%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a6e06bd75%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1875%22%20y%3D%22107.0%22%3ECollection%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
          itemCount: collectionData.importData?.length || 0,
          totalValue: collectionData.importData?.reduce((sum, item) => sum + (parseFloat(item.current_value) || 0), 0) || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          items: collectionData.importData || []
        };
        
        // Validate collection before "saving"
        const validatedCollection = validateCollection(newCollection, {
          actionName: 'createCollection',
          location: 'collections/internal/services.js',
          direction: 'outgoing',
          moduleFrom: 'collections',
          moduleTo: 'database'
        });
        
        // Publish collection created event
        eventBus.publish(events.COLLECTION_CREATED, { collection: validatedCollection });
        
        resolve(validatedCollection);
      }, 1000);
    });
  } catch (error) {
    console.error('Error creating collection:', error);
    Sentry.captureException(error);
    throw error;
  }
}

export async function updateCollection(collection) {
  try {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedCollection = {
          ...collection,
          updatedAt: new Date().toISOString()
        };
        
        // Validate collection before "saving"
        const validatedCollection = validateCollection(updatedCollection, {
          actionName: 'updateCollection',
          location: 'collections/internal/services.js',
          direction: 'outgoing',
          moduleFrom: 'collections',
          moduleTo: 'database'
        });
        
        // Publish collection updated event
        eventBus.publish(events.COLLECTION_UPDATED, { collection: validatedCollection });
        
        resolve(validatedCollection);
      }, 1000);
    });
  } catch (error) {
    console.error('Error updating collection:', error);
    Sentry.captureException(error);
    throw error;
  }
}

export async function deleteCollection(collectionId) {
  try {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Publish collection deleted event
        eventBus.publish(events.COLLECTION_DELETED, { collectionId });
        
        resolve({ success: true });
      }, 1000);
    });
  } catch (error) {
    console.error('Error deleting collection:', error);
    Sentry.captureException(error);
    throw error;
  }
}