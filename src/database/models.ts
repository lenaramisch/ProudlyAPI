import {TodoSize} from "./db";

export class TodoDB {
    constructor(
        public id: number,
        public user_id: number,
        public title: string,
        public size: TodoSize,
        public completed: boolean,
        public created_at: Date
    ) {}
}

export class UserDB {
    constructor(
        public id: number, 
        public username: string, 
        public password: string,
        public created_at: Date
    ) {}
}

export class PetDB {
    constructor(
        public id: number, 
        public user_id: number,
        public name: string,
        public xp: number,
        public happiness: number,
        public happiness_reduction_rate: number,
        public happiness_last_updated: Date,
        public created_at: Date
    ) {}
}
