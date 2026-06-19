import express from "express"
import Middleware from "../lib/middleware"
import { VoteController } from "../controller/VoteController"

const voteRouter = express.Router()

voteRouter.post("/vote", Middleware, (req, res) => {
    try { 

        const { voted_id } = req.body
    
        VoteController.Vote(req.user?.user.id, voted_id)

        res.status(200).json({message: "Vote Success"})
        
    } catch (e: unknown) {
        if (e instanceof Error) {
            res.status(500).json({message: e})
        }
    }

})

export default voteRouter