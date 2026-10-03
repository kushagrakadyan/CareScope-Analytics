const nodemailer = require("nodemailer");

// ==========================================
// EMAIL TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({

    host: process.env.EMAIL_HOST,

    port: process.env.EMAIL_PORT,

    secure: false,

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    }

});

// ==========================================
// SEND EMAIL FUNCTION
// ==========================================

const sendEmail = async (

    to,

    subject,

    html

) => {

    try {

        const mailOptions = {

            from: `"CareScope Analytics" <${process.env.EMAIL_USER}>`,

            to,

            subject,

            html

        };

        const info = await transporter.sendMail(mailOptions);

        console.log("=================================");
        console.log("Email Sent Successfully");
        console.log(info.messageId);
        console.log("=================================");

        return true;

    }

    catch (error) {

        console.error("Email Error :", error.message);

        return false;

    }

};

module.exports = sendEmail;