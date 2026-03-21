import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = "fX#p!ziGQ?f@zFJy^Msl),#ttoDpaD)8vg685S|=N!Xo2^*w*c/PXiwz$!$&@+efZw06bO2CVDXNJD[&K_>l#&";

export default async function authMiddleware(req, res, next) {
    //grab the token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            error: "No token provided or not authorized",

        });
    }
    const token = authHeader.split(" ")[1];

    //To verify token
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload.id).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User doesn't exist"
            });
        }
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            success: false,
            message: "Token invalid or expired"
        });
    }
}