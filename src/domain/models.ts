import {TodoSize} from "../database/db";

export class TodoDomain {
constructor(
    public id: number,
    public user_id: number,
    public title: string,
    public size: TodoSize,
    public completed: boolean
) {}
}

export class UserDomain {
constructor(
    public id: number, 
    public username: string
) {}
}

export class PetDomain {
constructor(
    public id: number, 
    public user_id: number,
    public name: string,
    public xp: number,
    public happiness: number,
    public happiness_reduction_rate: number,
    public happiness_last_updated: Date,
    public current_happiness?: number
) {}
}
