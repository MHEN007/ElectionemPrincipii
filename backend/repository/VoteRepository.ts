import { count, eq } from "drizzle-orm";
import { db } from "..";
import { VicariaCandidate, VicariusCandidate } from "../schema/Candidate";
import { Vote } from "../schema/Vote";
import { Member } from "../schema/Members";
import { VoteStatusPVRA, VoteStatusSRVM } from "../schema/Status";

export type Vote = typeof Vote.$inferSelect;
type InsertVote = typeof Vote.$inferInsert

export class VoteRepository {
    public static async GetVotes() {
        const pvraVotes = await db
            .select({
                name: Member.name,
                votes: count(Vote.vote)
            })
            .from(VicariusCandidate)
            .innerJoin(Member, eq(Member.id, VicariusCandidate.id))
            .leftJoin(Vote, eq(VicariusCandidate.id, Vote.vote))
            .groupBy(VicariusCandidate.id, Member.name);

        const srvmVotes = await db
            .select({
                name: Member.name,
                votes: count(Vote.vote)
            })
            .from(VicariaCandidate)
            .innerJoin(Member, eq(Member.id, VicariaCandidate.id))
            .leftJoin(Vote, eq(VicariaCandidate.id, Vote.vote))
            .groupBy(VicariaCandidate.id, Member.name);

        return {
            pvraVotes: pvraVotes,
            srvmVotes: srvmVotes
        }
    }

    public static async Vote(voter_id: string, vote: InsertVote) {
        await db.transaction(async (tx) => {
            // Get the candidate's group
            const [candidate] = await tx
                .select({ name: Member.name, group: Member.group})
                .from(Member)
                .where(eq(Member.id, vote.vote));

            if (!candidate) {
                throw new Error("Candidate not found");
            }

            // Check if voter can vote or not
            const voteAbility = await db.select({ status: Member.voteDisabled }).from(Member).where(eq(Member.id, voter_id)).then((r) => r.at(0))

            if (!voteAbility || voteAbility.status) {
                throw new Error("Your vote status has been disabled. Please contact the MC!")
            }

            // Check if voter has voted or not for this group
            const query = await tx
                .select({ status: candidate.group == "PVRA" ? VoteStatusPVRA.vote_status : VoteStatusSRVM.vote_status })
                .from( candidate.group=="PVRA" ? VoteStatusPVRA : VoteStatusSRVM )
                .where(eq(candidate.group=="PVRA" ? VoteStatusPVRA.id : VoteStatusSRVM.id, voter_id))
                .then((v) => v.at(0))

            if(!query || query.status) {
                throw new Error("You have voted for this group")
            }

            // Insert the vote
            await tx.insert(Vote).values(vote);

            // Update voting status based on candidate group
            await tx
                .update(candidate.group == "PVRA" ? VoteStatusPVRA : VoteStatusSRVM)
                .set({ vote_status: true })
                .where(eq(candidate.group == "PVRA" ? VoteStatusPVRA.id : VoteStatusSRVM.id, voter_id));
        });
    }
}