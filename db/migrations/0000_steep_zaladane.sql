CREATE TABLE IF NOT EXISTS "histories" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" numeric NOT NULL,
	"created_at" integer
);
