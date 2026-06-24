import express from "express";
import Middleware from "../lib/middleware.js";
import { CandidateController } from "../controller/CandidateController.js";

const candidateRoute = express.Router();

candidateRoute.get("/candidates/:group", Middleware,async (req, res) => {

    const group: any = req.params["group"]

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