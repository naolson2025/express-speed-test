import type { NextFunction, Request, Response } from 'express';
import { Schema, z } from 'zod';
import 'express';

declare module 'express' {
  export interface Request {
    validatedQuery?: Record<string, any>;
  }
}

export const schema = z
  .object({
    minPrice: z
      .string()
      .optional()
      .default('0')
      .refine((val) => Number(val) >= 0 && Number(val) <= 1000, {
        message: 'minPrice must be a number between 0 and 1000',
      })
      .transform((val) => Number(val)),
    maxPrice: z
      .string()
      .optional()
      .default('1000')
      .refine((val) => Number(val) >= 0 && Number(val) <= 1000, {
        message: 'maxPrice must be a number between 0 and 1000',
      })
      .transform((val) => Number(val)),
  })
  .strict({ message: 'Only minPrice and maxPrice are valid query params' })
  .refine((data) => data.minPrice <= data.maxPrice, {
    message: 'minPrice must be less than or equal to maxPrice',
  });

export const getBooksValidator =
  () => (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.query);

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
