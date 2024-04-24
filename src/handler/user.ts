import { UserDomain } from "../domain/models";
import { UserDTO } from "./models";
import domain from "../domain/domain";

module.exports = {
    getAllUsers: async function() {
        try {
            const domainUsers = await domain.getAllUsers();
            if (Object.keys(domainUsers).length === 0) {
                return { status: 404, message: 'No users found'};
            }
            if (domainUsers instanceof Error) {
                return { status: 500, message: "Internal Server Error"}
            }
            const dtoUsers = domainUsers.map((user: UserDomain) => new UserDTO(user.id, user.username))
            return { status: 200, data: dtoUsers };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },

    addUser: async function (username: string) {
        try {
            await domain.addUser(username);
            return { status: 201, message: `Added user with name ${username}` };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },

    getUserById: async function (user_id: number) {
        try {
            const domainUser = await domain.getUserById(user_id);
            if (Object.keys(domainUser).length === 0) {
                return { status: 404, message: 'No user found for user_id ' + user_id};
            }
            if (domainUser instanceof Error) {
                return { status: 500, message: "Internal Server Error"}
            }
            const dtoUser = new UserDTO(domainUser.id, domainUser.username);
            return { status: 200, data: dtoUser };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },

    updateUserById: async function (user_id: number, username: string) {
        try {
            const domainUser = await domain.getUserById(user_id);
            if (Object.keys(domainUser).length === 0) {
                return { status: 404, message: 'No user found for user_id ' + user_id};
            }
            if (domainUser instanceof Error) {
                return { status: 500, message: "Internal Server Error"}
            }
            await domain.updateUserById(user_id, username);
            return { status: 200, message: 'Updated user' }
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },

    deleteUserById: async function (user_id: number) {
        try {
            const domainUser = await domain.getUserById(user_id);
            if (Object.keys(domainUser).length === 0) {
                return { status: 404, message: 'No user found for user_id ' + user_id};
            }
            if (domainUser instanceof Error) {
                return { status: 500, message: "Internal Server Error"}
            }
            await domain.deleteUserById(user_id)
            return { status: 200, message: 'Deleted user with user_id ' + user_id}
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    }
}
