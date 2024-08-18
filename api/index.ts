import { Hono } from "hono";
import { handle } from "hono/vercel";
import { logger } from 'hono/logger'
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from '../db/schema';
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'


export const config = {
  runtime: "edge",
};

const db = drizzle(sql, { schema });

const app = new Hono().basePath("/api");
app.use(logger())

app.post(
  "/history", 
  zValidator(
    "json", 
    z.object({ 
      amount: z.number().min(0) 
    })), 
  async (c) => {
    const body = c.req.valid("json")

    const timeStamp = Math.floor(new Date().getTime() / 1000)

    try {
      await db.insert(schema.histories).values({amount: `${body.amount}`, createdAt: timeStamp})
    } catch (err) {
      return c.json({
        message: "error insert message"
      }, 500)
    }
    
    return c.json({ data: body })
  }
)

export default handle(app);
