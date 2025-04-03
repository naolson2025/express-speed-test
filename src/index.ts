import express, { type Request, type Response } from 'express';
import { getBooksByPrice } from './db/queries';
import { getBooksValidator } from './schemas/get-books-schema';
import 'express';

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

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
