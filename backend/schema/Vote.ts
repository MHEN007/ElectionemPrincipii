import { pgTable, uuid } from "drizzle-orm/pg-core";
import { Member } from "./Members.js";

export const Vote = pgTable('vote', {
    vote_id: uuid('vote_id').notNull().defaultRandom(),
    vote: uuid('vote').notNull().references(() => Member.id, { onDelete: "cascade" })
})