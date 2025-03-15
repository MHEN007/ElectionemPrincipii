import { prisma } from "../db";

export interface Candidate {
    id: number;
}

export class CandidateRepository {
    static async getAllCandidates(): Promise<Candidate[]> {
        const [candidatePraefect, candidateVicarius, candidateVicaria] = await Promise.all([
            prisma.candidatePraefect.findMany(),
            prisma.candidateVicarius.findMany(),
            prisma.candidateVicaria.findMany()
        ]);

        return [
            ...candidatePraefect.map(candidate => ({ id: candidate.id, name: candidate.name })),
            ...candidateVicarius.map(candidate => ({ id: candidate.id, name: candidate.name })),
            ...candidateVicaria.map(candidate => ({ id: candidate.id, name: candidate.name }))
        ];
    }

    static async getCandidatesByGroup(group : string): Promise<Candidate[]> {
        let candidates : Candidate[] = [];
        if (group == "praefect") {
            candidates = await prisma.candidatePraefect.findMany();
        } else if (group == "vicarius") {
            candidates = await prisma.candidateVicarius.findMany();
        } else if (group == "vicaria") {
            candidates = await prisma.candidateVicaria.findMany();
        }
        return candidates
    }
}