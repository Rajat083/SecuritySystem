import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
export const phoneSchema = z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number');
export const idSchema = z.string().min(1, 'ID is required');

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: passwordSchema,
});

// Student schema
export const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  student_id: z.string().min(1, 'Student ID is required'),
  department: z.string().min(1, 'Department is required'),
  phone: phoneSchema.optional(),
  password: passwordSchema.optional(),
});

// Visitor schema
export const visitorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  phone: phoneSchema,
  purpose: z.string().min(5, 'Purpose must be at least 5 characters'),
  host_name: z.string().min(2, 'Host name is required'),
  id_proof: z.string().optional(),
  valid_until: z.string().optional(),
});

// Entry schema
export const entrySchema = z.object({
  user_id: idSchema,
  reason: z.string().optional(),
});

// Exit schema
export const exitSchema = z.object({
  user_id: idSchema,
  destination: z.string().optional(),
  expected_return: z.string().optional(),
});

// Campus state schema
export const campusStateSchema = z.object({
  state: z.enum(['open', 'closed', 'restricted', 'emergency']),
  reason: z.string().optional(),
  restrictions: z.array(z.string()).optional(),
});
