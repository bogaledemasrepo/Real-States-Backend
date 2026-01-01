import {
  pgTable,
  text,
  varchar,
  doublePrecision,
  uuid,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Agents Table
export const agentTable = pgTable('agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  phone: varchar('phone', { length: 20 }),
  type: varchar('type', { length: 50 }).default('owner'),
  avatar: text('avatar'),
});

// 2. Reviews Table
export const reviewTable = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id').notNull(),
  rating: doublePrecision('rating').notNull(),
  content: text('content'),
  propertyId: uuid('property_id').references(() => propertyTable.id),
});

// 3. Properties Table
export const propertyTable = pgTable('properties', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: varchar('price'), // Keeping as varchar since your JSON had it as ""
  area: varchar('area'),
  bedrooms: varchar('bedrooms'),
  bathrooms: varchar('bathrooms'),
  address: text('address'),
  facilities: text('facilities'),
  image: text('image'),
  geolocation: jsonb('geolocation'),
  galleries: text('galleries').array(),
  agentId: uuid('agent_id').references(() => agentTable.id),
});

// --- RELATIONS ---
export const agentRelations = relations(agentTable, ({ many }) => ({
  properties: many(propertyTable),
}));

export const propertyRelations = relations(propertyTable, ({ one, many }) => ({
  agent: one(agentTable, {
    fields: [propertyTable.agentId],
    references: [agentTable.id],
  }),
  reviews: many(reviewTable),
}));
