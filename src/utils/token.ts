import jwt, { SignOptions } from "jsonwebtoken";
import { getEnvVariable } from "./helpers";

export const signJwt = (payload: Object, options: SignOptions) => {
    return jwt.sign(payload, getEnvVariable("JWT_SECRET_KEY"), {
        ...(options && options),
        algorithm: "HS256",
    });
};

export const verifyJwt = <T>(token: string): T | null => {
    try {
        const decoded = jwt.verify(token, getEnvVariable("JWT_SECRET_KEY")) as T;
        return decoded;
    } catch (error) {
        return null;
    }
};
