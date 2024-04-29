const { Pool } = require('pg');
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
const getActiveTodosByUserIdQuery: string = 'SELECT * from todos WHERE user_id = $1 AND completed = false';

//user querys
const getAllUsersQuery: string = 'SELECT * FROM users';
const addUserQuery: string = 'INSERT INTO users(username) VALUES($1)';
const getUserByIdQuery: string = 'SELECT * FROM users WHERE id = $1';
const updateUserByIdQuery: string = 'UPDATE users SET username = $2 WHERE id = $1';
const deleteUserByIdQuery: string = 'DELETE FROM users WHERE id = $1';

//pet querys
const getAllPetsQuery: string = 'SELECT * FROM pets';
const addPetQuery: string = 'INSERT INTO pets(user_id, name) VALUES($1, $2)';
const deletePetByUserIdQuery: string = 'DELETE FROM pets WHERE user_id = $1';
const getPetByUserIdQuery: string = 'SELECT * FROM pets WHERE user_id = $1';
const deletePetByIdQuery: string = 'DELETE FROM pets WHERE id = $1';
const updatePetByIdQuery: string = 'UPDATE pets SET name = $2 WHERE id= $1';
const getPetByIdQuery: string = 'SELECT * FROM pets WHERE id = $1';
const increasePetsHappinessQuery: string = 'UPDATE pets SET happiness = $2, happiness_last_updated = NOW() WHERE user_id = $1';

export enum TodoSize {
    Small = "small",
    Medium = "medium",
    Big = "big"
}

interface UserRow {
    id: number,
    username: string,
    created_at: Date
}

interface PetRow {
    id: number,
    user_id: number,
    name: string,
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
    addUser: (username: string) => Promise<string | Error>;
    getUserById: (user_id: number) => Promise<UserDomain | Error>;
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

    //pet
    getAllPets: () => Promise<PetDomain[] | Error >;
    addPet: (user_id: number, name: string) => Promise<string | Error>;
    getPetByUserId: (user_id: number) => Promise<PetDomain | Error>;
    deletePetByUserId: (user_id: number) => Promise<string | Error>;
    getPetById: (pet_id: number) => Promise<PetDomain | Error>;
    updatePetById: (pet_id: number, name: string) => Promise<string | Error>;
    deletePetById: (pet_id: number) => Promise<string | Error>;
    increasePetsHappiness: (user_id: number, increaseRate: number) => Promise<string | Error>;
}

const database: Database = {
    query: (text, params) => pool.query(text, params),
    getAllUsers: async function () {
        try{
            const dbResult = await pool.query(getAllUsersQuery);
            // map raw QueryResult to db model classes
            const dbModelUser = dbResult.rows.map((row: UserRow) => new UserDB(row.id, row.username, row.created_at))
            // map db model carts to domain model carts
            return dbModelUser.map((dbUser: UserDB) => new UserDomain(dbUser.id, dbUser.username));
        } catch (error: any) {
            return error
        }
    },
    addUser: async function (username: string) {
        try {
            pool.query(addUserQuery, [username]);
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    getUserById: async function (user_id: number) {
        try {
            const dbResult = await pool.query(getUserByIdQuery, [user_id]);
            const dbModelUser = dbResult.rows.map((row: UserRow) => new UserDB(row.id, row.username, row.created_at));
            return dbModelUser.map((dbUser: UserDB) => new UserDomain(dbUser.id, dbUser.username))[0]
        } catch (error: any) {
            return error
        }
    },
    updateUserById: async function (user_id: number, username: string) {
        try {
            pool.query(updateUserByIdQuery, [user_id, username])
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    deleteUserById: async function (user_id: number) {
        try {
            pool.query(deleteUserByIdQuery, [user_id])
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
                row.id, row.user_id, row.name, row.xp, row.happiness, 
                row.happiness_reduction_rate, row.happiness_last_updated, 
                row.created_at))

            for (let index = 0; index < dbModelPet.length; index++) {
                const pet = dbModelPet[index];
                console.log("DBPet is: " + JSON.stringify(pet))
            }
            return dbModelPet.map((dbPet: PetDB) => new PetDomain(
                dbPet.id, dbPet.user_id, dbPet.name, dbPet.xp, 
                dbPet.happiness, dbPet.happiness_reduction_rate, 
                dbPet.happiness_last_updated));
        } catch (error: any) {
            return error
        }
    },
    addPet: async function (user_id: number, name: string) {
        try {
            pool.query(addPetQuery, [user_id, name]);
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    getPetByUserId: async function (user_id: number) {
        try {
            const dbResult = await pool.query(getPetByUserIdQuery, [user_id]);
            const dbModelPet = dbResult.rows.map((row: PetRow) => new PetDB(
                row.id, row.user_id, row.name, row.xp, row.happiness, 
                row.happiness_reduction_rate, row.happiness_last_updated, 
                row.created_at));
            
            return dbModelPet.map((dbPet: PetDB) => new PetDomain(
                dbPet.id, dbPet.user_id, dbPet.name, dbPet.xp, 
                dbPet.happiness, dbPet.happiness_reduction_rate, 
                dbPet.happiness_last_updated))[0]
        } catch (error: any) {
            return error
        }
    },
    deletePetByUserId: async function (user_id: number) {
        try {
            pool.query(deletePetByUserIdQuery, [user_id])
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    getPetById: async function (pet_id: number) {
        try {
            const dbResult = await pool.query(getPetByIdQuery, [pet_id]);
            const dbModelPet = dbResult.rows.map((row: PetRow) => new PetDB(
                row.id, row.user_id, row.name, row.xp, row.happiness, 
                row.happiness_reduction_rate, row.happiness_last_updated, 
                row.created_at));

            return dbModelPet.map((dbPet: PetDB) => new PetDomain(
                dbPet.id, dbPet.user_id, dbPet.name, dbPet.xp, 
                dbPet.happiness, dbPet.happiness_reduction_rate, 
                dbPet.happiness_last_updated))[0]
        } catch (error: any) {
            return error
        }
    },
    updatePetById: async function (pet_id: number, name: string) {
        try {
            pool.query(updatePetByIdQuery, [pet_id, name])
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    deletePetById: async function (pet_id: number) {
        try {
            pool.query(deletePetByIdQuery, [pet_id])
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    increasePetsHappiness: async function (user_id: number, increaseRate: number) {
        try {
            const pet = await this.getPetByUserId(user_id);
            console.log("In db... pet is: " + JSON.stringify(pet))
            if (pet instanceof PetDomain) {
                const oldHappiness = pet.happiness;
                let newHappiness = oldHappiness + increaseRate;
                if (newHappiness > 100) {
                    newHappiness = 100
                } 
                // current time to database timestamp tz
                pool.query(increasePetsHappinessQuery, [user_id, newHappiness])
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
    completeTodoById: async function (todo_id: number) {
        try {
            pool.query(completeTodoByIdQuery, [todo_id])
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
            pool.query(addTodoQuery, [user_id, title, size]);
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
            pool.query(updateTodoByIdQuery, [todo_id, title, size])
            return "ok"
        } catch (error: any) {
            return error
        }
    },
    deleteTodoById: async function (todo_id: number) {
        try {
            pool.query(deleteTodoByIdQuery, [todo_id])
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
            pool.query(deleteTodosByUserIdQuery, [user_id])
            return "ok"
        } catch (error: any) {
            return error
        }
    }
};
export default database;
