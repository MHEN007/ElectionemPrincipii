import { VoteRepository } from "../repository/VoteRepository";

export class VoteController {
    public static async Vote(voter_id: string, vote: string) {
        await VoteRepository.Vote(voter_id, {vote});
    }

    public static async GetVotes() {
        return await VoteRepository.GetVotes();
    }
}