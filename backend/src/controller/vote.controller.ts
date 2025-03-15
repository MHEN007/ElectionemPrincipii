import Elysia from "elysia";
import { VoteRepository } from "../repository/vote.repository";

export type VoteBody = {
    voterId: number;
    candidateId: number;
    round: number;
    for: string;
}

export const VoteController = new Elysia()
    .get(
        '/round', async () => {
            const round = await VoteRepository.getCurrentRound();
            return { round };
        }
    )
    .post(
        '/vote',
        async ({ body } : { body: VoteBody }) => {
            const vote = await VoteRepository.createVote(body);
            return { vote };
        }
    )