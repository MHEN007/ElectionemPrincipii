import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { Member } from "./Members";

export const VoteToken = pgTable('vote_token', {
    token: varchar('token', { length: 6 }).notNull().primaryKey()
})

export const AuthToken = pgTable('auth_token', {
    id: uuid('id').primaryKey().notNull().references(() => Member.id),
    token: varchar('token', { length: 255 }).notNull()
})