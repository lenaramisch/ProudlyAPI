import {Request, Response} from 'express';
import cors from 'cors';
import * as users from './handler/user';
import * as todos from './handler/todo';
import * as pets from './handler/pet';

module.exports = function(app: any) {
    const allowedOrigins = ['http://localhost:3000'];

    const options: cors.CorsOptions = {
    origin: allowedOrigins
    };
    app.use(cors(options));

    //Home route:
        app.get('/', async (req: Request, res: Response) => {
            res.status(200).send("This is working!");
        }),

    // User routes
    app.get('/users', async (req: Request, res: Response) => {
        await users.getAllUsers(req, res);
    }),
    
    app.post('/users', async (req: Request, res: Response) => {
        await users.addUser(req, res);
    }),

    app.post('/login', async (req: Request, res: Response) => {
        await users.loginUser(req, res);
    })

    app.post('/verify', async (req: Request, res: Response) => {
        await users.verifyToken(req, res);
    })

    app.post('/register', async (req: Request, res: Response) => {
        await users.registerNewUser(req, res);
    })
    
    app.get('/users/:id', async (req: Request, res: Response) => {
        await users.getUserById(req, res);
    }),
    
    app.put('/users/:id', async (req: Request, res: Response) => {
        await users.updateUserById(req, res);
    }),
    
    app.delete('/users/:id', async (req: Request, res: Response) => {
        await users.deleteUserById(req, res);
    })

    //to-do routes
    app.get('/todos', async (req: Request, res: Response) => {
        await todos.getAllTodos(req, res);
    }),

    app.get('/todos/:id', async (req: Request, res: Response) => {
        await todos.getTodoById(req, res);
    }),

    app.put('/todos/:id', async (req: Request, res: Response) => {
        await todos.updateTodoById(req, res)
    }),

    app.delete('/todos/:id', async (req: Request, res: Response) => {
        await todos.deleteTodoById(req, res);
    }),

    app.post('/todos/user/:userid', async (req: Request, res: Response) => {
        await todos.addTodo(req, res);
    }),

    app.delete('/todos/user/:userid', async (req: Request, res: Response) => {
        await todos.deleteTodosByUserId(req, res);
    }),

    app.get('/todos/user/:userid', async (req: Request, res: Response) => {
        await todos.getTodosByUserId(req, res)
    }),

    app.get('/todos/user/active/:userid', async (req: Request, res: Response) => {
        await todos.getActiveTodosByUserId(req, res)
    }),

    app.get('/todos/user/archive/:userid', async (req: Request, res: Response) => {
        await todos.getCompletedTodosByUserId(req, res)
    }),

    app.put('/todos/complete/:id', async (req: Request, res: Response) => {
        await todos.completeTodoById(req, res);
    }),

    //pet routes
    app.get('/pets', async (req: Request, res: Response) => {
        await pets.getAllPets(req, res);
    }),

    app.post('/pets/user/:userid', async (req: Request, res: Response) => {
        await pets.addPet(req, res);
    }),

    app.delete('/pets/user/:userid', async (req: Request, res: Response) => {
        await pets.deletePetByUserId(req, res);
    }),

    app.get('/pets/user/:userid', async (req: Request, res: Response) => {
        await pets.getPetByUserId(req, res);
    }),

    app.get('/pets/:id', async (req: Request, res: Response) => {
        await pets.getPetById(req, res);
    }),

    app.put('/pets/:id', async (req: Request, res: Response) => {
        await pets.updatePetById(req, res)
    }),

    app.delete('/pets/:id', async (req: Request, res: Response) => {
        await pets.deletePetById(req, res);
    })
};
