const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
    {
        totalPatients: {
            type: Number,
            default: 0
        },

        totalDoctors: {
            type: Number,
            default: 0
        },

        totalReceptionists: {
            type: Number,
            default: 0
        },

        totalAppointments: {
            type: Number,
            default: 0
        },

        totalReports: {
            type: Number,
            default: 0
        },

        totalRevenue: {
            type: Number,
            default: 0
        },

        completedAppointments: {
            type: Number,
            default: 0
        },

        cancelledAppointments: {
            type: Number,
            default: 0
        },

        pendingReports: {
            type: Number,
            default: 0
        },

        completedReports: {
            type: Number,
            default: 0
        },

        activePatients: {
            type: Number,
            default: 0
        },

        dischargedPatients: {
            type: Number,
            default: 0
        },

        monthlyRevenue: [
            {
                month: String,
                revenue: Number
            }
        ],

        monthlyAppointments: [
            {
                month: String,
                total: Number
            }
        ],

        departmentStatistics: [
            {
                department: String,
                doctors: Number,
                patients: Number
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Analytics", analyticsSchema);