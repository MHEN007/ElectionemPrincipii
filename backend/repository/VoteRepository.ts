import { count, eq } from "drizzle-orm";
import { db } from "..";
import { VicariaCandidate, VicariusCandidate } from "../schema/Candidate";
import { Vote } from "../schema/Vote";
import { Member } from "../schema/Members";
import { VoteStatusPVRA, VoteStatusSRVM } from "../schema/Status";

export type Vote = typeof Vote.$inferSelect;
type InsertVote = typeof Vote.$inferInsert

export class VoteRepository {
    async GetVotes() {
        const pvraVotes = await db
        .select({
            name: Member.name,
            votes: count(Member.id) || 0
        })
        .from(VicariusCandidate)
        .innerJoin(Member, eq(Member.id, VicariusCandidate.id))
        .leftJoin(Vote, eq(VicariusCandidate.id, Vote.vote))
        .groupBy(VicariaCandidate.id)

        const srvmVotes = await db
        .select({
            name: Member.name,
            votes: count(Member.id) || 0
        })
        .from(VicariaCandidate)
        .innerJoin(Member, eq(Member.id, VicariaCandidate.id))
        .leftJoin(Vote, eq(VicariaCandidate.id, Vote.vote))
        .groupBy(VicariaCandidate.id)

        return {
            ...pvraVotes,
            ...srvmVotes
        }
    }

    async Vote(voter_id: string, vote: InsertVote) {
        await db.transaction(async (tx) => {
            // Insert the vote
            await tx.insert(Vote).values(vote);

            // Get the candidate's group
            const [candidate] = await tx
                .select({ group: Member.group })
                .from(Member)
                .where(eq(Member.id, vote.vote));

            if (!candidate) {
                throw new Error("Candidate not found");
            }

            // Update voting status based on candidate group
            switch (candidate.group) {
                case "PVRA":
                    await tx
                        .update(VoteStatusPVRA)
                        .set({ vote_status: true })
                        .where(eq(VoteStatusPVRA.id, voter_id));
                    break;

                case "SRVM":
                    await tx
                        .update(VoteStatusSRVM)
                        .set({ vote_status: true })
                        .where(eq(VoteStatusSRVM.id, voter_id));
                    break;
            }
        });
    }
}