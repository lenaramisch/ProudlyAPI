const { Pool } = require('pg');
import { UserDomain, PetDomain, TodoDomain } from '../domain/models';
import { TodoDB, UserDB, PetDB } from './models';

//All the DB Querys:
//TODO add todo querys


//user querys
const getAllUsersQuery: string = 'SELECT * FROM users';
const addUserQuery: string = 'INSERT INTO users(username) VALUES($1)';
const getUserByIdQuery: string = 'SELECT * FROM users WHERE id = $1';
const updateUserByIdQuery: string = 'UPDATE users SET username = $2 WHERE id = $1';
const deleteUserByIdQuery: string = 'DELETE FROM users WHERE id = $1';

//TODO add pet querys


export enum TodoSize {
    Small = "small",
    Medium = "medium",
    Big = "big"
}

interface UserRow {
    id: number,
    username: string,
    created_at: string
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
    //TODO check any[] as return type
    query: (text: string, params?: any[]) => Promise<{ rows: any[] }>;

    //user 
    getAllUsers: () => Promise<UserDomain[] | Error>;
    addUser: (username: string) => Promise<string | Error>;
    getUserById: (user_id: number) => Promise<UserDomain | Error>;
    updateUserById: (user_id: number, username: string) => Promise<string | Error>;
    deleteUserById: (user_id: number) => Promise<string | Error>;
    
    //TODO add db function definitions for todo and pet
}

//TODO add db functions for todo and pet
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
            return dbModelUser.map((dbUser: UserDB) => new UserDomain(dbUser.id, dbUser.username))
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
    }
};
export default database;
