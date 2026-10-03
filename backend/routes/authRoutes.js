const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    changePassword,
    logoutUser,
    deleteOwnAccount,
    getAllUsers,
    getDoctors,
    getUserById,
    updateUserRole,
    toggleUserStatus,
    deleteUser,
    getDashboardStats
} = require("../controllers/authController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

/*
=====================================================
                PUBLIC ROUTES
=====================================================
*/

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

/*
=====================================================
            AUTHENTICATED USER ROUTES
=====================================================
*/

// Logged In User Profile
router.get("/profile", protect, getProfile);

// Update Profile
router.put("/profile", protect, updateProfile);

// Change Password
router.put("/change-password", protect, changePassword);

// Logout
router.post("/logout", protect, logoutUser);

// Delete Own Account
router.delete("/delete-account", protect, deleteOwnAccount);

/*
=====================================================
                ADMIN ROUTES
=====================================================
*/

// Dashboard Statistics
router.get(
    "/dashboard-stats",
    protect,
    adminOnly,
    getDashboardStats
);

// Get active doctors (used by appointment scheduling)
router.get(
    "/doctors",
    protect,
    getDoctors
);

// Get All Users
router.get(
    "/users",
    protect,
    adminOnly,
    getAllUsers
);

// Get Single User
router.get(
    "/users/:id",
    protect,
    adminOnly,
    getUserById
);

// Update User Role
router.put(
    "/users/:id/role",
    protect,
    adminOnly,
    updateUserRole
);

// Activate / Deactivate User
router.put(
    "/users/:id/status",
    protect,
    adminOnly,
    toggleUserStatus
);

// Delete User
router.delete(
    "/users/:id",
    protect,
    adminOnly,
    deleteUser
);

module.exports = router;