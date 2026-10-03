const User = require("../models/User");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Report = require("../models/Report");

/*
===========================================================
@desc    Hospital Dashboard Analytics
@route   GET /api/analytics/dashboard
@access  Admin
===========================================================
*/

const getDashboardAnalytics = async (req, res) => {

    try {

        const totalUsers =
            await User.countDocuments();

        const totalDoctors =
            await User.countDocuments({
                role: "doctor"
            });

        const totalReceptionists =
            await User.countDocuments({
                role: "receptionist"
            });

        const totalPatients =
            await Patient.countDocuments();

        const totalAppointments =
            await Appointment.countDocuments();

        const totalReports =
            await Report.countDocuments();

        const activeAppointments =
            await Appointment.countDocuments({
                status: "Scheduled"
            });

        const completedAppointments =
            await Appointment.countDocuments({
                status: "Completed"
            });

        const cancelledAppointments =
            await Appointment.countDocuments({
                status: "Cancelled"
            });

        const criticalPatients = await Patient.countDocuments({ status: "Critical" });

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

            analytics: {

                totalUsers,

                totalDoctors,

                totalReceptionists,

                totalPatients,

                totalAppointments,

                totalReports,

                activeAppointments,

                completedAppointments,

                cancelledAppointments,

                criticalPatients,

                completionRate: totalAppointments ? Math.round((completedAppointments / totalAppointments) * 100) : 0,

                totalRevenue:

                    revenue.length

                        ? revenue[0].totalRevenue

                        : 0

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
@desc    Recent Activities
@route   GET /api/analytics/recent
@access  Admin
===========================================================
*/

const getRecentActivities = async (req, res) => {

    try {

        const recentPatients =
            await Patient.find()

            .sort({

                createdAt: -1

            })

            .limit(5);

        const recentAppointments =
            await Appointment.find()

            .populate(
                "patient",
                "firstName lastName"
            )

            .populate(
                "doctor",
                "fullName"
            )

            .sort({

                createdAt: -1

            })

            .limit(5);

        const recentReports =
            await Report.find()

            .populate(
                "patient",
                "firstName lastName"
            )

            .sort({

                createdAt: -1

            })

            .limit(5);

        return res.status(200).json({

            success: true,

            recentPatients,

            recentAppointments,

            recentReports

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
@desc    Monthly Revenue Analytics
@route   GET /api/analytics/monthly-revenue
@access  Admin
===========================================================
*/

const getMonthlyRevenueAnalytics = async (req, res) => {

    try {

        const revenue = await Appointment.aggregate([

            {
                $match: {
                    paymentStatus: "Paid"
                }
            },

            {
                $group: {

                    _id: {

                        month: {

                            $month: "$appointmentDate"

                        },

                        year: {

                            $year: "$appointmentDate"

                        }

                    },

                    revenue: {

                        $sum: "$consultationFee"

                    }

                }

            },

            {

                $sort: {

                    "_id.year": 1,

                    "_id.month": 1

                }

            }

        ]);

        return res.status(200).json({

            success: true,

            revenue

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
@desc    Department Wise Patients
@route   GET /api/analytics/patient-departments
@access  Admin
===========================================================
*/

const getDepartmentPatients = async (req, res) => {

    try {

        const statistics = await Patient.aggregate([

            {

                $group: {

                    _id: "$department",

                    totalPatients: {

                        $sum: 1

                    }

                }

            },

            {

                $sort: {

                    totalPatients: -1

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



/*
===========================================================
@desc    Department Wise Doctors
@route   GET /api/analytics/doctor-departments
@access  Admin
===========================================================
*/

const getDepartmentDoctors = async (req, res) => {

    try {

        const statistics = await User.aggregate([

            {

                $match: {

                    role: "doctor"

                }

            },

            {

                $group: {

                    _id: "$department",

                    totalDoctors: {

                        $sum: 1

                    }

                }

            },

            {

                $sort: {

                    totalDoctors: -1

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



/*
===========================================================
@desc    Appointment Status Analytics
@route   GET /api/analytics/appointment-status
@access  Admin
===========================================================
*/

const getAppointmentStatusAnalytics = async (req, res) => {

    try {

        const statistics = await Appointment.aggregate([

            {

                $group: {

                    _id: "$status",

                    total: {

                        $sum: 1

                    }

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
/*
===========================================================
@desc    Monthly Appointments Analytics
@route   GET /api/analytics/monthly-appointments
@access  Admin
===========================================================
*/

const getMonthlyAppointments = async (req, res) => {

    try {

        const analytics = await Appointment.aggregate([

            {

                $group: {

                    _id: {

                        month: {

                            $month: "$appointmentDate"

                        },

                        year: {

                            $year: "$appointmentDate"

                        }

                    },

                    totalAppointments: {

                        $sum: 1

                    }

                }

            },

            {

                $sort: {

                    "_id.year": 1,

                    "_id.month": 1

                }

            }

        ]);

        return res.status(200).json({

            success: true,

            analytics

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
@desc    Monthly Reports Analytics
@route   GET /api/analytics/monthly-reports
@access  Admin
===========================================================
*/

const getMonthlyReports = async (req, res) => {

    try {

        const analytics = await Report.aggregate([

            {

                $group: {

                    _id: {

                        month: {

                            $month: "$createdAt"

                        },

                        year: {

                            $year: "$createdAt"

                        }

                    },

                    totalReports: {

                        $sum: 1

                    }

                }

            },

            {

                $sort: {

                    "_id.year": 1,

                    "_id.month": 1

                }

            }

        ]);

        return res.status(200).json({

            success: true,

            analytics

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
@desc    Gender Analytics
@route   GET /api/analytics/gender
@access  Admin
===========================================================
*/

const getGenderAnalytics = async (req, res) => {

    try {

        const analytics = await Patient.aggregate([

            {

                $group: {

                    _id: "$gender",

                    totalPatients: {

                        $sum: 1

                    }

                }

            }

        ]);

        return res.status(200).json({

            success: true,

            analytics

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
@desc    Blood Group Analytics
@route   GET /api/analytics/blood-groups
@access  Admin
===========================================================
*/

const getBloodGroupAnalytics = async (req, res) => {

    try {

        const analytics = await Patient.aggregate([

            {

                $group: {

                    _id: "$bloodGroup",

                    totalPatients: {

                        $sum: 1

                    }

                }

            },

            {

                $sort: {

                    totalPatients: -1

                }

            }

        ]);

        return res.status(200).json({

            success: true,

            analytics

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
};