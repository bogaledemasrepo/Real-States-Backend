import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { agentTable, profileTable, usersTable } from '../models/schema';
import db from '../models';
import type { Request, Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { addHours } from 'date-fns'; // Useful utility library

const JWT_SECRET = process.env.JWT_SECRET || 'your_ultra_secure_secret';
const SALT_ROUNDS = 10;

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'CUSTOMER', 'AGENT']).optional().default('CUSTOMER'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});
export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});
// Infer types from Zod schemas for extra safety
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const authController = {
  signUp: async (req: Request, res: Response) => {
    try {
      // 1. Validate Input using Zod
      const validatedData = registerSchema.parse(req.body);
      const { name, email, password, role } = validatedData;

      // 2. Check if user exists
      const existingUser = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      // 3. Hash password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // 4. Database Transaction
      const newUser = await db.transaction(async (tx) => {
        const [insertedUser] = await tx
          .insert(usersTable)
          .values({
            name,
            email,
            password: hashedPassword,
            role,
          })
          .returning();

        if (!insertedUser) throw new Error('User creation failed');

        await tx.insert(profileTable).values({
          userId: insertedUser.id,
        });

        if (role === 'AGENT') {
          await tx.insert(agentTable).values({
            userId: insertedUser.id,
          });
        }

        return insertedUser;
      });

      res.status(201).json({
        message: 'User created successfully',
        userId: newUser.id,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.message });
      }
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  signIn: async (req: Request, res: Response) => {
    try {
      // 1. Validate Input
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;

      // 2. Find user
      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
        with: {
          profile: true,
          agentData: true,
        },
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // 3. Verify Password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // 4. Generate JWT
      const token = jwt.sign(
        { sub: user.id, role: user.role, email: user.email },
        JWT_SECRET,
        { expiresIn: '1d' },
      );

      const { password: _, ...userWithoutPassword } = user;
      console.log(_);
      res.status(200).json({
        message: 'Login successful',
        token,
        user: userWithoutPassword,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.message });
      }
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
sendPasswordResetLink: async (req: Request, res: Response) => {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);

      // 1. Check if user exists
      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
      });

      // Security Tip: Even if user doesn't exist, return 200 to prevent "Email Enumeration"
      if (!user) {
        return res.json({ message: "If an account exists, a reset link has been sent." });
      }

      // 2. Generate a random token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      
      // 3. Store hashed token and expiry (e.g., 1 hour from now)
      await db.update(usersTable)
        .set({
          resetToken: hashedToken,
          resetTokenExpires: addHours(new Date(), 1), 
        })
        .where(eq(usersTable.id, user.id));

      // 4. Send Email (Pseudo-code)
      const resetUrl = `https://yourfrontend.com/reset-password?token=${resetToken}`;
      console.log(`Email sent to ${email}: ${resetUrl}`); 
      // await sendEmail({ to: email, subject: "Reset Password", html: `<a href="${resetUrl}">Reset</a>` });

      res.json({ message: "If an account exists, a reset link has been sent." });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.message });
      res.status(500).json({ message: "Internal server error" });
    }
  },

  resetPassword: async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = resetPasswordSchema.parse(req.body);

      // 1. Hash the incoming token to compare with DB
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      // 2. Find user with valid token and check expiry
      const user = await db.query.usersTable.findFirst({
        where: (users, { and, eq, gt }) => and(
          eq(users.resetToken, hashedToken),
          gt(users.resetTokenExpires, new Date()) // Check if expiry is in the future
        ),
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // 3. Hash new password and clear token fields
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

      await db.update(usersTable)
        .set({
          password: hashedPassword,
          resetToken: null,
          resetTokenExpires: null,
        })
        .where(eq(usersTable.id, user.id));

      res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.message });
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
