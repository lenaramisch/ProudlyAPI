import { TodoDomain } from "../domain/models";
import { TodoDTO } from "./models";
import domain from "../domain/domain";
import { Request, Response } from "express";

export async function completeTodoById(req: Request, res: Response) {
    try {
        const todo_id = parseInt(req.params.id as string);
        const domainTodo = await domain.getTodoById(todo_id);
        if (Object.keys(domainTodo).length === 0) {
            res.status(404).send('No todo found for todo_id ' + todo_id)
            return
        }
        if (domainTodo instanceof Error) {
            res.status(500).send("Internal Server Error")
            return
        }
        const user_id = domainTodo.user_id;
        const token = req.headers.authorization
        if (!token) {
            console.log("No token provided")
            res.status(401).send("No token provided");
            return
        }
        const decoded = await domain.verifyToken(token) as string;

        const data = JSON.parse(JSON.stringify(decoded))

        if (data.userid !== user_id){
            res.status(403).send("Forbidden")
            return
        }
        await domain.completeTodoById(todo_id);
        res.status(200).send("Marked todo as completed")
        return
    } catch (error: any) {
        console.error(error);
        res.status(500).send("Internal Server Error")
        return
    } 
}

export async function getActiveTodosByUserId(req: Request, res: Response) {
    try {
        const token = req.headers.authorization
        const user_id = parseInt(req.params.userid as string);
        if (!token) {
            console.log("No token provided")
            res.status(401).send("No token provided");
            return
        }
        const decoded = await domain.verifyToken(token) as string;

        const data = JSON.parse(JSON.stringify(decoded))

        if (data.userid !== user_id){
            res.status(403).send("Forbidden")
            return
        }
        const activeDomainTodos = await domain.getActiveTodosByUserId(user_id);
        if (Object.keys(activeDomainTodos).length === 0) {
            res.status(200).send([])
            return
        }
        if (activeDomainTodos instanceof Error) {
            res.status(500).send("Internal Server Error")
            return
        }
        const activeDtoTodos = activeDomainTodos.map((todo: TodoDomain) => new TodoDTO(
            todo.id, todo.user_id, todo.title, todo.size
        ));
        res.status(200).send(activeDtoTodos)
        return
    } catch (err: any) {
        console.error(err);
        res.status(500).send("Internal Server Error")
        return
    }
}

export async function getAllTodos(req: Request, res: Response) {
    try {
        const domainTodos = await domain.getAllTodos();
        if (Object.keys(domainTodos).length === 0) {
            res.status(200).send([]);
            return
        }
        if (domainTodos instanceof Error) {
            res.status(500).send("Internal Server Error")
            return
        }
        const dtoTodos = domainTodos.map((todo: TodoDomain) => new TodoDTO(
            todo.id, todo.user_id, todo.title, todo.size
        ));
        res.status(200).send(dtoTodos)
        return
    } catch (err: any) {
        console.error(err);
        res.status(500).send("Internal Server Error")
        return
    }
}

export async function addTodo(req: Request, res: Response) {
    try {
        const user_id = parseInt(req.params.userid as string)
        const token = req.headers.authorization
        if (!token) {
            console.log("No token provided")
            res.status(401).send("No token provided");
            return
        }
        const decoded = await domain.verifyToken(token) as string;

        const data = JSON.parse(JSON.stringify(decoded))

        if (data.userid !== user_id){
            res.status(403).send("Forbidden")
            return
        }
        const { title, size } = req.body;
        await domain.addTodo(user_id, title, size);
        res.status(200).send('Added todo for user with id ' + user_id)
        return
    } catch (err: any) {
        console.error(err);
        res.status(500).send("Internal Server Error")
        return
    }
}

export async function getTodoById(req: Request, res: Response) {
    try {
        const todo_id = parseInt(req.params.id as string)
        const domainTodo = await domain.getTodoById(todo_id);
        if (Object.keys(domainTodo).length === 0) {
            res.status(404).send('No todo found for todo_id ' + todo_id)
            return
        }
        if (domainTodo instanceof Error) {
            res.status(500).send("Internal Server Error")
            return
        }
        const dtoTodo = new TodoDTO(
            domainTodo.id, domainTodo.user_id, domainTodo.title, domainTodo.size
        );
        res.status(200).send(dtoTodo)
        return
    } catch (err: any) {
        console.error(err);
        res.status(500).send("Internal Server Error")
        return
    }
}

export async function updateTodoById(req: Request, res: Response) {
    try {
        const todo_id = parseInt(req.params.id as string)
        const domainTodo = await domain.getTodoById(todo_id);
        if (Object.keys(domainTodo).length === 0) {
            res.status(404).send('No todo found for todo_id ' + todo_id)
            return
        }
        if (domainTodo instanceof Error) {
            res.status(500).send("Internal Server Error")
            return
        }
        const user_id = domainTodo.user_id;
        const token = req.headers.authorization
        if (!token) {
            console.log("No token provided")
            res.status(401).send("No token provided");
            return
        }
        const decoded = await domain.verifyToken(token) as string;

        const data = JSON.parse(JSON.stringify(decoded))

        if (data.userid !== user_id){
            res.status(403).send("Forbidden")
            return
        }
        const { title, size } = req.body;
        await domain.updateTodoById(todo_id, title, size);
        res.status(200).send("Updated todo")
        return
    } catch (err: any) {
        console.error(err);
        res.status(500).send("Internal Server Error")
        return
    }
}
export async function deleteTodoById(req: Request, res: Response) {
    try {
        const todo_id = parseInt(req.params.id as string)
        const domainTodo = await domain.getTodoById(todo_id);
        if (Object.keys(domainTodo).length === 0) {
            res.status(404).send('No todo found for todo_id ' + todo_id)
            return
        }
        if (domainTodo instanceof Error) {
            res.status(500).send("Internal Server Error")
            return
        }
        const user_id = domainTodo.user_id;
        const token = req.headers.authorization
        if (!token) {
            console.log("No token provided")
            res.status(401).send("No token provided");
            return
        }
        const decoded = await domain.verifyToken(token) as string;

        const data = JSON.parse(JSON.stringify(decoded))

        if (data.userid !== user_id){
            res.status(403).send("Forbidden")
            return
        }
        await domain.deleteTodoById(todo_id)
        res.status(200).send('Deleted todo with todo_id ' + todo_id)
        return
    } catch (err: any) {
        console.error(err);
        res.status(500).send("Internal Server Error")
        return
    }
}

export async function getTodosByUserId(req: Request, res: Response) {
    try {
        const user_id = parseInt(req.params.userid as string)
        const domainTodos = await domain.getTodosByUserId(user_id);
        if (Object.keys(domainTodos).length === 0) {
            res.status(200).send([])
            return
        }
        if (domainTodos instanceof Error) {
            res.status(500).send("Internal Server Error")
            return
        }
        const dtoTodos = domainTodos.map((todo: TodoDomain) => new TodoDTO(
            todo.id, todo.user_id, todo.title, todo.size
        ));
        res.status(200).send(dtoTodos)
        return
    } catch (err: any) {
        console.error(err);
        res.status(500).send("Internal Server Error")
        return
    }
}

export async function deleteTodosByUserId(req: Request, res: Response) {
    try {
        const user_id = parseInt(req.params.userid as string)
        const domainTodos = await domain.getTodosByUserId(user_id);
        if (Object.keys(domainTodos).length === 0) {
            res.status(200).send([]);
            return
        }
        if (domainTodos instanceof Error) {
            res.status(500).send("Internal Server Error")
            return
        }
        await domain.deleteTodosByUserId(user_id)
        res.status(200).send('Deleted todos for user with id ' + user_id)
        return
    } catch (err: any) {
        console.error(err);
        res.status(500).send("Internal Server Error")
        return
    }
}
