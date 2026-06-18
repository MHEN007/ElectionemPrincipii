import { db } from "..";
import { Member } from "../schema/Members";
import { VoteStatusPVRA, VoteStatusSRVM } from "../schema/Status";
import { eq } from "drizzle-orm";

export type MemberType = typeof Member.$inferSelect

export class MemberRepository {
    async AddMember(member: MemberType) {
        await db.transaction( async (tx) => {
            tx.insert(Member).values(member)

            if (member.group == "PVRA" || member.group == "PSVM") {
                tx.insert(VoteStatusPVRA).values({id: member.id})
            }

            if (member.group == "SRVM" || member.group == "PSVM") {
                tx.insert(VoteStatusSRVM).values({id: member.id})
            }
        })
    }

    async GetMemberVoterStatus() {
        const PVRAVoters = await db
        .select({
            name: Member.name,
            status: VoteStatusPVRA.vote_status
        })
        .from(Member)
        .innerJoin(VoteStatusPVRA, eq(Member.id, VoteStatusPVRA.id))

        const SRVMVoters = await db
        .select({
            name: Member.name,
            status: VoteStatusSRVM.vote_status
        })
        .from(Member)
        .innerJoin(VoteStatusSRVM, eq(Member.id, VoteStatusPVRA.id))

        return {
            ...PVRAVoters,
            ...SRVMVoters
        }
    }
}