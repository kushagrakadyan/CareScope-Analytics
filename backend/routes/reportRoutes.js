const express = require("express");

const router = express.Router();

const {

    createReport,

    getAllReports,

    getReportById,

    updateReport,

    deleteReport,

    getPatientReports,

    getDoctorReports,

    searchReports,

    getRecentReports,

    getReportStatistics,

    getReportTypeStatistics,

    downloadReport,

    getMonthlyReportAnalytics,

    deletePatientReports,

    getReportDashboard

} = require("../controllers/reportController");

const {

    protect,

    adminOnly,

    adminOrDoctor

} = require("../middleware/authMiddleware");

/*
===========================================================
                    REPORT ROUTES
===========================================================
*/


// ==============================================
// Dashboard
// ==============================================

router.get(
    "/dashboard",
    protect,
    getReportDashboard
);


// ==============================================
// Statistics
// ==============================================

router.get(
    "/stats",
    protect,
    getReportStatistics
);


// ==============================================
// Report Type Statistics
// ==============================================

router.get(
    "/type-stats",
    protect,
    getReportTypeStatistics
);


// ==============================================
// Monthly Analytics
// ==============================================

router.get(
    "/monthly-analytics",
    protect,
    adminOnly,
    getMonthlyReportAnalytics
);


// ==============================================
// Recent Reports
// ==============================================

router.get(
    "/recent",
    protect,
    getRecentReports
);


// ==============================================
// Search Reports
// ==============================================

router.get(
    "/search",
    protect,
    searchReports
);


// ==============================================
// Get All Reports
// ==============================================

router.get(
    "/",
    protect,
    getAllReports
);


// ==============================================
// Patient Reports
// ==============================================

router.get(
    "/patient/:patientId",
    protect,
    getPatientReports
);


// ==============================================
// Doctor Reports
// ==============================================

router.get(
    "/doctor/:doctorId",
    protect,
    getDoctorReports
);


// ==============================================
// Download Report
// ==============================================

router.get(
    "/download/:id",
    protect,
    downloadReport
);


// ==============================================
// Get Report By ID
// ==============================================

router.get(
    "/:id",
    protect,
    getReportById
);


// ==============================================
// Create Report
// ==============================================

router.post(
    "/",
    protect,
    adminOrDoctor,
    createReport
);


// ==============================================
// Update Report
// ==============================================

router.put(
    "/:id",
    protect,
    adminOrDoctor,
    updateReport
);


// ==============================================
// Delete Report
// ==============================================

router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteReport
);


// ==============================================
// Delete Patient Reports
// ==============================================

router.delete(
    "/patient/:patientId",
    protect,
    adminOnly,
    deletePatientReports
);

module.exports = router;