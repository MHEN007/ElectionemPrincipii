import { pgTable, uuid, varchar, boolean, pgEnum } from "drizzle-orm/pg-core";

export const groupEnum = pgEnum('group_type', [
    "PSVM",
    "PVRA", 
    "SRVM"
])

export const Member = pgTable("members", {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    username: varchar('username').notNull().unique(),
    name: varchar('name').notNull(),
    admin: boolean('admin').notNull().default(false),
    group: groupEnum('group').notNull()
})