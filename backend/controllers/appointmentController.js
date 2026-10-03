const Appointment = require("../models/Appointment");

/*
===========================================================
@desc    Create New Appointment
@route   POST /api/appointments
@access  Receptionist / Admin
===========================================================
*/

const createAppointment = async (req, res) => {

    try {

        const {

            appointmentId,

            patient,

            doctor,

            department,

            appointmentDate,

            appointmentTime,

            appointmentType,

            symptoms,

            consultationFee

        } = req.body;

        // ==========================================

        if (
            !appointmentId ||
            !patient ||
            !doctor ||
            !department ||
            !appointmentDate ||
            !appointmentTime
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please fill all required fields."

            });

        }

        // ==========================================

        const existingAppointment =
            await Appointment.findOne({

                appointmentId

            });

        if (existingAppointment) {

            return res.status(409).json({

                success: false,

                message:
                    "Appointment ID already exists."

            });

        }

        // ==========================================

        const appointment =
            await Appointment.create({

                appointmentId,

                patient,

                doctor,

                department,

                appointmentDate,

                appointmentTime,

                appointmentType,

                symptoms,

                consultationFee,

                createdBy: req.user._id

            });

        return res.status(201).json({

            success: true,

            message:
                "Appointment created successfully.",

            appointment

        });

    }

    catch (error) {

        console.error(error);

        if (error.name === "ValidationError") {
            return res.status(400).json({ success: false, message: Object.values(error.errors).map(e => e.message).join(", ") });
        }
        if (error.name === "CastError") {
            return res.status(400).json({ success: false, message: "Invalid " + error.path + " selected." });
        }
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "Appointment ID already exists." });
        }

        return res.status(500).json({

            success: false,

            message: process.env.NODE_ENV === "production" ? "Internal Server Error" : "Server error: " + error.message

        });

    }

};



/*
===========================================================
@desc    Get All Appointments
@route   GET /api/appointments
@access  Private
===========================================================
*/

const getAllAppointments = async (req, res) => {

    try {

        let page =
            Number(req.query.page) || 1;

        let limit =
            Number(req.query.limit) || 10;

        let status =
            req.query.status || "";

        let department =
            req.query.department || "";

        const query = {};

        if (status) {

            query.status = status;

        }

        if (department) {

            query.department = department;

        }

        const totalAppointments =
            await Appointment.countDocuments(query);

        const appointments =
            await Appointment.find(query)

                .populate(
                    "patient",
                    "patientId firstName lastName"
                )

                .populate(
                    "doctor",
                    "fullName"
                )

                .sort({
                    appointmentDate: -1
                })

                .skip(
                    (page - 1) * limit
                )

                .limit(limit);

        return res.status(200).json({

            success: true,

            totalAppointments,

            currentPage: page,

            totalPages:
                Math.ceil(
                    totalAppointments / limit
                ),

            appointments

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
@desc    Get Appointment By ID
@route   GET /api/appointments/:id
@access  Private
===========================================================
*/

const getAppointmentById = async (req, res) => {

    try {

        const appointment =
            await Appointment.findById(
                req.params.id
            )

                .populate("patient")

                .populate("doctor");

        if (!appointment) {

            return res.status(404).json({

                success: false,

                message:
                    "Appointment not found."

            });

        }

        return res.status(200).json({

            success: true,

            appointment

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
@desc    Update Appointment
@route   PUT /api/appointments/:id
@access  Admin / Receptionist
===========================================================
*/

const updateAppointment = async (req, res) => {

    try {

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {

            return res.status(404).json({

                success: false,

                message: "Appointment not found."

            });

        }

        const fields = [

            "patient",

            "doctor",

            "department",

            "appointmentDate",

            "appointmentTime",

            "appointmentType",

            "status",

            "symptoms",

            "diagnosis",

            "prescription",

            "notes",

            "consultationFee",

            "paymentStatus"

        ];

        fields.forEach(field => {

            if (req.body[field] !== undefined) {

                appointment[field] = req.body[field];

            }

        });

        await appointment.save();

        return res.status(200).json({

            success: true,

            message: "Appointment updated successfully.",

            appointment

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
@desc    Complete Appointment
@route   PUT /api/appointments/:id/complete
@access  Doctor
===========================================================
*/

const completeAppointment = async (req, res) => {

    try {

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {

            return res.status(404).json({

                success: false,

                message: "Appointment not found."

            });

        }

        appointment.status = "Completed";

        await appointment.save();

        return res.status(200).json({

            success: true,

            message: "Appointment completed successfully.",

            appointment

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
@desc    Cancel Appointment
@route   PUT /api/appointments/:id/cancel
@access  Admin / Receptionist
===========================================================
*/

const cancelAppointment = async (req, res) => {

    try {

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {

            return res.status(404).json({

                success: false,

                message: "Appointment not found."

            });

        }

        appointment.status = "Cancelled";

        await appointment.save();

        return res.status(200).json({

            success: true,

            message: "Appointment cancelled successfully.",

            appointment

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
@desc    Delete Appointment
@route   DELETE /api/appointments/:id
@access  Admin
===========================================================
*/

const deleteAppointment = async (req, res) => {

    try {

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {

            return res.status(404).json({

                success: false,

                message: "Appointment not found."

            });

        }

        await appointment.deleteOne();

        return res.status(200).json({

            success: true,

            message: "Appointment deleted successfully."

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
@desc    Get Today's Appointments
@route   GET /api/appointments/today
@access  Private
===========================================================
*/

const getTodayAppointments = async (req, res) => {

    try {

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);

        tomorrow.setDate(today.getDate() + 1);

        const appointments = await Appointment.find({

            appointmentDate: {

                $gte: today,

                $lt: tomorrow

            }

        })

        .populate("patient", "firstName lastName patientId")

        .populate("doctor", "fullName")

        .sort({

            appointmentTime: 1

        });

        return res.status(200).json({

            success: true,

            totalAppointments: appointments.length,

            appointments

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
@desc    Get Upcoming Appointments
@route   GET /api/appointments/upcoming
@access  Private
===========================================================
*/

const getUpcomingAppointments = async (req, res) => {

    try {

        const today = new Date();

        const appointments = await Appointment.find({

            appointmentDate: {

                $gt: today

            }

        })

        .populate("patient", "firstName lastName")

        .populate("doctor", "fullName")

        .sort({

            appointmentDate: 1

        });

        return res.status(200).json({

            success: true,

            totalAppointments: appointments.length,

            appointments

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};



/*
===========================================================
@desc    Search Appointment
@route   GET /api/appointments/search
@access  Private
===========================================================
*/

const searchAppointments = async (req, res) => {

    try {

        const {

            status,

            department,

            paymentStatus

        } = req.query;

        const query = {};

        if (status) {

            query.status = status;

        }

        if (department) {

            query.department = department;

        }

        if (paymentStatus) {

            query.paymentStatus = paymentStatus;

        }

        const appointments = await Appointment.find(query)

        .populate("patient", "firstName lastName")

        .populate("doctor", "fullName");

        return res.status(200).json({

            success: true,

            totalAppointments: appointments.length,

            appointments

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};



/*
===========================================================
@desc    Appointment Statistics
@route   GET /api/appointments/stats
@access  Private
===========================================================
*/

const getAppointmentStatistics = async (req, res) => {

    try {

        const totalAppointments =
            await Appointment.countDocuments();

        const scheduled =
            await Appointment.countDocuments({

                status: "Scheduled"

            });

        const completed =
            await Appointment.countDocuments({

                status: "Completed"

            });

        const cancelled =
            await Appointment.countDocuments({

                status: "Cancelled"

            });

        const rescheduled =
            await Appointment.countDocuments({

                status: "Rescheduled"

            });

        const noShow =
            await Appointment.countDocuments({

                status: "No Show"

            });

        const paid =
            await Appointment.countDocuments({

                paymentStatus: "Paid"

            });

        const pending =
            await Appointment.countDocuments({

                paymentStatus: "Pending"

            });

        return res.status(200).json({

            success: true,

            statistics: {

                totalAppointments,

                scheduled,

                completed,

                cancelled,

                rescheduled,

                noShow,

                paid,

                pending

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

/*
===========================================================
@desc    Reschedule Appointment
@route   PUT /api/appointments/:id/reschedule
@access  Receptionist / Admin
===========================================================
*/

const rescheduleAppointment = async (req, res) => {

    try {

        const {

            appointmentDate,

            appointmentTime

        } = req.body;

        if (!appointmentDate || !appointmentTime) {

            return res.status(400).json({

                success: false,

                message: "Date and Time are required."

            });

        }

        const appointment =
            await Appointment.findById(req.params.id);

        if (!appointment) {

            return res.status(404).json({

                success: false,

                message: "Appointment not found."

            });

        }

        appointment.appointmentDate = appointmentDate;

        appointment.appointmentTime = appointmentTime;

        appointment.status = "Rescheduled";

        await appointment.save();

        return res.status(200).json({

            success: true,

            message: "Appointment rescheduled successfully.",

            appointment

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
@desc    Check Doctor Availability
@route   POST /api/appointments/check-slot
@access  Receptionist / Admin
===========================================================
*/

const checkDoctorAvailability = async (req, res) => {

    try {

        const {

            doctor,

            appointmentDate,

            appointmentTime

        } = req.body;

        const existingAppointment =
            await Appointment.findOne({

                doctor,

                appointmentDate,

                appointmentTime,

                status: {

                    $ne: "Cancelled"

                }

            });

        if (existingAppointment) {

            return res.status(409).json({

                success: false,

                available: false,

                message: "Doctor is already booked for this slot."

            });

        }

        return res.status(200).json({

            success: true,

            available: true,

            message: "Doctor is available."

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
@desc    Monthly Revenue
@route   GET /api/appointments/revenue
@access  Admin
===========================================================
*/

const getMonthlyRevenue = async (req, res) => {

    try {

        const revenue =
            await Appointment.aggregate([

                {

                    $match: {

                        paymentStatus: "Paid"

                    }

                },

                {

                    $group: {

                        _id: null,

                        totalRevenue: {

                            $sum: "$consultationFee"

                        }

                    }

                }

            ]);

        return res.status(200).json({

            success: true,

            totalRevenue:

                revenue.length
                    ? revenue[0].totalRevenue
                    : 0

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
@desc    Department Wise Appointment Count
@route   GET /api/appointments/department-stats
@access  Admin
===========================================================
*/

const getDepartmentStatistics = async (req, res) => {

    try {

        const statistics =
            await Appointment.aggregate([

                {

                    $group: {

                        _id: "$department",

                        totalAppointments: {

                            $sum: 1

                        }

                    }

                },

                {

                    $sort: {

                        totalAppointments: -1

                    }

                }

            ]);

        return res.status(200).json({

            success: true,

            statistics

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
};