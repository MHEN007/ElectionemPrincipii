import express from "express"
import Middleware from "../lib/middleware.js";
import { MemberController } from "../controller/MemberController.js";
import multer from "multer"
import { Readable } from "stream"

const memberRoute = express.Router();
const storage = multer.memoryStorage()
const upload = multer({ storage, fileFilter: (_, file, cb) => {
    if (file.mimetype==='text/csv' || file.originalname.endsWith('.csv')) {
        cb(null, true);
    } else {
        cb(new Error("Only csv files allowed"))
    }
}})

memberRoute.get("/members", Middleware, async (req, res) => {
    const members = await MemberController.GetMembers();

    res.status(200).json(members)
})

memberRoute.patch("/member", Middleware, async (req, res) => {
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

memberRoute.post("/members/upload", Middleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.user?.user.admin) {
            throw new Error("Unauthorized");
        }

        if (!req.file) {
            throw new Error("No file uploaded")
        }
        
        // Process the file
        const stream = Readable.from(req.file.buffer)

        await MemberController.CreateMembersfromFile(stream)

        res.sendStatus(200)
        
    } catch (error) {
        if (error instanceof Error)
            res.status(500).json({message: error.message})
    }
})

memberRoute.delete("/member/:id", Middleware, async (req, res) => {
    const { id } = req.params

    if (!id) {
        throw new Error("Not authenticated")
    }

    const reqId = Array.isArray(id) ? id[0] : id

    if (!reqId) {
        throw new Error("Not authenticated")
    }

    if (reqId == req.user?.user.id) {
        res.status(403).json({message: "unable to delete self"})
        return
    }

    try {
        await MemberController.DeleteMember(reqId, req.user?.user.id)
        res.sendStatus(200)
    } catch (error) {
        if (error instanceof Error)
            res.status(500).json({message: error.message})
    }
})

export default memberRoute