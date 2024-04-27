import { PetDomain } from "../domain/models";
import { PetDTO } from "./models";
import domain from "../domain/domain";

export async function getAllPets() {
    try {
        const domainPets = await domain.getAllPets();
        if (Object.keys(domainPets).length === 0) {
            return { status: 404, message: 'No pets found'};
        }
        if (domainPets instanceof Error) {
            return { status: 500, message: "Internal Server Error"}
        }
        const dtoPets = [];
        for (const pet of domainPets) {
            const current_happiness = await domain.calculateCurrentHappiness(pet.id);
            if (typeof(current_happiness) === 'number') {
                const dtoPet = domainPets.map((pet: PetDomain) => new PetDTO(
                    pet.id, pet.user_id, pet.name, pet.xp, current_happiness
                ));
                dtoPets.push(dtoPet[0]);
            }
            else {
                console.log(`Failed to calculate happiness for pet with ID ${pet.id}`);
                throw new Error("Failed to calculate happiness");
            }
        }
        return { status: 200, data: dtoPets };
    } catch (err: any) {
        console.error(err);
        return { status: 500, message: 'Internal Server Error' };
    }
}

export async function addPet(user_id: number, name: string) {
    try {
        await domain.addPet(user_id, name);
        return { status: 200, message: 'Added pet for user with id ' + user_id }
    } catch (err: any) {
        console.error(err);
        return { status: 500, message: 'Internal Server Error' };
    }
}

export async function getPetByUserId(user_id: number) {
    try {
        const domainPet = await domain.getPetByUserId(user_id);
        if (Object.keys(domainPet).length === 0) {
            return { status: 404, message: 'No pet found for user with id ' + user_id};
        }
        if (domainPet instanceof Error) {
            return { status: 500, message: "Internal Server Error"}
        }
        const current_happiness = await domain.calculateCurrentHappiness(domainPet.id);
        if (typeof(current_happiness) === 'number') {
            const dtoPet = new PetDTO(
                domainPet.id, domainPet.user_id, domainPet.name, 
                domainPet.xp, current_happiness
            );
            return { status: 200, data: dtoPet };
        } else {
            console.log(`Failed to calculate happiness for pet with ID ${domainPet.id}`);
            return { status: 500, message: 'Internal Server Error' };
        }
    } catch (err: any) {
        console.error(err);
        return { status: 500, message: 'Internal Server Error' };
    }
}

export async function deletePetByUserId(user_id: number) {
    try {
        const domainPet = await domain.getPetByUserId(user_id);
        if (Object.keys(domainPet).length === 0) {
            return { status: 404, message: 'No pet found for user with id ' + user_id};
        }
        if (domainPet instanceof Error) {
            return { status: 500, message: "Internal Server Error"}
        }
        await domain.deletePetByUserId(user_id)
        return { status: 200, message: 'Deleted pet for user with id ' + user_id}
    } catch (err: any) {
        console.error(err);
        return { status: 500, message: 'Internal Server Error' };
    }
}

export async function getPetById(pet_id: number) {
    try {
        const domainPet = await domain.getPetById(pet_id);
        if (Object.keys(domainPet).length === 0) {
            return { status: 404, message: 'No pet found for pet_id ' + pet_id};
        }
        if (domainPet instanceof Error) {
            return { status: 500, message: "Internal Server Error"}
        }
        const current_happiness = await domain.calculateCurrentHappiness(domainPet.id);
            if (typeof(current_happiness) === 'number') {
                const dtoPet = new PetDTO(
                    domainPet.id, domainPet.user_id, domainPet.name, 
                    domainPet.xp, current_happiness
                );
            return { status: 200, data: dtoPet };
            } else {
                return { status: 500, message: 'Internal Server Error' };
            }
    } catch (err: any) {
        console.error(err);
        return { status: 500, message: 'Internal Server Error' };
    }
}

export async function updatePetById(pet_id: number, name: string) {
    try {
        const domainPet = await domain.getPetById(pet_id);
        if (Object.keys(domainPet).length === 0) {
            return { status: 404, message: 'No pet found for pet_id ' + pet_id};
        }
        if (domainPet instanceof Error) {
            return { status: 500, message: "Internal Server Error"}
        }
        await domain.updatePetById(pet_id, name);
        return { status: 200, message: 'Updated pet' }
    } catch (err: any) {
        console.error(err);
        return { status: 500, message: 'Internal Server Error' };
    }
}

export async function deletePetById(pet_id: number) {
    try {
        const domainPet = await domain.getPetById(pet_id);
        if (Object.keys(domainPet).length === 0) {
            return { status: 404, message: 'No pet found for pet_id ' + pet_id};
        }
        if (domainPet instanceof Error) {
            return { status: 500, message: "Internal Server Error"}
        }
        await domain.deletePetById(pet_id)
        return { status: 200, message: 'Deleted pet with id ' + pet_id}
    } catch (err: any) {
        console.error(err);
        return { status: 500, message: 'Internal Server Error' };
    }
}
