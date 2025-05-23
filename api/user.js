import { users } from '../drizzle/schema.js';
import { authenticateUser, createDbClient, asyncHandler, sendError } from './_apiUtils.js';
import { eq } from 'drizzle-orm';
import Sentry from './_sentry.js';

export default asyncHandler(async (req, res) => {
  try {
    const user = await authenticateUser(req);
    const { client, db } = createDbClient();

    try {
      if (req.method === 'GET') {
        // Get user profile
        const result = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
        
        // If user doesn't exist in our database, create a new user record
        if (result.length === 0) {
          console.log(`User ${user.id} not found in database, creating new record`);
          
          // Create the user record
          const newUser = {
            id: user.id,
            email: user.email,
            firstName: user.user_metadata?.first_name || '',
            lastName: user.user_metadata?.last_name || '',
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          const insertResult = await db.insert(users).values(newUser).returning();
          
          if (insertResult.length === 0) {
            return sendError(res, 500, 'Failed to create user record');
          }
          
          console.log(`Successfully created user record for ${user.id}`);
          return res.status(200).json(insertResult[0]);
        }
        
        return res.status(200).json(result[0]);
      } else if (req.method === 'PATCH') {
        // Check if user exists first
        const existingUser = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
        
        // If user doesn't exist, create it before updating
        if (existingUser.length === 0) {
          console.log(`User ${user.id} not found for update, creating new record first`);
          
          // Create the user record
          const newUser = {
            id: user.id,
            email: user.email,
            firstName: user.user_metadata?.first_name || '',
            lastName: user.user_metadata?.last_name || '',
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          await db.insert(users).values(newUser);
        }
        
        // Update user profile
        const { firstName, lastName, city, country, socialMedia, forumHandles, ...otherFields } = req.body;
        
        // Sanitize and validate input
        if (socialMedia && typeof socialMedia !== 'object') {
          return sendError(res, 400, 'socialMedia must be an object');
        }
        
        if (forumHandles && typeof forumHandles !== 'object') {
          return sendError(res, 400, 'forumHandles must be an object');
        }
        
        // Prepare update data
        const updateData = {
          updatedAt: new Date()
        };
        
        // Only add fields that are provided
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (city !== undefined) updateData.city = city;
        if (country !== undefined) updateData.country = country;
        if (socialMedia !== undefined) updateData.socialMedia = socialMedia;
        if (forumHandles !== undefined) updateData.forumHandles = forumHandles;
        
        // Update user
        const result = await db.update(users)
          .set(updateData)
          .where(eq(users.id, user.id))
          .returning();
        
        if (result.length === 0) {
          return sendError(res, 500, 'Failed to update user record');
        }
        
        return res.status(200).json(result[0]);
      } else {
        return sendError(res, 405, 'Method not allowed');
      }
    } finally {
      await client.end();
    }
  } catch (error) {
    console.error('Error in user API:', error);
    Sentry.captureException(error, {
      extra: {
        endpoint: 'user',
        method: req.method,
        user: req.user ? { id: req.user.id } : 'not authenticated'
      }
    });
    return sendError(res, 500, 'Internal server error');
  }
});