import express from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./route/AuthRoute";
import cookieParser from "cookie-parser";
import voteRouter from "./route/VoteRoute";
import candidateRoute from "./route/CandidateRoute";
import memberRoute from "./route/MemberRoute";

dotenv.config();

export const app = express();
export const db = drizzle(process.env.DATABASE_URL!)

const port = process.env.BE_PORT || 3001;

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

app.use(authRouter)
app.use(voteRouter)
app.use(candidateRoute)
app.use(memberRoute)

app.use(express.Router().get("/", (req, res) => {
  res.status(200).json({Message: "Hello World"})
}))

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

