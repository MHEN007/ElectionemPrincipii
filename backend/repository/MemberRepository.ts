import { db } from "..";
import { Member } from "../schema/Members";
import { VoteStatusPVRA, VoteStatusSRVM } from "../schema/Status";
import { eq, ne, desc } from "drizzle-orm";

export type MemberType = typeof Member.$inferSelect

export class MemberRepository {
    public static async AddMember(member: MemberType) {
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

    public static async GetMemberbyUsername(username: string): Promise<MemberType> {
        const [member] = await db
            .select()
            .from(Member)
            .where(eq(Member.username, username))
            .limit(1);

        if (!member) {
            throw new Error("Member not found");
        }

        return member;
    }

    public static async GetMemberVoterStatus() {
        const PVRAVoters = await db
        .select({
            name: Member.name,
            status: VoteStatusPVRA.vote_status
        })
        .from(Member)
        .leftJoin(VoteStatusPVRA, eq(Member.id, VoteStatusPVRA.id))
        .where(ne(Member.group, "SRVM"))
        .orderBy(desc(VoteStatusPVRA.vote_status))

        const SRVMVoters = await db
        .select({
            name: Member.name,
            status: VoteStatusSRVM.vote_status
        })
        .from(Member)
        .leftJoin(VoteStatusSRVM, eq(Member.id, VoteStatusSRVM.id))
        .where(ne(Member.group, "PVRA"))
        .orderBy(desc(VoteStatusSRVM.vote_status))

        return {
            vicariusVoteStatus: PVRAVoters,
            vicariaVoteStatus: SRVMVoters
        }
    }
}