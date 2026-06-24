import express from "express"
import { AuthController } from "../controller/AuthController.js"
import Middleware from "../lib/middleware.js"

const authRouter = express.Router()

authRouter.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body

        const token = await AuthController.Login(username, password)

        res.cookie("e2rdo", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 15,
            secure: true,
            sameSite: 'none',
            partitioned: true,
        })

        res.status(200).json({message: "SUCCESS"})

    } catch (error: unknown) {
        if (error instanceof Error)
            res.status(500).json({message: `${error}`})
    }
})

authRouter.post("/logout", (req, res) => {
    res.clearCookie("e2rdo")
    res.status(200).json({"message": "LOGOUT SUCCESS"})
})

authRouter.get("/clearance", Middleware, (req, res) => {
    res.status(200).json({
        name: req.user?.user.name,
        isAdmin: req.user?.user.admin,
        group: req.user?.user.group
    })
})

export default authRouter