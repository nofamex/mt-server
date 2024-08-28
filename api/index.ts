import { Hono } from "hono";
import { handle } from "hono/vercel";
import { logger } from "hono/logger";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "../db/schema";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const config = {
  runtime: "edge",
};

const db = drizzle(sql, { schema });

const app = new Hono().basePath("/api");
app.use(logger());

app.post(
  "/history",
  zValidator(
    "json",
    z.object({
      amount: z
        .number({ message: "amount field is required" })
        .min(0, "minimum amount is 0"),
      description: z.string({ message: "description field is required" }),
    }),
    (result, c) => {
      if (!result.success) {
        return c.json(
          {
            errors: formatError(result.error),
          },
          400
        );
      }
    }
  ),
  async (c) => {
    const body = c.req.valid("json");

    try {
      await db.insert(schema.histories).values({
        amount: `${body.amount}`,
        description: body.description,
      });
    } catch (err) {
      return c.json(
        {
          message: "error insert history",
        },
        500
      );
    }

    return c.json({ data: body });
  }
);

const formatError = (err: z.ZodError): string => {
  const fieldErrors = err.flatten().fieldErrors;
  let errors = "";
  for (const key in fieldErrors) {
    errors += `${fieldErrors[key]}, `;
  }
  errors = errors.slice(0, errors.length - 2);
  return errors;
};

export default handle(app);
