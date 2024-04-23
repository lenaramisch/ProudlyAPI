import express, {Request, Response} from 'express';

const users = require('./handler/user');
const pets = require('./handler/pet');
const todos = require('./handler/todo');

module.exports = function(app: any) {
    //Home route:
        app.get('/', async (req: Request, res: Response) => {
            res.status(200).send("This is working!");
        }),
    // TODO add todo routes

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
        const id = parseInt(req.params.id as string)
        const result = await users.getUserById(id);
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

    //TODO add pet Routes
    
};
