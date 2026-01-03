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
import { relations, sql } from 'drizzle-orm';

// 0. Enums
export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'CUSTOMER', 'AGENT']);

// 1. Users Table (The Base Identity)
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

// 2. Profile Table (User Details)
export const profileTable = pgTable('profile', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  bio: text('bio'),
  birthDate: date('birth_date'),
  photos: text('photos')
    .array()
    .default(sql`ARRAY[]::text[]`),
});

// 3. Agent Extension Table
// Only rows exist here if user.role === 'AGENT'
export const agentTable = pgTable('agents', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  phone: varchar('phone', { length: 20 }),
  type: varchar('type', { length: 50 }).default('owner'),
  // We removed 'name', 'email', and 'avatar' here because they live in usersTable
});

// 4. Properties Table (Linked to the Agent entry)
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
  agentId: uuid('agent_id').references(() => agentTable.userId), // References the agent's userId
});

// 5. Reviews Table
export const reviewTable = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  rating: doublePrecision('rating').notNull(),
  content: text('content'),
  propertyId: uuid('property_id').references(() => propertyTable.id),
});

// --- RELATIONS ---

export const userRelations = relations(usersTable, ({ one, many }) => ({
  profile: one(profileTable, {
    fields: [usersTable.id],
    references: [profileTable.userId],
  }),
  agentData: one(agentTable, {
    fields: [usersTable.id],
    references: [agentTable.userId],
  }),
  reviews: many(reviewTable),
}));

export const agentRelations = relations(agentTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [agentTable.userId],
    references: [usersTable.id],
  }),
  properties: many(propertyTable),
}));

export const propertyRelations = relations(propertyTable, ({ one, many }) => ({
  agent: one(agentTable, {
    fields: [propertyTable.agentId],
    references: [agentTable.userId],
  }),
  reviews: many(reviewTable),
}));
