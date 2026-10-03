const Patient = require("../models/Patient");
const Report = require("../models/Report");

/*
===========================================================
@desc    Create Medical Report
@route   POST /api/reports
@access  Doctor / Admin
===========================================================
*/

const createReport = async (req, res) => {

    try {

        const {

            reportId,

            patient,

            doctor,

            reportTitle,

            reportType,

            diagnosis,

            findings,

            remarks,

            reportStatus

        } = req.body;

        // ==========================================

        if (
            !reportId ||
            !patient ||
            !doctor ||
            !reportTitle
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please fill all required fields."

            });

        }

        // ==========================================

        const existingReport =
            await Report.findOne({

                reportId

            });

        if (existingReport) {

            return res.status(409).json({

                success: false,

                message:
                    "Report ID already exists."

            });

        }

        // ==========================================

        const report =
            await Report.create({

                reportId,

                patient,

                doctor,

                reportTitle,

                reportType,

                diagnosis,

                findings,

                remarks,

                reportStatus,

                reportFile:
                    req.file
                        ? req.file.path
                        : "",

                createdBy:
                    req.user._id

            });

        await Patient.findByIdAndUpdate(
            patient,
            { $addToSet: { reports: report._id } }
        );

        return res.status(201).json({

            success: true,

            message:
                "Medical report created successfully.",

            report

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
@desc    Get All Reports
@route   GET /api/reports
@access  Private
===========================================================
*/

const getAllReports = async (req, res) => {

    try {

        let page =
            Number(req.query.page) || 1;

        let limit =
            Number(req.query.limit) || 10;

        let reportType =
            req.query.reportType || "";

        let reportStatus =
            req.query.reportStatus || "";

        const query = {};

        if (reportType) {

            query.reportType =
                reportType;

        }

        if (reportStatus) {

            query.reportStatus =
                reportStatus;

        }

        const totalReports =
            await Report.countDocuments(query);

        const reports =
            await Report.find(query)

                .populate(
                    "patient",
                    "patientId firstName lastName"
                )

                .populate(
                    "doctor",
                    "fullName"
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

            totalReports,

            currentPage: page,

            totalPages:
                Math.ceil(
                    totalReports / limit
                ),

            reports

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
@desc    Get Report By ID
@route   GET /api/reports/:id
@access  Private
===========================================================
*/

const getReportById = async (req, res) => {

    try {

        const report =
            await Report.findById(
                req.params.id
            )

            .populate("patient")

            .populate("doctor")

            .populate(
                "createdBy",
                "fullName role"
            );

        if (!report) {

            return res.status(404).json({

                success: false,

                message:
                    "Report not found."

            });

        }

        return res.status(200).json({

            success: true,

            report

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
@desc    Update Medical Report
@route   PUT /api/reports/:id
@access  Doctor / Admin
===========================================================
*/

const updateReport = async (req, res) => {

    try {

        const report = await Report.findById(req.params.id);

        if (!report) {

            return res.status(404).json({

                success: false,

                message: "Report not found."

            });

        }

        const fields = [

            "reportTitle",

            "reportType",

            "diagnosis",

            "findings",

            "remarks",

            "reportStatus"

        ];

        fields.forEach(field => {

            if (req.body[field] !== undefined) {

                report[field] = req.body[field];

            }

        });

        if (req.file) {

            report.reportFile = req.file.path;

        }

        await report.save();

        return res.status(200).json({

            success: true,

            message: "Report updated successfully.",

            report

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
@desc    Delete Report
@route   DELETE /api/reports/:id
@access  Admin
===========================================================
*/

const deleteReport = async (req, res) => {

    try {

        const report = await Report.findById(req.params.id);

        if (!report) {

            return res.status(404).json({

                success: false,

                message: "Report not found."

            });

        }

        await Patient.findByIdAndUpdate(

            report.patient,

            {

                $pull: {

                    reports: report._id

                }

            }

        );

        await report.deleteOne();

        return res.status(200).json({

            success: true,

            message: "Report deleted successfully."

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
@desc    Get Reports By Patient
@route   GET /api/reports/patient/:patientId
@access  Private
===========================================================
*/

const getPatientReports = async (req, res) => {

    try {

        const reports = await Report.find({

            patient: req.params.patientId

        })

        .populate("doctor", "fullName")

        .sort({

            createdAt: -1

        });

        return res.status(200).json({

            success: true,

            totalReports: reports.length,

            reports

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
@desc    Get Reports By Doctor
@route   GET /api/reports/doctor/:doctorId
@access  Private
===========================================================
*/

const getDoctorReports = async (req, res) => {

    try {

        const reports = await Report.find({

            doctor: req.params.doctorId

        })

        .populate(

            "patient",

            "patientId firstName lastName"

        )

        .sort({

            createdAt: -1

        });

        return res.status(200).json({

            success: true,

            totalReports: reports.length,

            reports

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
@desc    Search Reports
@route   GET /api/reports/search
@access  Private
===========================================================
*/

const searchReports = async (req, res) => {

    try {

        const {

            reportType,

            reportStatus,

            diagnosis

        } = req.query;

        const query = {};

        if (reportType) {

            query.reportType = reportType;

        }

        if (reportStatus) {

            query.reportStatus = reportStatus;

        }

        if (diagnosis) {

            query.diagnosis = {

                $regex: diagnosis,

                $options: "i"

            };

        }

        const reports = await Report.find(query)

            .populate(
                "patient",
                "patientId firstName lastName"
            )

            .populate(
                "doctor",
                "fullName"
            )

            .sort({
                createdAt: -1
            });

        return res.status(200).json({

            success: true,

            totalReports: reports.length,

            reports

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
@desc    Recent Reports
@route   GET /api/reports/recent
@access  Private
===========================================================
*/

const getRecentReports = async (req, res) => {

    try {

        const reports = await Report.find()

            .populate(
                "patient",
                "patientId firstName lastName"
            )

            .populate(
                "doctor",
                "fullName"
            )

            .sort({

                createdAt: -1

            })

            .limit(10);

        return res.status(200).json({

            success: true,

            reports

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
@desc    Report Statistics
@route   GET /api/reports/stats
@access  Private
===========================================================
*/

const getReportStatistics = async (req, res) => {

    try {

        const totalReports =
            await Report.countDocuments();

        const pending =
            await Report.countDocuments({

                reportStatus: "Pending"

            });

        const processing =
            await Report.countDocuments({

                reportStatus: "Processing"

            });

        const completed =
            await Report.countDocuments({

                reportStatus: "Completed"

            });

        return res.status(200).json({

            success: true,

            statistics: {

                totalReports,

                pending,

                processing,

                completed

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
@desc    Report Type Statistics
@route   GET /api/reports/type-stats
@access  Private
===========================================================
*/

const getReportTypeStatistics = async (req, res) => {

    try {

        const statistics =
            await Report.aggregate([

                {

                    $group: {

                        _id: "$reportType",

                        totalReports: {

                            $sum: 1

                        }

                    }

                },

                {

                    $sort: {

                        totalReports: -1

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
@desc    Download Report
@route   GET /api/reports/download/:id
@access  Private
===========================================================
*/

const downloadReport = async (req, res) => {

    try {

        const report = await Report.findById(req.params.id);

        if (!report) {

            return res.status(404).json({

                success: false,

                message: "Report not found."

            });

        }

        if (!report.reportFile) {

            return res.status(404).json({

                success: false,

                message: "No report file available."

            });

        }

        return res.download(report.reportFile);

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
@desc    Monthly Report Analytics
@route   GET /api/reports/monthly-analytics
@access  Admin
===========================================================
*/

const getMonthlyReportAnalytics = async (req, res) => {

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
@desc    Delete All Reports of Patient
@route   DELETE /api/reports/patient/:patientId
@access  Admin
===========================================================
*/

const deletePatientReports = async (req, res) => {

    try {

        const patientId = req.params.patientId;

        await Report.deleteMany({

            patient: patientId

        });

        await Patient.findByIdAndUpdate(

            patientId,

            {

                $set: {

                    reports: []

                }

            }

        );

        return res.status(200).json({

            success: true,

            message:
                "All reports deleted successfully."

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
@desc    Report Dashboard Summary
@route   GET /api/reports/dashboard
@access  Private
===========================================================
*/

const getReportDashboard = async (req, res) => {

    try {

        const totalReports =
            await Report.countDocuments();

        const latestReports =
            await Report.find()

                .sort({

                    createdAt: -1

                })

                .limit(5)

                .populate(

                    "patient",

                    "firstName lastName"

                )

                .populate(

                    "doctor",

                    "fullName"

                );

        return res.status(200).json({

            success: true,

            dashboard: {

                totalReports,

                latestReports

            }

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
module.exports = {
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
};