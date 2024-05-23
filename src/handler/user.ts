import { UserDomain } from "../domain/models";
import { UserDTO } from "./models";
import domain from "../domain/domain";


export async function getAllUsers() {
    try {
        const domainUsers = await domain.getAllUsers();
        if (Object.keys(domainUsers).length === 0) {
            return { status: 200, data: []};
        }
        if (domainUsers instanceof Error) {
            return { status: 500, message: "Internal Server Error"}
        }
        const dtoUsers = domainUsers.map((user: UserDomain) => new UserDTO(user.id, user.username, user.password))
        return { status: 200, data: dtoUsers };
    } catch (err: any) {
        console.error(err);
        return { status: 500, message: 'Internal Server Error' };
    }
}

export async function loginUser (username: string, password: string) {
    try {
        const token = await domain.loginUser(username, password)
        return { status: 200, data: token}
    } catch (err: any) {
        console.error(err);
        return { status: 500, message: 'Internal Server Error' };
    }
}

export async function verifyToken (token: string) {
    try {
        const encoded = await domain.verifyToken(token)
        return { status: 200, data: encoded}
    } catch (err: any) {
        console.error(err);
        return { status: 500, message: 'Internal Server Error' };
    }
}

export async function addUser (username: string, password: string) {
    try {
        await domain.addUser(username, password);
        return { status: 201, message: `Added user with name ${username}` };
    } catch (err: any) {
        console.error(err);
        return { status: 500, message: 'Internal Server Error' };
    }
}

export async function registerNewUser (username: string, petname: string, password: string) {
    try {
        await domain.registerNewUser(username, petname, password);
        return { status: 201, message: `Added user with name ${username} and pet with name ${petname}` }
    } catch (err: any) {
        return { status: 500, message: 'Internal Server Error' }
    }
}

export async function getUserById(user_id: number) {
    try {
        const domainUser = await domain.getUserById(user_id);
        if (Object.keys(domainUser).length === 0) {
            return { status: 404, message: 'No user found for user_id ' + user_id};
        }
        if (domainUser instanceof Error) {
            return { status: 500, message: "Internal Server Error"}
        }
        const dtoUser = new UserDTO(domainUser.id, domainUser.username, domainUser.password);
        return { status: 200, data: dtoUser };
    } catch (err: any) {
        console.error(err);
        return { status: 500, message: 'Internal Server Error' };
    }
}

export async function updateUserById(user_id: number, username: string) {
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
}

export async function deleteUserById(user_id: number) {
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
