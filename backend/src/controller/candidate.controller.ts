import Elysia from "elysia";
import { CandidateRepository } from "../repository/candidate.repository";

export const CandidateController = new Elysia()
    .get(
        '/candidates',
        async () => {
            const candidates = await CandidateRepository.getAllCandidates();
            return { candidates };
        }
    )
    .get(
        '/candidates/:group',
        async ({ params }) => {
            const candidates = await CandidateRepository.getCandidatesByGroup(params.group);
            return { candidates };
        }
    )
