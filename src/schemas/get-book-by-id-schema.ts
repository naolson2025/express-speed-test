import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const schema = z.string().uuid();

export const getBooksByIdValidator =
  () => (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.params.bookId);

      if (!result.success) {
        const errorMessages = result.error.errors.map((err) => err.message);

        res.status(400).json({
          message: 'Invalid url parameter',
          errors: errorMessages,
        });
        return;
      }

      req.validatedQuery = { bookId: result.data };

      next();
    } catch (error) {
      console.error('Validation middleware error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
