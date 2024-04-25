import { TodoDomain } from "../domain/models";
import { TodoDTO } from "./models";
import { TodoSize } from "../database/db";
import domain from "../domain/domain";

module.exports = {
    getAllTodos: async function() {
        try {
            const domainTodos = await domain.getAllTodos();
            if (Object.keys(domainTodos).length === 0) {
                return { status: 404, message: 'No todos found'};
            }
            if (domainTodos instanceof Error) {
                return { status: 500, message: "Internal Server Error"}
            }
            const dtoTodos = domainTodos.map((todo: TodoDomain) => new TodoDTO(
                todo.id, todo.user_id, todo.title, todo.size
            ));
            return { status: 200, data: dtoTodos };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },
    addTodo: async function (user_id: number, title: string, size: TodoSize) {
        try {
            await domain.addTodo(user_id, title, size);
            return { status: 200, message: 'Added todo for user with id ' + user_id }
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },
    getTodoById: async function (todo_id: number) {
        try {
            const domainTodo = await domain.getTodoById(todo_id);
            if (Object.keys(domainTodo).length === 0) {
                return { status: 404, message: 'No todo found for todo_id ' + todo_id};
            }
            if (domainTodo instanceof Error) {
                return { status: 500, message: "Internal Server Error"}
            }
            const dtoTodo = new TodoDTO(
                domainTodo.id, domainTodo.user_id, domainTodo.title, domainTodo.size
            );
            return { status: 200, data: dtoTodo };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },
    updateTodoById: async function (todo_id: number, title: string, size: TodoSize) {
        try {
            const domainTodo = await domain.getTodoById(todo_id);
            if (Object.keys(domainTodo).length === 0) {
                return { status: 404, message: 'No todo found for todo_id ' + todo_id};
            }
            if (domainTodo instanceof Error) {
                return { status: 500, message: "Internal Server Error"}
            }
            await domain.updateTodoById(todo_id, title, size);
            return { status: 200, message: 'Updated todo' }
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },
    deleteTodoById: async function (todo_id: number) {
        try {
            const domainTodo = await domain.getTodoById(todo_id);
            if (Object.keys(domainTodo).length === 0) {
                return { status: 404, message: 'No todo found for todo_id ' + todo_id};
            }
            if (domainTodo instanceof Error) {
                return { status: 500, message: "Internal Server Error"}
            }
            await domain.deleteTodoById(todo_id)
            return { status: 200, message: 'Deleted todo with todo_id ' + todo_id}
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },
    getTodosByUserId: async function (user_id: number) {
        try {
            const domainTodos = await domain.getTodosByUserId(user_id);
            if (Object.keys(domainTodos).length === 0) {
                return { status: 404, message: 'No todos found'};
            }
            if (domainTodos instanceof Error) {
                return { status: 500, message: "Internal Server Error"}
            }
            const dtoTodos = domainTodos.map((todo: TodoDomain) => new TodoDTO(
                todo.id, todo.user_id, todo.title, todo.size
            ));
            return { status: 200, data: dtoTodos };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },
    deleteTodosByUserId: async function (user_id: number) {
        try {
            const domainTodos = await domain.getTodosByUserId(user_id);
            if (Object.keys(domainTodos).length === 0) {
                return { status: 404, message: 'No todos found for user with id ' + user_id};
            }
            if (domainTodos instanceof Error) {
                return { status: 500, message: "Internal Server Error"}
            }
            await domain.deleteTodosByUserId(user_id)
            return { status: 200, message: 'Deleted todos for user with id ' + user_id}
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    }
};
