const express = require("express");

const router = express.Router();

const {

    getDashboardAnalytics,

    getRecentActivities,

    getMonthlyRevenueAnalytics,

    getDepartmentPatients,

    getDepartmentDoctors,

    getAppointmentStatusAnalytics,

    getMonthlyAppointments,

    getMonthlyReports,

    getGenderAnalytics,

    getBloodGroupAnalytics

} = require("../controllers/analyticsController");

const {

    protect,

    adminOnly

} = require("../middleware/authMiddleware");


// Dashboard
router.get(
    "/dashboard",
    protect,
    getDashboardAnalytics
);

// Recent Activity
router.get(
    "/recent",
    protect,
    getRecentActivities
);

// Revenue
router.get(
    "/monthly-revenue",
    protect,
    getMonthlyRevenueAnalytics
);

// Patient Department Analytics
router.get(
    "/patient-departments",
    protect,
    getDepartmentPatients
);

// Doctor Department Analytics
router.get(
    "/doctor-departments",
    protect,
    getDepartmentDoctors
);

// Appointment Status
router.get(
    "/appointment-status",
    protect,
    getAppointmentStatusAnalytics
);

// Monthly Appointments
router.get(
    "/monthly-appointments",
    protect,
    getMonthlyAppointments
);

// Monthly Reports
router.get(
    "/monthly-reports",
    protect,
    getMonthlyReports
);

// Gender Analytics
router.get(
    "/gender",
    protect,
    getGenderAnalytics
);

// Blood Group Analytics
router.get(
    "/blood-groups",
    protect,
    getBloodGroupAnalytics
);

module.exports = router;