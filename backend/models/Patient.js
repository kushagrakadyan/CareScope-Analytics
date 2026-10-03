const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
    {
        patientId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        age: {
            type: Number,
            required: true,
            min: 0
        },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true
        },

        dateOfBirth: {
            type: Date
        },

        bloodGroup: {
            type: String,
            enum: [
                "A+",
                "A-",
                "B+",
                "B-",
                "AB+",
                "AB-",
                "O+",
                "O-"
            ]
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            lowercase: true,
            trim: true,
            default: ""
        },

        address: {
            type: String,
            default: ""
        },

        emergencyContactName: {
            type: String,
            default: ""
        },

        emergencyContactNumber: {
            type: String,
            default: ""
        },

        department: {
            type: String,
            required: true
        },

        assignedDoctor: {
            type: String,
            required: true
        },

        diagnosis: {
            type: String,
            default: ""
        },

        allergies: {
            type: [String],
            default: []
        },

        medications: {
            type: [String],
            default: []
        },

        medicalHistory: {
            type: String,
            default: ""
        },

        admissionDate: {
            type: Date,
            default: Date.now
        },

        dischargeDate: {
            type: Date
        },

        status: {
            type: String,
            enum: [
                "Healthy",
                "Recovering",
                "Observation",
                "Critical",
                "Discharged"
            ],
            default: "Healthy"
        },

        profileImage: {
            type: String,
            default: ""
        },

        reports: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Report"
            }
        ],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Patient", patientSchema);