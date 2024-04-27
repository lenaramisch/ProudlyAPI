import express, {Request, Response} from 'express';
import * as users from './handler/user';
import * as todos from './handler/todo';
import * as pets from './handler/pet';

module.exports = function(app: any) {
    //Home route:
        app.get('/', async (req: Request, res: Response) => {
            res.status(200).send("This is working!");
        }),

    // User routes
    app.get('/users', async (req: Request, res: Response) => {
        const result = await users.getAllUsers();
        res.status(result.status).send(result.data || result.message);
    }),
    
    app.post('/users', async (req: Request, res: Response) => {
        const { username } = req.body;
        const result = await users.addUser(username);
        res.status(result.status).send(result.message);
    }),
    
    app.get('/users/:id', async (req: Request, res: Response) => {
        const user_id = parseInt(req.params.id as string)
        const result = await users.getUserById(user_id);
        res.status(result.status).send(result.data || result.message);
    }),
    
    app.put('/users/:id', async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string)
        const { username } = req.body;
        const result = await users.updateUserById(id, username);
        res.status(result.status).send(result.message);
    }),
    
    app.delete('/users/:id', async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string)
        const result = await users.deleteUserById(id);
        res.status(result.status).send(result.message);
    })

    //to-do routes
    app.get('/todos', async (req: Request, res: Response) => {
        const result = await todos.getAllTodos();
        res.status(result.status).send(result.data || result.message);
    }),

    app.get('/todos/:id', async (req: Request, res: Response) => {
        const todo_id = parseInt(req.params.id as string)
        const result = await todos.getTodoById(todo_id);
        res.status(result.status).send(result.data || result.message);
    }),

    app.put('/todos/:id', async (req: Request, res: Response) => {
        const todo_id = parseInt(req.params.id as string)
        const { title, size } = req.body;
        const result = await todos.updateTodoById(todo_id, title, size);
        res.status(result.status).send(result.message);
    }),

    app.delete('/todos/:id', async (req: Request, res: Response) => {
        const todo_id = parseInt(req.params.id as string)
        const result = await todos.deleteTodoById(todo_id);
        res.status(result.status).send(result.message);
    }),

    app.post('/todos/user/:userid', async (req: Request, res: Response) => {
        const user_id = parseInt(req.params.userid as string)
        const { title, size } = req.body;
        const result = await todos.addTodo(user_id, title, size);
        res.status(result.status).send(result.message);
    }),

    app.delete('/todos/user/:userid', async (req: Request, res: Response) => {
        const user_id = parseInt(req.params.userid as string)
        const result = await todos.deleteTodosByUserId(user_id);
        res.status(result.status).send(result.message);
    }),

    app.get('/todos/user/:userid', async (req: Request, res: Response) => {
        const user_id = parseInt(req.params.userid as string)
        const result = await todos.getTodosByUserId(user_id);
        res.status(result.status).send(result.data || result.message);
    }),

    //pet routes
    app.get('/pets', async (req: Request, res: Response) => {
        const result = await pets.getAllPets();
        res.status(result.status).send(result.data || result.message);
    }),

    app.post('/pets/user/:userid', async (req: Request, res: Response) => {
        const user_id = parseInt(req.params.userid as string)
        const { name } = req.body;
        const result = await pets.addPet(user_id, name);
        res.status(result.status).send(result.message);
    }),

    app.delete('/pets/user/:userid', async (req: Request, res: Response) => {
        const user_id = parseInt(req.params.userid as string)
        const result = await pets.deletePetByUserId(user_id);
        res.status(result.status).send(result.message);
    }),

    app.get('/pets/user/:userid', async (req: Request, res: Response) => {
        const user_id = parseInt(req.params.userid as string)
        const result = await pets.getPetByUserId(user_id);
        res.status(result.status).send(result.data || result.message);
    }),

    app.get('/pets/:id', async (req: Request, res: Response) => {
        const pet_id = parseInt(req.params.id as string)
        const result = await pets.getPetById(pet_id);
        res.status(result.status).send(result.data || result.message);
    }),

    app.put('/pets/:id', async (req: Request, res: Response) => {
        const pet_id = parseInt(req.params.id as string)
        const { name } = req.body;
        const result = await pets.updatePetById(pet_id, name);
        res.status(result.status).send(result.message);
    }),

    app.delete('/pets/:id', async (req: Request, res: Response) => {
        const pet_id = parseInt(req.params.id as string)
        const result = await pets.deletePetById(pet_id);
        res.status(result.status).send(result.message);
    })
};
