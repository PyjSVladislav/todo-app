import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to the To-Do App Backend!' });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is healthy' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});