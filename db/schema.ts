import { decimal, integer, pgTable, serial } from "drizzle-orm/pg-core";

export const histories = pgTable("histories", {
  id: serial("id").primaryKey(),
  amount: decimal("amount").notNull(),
  createdAt: integer("created_at")
});
