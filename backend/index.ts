import express from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

export const app = express();
export const db = drizzle(process.env.DATABASE_URL!)

const port = process.env.BE_PORT || 3001;

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};

app.use(cors(corsOptions))

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

