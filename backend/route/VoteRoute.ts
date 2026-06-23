import express from "express"
import Middleware from "../lib/middleware"
import { VoteController } from "../controller/VoteController"
import { MemberController } from "../controller/MemberController"

const voteRouter = express.Router()

voteRouter.post("/vote", Middleware, async (req, res) => {
    try { 
        const { voted_id, token } = req.body
    
        await VoteController.Vote(req.user?.user.id, voted_id, token)

        res.status(200).json({message: "Vote Success"})

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        }
    }

})

voteRouter.get("/voteReport", Middleware, async (req, res) => {
    try {
        const report = await VoteController.GetVotes()

        res.status(200).json({
            vicariusVotes: report.pvraVotes,
            vicariaVotes: report.srvmVotes,
            total: report.pvraVotes.reduce((sum, current) => sum + (current.votes ?? 0), 0) + report.srvmVotes.reduce((sum, current) => sum + (current.votes ?? 0), 0)
        })
    }catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        }
    }
})

voteRouter.get("/vote/status", Middleware, async (req, res) => {
    try {
        const statusFetch = await MemberController.GetMemberVoteStatus()

        res.status(200).json(statusFetch)

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        }
    }
})

voteRouter.post("/vote/token", Middleware, async (req, res) => {
    try {
        const { token } = await VoteController.NewRound()

        res.send(200).json({token})
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        }
    }
})

export default voteRouter