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

//Sample Data
const user = {
    id: 2,
    petid: 1
  };
  
  // Sign the JWT
  const token = signJwt(
    { userid: user.id, 
      petid: user.petid},
    {
      expiresIn: `${getEnvVariable("JWT_EXPIRES_IN")}m`,
    }
  );
  
  console.log({ token });
  
  // Verify the JWT
  const payload = verifyJwt<{ userid: number, petid: number }>(token);
  if (payload) {
    console.log("✅Token is valid");
  } else {
    console.error("🔥 Token is invalid or user doesn't exists");
  }
