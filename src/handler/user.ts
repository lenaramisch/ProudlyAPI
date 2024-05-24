import { UserDomain } from "../domain/models";
import { UserDTO } from "./models";
import domain from "../domain/domain";
import {Request, Response} from 'express';


export async function getAllUsers(req: Request, res: Response) {
    try {
        const domainUsers = await domain.getAllUsers();
        if (Object.keys(domainUsers).length === 0) {
            res.status(200).send(domainUsers)
            return
        }
        if (domainUsers instanceof Error) {
            res.status(500).send("Internal Server Error")
            return
        }
        const dtoUsers = domainUsers.map((user: UserDomain) => new UserDTO(user.id, user.username, user.password))
        res.status(200).send(dtoUsers);
        return
    } catch (err: any) {
        console.error(err);
        res.status(500).send("Internal Server Error")
        return
    }
}

export async function loginUser (req: Request, res: Response) {
    try {
        const { username, password } = req.body;
        const token = await domain.loginUser(username, password)
        res.status(200).send(token);
        return
    } catch (err: any) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return
    }
}

export async function verifyToken (req: Request, res: Response) {
    try {
        const { token } = req.body;
        const encoded = await domain.verifyToken(token)
        res.status(200).send(encoded);
        return
    } catch (err: any) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return
    }
}

export async function addUser (req: Request, res: Response) {
    try {
        const { username, password } = req.body;
        await domain.addUser(username, password);
        res.status(201).send(`Added user with name ${username}`);
        return
    } catch (err: any) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return
    }
}

export async function registerNewUser (req: Request, res: Response) {
    try {
        const { username, password, petname } = req.body;
        await domain.registerNewUser(username, petname, password);
        res.status(201).send(`Added user with name ${username} and pet with name ${petname}`);
        return
    } catch (err: any) {
        res.status(500).send('Internal Server Error');
        return
    }
}

export async function getUserById(req: Request, res: Response) {
    try {
        const user_id = parseInt(req.params.id as string)
        const domainUser = await domain.getUserById(user_id);
        if (Object.keys(domainUser).length === 0) {
            res.status(404).send('No user found for user_id ' + user_id);
            return
        }
        if (domainUser instanceof Error) {
            res.status(500).send('Internal Server Error');
            return
        }
        const dtoUser = new UserDTO(domainUser.id, domainUser.username, domainUser.password);
        return { status: 200, data: dtoUser };
    } catch (err: any) {
        console.error(err);
        return { status: 500, message: 'Internal Server Error' };
    }
}

export async function updateUserById(req: Request, res: Response) {
    try {
        const user_id = parseInt(req.params.id as string)
        const { username } = req.body;
        const domainUser = await domain.getUserById(user_id);
        if (Object.keys(domainUser).length === 0) {
            res.status(404).send('No user found for user_id ' + user_id);
            return
        }
        if (domainUser instanceof Error) {
            res.status(500).send('Internal Server Error');
            return
        }
        await domain.updateUserById(user_id, username);
        res.status(200).send('Updated user')
        return
    } catch (err: any) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return
    }
}

export async function deleteUserById(req: Request, res: Response) {
    try {
        const user_id = parseInt(req.params.id as string)
        const domainUser = await domain.getUserById(user_id);
        if (Object.keys(domainUser).length === 0) {
            res.status(404).send('No user found for user_id ' + user_id);
            return
        }
        if (domainUser instanceof Error) {
            res.status(500).send('Internal Server Error')
            return
        }
        await domain.deleteUserById(user_id)
        res.status(200).send('Deleted user with user_id ' + user_id)
        return
    } catch (err: any) {
        console.error(err);
        res.status(500).send('Internal Server Error')
        return
    }
}
