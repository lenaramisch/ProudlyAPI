import db from '../database/db';
import { TodoSize } from '../database/db';
import { PetDomain, TodoDomain, UserDomain } from './models';

//TODO Give todos effect on happiness based on todo size!
//TODO Filter todo for completed = false

interface domain {
    //users
    getAllUsers: () => Promise<UserDomain[] | Error>,
    addUser: (username: string) => Promise<string | Error>,
    getUserById: (user_id: number) => Promise<UserDomain | Error>,
    updateUserById: (user_id: number, username: string) => Promise<string | Error>,
    deleteUserById: (user_id: number) => Promise<string | Error>,
    
    //to-do
    getAllTodos: () => Promise<TodoDomain[] | Error>;
    addTodo: (user_id: number, title: string, size: TodoSize) => Promise<string | Error>;
    getTodoById: (todo_id: number) => Promise<TodoDomain | Error>;
    updateTodoById: (todo_id: number, title: string, size: TodoSize) => Promise<string | Error>;
    deleteTodoById: (todo_id: number) => Promise<string | Error>;
    getTodosByUserId: (user_id: number) => Promise<TodoDomain[] | Error>;
    deleteTodosByUserId: (user_id: number) => Promise<string | Error>;

    //pets
    getAllPets: () => Promise<PetDomain[] | Error >;
    addPet: (user_id: number, name: string) => Promise<string | Error>;
    getPetByUserId: (user_id: number) => Promise<PetDomain | Error>;
    deletePetByUserId: (user_id: number) => Promise<string | Error>;
    getPetById: (pet_id: number) => Promise<PetDomain | Error>;
    updatePetById: (pet_id: number, name: string) => Promise<string | Error>;
    deletePetById: (pet_id: number) => Promise<string | Error>;

    calculateCurrentHappiness: (pet_id: number) => Promise<number | { status: number, message: string}>;
}

const domain: domain = {
    calculateCurrentHappiness: async function (pet_id: number) {
        const dbPet = await db.getPetById(pet_id);
        if (Object.keys(dbPet).length === 0) {
            return { status: 404, message: 'No pet found'};
        }
        if (dbPet instanceof Error) {
            return { status: 500, message: "Internal Server Error"}
        }
        const happiness = dbPet.happiness;
        const happiness_last_updated = dbPet.happiness_last_updated.valueOf();
        //Sat Apr 27 2024 13:39:33 GMT+0200 (Central European Summer Time)
        const happiness_reduction_rate = dbPet.happiness_reduction_rate;
        const time_now = Date.now().valueOf();
        //ms -> h
        const elapsed_time_ms = time_now - happiness_last_updated;
        const elapsed_time_s = elapsed_time_ms / 1000;
        const elapsed_time_min = elapsed_time_s / 60;
        const elapsed_time_h = elapsed_time_min / 60;
        //calc lost happiness
        const lost_happiness = elapsed_time_h * happiness_reduction_rate;
        let current_happiness = happiness - lost_happiness;
        if (current_happiness < 0) {
            current_happiness = 0;
        }
        return current_happiness;
    },

    getAllUsers: async function () {
        const allUsers = await db.getAllUsers();
        return allUsers;
    },

    addUser: async function (username: string) {
        const addUserResult = await db.addUser(username);
        return addUserResult;
    },

    getUserById: async function (user_id: number) {
        const user = await db.getUserById(user_id);
        return user;
    },

    updateUserById: async function (user_id: number, username: string) {
        const updateUserResult = await db.updateUserById(user_id, username);
        return updateUserResult;
    },

    deleteUserById: async function (user_id: number) {
        const deleteUserResult = await db.deleteUserById(user_id);
        return deleteUserResult;
    },

    getAllPets: async function () {
        const allPets = await db.getAllPets();
        return allPets;
    },

    addPet: async function (user_id: number, name: string) {
        const addPetResult = await db.addPet(user_id, name)
        return addPetResult;
    },

    getPetByUserId: async function (user_id: number) {
        const pet = await db.getPetByUserId(user_id);
        return pet;
    },

    deletePetByUserId: async function (user_id: number) {
        const deletePetResult = await db.deletePetByUserId(user_id);
        return deletePetResult;
    },

    getPetById: async function (pet_id: number) {
        const pet = await db.getPetById(pet_id);
        return pet;
    },

    updatePetById: async function (pet_id: number, name: string) {
        const updatePetResult = await db.updatePetById(pet_id, name);
        return updatePetResult;
    },

    deletePetById: async function (pet_id: number) {
        const deletePetResult = await db.deletePetById(pet_id);
        return deletePetResult;
    },

    getAllTodos: async function () {
        const allTodos = await db.getAllTodos();
        return allTodos;
    },

    addTodo: async function (user_id: number, title: string, size: TodoSize) {
        const addTodoResult = await db.addTodo(user_id, title, size)
        return addTodoResult;
    },

    getTodoById: async function (todo_id: number) {
        const todo = await db.getTodoById(todo_id);
        return todo;
    },

    updateTodoById: async function (todo_id: number, title: string, size: TodoSize) {
        const updateTodoResult = await db.updateTodoById(todo_id, title, size);
        return updateTodoResult;
    },

    deleteTodoById: async function (todo_id: number) {
        const deleteTodoResult = db.deleteTodoById(todo_id);
        return deleteTodoResult;
    },

    getTodosByUserId: async function (user_id: number) {
        const userTodos = db.getTodosByUserId(user_id);
        return userTodos;
    },

    deleteTodosByUserId: async function (user_id: number) {
        const deleteTodosResult = db.deleteTodosByUserId(user_id);
        return deleteTodosResult;
    }
};

export default domain;
