import express, { Request, Response } from 'express';
import { Pool, QueryResult } from 'pg';

const app = express();
const port = 3000;

app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todo_app',
  password: 'postgres',
  port: 5432,
});

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoRequestBody {
  title?: string;
  completed?: boolean;
}

interface ErrorResponse {
  message: string;
}

app.get('/', (_req: Request, res: Response) => {
  return res.json({ message: 'Welcome to the To-Do App Backend!' });
});

app.get('/api/health', (_req: Request, res: Response) => {
  return res.json({ status: 'OK', message: 'Server is healthy' });
});

app.get('/api/todos', async (_req: Request, res: Response) => {
  try {
    const result: QueryResult<Todo> = await pool.query('SELECT * FROM todos;')
    return res.status(200).json(result.rows as Todo[])
  } catch(err: unknown) {
    console.error('Error occur while fetching todos', err)
    return res.status(500).json({message: 'Internal server error'} as ErrorResponse)
  }
})

app.get('/api/todos/:id', async (req: Request<{id: string}>, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const result: QueryResult<Todo> = await pool.query('SELECT * FROM todos WHERE id = $1', [id])
    if(result.rows.length === 0) 
      return res.status(404).json({message: 'Todo not found'} as ErrorResponse);
    return res.status(200).json(result.rows[0] as Todo)
  } catch(err: unknown) {
    console.error('Error occur while fetching todo', err);
    return res.status(500).json({message: 'Internal server error'} as ErrorResponse)
  }
})

app.post('/api/todos', async (req: Request<{}, {}, TodoRequestBody>, res: Response) => {
  const {title} = req.body;
  if(!title || typeof title !== 'string') 
    return res.json(400).json({message: 'Title is required and must be a string'} as ErrorResponse);
  try {
    const result: QueryResult<Todo> = await pool.query('INSERT INTO todos (title, completed) values ($1, $2) RETURNING *', [title, false])
    return res.status(201).json(result.rows[0] as Todo)
  } catch(err: unknown) {
    console.error('Error occur while creating todo', err);
    return res.status(500).json({message: 'Internal server error'} as ErrorResponse)
  }
})

app.put('/api/todos/:id', async (req: Request<{id: string}, {}, TodoRequestBody>, res: Response) => {
  const {title, completed} = req.body;
  const id = parseInt(req.params.id)
  if(title !== undefined && typeof title !== 'string')
    return res.status(400).json({message: 'Title must be a string'} as ErrorResponse) 
  if(completed !== undefined && typeof completed !== 'boolean')
    return res.status(400).json({message: 'Completed must be a boolean'} as ErrorResponse)
  try {
    const todo: QueryResult<Todo> = await pool.query<Todo>('SELECT * FROM todos WHERE id = $1', [id])
    if(todo.rows.length === 0) 
      return res.status(404).json({message: 'Todo not found'} as ErrorResponse);
    const updated: string[] = [];
    const values: any[] = [];
    let paramCount = 1;
    if(title !== undefined) {
      updated.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }
    if(completed !== undefined) {
      updated.push(`completed = $${paramCount}`)
      values.push(completed);
      paramCount++;
    }
    values.push(id)
    const queryString =`
      UPDATE todos 
      SET ${updated.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `
    const updateResult: QueryResult<Todo> = await pool.query(queryString, values);
    return res.status(200).json(updateResult.rows[0] as Todo)
  } catch(err: unknown) {
    console.error('Error occur while updating todo', err);
    return res.status(500).json({message: 'Internal server error'} as ErrorResponse)
  }
})

app.delete('/api/todos/:id', async (req: Request<{id: string}>, res: Response) => {
  const id = parseInt(req.params.id)
  try {
    const result: QueryResult<Todo> = await pool.query<Todo>('DELETE FROM todos WHERE id = $1 RETURNING *', [id])
    if(result.rowCount === 0) 
      return res.status(400).json({message: 'Todo not found'} as ErrorResponse);
    return res.status(204).send();
  } catch(err:unknown) {
    console.error('Error occur while deleting todo', err);
    return res.status(500).json({message: 'Internal server error'} as ErrorResponse)
  }
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});