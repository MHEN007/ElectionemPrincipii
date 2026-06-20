import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default function Middleware(req: Request, res: Response, next: NextFunction) {
    try {
        const e2rdo = req.cookies["e2rdo"];

        if (!e2rdo) {
            throw Error("Not authenticated. Please provide token!");
        }

        const verifiedToken = jwt.verify(e2rdo, process.env.JWT_SECRET!)

        if (!verifiedToken || typeof verifiedToken === 'string') {
            throw Error("TOKEN NOT VERIFIED")
        }
        
        req.user = verifiedToken
        
        next()
    } catch (error: unknown) {
        if (error instanceof Error)
            res.status(500).json({ message: error.message });
    }
}