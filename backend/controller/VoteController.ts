import { TokenRepository } from "../repository/TokenRepository";
import { VoteRepository } from "../repository/VoteRepository";
import bcrypt from "bcrypt"

export class VoteController {
    public static async Vote(voter_id: string, vote: string, token: string) {

        // Validate the token given
        const activeToken = await TokenRepository.GetVoteToken();

        if (!bcrypt.compareSync(token, activeToken)) 
            throw new Error("Token is invalid. Please check again!")

        await VoteRepository.Vote(voter_id, {vote});
    }

    public static async GetVotes() {
        return await VoteRepository.GetVotes();
    }
}