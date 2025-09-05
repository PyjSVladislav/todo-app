import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

let todos:Todo[] = [];
let nextId = 1;

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to the To-Do App Backend!' });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is healthy' });
});

app.get('/api/todos', (_req: Request, res: Response) => {
  return res.status(200).json(todos)
})

app.get('/api/todos/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  const todo = todos.find(t => t.id === id)
  if(!todo) 
    return res.status(404).json({message: 'Todo not found'});
  return res.status(200).json(todo);
})

app.post('/api/todos', (req: Request, res: Response) => {
  const {title} = req.body;
  if(!title || typeof title !== 'string') 
    return res.status(400).json({message: 'Title is required and must be a string'});
  const todo:Todo = {id: nextId++, title, completed: false}
  todos.push(todo)
  return res.status(201).json(todo)
})

app.put('/api/todos/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const {title, completed} = req.body;
  const todo = todos.find(t => t.id === id)
  if(!todo) 
    return res.status(404).json({message: 'Todo not found'});
  if(title !== undefined && typeof title !== 'string')
    return res.status(400).json({message: 'Title must be a string'});
  if(completed !== undefined && typeof completed !== 'boolean') 
    return res.status(400).json({message: 'Completed must be a boolean'});
  if(title !== undefined) todo.title = title;
  if(completed !== undefined) todo.completed = completed;
  return res.status(200).json(todo)
})

app.delete('/api/todos/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  const index = todos.findIndex(t => t.id === id)
  if(index === -1) 
    return res.status(404).json({message: 'Todo not found'});
  todos.splice(index, 1);
  return res.status(204).send()
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});