import { authenticateUser, asyncHandler, sendError, createDbClient } from './_apiUtils.js';
import { items } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import Sentry from './_sentry.js';

export default asyncHandler(async (req, res) => {
  try {
    const user = await authenticateUser(req);
    const { client, db } = createDbClient();
    
    try {
      if (req.method !== 'POST') {
        return sendError(res, 405, 'Method not allowed');
      }
      
      const { itemId, files } = req.body;
      
      if (!itemId) {
        return sendError(res, 400, 'Item ID is required');
      }
      
      if (!files || !Array.isArray(files) || files.length === 0) {
        return sendError(res, 400, 'Files to upload are required');
      }
      
      // Verify item ownership
      const itemResult = await db.select()
        .from(items)
        .where(eq(items.id, itemId))
        .limit(1);
      
      if (itemResult.length === 0) {
        return sendError(res, 404, 'Item not found');
      }
      
      const item = itemResult[0];
      
      if (item.userId !== user.id) {
        return sendError(res, 403, 'You do not have permission to access this item');
      }
      
      // In a real implementation, files would be uploaded to a storage service
      // and the URLs would be stored in the database.
      // For this example, we'll simulate storing the proofOfPurchase URLs
      
      // Update the item with the proof of purchase files
      const proofOfPurchase = item.proofOfPurchase || [];
      const updatedProofOfPurchase = [...proofOfPurchase, ...files];
      
      const result = await db.update(items)
        .set({
          proofOfPurchase: updatedProofOfPurchase,
          updatedAt: new Date()
        })
        .where(eq(items.id, itemId))
        .returning();
      
      if (result.length === 0) {
        return sendError(res, 500, 'Failed to update item');
      }
      
      return res.status(200).json({
        success: true,
        message: `Successfully uploaded ${files.length} files`,
        proofOfPurchase: updatedProofOfPurchase
      });
    } finally {
      await client.end();
    }
  } catch (error) {
    console.error('Error in proof of purchase upload API:', error);
    Sentry.captureException(error);
    return sendError(res, 500, 'Internal server error');
  }
});