import { TodoSize } from "../database/db";

export class UserDTO {
constructor(
    public id: number,
    public username: string
) {}
}

export class PetDTO {
constructor (
    public id: number, 
    public user_id: number, 
    public name: string,
    public xp: number,
    public current_happiness: number
) {}
}

export class TodoDTO {
constructor (
    public id: number,
    public user_id: number,
    public title: string,
    public size: TodoSize
) {}
}
