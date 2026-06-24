import { db } from "../lib/db.js"
import { VicariaCandidate, VicariusCandidate } from "../schema/Candidate.js";
import { Member } from "../schema/Members.js";
import { VoteStatusPVRA, VoteStatusSRVM } from "../schema/Status.js";
import { eq, ne, desc, like, not, and } from "drizzle-orm";

export type MemberType = typeof Member.$inferSelect

export type CreateMemberType = MemberType & {
    isCandidate: boolean;
}

export class MemberRepository {
    public static async AddMember(member: CreateMemberType) {
        await db.transaction( async (tx) => {
            const [createdId] = await tx.insert(Member).values(member).returning({ createdId: Member.id })
            
            if (!createdId?.createdId)
                throw new Error("Failed to create user")

            if (member.group == "PVRA" || member.group == "PSVM") {
                await tx.insert(VoteStatusPVRA).values({id: createdId?.createdId})
            }

            if (member.group == "SRVM" || member.group == "PSVM") {
                await tx.insert(VoteStatusSRVM).values({id: createdId?.createdId})
            }

            if (member.isCandidate && (member.group != "PSVM")) {
                await tx.insert(member.group == "PVRA" ? VicariusCandidate : VicariaCandidate).values({id: createdId?.createdId})
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

    public static async DeleteMember(id: string) {
        await db.delete(Member).where(eq(Member.id, id))
    }

    public static async GetMemberVoterStatus() {
        const PVRAVoters = await db
        .select({
            name: Member.name,
            status: VoteStatusPVRA.vote_status
        })
        .from(Member)
        .leftJoin(VoteStatusPVRA, eq(Member.id, VoteStatusPVRA.id))
        .where(and(ne(Member.group, "SRVM"), eq(Member.voteDisabled, false)))
        .orderBy(desc(VoteStatusPVRA.vote_status))

        const SRVMVoters = await db
        .select({
            name: Member.name,
            status: VoteStatusSRVM.vote_status
        })
        .from(Member)
        .leftJoin(VoteStatusSRVM, eq(Member.id, VoteStatusSRVM.id))
        .where(and(ne(Member.group, "PVRA"), eq(Member.voteDisabled, false)))
        .orderBy(desc(VoteStatusSRVM.vote_status))

        return {
            vicariusVoteStatus: PVRAVoters,
            vicariaVoteStatus: SRVMVoters
        }
    }

    public static async GetMembers(whereClause?: string) {
        return db
            .select({
                id: Member.id,
                name: Member.name,
                voteStatus: Member.voteDisabled,
            })
            .from(Member)
            .where(
                whereClause
                    ? like(Member.name, `%${whereClause}%`)
                    : undefined
            )
            .orderBy(Member.group, Member.name)
            // .groupBy(Member.group);
    }

    public static async UpdateMemberStatus(member_id: string) {
        await db.update(Member).set({ voteDisabled: not(Member.voteDisabled) }).where(eq(Member.id, member_id))
    }
}