const User=require("../models/userModel")
exports.authorizeRole = (requiredRoles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user || !requiredRoles.includes(user.role)) {
                return res.status(403).json({ error: "Access denied. Insufficient permissions." });
            }
            next();
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    };
};