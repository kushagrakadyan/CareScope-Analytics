const express = require("express");

const router = express.Router();

const {

    createAppointment,

    getAllAppointments,

    getAppointmentById,

    updateAppointment,

    completeAppointment,

    cancelAppointment,

    deleteAppointment,

    getTodayAppointments,

    getUpcomingAppointments,

    searchAppointments,

    getAppointmentStatistics,

    rescheduleAppointment,

    checkDoctorAvailability,

    getMonthlyRevenue,

    getDepartmentStatistics

} = require("../controllers/appointmentController");

const {

    protect,

    adminOnly,

    doctorOnly,

    receptionistOnly,

    adminOrDoctor,
    adminDoctorOrReceptionist

} = require("../middleware/authMiddleware");

/*
===========================================================
                APPOINTMENT ROUTES
===========================================================
*/


// ==============================================
// Statistics
// ==============================================

router.get(
    "/stats",
    protect,
    getAppointmentStatistics
);


// ==============================================
// Revenue
// ==============================================

router.get(
    "/revenue",
    protect,
    adminOnly,
    getMonthlyRevenue
);


// ==============================================
// Department Statistics
// ==============================================

router.get(
    "/department-stats",
    protect,
    adminOnly,
    getDepartmentStatistics
);


// ==============================================
// Today's Appointments
// ==============================================

router.get(
    "/today",
    protect,
    getTodayAppointments
);


// ==============================================
// Upcoming Appointments
// ==============================================

router.get(
    "/upcoming",
    protect,
    getUpcomingAppointments
);


// ==============================================
// Search
// ==============================================

router.get(
    "/search",
    protect,
    searchAppointments
);


// ==============================================
// Get All
// ==============================================

router.get(
    "/",
    protect,
    getAllAppointments
);


// ==============================================
// Get By Id
// ==============================================

router.get(
    "/:id",
    protect,
    getAppointmentById
);


// ==============================================
// Create Appointment
// ==============================================

router.post(
    "/",
    protect,
    adminDoctorOrReceptionist,
    createAppointment
);


// ==============================================
// Check Slot
// ==============================================

router.post(
    "/check-slot",
    protect,
    receptionistOnly,
    checkDoctorAvailability
);


// ==============================================
// Update Appointment
// ==============================================

router.put(
    "/:id",
    protect,
    adminDoctorOrReceptionist,
    updateAppointment
);


// ==============================================
// Complete Appointment
// ==============================================

router.put(
    "/:id/complete",
    protect,
    doctorOnly,
    completeAppointment
);


// ==============================================
// Cancel Appointment
// ==============================================

router.put(
    "/:id/cancel",
    protect,
    adminOrDoctor,
    cancelAppointment
);


// ==============================================
// Reschedule Appointment
// ==============================================

router.put(
    "/:id/reschedule",
    protect,
    adminDoctorOrReceptionist,
    rescheduleAppointment
);


// ==============================================
// Delete Appointment
// ==============================================

router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteAppointment
);

module.exports = router;