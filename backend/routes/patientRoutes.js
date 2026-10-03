const express = require("express");

const router = express.Router();

const {

    addPatient,

    getAllPatients,

    getPatientById,

    updatePatient,

    dischargePatient,

    deletePatient,

    getPatientStatistics

} = require("../controllers/patientController");

const {
    protect,
    adminOnly,
    doctorOnly,
    receptionistOnly,
    adminOrReceptionist,
    adminDoctorOrReceptionist,
    adminOrDoctor
} = require("../middleware/authMiddleware");

/*
===========================================================
                    PATIENT ROUTES
===========================================================
*/


// ===============================================
// Dashboard Statistics
// ===============================================

router.get(
    "/stats",
    protect,
    getPatientStatistics
);


// ===============================================
// Get All Patients
// ===============================================

router.get(
    "/",
    protect,
    getAllPatients
);


// ===============================================
// Get Patient By ID
// ===============================================

router.get(
    "/:id",
    protect,
    getPatientById
);


// ===============================================
// Add New Patient
// ===============================================

router.post(
    "/",
    protect,
    adminDoctorOrReceptionist,
    addPatient
);


// ===============================================
// Update Patient
// ===============================================

router.put(
    "/:id",
    protect,
    adminDoctorOrReceptionist,
    updatePatient
);


// ===============================================
// Discharge Patient
// ===============================================

router.put(
    "/:id/discharge",
    protect,
    adminOrDoctor,
    dischargePatient
);


// ===============================================
// Delete Patient
// ===============================================

router.delete(
    "/:id",
    protect,
    adminOnly,
    deletePatient
);


module.exports = router;