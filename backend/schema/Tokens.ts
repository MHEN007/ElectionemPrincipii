import { pgTable, timestamp, uuid, varchar, primaryKey } from "drizzle-orm/pg-core";
import { Member } from "./Members";

export const VoteToken = pgTable('vote_token', {
    token: varchar('token', { length: 255 }).notNull().primaryKey()
})

export const AuthToken = pgTable('auth_token', 
    {
        user_id: uuid('id').notNull().references(() => Member.id),
        token: varchar('token', { length: 255 }).notNull(),
        expires_at: timestamp('expires_at', { mode: "string" }).notNull().defaultNow(),
    }, 
    (table) => [
        primaryKey({
            columns: [table.user_id, table.token]
        })
    ]
)