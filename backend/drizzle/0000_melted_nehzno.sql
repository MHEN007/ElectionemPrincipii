DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'group_type') THEN
        CREATE TYPE "public"."group_type" AS ENUM('PSVM', 'PVRA', 'SRVM');
    END IF;
END $$;
CREATE TABLE IF NOT EXISTS "vote_status_pvra" (
	"id" uuid PRIMARY KEY NOT NULL,
	"vote" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vote_status_srvm" (
	"id" uuid PRIMARY KEY NOT NULL,
	"vote" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vicaria_candidate" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vicarius_candidate" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vote" (
	"vote_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vote" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_token" (
	"id" uuid NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "auth_token_id_token_pk" PRIMARY KEY("id","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vote_token" (
	"token" varchar(255) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar NOT NULL,
	"password" varchar(255) NOT NULL,
	"name" varchar NOT NULL,
	"admin" boolean DEFAULT false NOT NULL,
	"group" "group_type" NOT NULL,
	"vote_disabled" boolean DEFAULT false NOT NULL,
	CONSTRAINT "members_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ 
BEGIN
    -- 1. vote_status_pvra
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'vote_status_pvra_id_members_id_fk') THEN
        ALTER TABLE "vote_status_pvra" ADD CONSTRAINT "vote_status_pvra_id_members_id_fk" FOREIGN KEY ("id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
    END IF;

    -- 2. vote_status_srvm
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'vote_status_srvm_id_members_id_fk') THEN
        ALTER TABLE "vote_status_srvm" ADD CONSTRAINT "vote_status_srvm_id_members_id_fk" FOREIGN KEY ("id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
    END IF;

    -- 3. vicaria_candidate
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'vicaria_candidate_id_members_id_fk') THEN
        ALTER TABLE "vicaria_candidate" ADD CONSTRAINT "vicaria_candidate_id_members_id_fk" FOREIGN KEY ("id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
    END IF;

    -- 4. vicarius_candidate
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'vicarius_candidate_id_members_id_fk') THEN
        ALTER TABLE "vicarius_candidate" ADD CONSTRAINT "vicarius_candidate_id_members_id_fk" FOREIGN KEY ("id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
    END IF;

    -- 5. vote
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'vote_vote_members_id_fk') THEN
        ALTER TABLE "vote" ADD CONSTRAINT "vote_vote_members_id_fk" FOREIGN KEY ("vote") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
    END IF;

    -- 6. auth_token
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'auth_token_id_members_id_fk') THEN
        ALTER TABLE "auth_token" ADD CONSTRAINT "auth_token_id_members_id_fk" FOREIGN KEY ("id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
    END IF;
END $$;