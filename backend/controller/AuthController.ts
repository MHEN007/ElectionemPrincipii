import { MemberRepository } from "../repository/MemberRepository";
import { TokenRepository } from "../repository/TokenRepository";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class AuthController {
    public static async Login(username: string, token: string) {
        // Search and get for user
        const dbUser = await MemberRepository.GetMemberbyUsername(username);

        if (!dbUser) { throw new Error("User or token not found") }

        // Check if it is the valid token
        const dbToken = await TokenRepository.GetVoteToken();

        if(!dbToken || !bcrypt.compareSync(token, dbToken)) {
            throw new Error("User or token not found")
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