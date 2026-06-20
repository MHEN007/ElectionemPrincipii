ALTER TABLE "auth_token" DROP CONSTRAINT "auth_token_id_id_pk";--> statement-breakpoint
ALTER TABLE "auth_token" ADD CONSTRAINT "auth_token_id_token_pk" PRIMARY KEY("id","token");