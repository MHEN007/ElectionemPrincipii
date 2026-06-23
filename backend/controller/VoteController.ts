import { db } from "..";
import { TokenRepository } from "../repository/TokenRepository";
import { VoteRepository } from "../repository/VoteRepository";
import bcrypt from "bcrypt"

export class VoteController {
    public static async Vote(voter_id: string, vote: string, token: string) {

        // Validate the token given
        const activeToken = await TokenRepository.GetVoteToken();

        if (!bcrypt.compareSync(token, activeToken)) 
            throw new Error("Token is invalid. Please check again!")

        await VoteRepository.Vote(voter_id, { vote, vote_id: voter_id });
    }

    public static async GetVotes() {
        return await VoteRepository.GetVotes();
    }

    public static async NewRound() {
        // CREATE A 6 RANDOM ALPHABETICAL STRING
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const newToken = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

        const encryptedToken = await bcrypt.hash(newToken, 12)

        await VoteRepository.NewRound(encryptedToken)

        return { token: newToken }
    }
}