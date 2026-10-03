const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            minlength: 3,
            maxlength: 100
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please enter a valid email"
            ]
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false
        },

        phone: {
            type: String,
            trim: true,
            default: ""
        },

        role: {
            type: String,
            enum: ["admin", "doctor", "receptionist"],
            default: "receptionist"
        },

        department: {
            type: String,
            default: ""
        },

        profileImage: {
            type: String,
            default: ""
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);