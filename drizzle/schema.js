import { pgTable, serial, text, timestamp, uuid, varchar, integer, decimal, boolean, jsonb } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  role: text('role').default('user'),
  profilePicture: text('profile_picture'),
  location: text('location'),
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }),
  ratingCount: integer('rating_count').default(0)
});

// Collection Types table (templates for different collectibles)
export const collectionTypes = pgTable('collection_types', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  fields: jsonb('fields').notNull(), // JSON schema defining required and optional fields
  icon: text('icon'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Collections table
export const collections = pgTable('collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),
  typeId: integer('type_id').notNull().references(() => collectionTypes.id),
  coverImage: text('cover_image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  isPrivate: boolean('is_private').default(false),
  itemCount: integer('item_count').default(0),
  totalValue: decimal('total_value', { precision: 12, scale: 2 }).default('0.00')
});

// Items table
export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  collectionId: uuid('collection_id').notNull().references(() => collections.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),
  purchasePrice: decimal('purchase_price', { precision: 12, scale: 2 }),
  currentValue: decimal('current_value', { precision: 12, scale: 2 }),
  purchaseDate: timestamp('purchase_date'),
  purchasePlace: text('purchase_place'),
  condition: text('condition'),
  attributes: jsonb('attributes'), // Custom attributes based on collection type
  images: jsonb('images'), // Array of image URLs
  forSale: boolean('for_sale').default(false),
  askingPrice: decimal('asking_price', { precision: 12, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Wishlist items
export const wishlistItems = pgTable('wishlist_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),
  typeId: integer('type_id').references(() => collectionTypes.id),
  maxPrice: decimal('max_price', { precision: 12, scale: 2 }),
  attributes: jsonb('attributes'), // Desired attributes
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  notificationsEnabled: boolean('notifications_enabled').default(true)
});

// Wishlist matches (matches between wishlist items and available items)
export const wishlistMatches = pgTable('wishlist_matches', {
  id: uuid('id').primaryKey().defaultRandom(),
  wishlistItemId: uuid('wishlist_item_id').notNull().references(() => wishlistItems.id),
  itemId: uuid('item_id').notNull().references(() => items.id),
  createdAt: timestamp('created_at').defaultNow(),
  notified: boolean('notified').default(false),
  notificationSentAt: timestamp('notification_sent_at')
});

// Messages between users
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: uuid('sender_id').notNull().references(() => users.id),
  recipientId: uuid('recipient_id').notNull().references(() => users.id),
  itemId: uuid('item_id').references(() => items.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  read: boolean('read').default(false),
  readAt: timestamp('read_at')
});

// Transactions
export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sellerId: uuid('seller_id').notNull().references(() => users.id),
  buyerId: uuid('buyer_id').notNull().references(() => users.id),
  itemId: uuid('item_id').notNull().references(() => items.id),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  status: text('status').notNull(), // 'pending', 'completed', 'cancelled'
  paymentMethod: text('payment_method'),
  paymentId: text('payment_id'),
  shippingAddress: jsonb('shipping_address'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  completedAt: timestamp('completed_at')
});

// User feedback
export const feedback = pgTable('feedback', {
  id: uuid('id').primaryKey().defaultRandom(),
  fromUserId: uuid('from_user_id').notNull().references(() => users.id),
  toUserId: uuid('to_user_id').notNull().references(() => users.id),
  transactionId: uuid('transaction_id').references(() => transactions.id),
  rating: integer('rating').notNull(), // 1-5 stars
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow()
});

// Notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  type: text('type').notNull(), // 'wishlist_match', 'message', 'offer', etc.
  content: text('content').notNull(),
  relatedId: text('related_id'), // ID related to the notification (itemId, messageId, etc.)
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  readAt: timestamp('read_at')
});

// Advertisements
export const advertisements = pgTable('advertisements', {
  id: uuid('id').primaryKey().defaultRandom(),
  merchantId: uuid('merchant_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),
  linkUrl: text('link_url'),
  targetCollectionTypes: jsonb('target_collection_types'), // Array of collection type IDs
  active: boolean('active').default(true),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  impressions: integer('impressions').default(0),
  clicks: integer('clicks').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});