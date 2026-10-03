const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        reportId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },

        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        reportTitle: {
            type: String,
            required: true,
            trim: true
        },

        reportType: {
            type: String,
            enum: [
                "Blood Test",
                "X-Ray",
                "MRI",
                "CT Scan",
                "ECG",
                "Prescription",
                "Discharge Summary",
                "Medical Certificate",
                "Other"
            ],
            default: "Other"
        },

        diagnosis: {
            type: String,
            default: ""
        },

        findings: {
            type: String,
            default: ""
        },

        remarks: {
            type: String,
            default: ""
        },

        reportFile: {
            type: String,
            default: ""
        },

        reportStatus: {
            type: String,
            enum: [
                "Pending",
                "Processing",
                "Completed"
            ],
            default: "Pending"
        },

        reportDate: {
            type: Date,
            default: Date.now
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Report", reportSchema);