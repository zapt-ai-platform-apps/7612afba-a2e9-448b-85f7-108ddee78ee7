import { authenticateUser, asyncHandler, sendError, createDbClient } from '../_apiUtils.js';
import { collections, items, collectionTypes } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import Sentry from '../_sentry.js';

export default asyncHandler(async (req, res) => {
  try {
    const user = await authenticateUser(req);
    const { client, db } = createDbClient();
    
    try {
      if (req.method === 'GET') {
        // Export collection template
        const { collectionId, format } = req.query;
        
        if (!collectionId) {
          return sendError(res, 400, 'Collection ID is required');
        }
        
        // Verify collection ownership
        const collectionResult = await db.select()
          .from(collections)
          .where(eq(collections.id, collectionId))
          .limit(1);
        
        if (collectionResult.length === 0) {
          return sendError(res, 404, 'Collection not found');
        }
        
        const collection = collectionResult[0];
        
        if (collection.userId !== user.id) {
          return sendError(res, 403, 'You do not have permission to access this collection');
        }
        
        // Get collection type
        const collectionTypeResult = await db.select()
          .from(collectionTypes)
          .where(eq(collectionTypes.id, collection.typeId))
          .limit(1);
          
        if (collectionTypeResult.length === 0) {
          return sendError(res, 404, 'Collection type not found');
        }
        
        const type = collectionTypeResult[0];
        
        // Get fields from the collection type
        const typeFields = type.fields;
        const requiredFields = typeFields.required || [];
        const optionalFields = typeFields.optional || [];
        
        // Generate template based on collection type
        const headers = [
          'name',
          'description',
          'purchase_price',
          'current_value',
          'purchase_date',
          'purchase_place',
          'condition',
          'currency',
          ...requiredFields,
          ...optionalFields
        ];
        
        if (format === 'csv') {
          // Generate CSV template
          const csvHeader = headers.join(',');
          
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', `attachment; filename=${collection.name}-template.csv`);
          return res.status(200).send(csvHeader);
        } else {
          // Default: JSON template
          const template = {
            headers,
            items: []
          };
          
          return res.status(200).json(template);
        }
      } else if (req.method === 'POST') {
        // Import collection data
        const { collectionId, items: importItems } = req.body;
        
        if (!collectionId) {
          return sendError(res, 400, 'Collection ID is required');
        }
        
        if (!importItems || !Array.isArray(importItems) || importItems.length === 0) {
          return sendError(res, 400, 'Items to import are required');
        }
        
        // Verify collection ownership
        const collectionResult = await db.select()
          .from(collections)
          .where(eq(collections.id, collectionId))
          .limit(1);
        
        if (collectionResult.length === 0) {
          return sendError(res, 404, 'Collection not found');
        }
        
        const collection = collectionResult[0];
        
        if (collection.userId !== user.id) {
          return sendError(res, 403, 'You do not have permission to access this collection');
        }
        
        // Insert items
        const insertedItems = [];
        
        for (const item of importItems) {
          const {
            name,
            description,
            purchasePrice,
            currentValue,
            purchaseDate,
            purchasePlace,
            condition,
            currency,
            attributes
          } = item;
          
          if (!name) {
            continue; // Skip items without a name
          }
          
          // Insert the item
          const result = await db.insert(items)
            .values({
              collectionId,
              userId: user.id,
              name,
              description,
              purchasePrice: purchasePrice ? parseFloat(purchasePrice) : null,
              currentValue: currentValue ? parseFloat(currentValue) : null,
              purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
              purchasePlace,
              condition,
              currency: currency || 'USD',
              attributes: attributes || {},
              images: [],
              createdAt: new Date(),
              updatedAt: new Date()
            })
            .returning();
          
          if (result.length > 0) {
            insertedItems.push(result[0]);
          }
        }
        
        // Update collection item count
        await db.update(collections)
          .set({
            itemCount: collection.itemCount + insertedItems.length,
            updatedAt: new Date()
          })
          .where(eq(collections.id, collectionId));
        
        return res.status(200).json({
          success: true,
          message: `Successfully imported ${insertedItems.length} items`,
          items: insertedItems
        });
      } else {
        return sendError(res, 405, 'Method not allowed');
      }
    } finally {
      await client.end();
    }
  } catch (error) {
    console.error('Error in collection import/export API:', error);
    Sentry.captureException(error);
    return sendError(res, 500, 'Internal server error');
  }
});