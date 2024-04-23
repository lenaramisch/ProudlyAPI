import db from '../database/db';
import { PetDomain, TodoDomain, UserDomain } from './models';

interface domain {
    // TODO add function definitions for todo and pet
    
    getAllUsers: () => Promise<UserDomain[] | Error>,
    addUser: (username: string) => Promise<string | Error>,
    getUserById: (user_id: number) => Promise<UserDomain | Error>,
    updateUserById: (user_id: number, username: string) => Promise<string | Error>,
    deleteUserById: (user_id: number) => Promise<string | Error>,
}

const domain: domain = {
    //TODO add functions for todo and pet
    
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
    }
};

export default domain;
