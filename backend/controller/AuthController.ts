import { MemberRepository } from "../repository/MemberRepository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class AuthController {
    public static async Login(username: string, token: string) {
        // Search and get for user
        const dbUser = await MemberRepository.GetMemberbyUsername(username);

        if (!dbUser) { throw new Error("User or password incorrect") }

        // Check if the password is correct or not
        if(!bcrypt.compareSync(token, dbUser.password)) {
            throw new Error("User or password incorrect")
        }

        // Create jwt
        const jwtToken = jwt.sign(
            {
                user: dbUser
            },
            process.env.JWT_SECRET!,
            {
                "expiresIn": 1000 * 60 * 15
            }
        )

        return jwtToken
    }
}