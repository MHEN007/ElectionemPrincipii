ALTER TABLE "vote_status_pvra" DROP CONSTRAINT "vote_status_pvra_id_members_id_fk";
--> statement-breakpoint
ALTER TABLE "vote_status_srvm" DROP CONSTRAINT "vote_status_srvm_id_members_id_fk";
--> statement-breakpoint
ALTER TABLE "vicaria_candidate" DROP CONSTRAINT "vicaria_candidate_id_members_id_fk";
--> statement-breakpoint
ALTER TABLE "vicarius_candidate" DROP CONSTRAINT "vicarius_candidate_id_members_id_fk";
--> statement-breakpoint
ALTER TABLE "vote" DROP CONSTRAINT "vote_vote_members_id_fk";
--> statement-breakpoint
ALTER TABLE "auth_token" DROP CONSTRAINT "auth_token_id_members_id_fk";
--> statement-breakpoint
ALTER TABLE "vote_status_pvra" ADD CONSTRAINT "vote_status_pvra_id_members_id_fk" FOREIGN KEY ("id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_status_srvm" ADD CONSTRAINT "vote_status_srvm_id_members_id_fk" FOREIGN KEY ("id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vicaria_candidate" ADD CONSTRAINT "vicaria_candidate_id_members_id_fk" FOREIGN KEY ("id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vicarius_candidate" ADD CONSTRAINT "vicarius_candidate_id_members_id_fk" FOREIGN KEY ("id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_vote_members_id_fk" FOREIGN KEY ("vote") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_token" ADD CONSTRAINT "auth_token_id_members_id_fk" FOREIGN KEY ("id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;