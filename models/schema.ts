import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  varchar,
  doublePrecision,
  uuid,
  jsonb,
  timestamp,
  date,
  pgEnum,
} from 'drizzle-orm/pg-core';

// 0. Enums
export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'CUSTOMER', 'AGENT']);

// 1. Users Table
export const usersTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  avatar: varchar('avatar', { length: 255 }),
  password: varchar('password', { length: 255 }).notNull(),
  role: userRoleEnum('role').default('CUSTOMER'),
  resetToken: text('reset_token'),
  resetTokenExpires: timestamp('reset_token_expires'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Profile Table
export const profileTable = pgTable('profile', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  bio: text('bio'),
  birthDate: date('birth_date'),
});

// 3. Properties Table
export const propertyTable = pgTable('properties', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: varchar('price'),
  area: varchar('area'),
  bedrooms: varchar('bedrooms'),
  bathrooms: varchar('bathrooms'),
  address: text('address'),
  facilities: text('facilities'),
  image: text('image'),
  geolocation: jsonb('geolocation'),
  galleries: text('galleries').array(),
  agentId: uuid('agent_id').references(() => usersTable.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Reviews Table
export const reviewTable = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  rating: doublePrecision('rating').notNull(),
  content: text('content'),
  propertyId: uuid('property_id').references(() => propertyTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- RELATIONS ---

// Users Relations: Link to profile, properties (as agent), and reviews (as author)
export const usersRelations = relations(usersTable, ({ one, many }) => ({
  profile: one(profileTable, {
    fields: [usersTable.id],
    references: [profileTable.userId],
  }),
  properties: many(propertyTable), 
  reviews: many(reviewTable),      
}));

// Profile Relations: Back link to the owner user
export const profileRelations = relations(profileTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [profileTable.userId],
    references: [usersTable.id],
  }),
}));

// Property Relations: Link to the agent and the collection of reviews
export const propertyRelations = relations(propertyTable, ({ one, many }) => ({
  agent: one(usersTable, {
    fields: [propertyTable.agentId],
    references: [usersTable.id],
  }),
  reviews: many(reviewTable),
}));

// Review Relations: Link to both the reviewer and the property being reviewed
export const reviewRelations = relations(reviewTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [reviewTable.userId],
    references: [usersTable.id],
  }),
  property: one(propertyTable, {
    fields: [reviewTable.propertyId],
    references: [propertyTable.id],
  }),
}));