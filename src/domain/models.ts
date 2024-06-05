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
    public username: string,
    public password: string
) {}
}

export class PetDomain {
constructor(
    public id: number, 
    public user_id: number,
    public name: string,
    public image_key: PetImage,
    public xp: number,
    public happiness: number,
    public happiness_reduction_rate: number,
    public happiness_last_updated: Date,
    public current_happiness?: number
) {}
}
