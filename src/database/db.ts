const { Pool } = require('pg');
const bcrypt = require("bcrypt")
import { UserDomain, PetDomain, TodoDomain } from '../domain/models';
import { TodoDB, UserDB, PetDB } from './models';

//All the DB Querys:
//querys todo
const getAllTodosQuery: string = 'SELECT * FROM todos';
const addTodoQuery: string = 'INSERT INTO todos(user_id, title, size) VALUES($1, $2, $3)';
const getTodoByIdQuery: string = 'SELECT * FROM todos WHERE id = $1';
const updateTodoByIdQuery: string = 'UPDATE todos SET title = $2, size = $3 WHERE id = $1';
const deleteTodoByIdQuery: string = 'DELETE FROM todos WHERE id = $1';
const getTodosByUserIdQuery: string = 'SELECT * FROM todos WHERE user_id = $1';
const deleteTodosByUserIdQuery: string = 'DELETE FROM todos WHERE user_id = $1';
const completeTodoByIdQuery: string = "UPDATE todos SET completed = true WHERE id = $1";
const getActiveTodosByUserIdQuery: string = 'SELECT * from todos WHERE user_id = $1 AND completed = false ORDER BY created_at DESC';
const getCompletedTodosByUserIdQuery: string = 'SELECT * from todos WHERE user_id = $1 AND completed = true ORDER BY created_at DESC';

//user querys
const getAllUsersQuery: string = 'SELECT * FROM users';
const addUserQuery: string = 'INSERT INTO users(username, password) VALUES($1, $2)';
const getUserByIdQuery: string = 'SELECT * FROM users WHERE id = $1';
const updateUserByIdQuery: string = 'UPDATE users SET username = $2 WHERE id = $1';
const deleteUserByIdQuery: string = 'DELETE FROM users WHERE id = $1';
const getUserByUsernameQuery: string = "SELECT * FROM users WHERE username = $1";

//pet querys
const getAllPetsQuery: string = 'SELECT * FROM pets';
const addPetQuery: string = 'INSERT INTO pets(user_id, name, image_key) VALUES($1, $2, $3)';
const deletePetByUserIdQuery: string = 'DELETE FROM pets WHERE user_id = $1';
const getPetByUserIdQuery: string = 'SELECT * FROM pets WHERE user_id = $1';
const deletePetByIdQuery: string = 'DELETE FROM pets WHERE id = $1';
const updatePetByIdQuery: string = 'UPDATE pets SET name = $2 WHERE id= $1';
const getPetByIdQuery: string = 'SELECT * FROM pets WHERE id = $1';
const increasePetsHappinessAndXPQuery: string = 'UPDATE pets SET happiness = $2, happiness_last_updated = NOW(), xp = $3 WHERE user_id = $1';

enum TodoSize {
    Small = "small",
    Medium = "medium",
    Big = "big"
}

enum PetImage {
    Cat = "cat",
    Dog = "dog",
    Bird = "bird",
    Turtle = "turtle"
}

interface UserRow {
    id: number,
    username: string,
    password: string,
    created_at: Date
}

interface PetRow {
    id: number,
    user_id: number,
    name: string,
    image_key: PetImage,
    xp: number,
    happiness: number,
    happiness_reduction_rate: number,
    happiness_last_updated: Date,
    created_at: Date
}

interface TodoRow {
    id: number,
    user_id: number,
    title: string,
    size: TodoSize,
    completed: boolean,
    created_at: Date
}

const pool = new Pool({
    user: 'postgres',
    password: 'changeme',
    host: 'localhost', // for local development (nodemon)
    // host: 'postgres', // if we run node in docker
    port: 5432, // default Postgres port
    database: 'postgres'
});

interface Database {
    query: (text: string, params?: any[]) => Promise<{ rows: any[] }>;

    //user 
    getAllUsers: () => Promise<UserDomain[] | Error>;
    addUser: (username: string, password: string) => Promise<string | Error>;
    getUserById: (user_id: number) => Promise<UserDomain | Error>;
    getUserByUsername: (username: string) => Promise<UserDomain | Error>;
    updateUserById: (user_id: number, username: string) => Promise<string | Error>;
    deleteUserById: (user_id: number) => Promise<string | Error>;
    
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
    getCompletedTodosByUserId: (user_id: number) => Promise<TodoDomain[] | Error>;

    //pet
    getAllPets: () => Promise<PetDomain[] | Error >;
    addPet: (user_id: number, name: string, image_key: PetImage) => Promise<string | Error>;
    getPetByUserId: (user_id: number) => Promise<PetDomain | Error>;
    deletePetByUserId: (user_id: number) => Promise<string | Error>;
    getPetById: (pet_id: number) => Promise<PetDomain | Error>;
    updatePetById: (pet_id: number, name: string) => Promise<string | Error>;
    deletePetById: (pet_id: number) => Promise<string | Error>;
    increasePetsHappinessAndXP: (user_id: number, increaseRateHappiness: number, increaseXP: number) => Promise<string | Error>;
}

const database: Database = {
    query: (text, params) => pool.query(text, params),
    getAllUsers: async function () {
        try{
            const dbResult = await pool.query(getAllUsersQuery);
            // map raw QueryResult to db model classes
            const dbModelUser = dbResult.rows.map((row: UserRow) => new UserDB(row.id, row.username, row.password, row.created_at))
            // map db model carts to domain model carts
            return dbModelUser.map((dbUser: UserDB) => new UserDomain(dbUser.id, dbUser.username, dbUser.password));
        } catch (error: any) {
            return error
        }
    },
    addUser: async function (username: string, password: string) {
        try {
            await pool.query(addUserQuery, [username, password]);
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    getUserById: async function (user_id: number) {
        try {
            const dbResult = await pool.query(getUserByIdQuery, [user_id]);
            const dbModelUser = dbResult.rows.map((row: UserRow) => new UserDB(row.id, row.username, row.password, row.created_at));
            return dbModelUser.map((dbUser: UserDB) => new UserDomain(dbUser.id, dbUser.username, dbUser.password))[0]
        } catch (error: any) {
            return error
        }
    },
    getUserByUsername: async function (username: string) {
        try {
            const dbResult = await pool.query(getUserByUsernameQuery, [username]);
            const dbModelUser = dbResult.rows.map((row: UserRow) => new UserDB(row.id, row.username, row.password, row.created_at));
            return dbModelUser.map((dbUser: UserDB) => new UserDomain(dbUser.id, dbUser.username, dbUser.password))[0]
        } catch (error: any) {
            return error
        }
    },
    updateUserById: async function (user_id: number, username: string) {
        try {
            await pool.query(updateUserByIdQuery, [user_id, username])
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    deleteUserById: async function (user_id: number) {
        try {
            await pool.query(deleteUserByIdQuery, [user_id])
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    getAllPets: async function () {
        try{
            const dbResult = await pool.query(getAllPetsQuery);
            // map raw QueryResult to db model classes
            const dbModelPet = dbResult.rows.map((row: PetRow) => new PetDB(
                row.id, row.user_id, row.name, row.image_key, row.xp, row.happiness, 
                row.happiness_reduction_rate, row.happiness_last_updated, 
                row.created_at))

            for (let index = 0; index < dbModelPet.length; index++) {
                const pet = dbModelPet[index];
            }
            return dbModelPet.map((dbPet: PetDB) => new PetDomain(
                dbPet.id, dbPet.user_id, dbPet.name, dbPet.image_key, dbPet.xp, 
                dbPet.happiness, dbPet.happiness_reduction_rate, 
                dbPet.happiness_last_updated));
        } catch (error: any) {
            return error
        }
    },
    addPet: async function (user_id: number, name: string, image_key: PetImage) {
        try {
            await pool.query(addPetQuery, [user_id, name, image_key]);
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    getPetByUserId: async function (user_id: number) {
        try {
            const dbResult = await pool.query(getPetByUserIdQuery, [user_id]);
            const dbModelPet = dbResult.rows.map((row: PetRow) => new PetDB(
                row.id, row.user_id, row.name, row.image_key, row.xp, row.happiness, 
                row.happiness_reduction_rate, row.happiness_last_updated, 
                row.created_at));
            return dbModelPet.map((dbPet: PetDB) => new PetDomain(
                dbPet.id, dbPet.user_id, dbPet.name, dbPet.image_key, dbPet.xp, 
                dbPet.happiness, dbPet.happiness_reduction_rate, 
                dbPet.happiness_last_updated))[0]
        } catch (error: any) {
            return error
        }
    },
    deletePetByUserId: async function (user_id: number) {
        try {
            await pool.query(deletePetByUserIdQuery, [user_id])
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    getPetById: async function (pet_id: number) {
        try {
            const dbResult = await pool.query(getPetByIdQuery, [pet_id]);
            const dbModelPet = dbResult.rows.map((row: PetRow) => new PetDB(
                row.id, row.user_id, row.name, row.image_key, row.xp, row.happiness, 
                row.happiness_reduction_rate, row.happiness_last_updated, 
                row.created_at));

            return dbModelPet.map((dbPet: PetDB) => new PetDomain(
                dbPet.id, dbPet.user_id, dbPet.name, dbPet.image_key, dbPet.xp, 
                dbPet.happiness, dbPet.happiness_reduction_rate, 
                dbPet.happiness_last_updated))[0]
        } catch (error: any) {
            return error
        }
    },
    updatePetById: async function (pet_id: number, name: string) {
        try {
            await pool.query(updatePetByIdQuery, [pet_id, name])
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    deletePetById: async function (pet_id: number) {
        try {
            await pool.query(deletePetByIdQuery, [pet_id])
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    increasePetsHappinessAndXP: async function (user_id: number, increaseRateHappiness: number, increseXP: number) {
        try {
            const pet = await this.getPetByUserId(user_id);
            if (pet instanceof PetDomain) {
                const oldHappiness = pet.happiness;
                let newHappiness = oldHappiness + increaseRateHappiness;
                if (newHappiness > 100) {
                    newHappiness = 100
                }
                const oldXP = pet.xp;
                let newXP = oldXP + increseXP;
                // current time to database timestamp tz
                await pool.query(increasePetsHappinessAndXPQuery, [user_id, newHappiness, newXP])
                return "ok"
            }
        } catch (error: any) {
            return error
        }
    },
    getActiveTodosByUserId: async function(user_id: number) {
        try {
            const dbResult = await pool.query(getActiveTodosByUserIdQuery, [user_id]);
            const dbModelTodo = dbResult.rows.map((row: TodoRow) => new TodoDB(
                row.id, row.user_id, row.title, row.size, row.completed, row.created_at
            ));
            return dbModelTodo.map((dbTodo: TodoDB) => new TodoDomain(
                dbTodo.id, dbTodo.user_id, dbTodo.title, dbTodo.size, dbTodo.completed
            ));
        } catch (error: any) {
            return error
        }
    },
    getCompletedTodosByUserId: async function(user_id: number) {
        try {
            const dbResult = await pool.query(getCompletedTodosByUserIdQuery, [user_id]);
            const dbModelTodo = dbResult.rows.map((row: TodoRow) => new TodoDB(
                row.id, row.user_id, row.title, row.size, row.completed, row.created_at
            ));
            return dbModelTodo.map((dbTodo: TodoDB) => new TodoDomain(
                dbTodo.id, dbTodo.user_id, dbTodo.title, dbTodo.size, dbTodo.completed
            ));
        } catch (error: any) {
            return error
        }
    },
    completeTodoById: async function (todo_id: number) {
        try {
            await pool.query(completeTodoByIdQuery, [todo_id])
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    getAllTodos: async function () {
        try{
            const dbResult = await pool.query(getAllTodosQuery);
            // map raw QueryResult to db model classes
            const dbModelTodo = dbResult.rows.map((row: TodoRow) => new TodoDB(
                row.id, row.user_id, row.title, row.size, row.completed, row.created_at
            ));
            // map db model carts to domain model carts
            return dbModelTodo.map((dbTodo: TodoDB) => new TodoDomain(
                dbTodo.id, dbTodo.user_id, dbTodo.title, dbTodo.size, dbTodo.completed
            ));
        } catch (error: any) {
            return error
        }
    },
    addTodo: async function (user_id: number, title: string, size: TodoSize) {
        try {
            await pool.query(addTodoQuery, [user_id, title, size]);
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    getTodoById: async function (todo_id: number) {
        try {
            const dbResult = await pool.query(getTodoByIdQuery, [todo_id]);
            const dbModelTodo = dbResult.rows.map((row: TodoRow) => new TodoDB(
                row.id, row.user_id, row.title, row.size, row.completed, row.created_at
            ));
            return dbModelTodo.map((dbTodo: TodoDB) => new TodoDomain(
                dbTodo.id, dbTodo.user_id, dbTodo.title, dbTodo.size, dbTodo.completed
            ))[0];
        } catch (error: any) {
            return error
        }
    },
    updateTodoById: async function (todo_id: number, title: string, size: TodoSize) {
        try {
            await pool.query(updateTodoByIdQuery, [todo_id, title, size])
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    deleteTodoById: async function (todo_id: number) {
        try {
            await pool.query(deleteTodoByIdQuery, [todo_id])
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    getTodosByUserId: async function (user_id: number) {
        try {
            const dbResult = await pool.query(getTodosByUserIdQuery, [user_id]);
            const dbModelTodo = dbResult.rows.map((row: TodoRow) => new TodoDB(
                row.id, row.user_id, row.title, row.size, row.completed, row.created_at
            ));
            return dbModelTodo.map((dbTodo: TodoDB) => new TodoDomain(
                dbTodo.id, dbTodo.user_id, dbTodo.title, dbTodo.size, dbTodo.completed
            ));
        } catch (error: any) {
            return error
        }
    },
    deleteTodosByUserId: async function (user_id: number) {
        try {
            await pool.query(deleteTodosByUserIdQuery, [user_id])
            return "ok"
        } catch (error: any) {
            return error
        }
    }
};
export default database;
