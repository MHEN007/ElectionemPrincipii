import express from "express"
import Middleware from "../lib/middleware";
import { MemberController } from "../controller/MemberController";

const memberRoute = express.Router();

memberRoute.use(Middleware)

memberRoute.get("/members", async (req, res) => {
    const members = await MemberController.GetMembers();

    res.status(200).json(members)
})

memberRoute.patch("/member", async (req, res) => {
    try {
        const { member_id } = req.body
    
        await MemberController.UpdateStatus(member_id)
    
        res.sendStatus(200)
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: error.message})
        }
    }
})

export default memberRoute