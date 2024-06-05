import { PetDTO } from "./models";
import domain from "../domain/domain";
import { Request, Response } from "express";

export async function getAllPets(req: Request, res: Response) {
    try {
        const domainPets = await domain.getAllPets();
        
        if (Object.keys(domainPets).length === 0) {
            res.status(200).send([])
            return
        }
        if (domainPets instanceof Error) {
            res.status(500).send("Internal Server Error")
            return
        }
        for (let index = 0; index < domainPets.length; index++) {
            const pet = domainPets[index];
        }
        let dtoPets = [];
        for (let index = 0; index < domainPets.length; index++) {
            let pet = domainPets[index];
            const current_happiness = await domain.calculateCurrentHappiness(pet.id);
            if (typeof(current_happiness) === 'number') {
                let dtoPet = new PetDTO(
                    pet.id, pet.user_id, pet.name, pet.image_key, pet.xp, current_happiness
                );
                dtoPets.push(dtoPet);
            }
            else {
                console.log(`Failed to calculate happiness for pet with ID ${pet.id}`);
                throw new Error("Failed to calculate happiness");
            }
        }
        res.status(200).send(dtoPets)
        return
    } catch (err: any) {
        console.error(err);
        res.status(500).send("Internal Server Error")
        return
    }
}

export async function addPet(req: Request, res: Response) {
    try {
        const user_id = parseInt(req.params.userid as string)
        const { name, image_key } = req.body;
        await domain.addPet(user_id, name, image_key);
        res.status(200).send('Added pet for user with id ' + user_id)
        return
    } catch (err: any) {
        console.error(err);
        res.status(500).send("Internal Server Error")
        return
    }
}

export async function getPetByUserId(req: Request, res: Response) {
    try {
        const token = req.headers.authorization
        const user_id = parseInt(req.params.userid as string)
        if (!token) {
            console.log("No token provided (getPetByUserId)")
            res.status(401).send("No token provided");
            return
        }
        const decoded = await domain.verifyToken(token) as string;

        const data = JSON.parse(JSON.stringify(decoded))

        if (data.userid !== user_id){
            res.status(403).send("Forbidden")
            return
        }
        const domainPet = await domain.getPetByUserId(user_id);
        if (Object.keys(domainPet).length === 0) {
            res.status(404).send('No pet found for user with id ' + user_id)
            return
        }
        if (domainPet instanceof Error) {
            res.status(500).send("Internal Server Error")
            return
        }
        const current_happiness = await domain.calculateCurrentHappiness(domainPet.id);
        if (typeof(current_happiness) === 'number') {
            const dtoPet = new PetDTO(
                domainPet.id, domainPet.user_id, domainPet.name, domainPet.image_key,
                domainPet.xp, current_happiness
            );
            res.status(200).send(dtoPet)
            return
        } else {
            console.log(`Failed to calculate happiness for pet with ID ${domainPet.id}`);
            res.status(500).send("Internal Server Error")
            return
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).send("Internal Server Error")
        return
    }
}

export async function deletePetByUserId(req: Request, res: Response) {
    try {
        const user_id = parseInt(req.params.userid as string)
        const domainPet = await domain.getPetByUserId(user_id);
        if (Object.keys(domainPet).length === 0) {
            res.status(404).send('No pet found for user with id ' + user_id)
            return
        }
        if (domainPet instanceof Error) {
            res.status(500).send("Internal Server Error")
            return
        }
        await domain.deletePetByUserId(user_id)
        res.status(200).send('Deleted pet for user with id ' + user_id)
        return
    } catch (err: any) {
        console.error(err);
        res.status(500).send("Internal Server Error")
        return
    }
}

export async function getPetById(req: Request, res: Response) {
    try {
        const pet_id = parseInt(req.params.id as string)
        const token = req.headers.authorization
        if (!token) {
            console.log("No token provided (getPetById)")
            res.status(401).send("No token provided");
            return
        }
        const decoded = await domain.verifyToken(token) as string;

        const data = JSON.parse(JSON.stringify(decoded))

        if (data.petid !== pet_id){
            res.status(403).send("Forbidden")
            return
        }
        const domainPet = await domain.getPetById(pet_id);
        if (Object.keys(domainPet).length === 0) {
            res.status(404).send('No pet found for pet_id ' + pet_id)
            return
        }
        if (domainPet instanceof Error) {
            res.status(500).send("Internal Server Error")
            return
        }
        const current_happiness = await domain.calculateCurrentHappiness(domainPet.id);
            if (typeof(current_happiness) === 'number') {
                const dtoPet = new PetDTO(
                    domainPet.id, domainPet.user_id, domainPet.name, domainPet.image_key, 
                    domainPet.xp, current_happiness
                );
            res.status(200).send(dtoPet)
            return
            } else {
                res.status(500).send("Internal Server Error")
                return
            }
    } catch (err: any) {
        console.error(err);
        res.status(500).send("Internal Server Error")
        return
    }
}

export async function updatePetById(req: Request, res: Response) {
    try {
        const pet_id = parseInt(req.params.id as string)
        const { name } = req.body;
        const domainPet = await domain.getPetById(pet_id);
        if (Object.keys(domainPet).length === 0) {
            res.status(404).send('No pet found for pet_id ' + pet_id)
            return
        }
        if (domainPet instanceof Error) {
            res.status(500).send("Internal Server Error")
            return
        }
        await domain.updatePetById(pet_id, name);
        res.status(200).send("Updated pet")
        return
    } catch (err: any) {
        console.error(err);
        res.status(500).send("Internal Server Error")
        return
    }
}

export async function deletePetById(req: Request, res: Response) {
    try {
        const pet_id = parseInt(req.params.id as string)
        const domainPet = await domain.getPetById(pet_id);
        if (Object.keys(domainPet).length === 0) {
            res.status(404).send('No pet found for pet_id ' + pet_id)
            return
        }
        if (domainPet instanceof Error) {
            res.status(500).send("Internal Server Error")
            return
        }
        await domain.deletePetById(pet_id)
        res.status(200).send('Deleted pet with id ' + pet_id)
        return
    } catch (err: any) {
        console.error(err);
        res.status(500).send("Internal Server Error")
        return
    }
}
