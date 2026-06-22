import express from "express"
import Middleware from "../lib/middleware";
import { MemberController } from "../controller/MemberController";
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

memberRoute.post("/members/upload", upload.single('file'), async (req, res) => {
    try {
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

export default memberRoute