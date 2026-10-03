const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================
// VERIFY JWT TOKEN
// ==========================================

const protect = async (req, res, next) => {
    let token;

    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found"
                });
            }

            next();
        } else {
            return res.status(401).json({
                success: false,
                message: "Not authorized, token missing"
            });
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

// ==========================================
// ADMIN ACCESS
// ==========================================

const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin only."
        });
    }

    next();
};

// ==========================================
// DOCTOR ACCESS
// ==========================================

const doctorOnly = (req, res, next) => {
    if (req.user.role !== "doctor") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Doctor only."
        });
    }

    next();
};

// ==========================================
// RECEPTIONIST ACCESS
// ==========================================

const receptionistOnly = (req, res, next) => {
    if (!["receptionist", "admin"].includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: "Access denied. Receptionist only."
        });
    }

    next();
};
// ==========================================
// ADMIN OR RECEPTIONIST
// ==========================================

const adminOrReceptionist = (req, res, next) => {

    if (
        req.user.role === "admin" ||
        req.user.role === "receptionist"
    ) {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: "Access denied. Admin or Receptionist only."
    });
};

// ==========================================
// ADMIN / DOCTOR / RECEPTIONIST
// ==========================================
const adminDoctorOrReceptionist = (req, res, next) => {
    if (["admin", "doctor", "receptionist"].includes(req.user.role)) return next();
    return res.status(403).json({ success: false, message: "Access denied." });
};

// ==========================================
// ADMIN OR DOCTOR
// ==========================================

const adminOrDoctor = (req, res, next) => {
    if (
        req.user.role === "admin" ||
        req.user.role === "doctor"
    ) {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: "Access denied."
    });
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
    protect,
    adminOnly,
    doctorOnly,
    receptionistOnly,
    adminOrReceptionist,
    adminDoctorOrReceptionist,
    adminOrDoctor
};