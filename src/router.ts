import express, {Request, Response} from 'express';
import * as users from './handler/user';

const pets = require('./handler/pet');
const todos = require('./handler/todo');

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

    //to-do routes

    //TODO add todo routes:
    // /to-do routes:
    //get all todos
    //post new todo

    // /to-do/id routes:
    //get todo by id
    //put todo by id
    //delete todo by id

    // /to-do/user/userid routes:
    //delete todos by user id
    //get todos by user id

    //pet routes

    //TODO add pet routes:
    // /pets routes:
    //get all pets
    //post new pet

    // /pets/user/userid routes:
    //delete pet by user id
    //get pet by user id

    // /pets/petId routes:
    //delete pet by petID
    //put pet by petID
    //get pet by petID
    
};
