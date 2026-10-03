const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ==========================================
// CREATE UPLOAD FOLDERS
// ==========================================

const reportDirectory = "uploads/reports";
const profileDirectory = "uploads/profile-images";

if (!fs.existsSync(reportDirectory)) {
    fs.mkdirSync(reportDirectory, { recursive: true });
}

if (!fs.existsSync(profileDirectory)) {
    fs.mkdirSync(profileDirectory, { recursive: true });
}

// ==========================================
// STORAGE CONFIGURATION
// ==========================================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        if (file.fieldname === "profileImage") {

            cb(null, profileDirectory);

        } else {

            cb(null, reportDirectory);

        }

    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

// ==========================================
// FILE FILTER
// ==========================================

const fileFilter = (req, file, cb) => {

    if (file.fieldname === "profileImage") {

        const allowedImages = [

            "image/jpeg",

            "image/jpg",

            "image/png",

            "image/webp"

        ];

        if (allowedImages.includes(file.mimetype)) {

            cb(null, true);

        } else {

            cb(new Error("Only image files are allowed."), false);

        }

    }

    else {

        const allowedReports = [

            "application/pdf",

            "image/jpeg",

            "image/jpg",

            "image/png"

        ];

        if (allowedReports.includes(file.mimetype)) {

            cb(null, true);

        } else {

            cb(new Error("Only PDF or Image reports are allowed."), false);

        }

    }

};

// ==========================================
// MULTER CONFIGURATION
// ==========================================

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 5 * 1024 * 1024

    }

});

module.exports = upload;