CREATE TYPE "public"."group_type" AS ENUM('PSVM', 'PVRA', 'SRVM');--> statement-breakpoint
CREATE TABLE "vote_status_pvra" (
	"id" uuid PRIMARY KEY NOT NULL,
	"vote" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vote_status_srvm" (
	"id" uuid PRIMARY KEY NOT NULL,
	"vote" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vicaria_candidate" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vicarius_candidate" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vote" (
	"vote_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vote" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_token" (
	"id" uuid NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "auth_token_id_id_pk" PRIMARY KEY("id","token")
);
--> statement-breakpoint
CREATE TABLE "vote_token" (
	"token" varchar(6) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar NOT NULL,
	"name" varchar NOT NULL,
	"admin" boolean DEFAULT false NOT NULL,
	"group" "group_type" NOT NULL,
	CONSTRAINT "members_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "vote_status_pvra" ADD CONSTRAINT "vote_status_pvra_id_members_id_fk" FOREIGN KEY ("id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_status_srvm" ADD CONSTRAINT "vote_status_srvm_id_members_id_fk" FOREIGN KEY ("id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vicaria_candidate" ADD CONSTRAINT "vicaria_candidate_id_members_id_fk" FOREIGN KEY ("id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vicarius_candidate" ADD CONSTRAINT "vicarius_candidate_id_members_id_fk" FOREIGN KEY ("id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_vote_members_id_fk" FOREIGN KEY ("vote") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_token" ADD CONSTRAINT "auth_token_id_members_id_fk" FOREIGN KEY ("id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
