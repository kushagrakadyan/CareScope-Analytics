const User = require("../models/User");
const generateToken = require("../utils/generateToken");

/*
===========================================================
@desc    Register New User
@route   POST /api/auth/register
@access  Public
===========================================================
*/

const registerUser = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            phone,
            department,
            role
        } = req.body;

        // ==========================
        // Required Field Validation
        // ==========================

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields."
            });
        }

        // ==========================
        // Password Length
        // ==========================

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters."
            });
        }

        // ==========================
        // Duplicate Email Check
        // ==========================

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email."
            });
        }

        // ==========================
        // Create User
        // ==========================

        const user = await User.create({
            fullName,
            email,
            password,
            phone,
            department,
            role
        });

        // ==========================
        // Success Response
        // ==========================

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",

            token: generateToken(
                user._id,
                user.role
            ),

            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                department: user.department,
                profileImage: user.profileImage,
                isActive: user.isActive,
                createdAt: user.createdAt
            }
        });

    } catch (error) {

        console.error("Register Error :", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


/*
===========================================================
@desc    Login User
@route   POST /api/auth/login
@access  Public
===========================================================
*/

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        // ==========================
        // Validation
        // ==========================

        if (!email || !password) {

            return res.status(400).json({

                success: false,
                message: "Email and Password are required."

            });

        }

        // ==========================
        // Find User
        // ==========================

        const user = await User.findOne({
            email
        }).select("+password");

        if (!user) {

            return res.status(401).json({

                success: false,
                message: "Invalid Email or Password"

            });

        }

        // ==========================
        // Compare Password
        // ==========================

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {

            return res.status(401).json({

                success: false,
                message: "Invalid Email or Password"

            });

        }

        // ==========================
        // Check Account Status
        // ==========================

        if (!user.isActive) {

            return res.status(403).json({

                success: false,
                message: "Account has been disabled."

            });

        }

        // ==========================
        // Login Success
        // ==========================

        return res.status(200).json({

            success: true,

            message: "Login Successful.",

            token: generateToken(
                user._id,
                user.role
            ),

            data: {

                id: user._id,

                fullName: user.fullName,

                email: user.email,

                phone: user.phone,

                role: user.role,

                department: user.department,

                profileImage: user.profileImage

            }

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};



/*
===========================================================
@desc    Get Logged In User
@route   GET /api/auth/profile
@access  Private
===========================================================
*/

const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user._id);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        return res.status(200).json({

            success: true,

            data: user

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};



module.exports = {

    registerUser,

    loginUser,

    getProfile

};
/*
===========================================================
@desc    Update Logged In User Profile
@route   PUT /api/auth/profile
@access  Private
===========================================================
*/

const updateProfile = async (req, res) => {
    try {
        const {
            fullName,
            phone,
            department
        } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (fullName) user.fullName = fullName;
        if (phone) user.phone = phone;
        if (department) user.department = department;

        if (req.file) {
            user.profileImage = req.file.path;
        }

        const updatedUser = await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            data: {
                id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
                department: updatedUser.department,
                profileImage: updatedUser.profileImage,
                updatedAt: updatedUser.updatedAt
            }
        });

    } catch (error) {
        console.error("Update Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



/*
===========================================================
@desc    Change Password
@route   PUT /api/auth/change-password
@access  Private
===========================================================
*/

const changePassword = async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            return res.status(400).json({
                success: false,
                message: "All password fields are required."
            });

        }

        if (newPassword !== confirmPassword) {

            return res.status(400).json({
                success: false,
                message: "Passwords do not match."
            });

        }

        if (newPassword.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters."
            });

        }

        const user = await User.findById(req.user._id)
            .select("+password");

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }

        const isMatch =
            await user.matchPassword(currentPassword);

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Current password is incorrect."
            });

        }

        user.password = newPassword;

        await user.save();

        return res.status(200).json({

            success: true,

            message: "Password changed successfully."

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};



/*
===========================================================
@desc    Logout User
@route   POST /api/auth/logout
@access  Private
===========================================================
*/

const logoutUser = async (req, res) => {

    try {

        return res.status(200).json({

            success: true,

            message: "Logged out successfully."

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};



/*
===========================================================
@desc    Delete Own Account (Soft Delete)
@route   DELETE /api/auth/delete-account
@access  Private
===========================================================
*/

const deleteOwnAccount = async (req, res) => {

    try {

        const user = await User.findById(req.user._id);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        user.isActive = false;

        await user.save();

        return res.status(200).json({

            success: true,

            message:
                "Account deactivated successfully."

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};
/*
===========================================================
@desc    Get All Users
@route   GET /api/auth/users
@access  Admin
===========================================================
*/

const getAllUsers = async (req, res) => {
    try {

        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 10;
        let search = req.query.search || "";
        let role = req.query.role || "";

        const query = {};

        if (search) {
            query.$or = [
                {
                    fullName: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        if (role) {
            query.role = role;
        }

        const totalUsers = await User.countDocuments(query);

        const users = await User.find(query)
            .select("-password")
            .sort({
                createdAt: -1
            })
            .skip((page - 1) * limit)
            .limit(limit);

        return res.status(200).json({

            success: true,

            totalUsers,

            currentPage: page,

            totalPages: Math.ceil(totalUsers / limit),

            users

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }
};



/*
===========================================================
@desc    Get Doctors
@route   GET /api/auth/doctors
@access  Private
===========================================================
*/
const getDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: "doctor", isActive: true })
            .select("fullName email phone department profileImage")
            .sort({ fullName: 1 });
        return res.status(200).json({ success: true, users: doctors });
    } catch (error) {
        console.error("Get Doctors Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


/*
===========================================================
@desc    Get User By Id
@route   GET /api/auth/users/:id
@access  Admin
===========================================================
*/

const getUserById = async (req, res) => {

    try {

        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        return res.status(200).json({

            success: true,

            user

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};



/*
===========================================================
@desc    Update User Role
@route   PUT /api/auth/users/:id/role
@access  Admin
===========================================================
*/

const updateUserRole = async (req, res) => {

    try {

        const { role } = req.body;

        if (
            !["admin", "doctor", "receptionist"].includes(role)
        ) {

            return res.status(400).json({

                success: false,

                message: "Invalid role."

            });

        }

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        user.role = role;

        await user.save();

        return res.status(200).json({

            success: true,

            message: "Role updated successfully.",

            user

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};



/*
===========================================================
@desc    Activate / Deactivate User
@route   PUT /api/auth/users/:id/status
@access  Admin
===========================================================
*/

const toggleUserStatus = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        user.isActive = !user.isActive;

        await user.save();

        return res.status(200).json({

            success: true,

            message: `User ${user.isActive ? "Activated" : "Deactivated"} Successfully.`,

            isActive: user.isActive

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};



/*
===========================================================
@desc    Delete User
@route   DELETE /api/auth/users/:id
@access  Admin
===========================================================
*/

const deleteUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        await user.deleteOne();

        return res.status(200).json({

            success: true,

            message: "User deleted successfully."

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};



/*
===========================================================
@desc    Dashboard Statistics
@route   GET /api/auth/dashboard-stats
@access  Admin
===========================================================
*/

const getDashboardStats = async (req, res) => {

    try {

        const totalUsers =
            await User.countDocuments();

        const totalDoctors =
            await User.countDocuments({
                role: "doctor"
            });

        const totalAdmins =
            await User.countDocuments({
                role: "admin"
            });

        const totalReceptionists =
            await User.countDocuments({
                role: "receptionist"
            });

        const activeUsers =
            await User.countDocuments({
                isActive: true
            });

        return res.status(200).json({

            success: true,

            statistics: {

                totalUsers,

                totalDoctors,

                totalAdmins,

                totalReceptionists,

                activeUsers

            }

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};



module.exports = {

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

};