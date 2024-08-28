import {
  decimal,
  integer,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

export const histories = pgTable("histories", {
  id: serial("id").primaryKey(),
  amount: decimal("amount").notNull(),
  description: varchar("description"),
  createdAt: integer("created_at").$default(() =>
    Math.floor(new Date().getTime() / 1000)
  ),
});
