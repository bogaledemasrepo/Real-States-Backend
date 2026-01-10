import db from '../models';
import { propertyTable } from '../models/schema';
import type { Request, Response } from 'express';
import { eq, sql } from 'drizzle-orm';

/**
 * @openapi
 * components:
 * schemas:
 * Property:
 * type: object
 * properties:
 * id: { type: string, format: uuid }
 * name: { type: string }
 * price: { type: string }
 * address: { type: string }
 * agentId: { type: string, format: uuid }
 */

export const propertyController = {
  /**
   * @openapi
   * /property:
   * post:
   * tags: [Properties]
   * summary: Create a new property
   * requestBody:
   * required: true
   * content:
   * application/json:
   * schema: { $ref: '#/components/schemas/Property' }
   */
  createProperty: async (req: Request, res: Response) => {
    try {
      const newProperty = await db
        .insert(propertyTable)
        .values(req.body)
        .returning();
      return res.status(201).json(newProperty[0]);
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Failed to create property' });
    }
  },

  /**
   * @openapi
   * /property:
   * get:
   * tags: [Properties]
   * summary: Get all properties
   */
  getAllProperties: async (req: Request, res: Response) => {
    try {
      const properties = await db.query.propertyTable.findMany({
        with: {
          reviews: true,
          agent: {
            columns: { name: true, email: true, avatar: true }
          }
        },
      });
      return res.json(properties);
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Failed to fetch properties' });
    }
  },

  /**
   * @openapi
   * /property/paged:
   * get:
   * tags: [Properties]
   * summary: Get paginated properties
   * parameters:
   * - in: query
   * name: page
   * schema: { type: integer, default: 1 }
   * - in: query
   * name: limit
   * schema: { type: integer, default: 10 }
   */
  getAllPropertiesPaged: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const properties = await db.query.propertyTable.findMany({
        limit: limit,
        offset: offset,
        with: {
          reviews: true,
          agent: { columns: { name: true, avatar: true } }
        },
      });

      const totalResult = await db.select({ count: sql<number>`count(*)` }).from(propertyTable);
      
      return res.json({
        data: properties,
        meta: {
          total: Number(totalResult[0]?.count),
          page,
          limit
        }
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Failed to fetch paginated properties' });
    }
  },

  /**
   * @openapi
   * /property/{id}:
   * get:
   * tags: [Properties]
   * summary: Get a single property by ID
   */
  getPropertyById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) throw new Error('Please provide property ID');
      const property = await db.query.propertyTable.findFirst({
        where: eq(propertyTable.id, id),
        with: {
          agent: { columns: { name: true, avatar: true, email: true } },
          reviews: {
            with: { user: { columns: { name: true, avatar: true } } },
          },
        },
      });

      if (!property) return res.status(404).json({ error: 'Property not found' });
      return res.json(property);
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Error fetching property' });
    }
  },

  /**
   * @openapi
   * /property/{id}:
   * put:
   * tags: [Properties]
   * summary: Update property
   */
  updateProperty: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) throw new Error('Please provide property ID');
      const updated = await db
        .update(propertyTable)
        .set(req.body)
        .where(eq(propertyTable.id, id))
        .returning();

      if (updated.length === 0) return res.status(404).json({ error: 'Property not found' });
      return res.json(updated[0]);
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Update failed' });
    }
  },

  /**
   * @openapi
   * /property/{id}:
   * delete:
   * tags: [Properties]
   * summary: Delete property
   */
  deleteProperty: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) throw new Error('Please provide property ID');
      const result = await db.delete(propertyTable).where(eq(propertyTable.id, id)).returning();
      
      if (result.length === 0) return res.status(404).json({ error: 'Property not found' });
      return res.status(204).send();
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Delete failed' });
    }
  },
};