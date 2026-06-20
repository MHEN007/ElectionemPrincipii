import { eq } from "drizzle-orm"
import { db } from ".."
import { VicariaCandidate, VicariusCandidate } from "../schema/Candidate"
import { Member } from "../schema/Members"

export class CandidateRepository {
    public static async GetCandidates(group: string){
        const targetGroup = group == "vicarius" ? VicariusCandidate : VicariaCandidate
        const candidates = await db
            .select({
                id: targetGroup.id,
                name: Member.name
            })
            .from(targetGroup)
            .innerJoin(Member, eq(targetGroup.id, Member.id))

        return candidates
    }
}
