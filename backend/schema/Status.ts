import { boolean, pgTable, uuid } from "drizzle-orm/pg-core";
import { Member } from "./Members";

export const VoteStatusPVRA = pgTable('vote_status_pvra', {
    id: uuid('id').primaryKey().notNull().references(() => Member.id, { onDelete: "cascade" }),
    vote_status: boolean('vote').notNull().default(false)
})

export const VoteStatusSRVM = pgTable('vote_status_srvm', {
    id: uuid('id').primaryKey().notNull().references(() => Member.id, { onDelete: "cascade" }),
    vote_status: boolean('vote').notNull().default(false)
})