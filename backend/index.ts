import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./route/AuthRoute.js";
import cookieParser from "cookie-parser";
import voteRouter from "./route/VoteRoute.js";
import candidateRoute from "./route/CandidateRoute.js";
import memberRoute from "./route/MemberRoute.js";

dotenv.config();

const app = express();

const port = process.env.BE_PORT || 3001;

const corsOptions = {
  origin: [process.env.FE_API_URL || "http://localhost:3000"],
  credentials: true,
};

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

app.use('/api', authRouter)
app.use('/api', voteRouter)
app.use('/api', candidateRoute)
app.use('/api', memberRoute)

app.use(express.Router().get("/api", (req, res) => {
  res.status(200).json({Message: "Hello World"})
}))

app.listen(port || 3001, () => {
    console.log(`Listening on port ${port}`);
})

