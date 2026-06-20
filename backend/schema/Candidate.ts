import { pgTable, uuid } from "drizzle-orm/pg-core";
import { Member } from "./Members";

export const VicariusCandidate = pgTable("vicarius_candidate", {
    id: uuid('id').primaryKey().notNull().references(() => Member.id)
})

export const VicariaCandidate = pgTable("vicaria_candidate", {
    id: uuid('id').primaryKey().notNull().references(() => Member.id)
})