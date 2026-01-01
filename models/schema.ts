import { 
  pgTable, 
  serial, 
  text, 
  varchar, 
  integer, 
  doublePrecision, 
  jsonb, 
  uuid 
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- Agents Table ---
export const agents = pgTable("agents", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  phone: varchar("phone", { length: 20 }),
  type: varchar("type", { length: 50 }).default("owner"), // e.g., owner, agent
  avatar: text("avatar"),
});

// --- Properties Table ---
export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: doublePrecision("price").notNull(),
  area: integer("area"), // square meters/feet
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  address: text("address"),
  facilities: text("facilities"), // or jsonb if you want a list
  mainImage: text("image"),
  geolocation: jsonb("geolocation"), // { lat: number, lng: number }
  galleries: text("galleries").array(), // Array of image URLs
  agentId: uuid("agent_id").references(() => agents.id),
});

// --- Reviews Table ---
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull(), // ID of the person who wrote the review
  rating: doublePrecision("rating").notNull(),
  content: text("content"),
  propertyId: uuid("property_id").references(() => properties.id),
});

// --- Relations ---
export const agentsRelations = relations(agents, ({ many }) => ({
  properties: many(properties),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  agent: one(agents, {
    fields: [properties.agentId],
    references: [agents.id],
  }),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  property: one(properties, {
    fields: [reviews.propertyId],
    references: [properties.id],
  }),
}));