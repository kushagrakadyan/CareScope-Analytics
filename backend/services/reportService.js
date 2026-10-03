const Report = require("../models/Report");

class ReportService {

    // Create Report
    async createReport(data) {

        return await Report.create(data);

    }

    // Get All Reports
    async getAllReports() {

        return await Report.find()

            .populate("patient")

            .populate("doctor")

            .sort({

                createdAt: -1

            });

    }

    // Get Report By ID
    async getReportById(id) {

        return await Report.findById(id)

            .populate("patient")

            .populate("doctor");

    }

    // Update Report
    async updateReport(id, data) {

        return await Report.findByIdAndUpdate(

            id,

            data,

            {

                new: true

            }

        );

    }

    // Delete Report
    async deleteReport(id) {

        return await Report.findByIdAndDelete(id);

    }

    // Patient Reports
    async getPatientReports(patientId) {

        return await Report.find({

            patient: patientId

        })

        .populate("doctor");

    }

    // Doctor Reports
    async getDoctorReports(doctorId) {

        return await Report.find({

            doctor: doctorId

        })

        .populate("patient");

    }

}

module.exports = new ReportService();