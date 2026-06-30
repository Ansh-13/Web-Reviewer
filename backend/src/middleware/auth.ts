import { type Request, type Response, type NextFunction } from "express";
import { adminAuth } from "../config/firebase";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            error:
                "No token provided"
        });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = await adminAuth.verifyIdToken(token);
        res.locals.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            error: "Internal Server Error"
        })
    }
}