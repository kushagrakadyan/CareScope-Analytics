const Patient = require("../models/Patient");

/*
===========================================================
@desc    Add New Patient
@route   POST /api/patients
@access  Admin / Receptionist
===========================================================
*/

const addPatient = async (req, res) => {

    try {

        const {

            patientId,

            firstName,

            lastName,

            age,

            gender,

            dateOfBirth,

            bloodGroup,

            phone,

            email,

            address,

            emergencyContactName,

            emergencyContactNumber,

            department,

            assignedDoctor,

            diagnosis,

            allergies,

            medications,

            medicalHistory,

            admissionDate,

            dischargeDate,

            status

        } = req.body;

        // Blank optional strings -> undefined (blank bloodGroup etc. would break enum validation)
        const clean = (v) => (typeof v === "string" ? v.trim() : v);
        const opt = (v) => (clean(v) === "" || clean(v) === null ? undefined : clean(v));

        // ==========================================
        // Required Field Validation
        // ==========================================

        if (
            !patientId ||
            !firstName ||
            !lastName ||
            age === undefined || age === null || age === "" ||
            !gender ||
            !phone ||
            !department ||
            !assignedDoctor
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please fill all required fields."

            });

        }

        // ==========================================
        // Duplicate Patient ID
        // ==========================================

        const existingPatient =
            await Patient.findOne({

                patientId

            });

        if (existingPatient) {

            return res.status(409).json({

                success: false,

                message:
                    "Patient ID already exists."

            });

        }

        // ==========================================
        // Create Patient
        // ==========================================

        const patient =
            await Patient.create({

                patientId,

                firstName,

                lastName,

                age,

                gender,

                dateOfBirth: opt(dateOfBirth),

                bloodGroup: opt(bloodGroup),

                phone,

                email: opt(email),

                address: opt(address),

                emergencyContactName: opt(emergencyContactName),

                emergencyContactNumber: opt(emergencyContactNumber),

                department,

                assignedDoctor,

                diagnosis: opt(diagnosis),

                allergies,

                medications,

                medicalHistory: opt(medicalHistory),

                admissionDate: opt(admissionDate),

                dischargeDate: opt(dischargeDate),

                status: opt(status),

                createdBy: req.user._id

            });

        return res.status(201).json({

            success: true,

            message:
                "Patient registered successfully.",

            patient

        });

    }

    catch (error) {

        console.error(error);

        if (error.name === "ValidationError") {
            return res.status(400).json({ success: false, message: Object.values(error.errors).map(e => e.message).join(", ") });
        }
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "Patient ID already exists." });
        }

        return res.status(500).json({

            success: false,

            message: process.env.NODE_ENV === "production" ? "Internal Server Error" : "Server error: " + error.message

        });

    }

};



/*
===========================================================
@desc    Get All Patients
@route   GET /api/patients
@access  Private
===========================================================
*/

const getAllPatients = async (req, res) => {

    try {

        let page =
            Number(req.query.page) || 1;

        let limit =
            Number(req.query.limit) || 10;

        let search =
            req.query.search || "";

        let department =
            req.query.department || "";

        let status =
            req.query.status || "";

        const query = {};

        // ==========================================

        if (search) {

            query.$or = [

                {
                    firstName: {

                        $regex: search,

                        $options: "i"

                    }

                },

                {
                    lastName: {

                        $regex: search,

                        $options: "i"

                    }

                },

                {
                    patientId: {

                        $regex: search,

                        $options: "i"

                    }

                }

            ];

        }

        // ==========================================

        if (department) {

            query.department =
                department;

        }

        if (status) {

            query.status =
                status;

        }

        // ==========================================

        const totalPatients =
            await Patient.countDocuments(query);

        const patients =
            await Patient.find(query)

                .populate(
                    "createdBy",
                    "fullName role"
                )

                .sort({
                    createdAt: -1
                })

                .skip(
                    (page - 1) * limit
                )

                .limit(limit);

        return res.status(200).json({

            success: true,

            totalPatients,

            currentPage: page,

            totalPages:
                Math.ceil(
                    totalPatients / limit
                ),

            patients

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};



/*
===========================================================
@desc    Get Patient By ID
@route   GET /api/patients/:id
@access  Private
===========================================================
*/

const getPatientById = async (req, res) => {

    try {

        const patient =
            await Patient.findById(
                req.params.id
            )

                .populate(
                    "createdBy",
                    "fullName role"
                )

                .populate(
                    "reports"
                );

        if (!patient) {

            return res.status(404).json({

                success: false,

                message:
                    "Patient not found."

            });

        }

        return res.status(200).json({

            success: true,

            patient

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};



/*
===========================================================
@desc    Update Patient
@route   PUT /api/patients/:id
@access  Admin / Receptionist
===========================================================
*/

const updatePatient = async (req, res) => {

    try {

        const patient = await Patient.findById(req.params.id);

        if (!patient) {

            return res.status(404).json({

                success: false,

                message: "Patient not found."

            });

        }

        const fields = [

            "firstName",
            "lastName",
            "age",
            "gender",
            "dateOfBirth",
            "bloodGroup",
            "phone",
            "email",
            "address",
            "emergencyContactName",
            "emergencyContactNumber",
            "department",
            "assignedDoctor",
            "diagnosis",
            "allergies",
            "medications",
            "medicalHistory",
            "admissionDate",
            "dischargeDate",
            "status"

        ];

        fields.forEach(field => {

            if (req.body[field] !== undefined) {

                patient[field] = req.body[field];

            }

        });

        if (req.file) {

            patient.profileImage = req.file.path;

        }

        await patient.save();

        return res.status(200).json({

            success: true,

            message: "Patient updated successfully.",

            patient

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
@desc    Discharge Patient
@route   PUT /api/patients/:id/discharge
@access  Doctor / Admin
===========================================================
*/

const dischargePatient = async (req, res) => {

    try {

        const patient = await Patient.findById(req.params.id);

        if (!patient) {

            return res.status(404).json({

                success: false,

                message: "Patient not found."

            });

        }

        patient.status = "Discharged";

        patient.dischargeDate = new Date();

        await patient.save();

        return res.status(200).json({

            success: true,

            message: "Patient discharged successfully.",

            patient

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
@desc    Delete Patient
@route   DELETE /api/patients/:id
@access  Admin
===========================================================
*/

const deletePatient = async (req, res) => {

    try {

        const patient = await Patient.findById(req.params.id);

        if (!patient) {

            return res.status(404).json({

                success: false,

                message: "Patient not found."

            });

        }

        await patient.deleteOne();

        return res.status(200).json({

            success: true,

            message: "Patient deleted successfully."

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
@desc    Patient Statistics
@route   GET /api/patients/stats
@access  Private
===========================================================
*/

const getPatientStatistics = async (req, res) => {

    try {

        const totalPatients =
            await Patient.countDocuments();

        const healthy =
            await Patient.countDocuments({
                status: "Healthy"
            });

        const recovering =
            await Patient.countDocuments({
                status: "Recovering"
            });

        const observation =
            await Patient.countDocuments({
                status: "Observation"
            });

        const critical =
            await Patient.countDocuments({
                status: "Critical"
            });

        const discharged =
            await Patient.countDocuments({
                status: "Discharged"
            });

        return res.status(200).json({

            success: true,

            statistics: {

                totalPatients,

                healthy,

                recovering,

                observation,

                critical,

                discharged

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
module.exports = {
    addPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    dischargePatient,
    deletePatient,
    getPatientStatistics
};