import { CandidateRepository } from "../repository/CandidateRepository.js";

export class CandidateController {
    public static async GetCandidates(group: string) {
        return await CandidateRepository.GetCandidates(group)
    }
}