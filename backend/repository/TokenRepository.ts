import { db } from "../index.js";
import { AuthToken, VoteToken } from "../schema/Tokens.js";
import { eq, and, gte } from "drizzle-orm"

export class TokenRepository {
    public static async GetVoteToken(): Promise<string>{
        const [voteToken] = await db.select().from(VoteToken).limit(1)

        if (!voteToken) {
            throw new Error("No token created");
        }

        return voteToken.token;
    }

    public static async CreateVoteToken(newVoteToken: string){
        await db.transaction( async (tx) => {
            tx.delete(VoteToken)

            tx.insert(VoteToken).values({token: newVoteToken})
        })
    }

    public static async CheckAuthToken(token: string, user_id: string) {
        const currentTimestamp = new Date()
        const check = await db
            .select()
            .from(AuthToken)
            .where(and(
                eq(AuthToken.token, token), 
                eq(AuthToken.user_id, user_id), 
                // gte(AuthToken.expires_at, currentTimestamp.toISOString)
            ));

        if (!check) {
            throw new Error("Session invalid");
        }

        return check
    }
}