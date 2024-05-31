import db from '../database/db';
import { TodoSize } from '../database/db';
import bcrypt from 'bcrypt'
import { PetDomain, TodoDomain, UserDomain } from './models';
import { signJwt, verifyJwt } from "../utils/token";
import { getEnvVariable } from "../utils/helpers";

interface domain {
    //users
    getAllUsers: () => Promise<UserDomain[] | Error>,
    addUser: (username: string, password: string) => Promise<string | Error>,
    getUserById: (user_id: number) => Promise<UserDomain | Error>,
    getUserByUsername: (username: string) => Promise<UserDomain | Error>,
    updateUserById: (user_id: number, username: string) => Promise<string | Error>,
    deleteUserById: (user_id: number) => Promise<string | Error>,
    registerNewUser: (username: string, petname: string, password: string) => Promise<string | Error>,
    loginUser: (username: string, password: string) => Promise<string | Error>

    //to-do
    getAllTodos: () => Promise<TodoDomain[] | Error>;
    addTodo: (user_id: number, title: string, size: TodoSize) => Promise<string | Error>;
    getTodoById: (todo_id: number) => Promise<TodoDomain | Error>;
    updateTodoById: (todo_id: number, title: string, size: TodoSize) => Promise<string | Error>;
    deleteTodoById: (todo_id: number) => Promise<string | Error>;
    getTodosByUserId: (user_id: number) => Promise<TodoDomain[] | Error>;
    deleteTodosByUserId: (user_id: number) => Promise<string | Error>;
    completeTodoById: (todo_id: number) => Promise<string | Error>;
    getActiveTodosByUserId: (user_id: number) => Promise<TodoDomain[] | Error>;
    getCompletedTodosByUserId: (user_id: number) => Promise<TodoDomain[] | Error>
    //pets
    getAllPets: () => Promise<PetDomain[] | Error >;
    addPet: (user_id: number, name: string) => Promise<string | Error>;
    getPetByUserId: (user_id: number) => Promise<PetDomain | Error>;
    deletePetByUserId: (user_id: number) => Promise<string | Error>;
    getPetById: (pet_id: number) => Promise<PetDomain | Error>;
    updatePetById: (pet_id: number, name: string) => Promise<string | Error>;
    deletePetById: (pet_id: number) => Promise<string | Error>;

    calculateCurrentHappiness: (pet_id: number) => Promise<number | { status: number, message: string}>;
    encryptPassword: (password: string) => Promise<string>;
    validatePassword: (userhash: string, password: string) => Promise<boolean>;
    verifyToken: (token: string) => Promise<string | Error>;
}

const domain: domain = {
    encryptPassword: async function (password: string) {
        try {
            return bcrypt.hash(password, /*salt rounds: */10)
        }
        catch (err: any) {
            return err.message;
        }
    },

    verifyToken: async function (token: string) {
        try {
            const encoded = verifyJwt(token);
            return encoded;
        } catch (err: any) {
            return err.message;
        }
    },

    validatePassword: async function (hashedPassword: string, inputPassword: string) {
        try {
            const match = await bcrypt.compare(inputPassword, hashedPassword);
            return match;
        } catch (error) {
            console.error("Error comparing passwords:", error);
            return false;
        }   
    },

    loginUser: async function (username: string, password: string) {
        try {
            //IS USER KNOWN IN DB?
            const knownUser = await this.getUserByUsername(username);
            if (Object.keys(knownUser).length === 0) {
                return { status: 404, data: {message: 'User not registered'}};
            }
            if (knownUser instanceof Error) {
                return { status: 500, data: {message: "Internal Server Error"}}
            }
            //VALIDATE PASSWORD
            const dbPassword = knownUser.password;
            const validatePasswordResult = await this.validatePassword(dbPassword, password);
            if (validatePasswordResult === false) {
                return { status: 409, data: {message: 'Password incorrect'}}
            }
            //CREATE AND SAVE JWT TOKEN
            const pet = await this.getPetByUserId(knownUser.id);
            if (pet instanceof Error) {
                return { status: 500, data: {message: "Internal Server Error"}}
            }
            if (Object.keys(pet).length === 0) {
                return { status: 404, data: {message: 'No pet found'}};
            }
            const token = signJwt(
                { userid: knownUser.id, 
                    petid: pet.id},
                {
                    expiresIn: `${getEnvVariable("JWT_EXPIRES_IN")}m`,
                }
            );
            return { status: 200, data: { token } };
        } catch (err: any) {
            return err;
        }
    },

    calculateCurrentHappiness: async function (pet_id: number) {
        const dbPet = await db.getPetById(pet_id);
        if (Object.keys(dbPet).length === 0) {
            return { status: 404, message: 'No pet found'};
        }
        if (dbPet instanceof Error) {
            return { status: 500, message: "Internal Server Error"}
        }
        const happiness = dbPet.happiness;
        const happiness_last_updated = dbPet.happiness_last_updated; // UTC
        const happiness_reduction_rate = dbPet.happiness_reduction_rate;
        var date = new Date();
        var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                        date.getUTCDate(), date.getUTCHours(),
                        date.getUTCMinutes(), date.getUTCSeconds());


        //ms -> h
        const elapsed_time_ms = now_utc - happiness_last_updated.valueOf();
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

    addUser: async function (username: string, password: string) {
        const passwordHash = await this.encryptPassword(password);
        const addUserResult = await db.addUser(username, passwordHash);
        return addUserResult;
    },

    getUserById: async function (user_id: number) {
        const user = await db.getUserById(user_id);
        return user;
    },

    getUserByUsername: async function (username: string) {
        const user = await db.getUserByUsername(username);
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

    registerNewUser: async function (username: string, petname: string, password: string) {
        //TODO IF USERNAME ALREADY EXISTS IN DB APP CRASHES -> FIX!
        try {
            const addUserResult = await this.addUser(username, password);
            if (addUserResult instanceof Error) {
                return addUserResult.message;
            } else {
                const newUser = await this.getUserByUsername(username);
                if (newUser instanceof UserDomain) {
                    const user_id = newUser.id;
                    const addPetResult = await this.addPet(user_id, petname);
                    return addPetResult;
                }
            }
        } catch (err: any) {
                return err;
            }
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
    },

    getActiveTodosByUserId: async function (user_id: number) {
        const activeTodos = db.getActiveTodosByUserId(user_id);
        return activeTodos;
    },

    getCompletedTodosByUserId: async function (user_id: number) {
        const completedTodos = db.getCompletedTodosByUserId(user_id);
        return completedTodos;
    },

    completeTodoById: async function (todo_id: number) {
        try {
            const todo = await db.getTodoById(todo_id);
            if (todo instanceof TodoDomain) {
                const user_id = todo.user_id;
                const todo_size = todo.size;
                let increaseRate: number;
                switch (todo_size) {
                    case TodoSize.Small:
                        increaseRate = 15;
                        break;
                    case TodoSize.Medium:
                        increaseRate = 25;
                        break;
                    case TodoSize.Big:
                        increaseRate = 50;
                        break;
                }
                db.increasePetsHappiness(user_id, increaseRate)
            } 
            const completeTodoResult = db.completeTodoById(todo_id);
            return completeTodoResult;
        } catch (error: any) {
            return error;
        }
    }
};

export default domain;
