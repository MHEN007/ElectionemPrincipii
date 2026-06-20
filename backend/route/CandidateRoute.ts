import express from "express";
import Middleware from "../lib/middleware";
import { CandidateController } from "../controller/CandidateController";

const candidateRoute = express.Router();

candidateRoute.use(Middleware)

candidateRoute.get("/candidates/:group", async (req, res) => {

    const group = req.params["group"]

    try {
        const candidates = await CandidateController.GetCandidates(group)

        res.status(200).json({ candidates })

    } catch (e: unknown) {
        if (e instanceof Error) {
            res.status(500).json({"message": e}) 
        }
    }
    
})

export default candidateRoute