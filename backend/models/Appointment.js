const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        appointmentId: {
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

        department: {
            type: String,
            required: true,
            trim: true
        },

        appointmentDate: {
            type: Date,
            required: true
        },

        appointmentTime: {
            type: String,
            required: true
        },

        appointmentType: {
            type: String,
            enum: [
                "Consultation",
                "Follow-up",
                "Emergency",
                "Routine Checkup",
                "Surgery"
            ],
            default: "Consultation"
        },

        status: {
            type: String,
            enum: [
                "Scheduled",
                "Completed",
                "Cancelled",
                "Rescheduled",
                "No Show"
            ],
            default: "Scheduled"
        },

        symptoms: {
            type: String,
            default: ""
        },

        diagnosis: {
            type: String,
            default: ""
        },

        prescription: {
            type: String,
            default: ""
        },

        notes: {
            type: String,
            default: ""
        },

        consultationFee: {
            type: Number,
            default: 0
        },

        paymentStatus: {
            type: String,
            enum: [
                "Pending",
                "Paid",
                "Refunded"
            ],
            default: "Pending"
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

module.exports = mongoose.model("Appointment", appointmentSchema);