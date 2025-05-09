import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export type CreateBookSchema = z.infer<typeof schema>;

export const schema = z
  .object({
    title: z
      .string({
        required_error: 'Title is required',
        invalid_type_error: 'Title must be a string',
      })
      .min(1, 'Title cannot be empty'),
    author: z
      .string({
        required_error: 'Author is required',
        invalid_type_error: 'Author must be a string',
      })
      .min(1, 'Author cannot be empty'),
    genre: z
      .string({
        required_error: 'Genre is required',
        invalid_type_error: 'Genre must be a string',
      })
      .min(1, 'Genre cannot be empty'),
    price: z
      .number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
      })
      .gt(0, { message: 'Price must be greater than 0' })
      .max(1000, { message: 'Price cannot exceed 1000' }),
  })
  .strict();

  export const createBookValidator =
  () => (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errorMessages = result.error.errors.map((err) => err.message);

        res.status(400).json({
          message: 'Invalid request body',
          errors: errorMessages,
        });
        return;
      }

      req.validatedQuery = result.data;

      next();
    } catch (error) {
      console.error('Validation middleware error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
