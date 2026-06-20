import express from "express"
import Middleware from "../lib/middleware"
import { VoteController } from "../controller/VoteController"

const voteRouter = express.Router()

voteRouter.post("/vote", Middleware, async (req, res) => {
    try { 
        const { voted_id } = req.body
    
        await VoteController.Vote(req.user?.user.id, voted_id)

        res.status(200).json({message: "Vote Success"})

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        }
    }

})

export default voteRouter