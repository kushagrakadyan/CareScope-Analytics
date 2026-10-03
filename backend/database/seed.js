const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const connectDB = require("../config/db");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Report = require("../models/Report");

const seedDatabase = async () => {
    try {
        console.log("==================================");
        console.log("CareScope Database Seed");
        console.log("==================================");

        await connectDB();
        console.log("Cleaning Database...");
        await Promise.all([
            User.deleteMany({}),
            Patient.deleteMany({}),
            Appointment.deleteMany({}),
            Report.deleteMany({})
        ]);
        console.log("Collections Cleared.");

        const admin = await User.create({
            fullName: "Admin User",
            email: "admin@carescope.com",
            password: "admin123",
            phone: "9999999999",
            role: "admin",
            department: "Administration"
        });
        const doctor = await User.create({
            fullName: "Dr. Emma Watson",
            email: "doctor@carescope.com",
            password: "doctor123",
            phone: "8888888888",
            role: "doctor",
            department: "Cardiology"
        });
        const doctor2 = await User.create({
            fullName: "Dr. Alex Morgan",
            email: "alex@carescope.com",
            password: "alex12345",
            phone: "8888888887",
            role: "doctor",
            department: "Neurology"
        });
        const staff = await User.create({
            fullName: "Reception Staff",
            email: "staff@carescope.com",
            password: "staff123",
            phone: "7777777777",
            role: "receptionist",
            department: "Reception"
        });

        const patients = await Patient.insertMany([
            { patientId:"PAT1001", firstName:"Rahul", lastName:"Sharma", age:25, gender:"Male", bloodGroup:"O+", phone:"9876543210", email:"rahul@example.com", department:"Cardiology", assignedDoctor:doctor.fullName, diagnosis:"Chest Pain", status:"Recovering", createdBy:staff._id },
            { patientId:"PAT1002", firstName:"Priya", lastName:"Singh", age:30, gender:"Female", bloodGroup:"A+", phone:"9123456789", email:"priya@example.com", department:"Neurology", assignedDoctor:doctor2.fullName, diagnosis:"Migraine", status:"Healthy", createdBy:staff._id },
            { patientId:"PAT1003", firstName:"Aman", lastName:"Verma", age:42, gender:"Male", bloodGroup:"B+", phone:"9000000001", department:"Orthopedics", assignedDoctor:doctor.fullName, diagnosis:"Knee Pain", status:"Observation", createdBy:staff._id },
            { patientId:"PAT1004", firstName:"Neha", lastName:"Kapoor", age:19, gender:"Female", bloodGroup:"AB+", phone:"9000000002", department:"Pediatrics", assignedDoctor:doctor2.fullName, diagnosis:"Fever", status:"Healthy", createdBy:staff._id }
        ]);

        const now = new Date();
        const day = (offset) => new Date(now.getFullYear(), now.getMonth(), now.getDate()+offset);
        await Appointment.insertMany([
            { appointmentId:"APT1001", patient:patients[0]._id, doctor:doctor._id, department:"Cardiology", appointmentDate:day(0), appointmentTime:"10:00 AM", appointmentType:"Consultation", status:"Scheduled", consultationFee:500, paymentStatus:"Paid", createdBy:staff._id },
            { appointmentId:"APT1002", patient:patients[1]._id, doctor:doctor2._id, department:"Neurology", appointmentDate:day(0), appointmentTime:"12:00 PM", appointmentType:"Follow-up", status:"Scheduled", consultationFee:400, paymentStatus:"Pending", createdBy:staff._id },
            { appointmentId:"APT1003", patient:patients[2]._id, doctor:doctor._id, department:"Orthopedics", appointmentDate:day(1), appointmentTime:"11:30 AM", appointmentType:"Consultation", status:"Scheduled", consultationFee:600, paymentStatus:"Paid", createdBy:staff._id },
            { appointmentId:"APT1004", patient:patients[3]._id, doctor:doctor2._id, department:"Pediatrics", appointmentDate:day(-1), appointmentTime:"03:00 PM", appointmentType:"Routine Checkup", status:"Completed", consultationFee:350, paymentStatus:"Paid", createdBy:staff._id }
        ]);

        const reports = await Report.insertMany([
            { reportId:"REP1001", patient:patients[0]._id, doctor:doctor._id, reportTitle:"Blood Test", reportType:"Blood Test", diagnosis:"Normal", findings:"CBC values within normal range.", remarks:"Continue follow-up.", reportStatus:"Completed", createdBy:doctor._id },
            { reportId:"REP1002", patient:patients[1]._id, doctor:doctor2._id, reportTitle:"Neurology Follow-up", reportType:"Other", diagnosis:"Migraine", findings:"Symptoms improving.", remarks:"Review after 30 days.", reportStatus:"Processing", createdBy:doctor2._id }
        ]);
        await Patient.findByIdAndUpdate(patients[0]._id,{ $addToSet:{reports:reports[0]._id} });
        await Patient.findByIdAndUpdate(patients[1]._id,{ $addToSet:{reports:reports[1]._id} });

        console.log("==================================");
        console.log("Database Seeded Successfully");
        console.log("==================================");
        console.log("Admin: admin@carescope.com / admin123");
        console.log("Doctor: doctor@carescope.com / doctor123");
        console.log("Reception: staff@carescope.com / staff123");
        process.exit(0);
    } catch (error) {
        console.error("SEED FAILED:", error);
        process.exit(1);
    }
};

seedDatabase();
