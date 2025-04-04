import express, { type Request, type Response } from 'express';
import { getBooksByPrice, getBookById } from './db/queries';
import { getBooksValidator } from './schemas/get-books-schema';
import type { UUID } from 'crypto';
import 'express';
import { getBooksByIdValidator } from './schemas/get-book-by-id-schema';

declare module 'express' {
  export interface Request {
    validatedQuery?: Record<string, any>;
  }
}

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send({ message: 'Hello World!' });
});

app.get('/books', getBooksValidator(), (req: Request, res: Response) => {
  const { minPrice, maxPrice } = req.validatedQuery as {
    minPrice: number;
    maxPrice: number;
  };

  const books = getBooksByPrice(minPrice, maxPrice);

  res.status(200).json(books);
});

app.get('/books/:bookId', getBooksByIdValidator(), (req: Request, res: Response) => {
  const bookId = req.validatedQuery?.bookId as UUID;

  const book = getBookById(bookId);

  if (!book) {
    res.status(404).json({ message: 'Book not found' });
  }

  res.status(200).json(book);
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
