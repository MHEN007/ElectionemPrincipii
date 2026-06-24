import { pgTable, uuid } from "drizzle-orm/pg-core";
import { Member } from "./Members";

export const Vote = pgTable('vote', {
    vote_id: uuid('vote_id').primaryKey().notNull().defaultRandom(),
    vote: uuid('vote').notNull().references(() => Member.id, { onDelete: "cascade" })
})