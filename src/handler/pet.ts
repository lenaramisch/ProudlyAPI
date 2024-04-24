import { PetDomain, UserDomain, TodoDomain } from "../domain/models";
import { PetDTO, UserDTO, TodoDTO } from "./models";
import domain from "../domain/domain";

module.exports = {
    //TODO add handler functions for pet
    /*getAllCarts: async function() {
        try {
            const domainCarts = await domain.getAllCarts();
            if (Object.keys(domainCarts).length === 0) {
                return { status: 404, message: 'No carts found'};
            }
            if (domainCarts instanceof Error) {
                return { status: 500, message: "Internal Server Error"}
            }
            const dtoCarts = domainCarts.map((cart: CartDomain) => new CartDTO(cart.id, cart.userid, cart.name))
            return { status: 200, data: dtoCarts };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    },

    addCart: async function (name: string, userid: number) {
        if (isNaN(userid)) {
            return { status: 400, message: 'Invalid ID supplied' };
        }
        try {
            const userResult = await domain.getUserById(userid);
            if (Object.keys(userResult).length === 0) {
                return { status: 404, message: `Can not find user (user ID: ${userid})`};
            }
            await domain.addCart(name, userid);
            return { status: 201, message: `Added cart with name ${name} for user (user ID: ${userid})` };
        } catch (err: any) {
            console.error(err);
            return { status: 500, message: 'Internal Server Error' };
        }
    }
    */
}
