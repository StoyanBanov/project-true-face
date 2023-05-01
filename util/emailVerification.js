const nodemailer = require('nodemailer');

async function sendConfirmationEmail({ _id, email, username }) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.abv.bg',
        port: 465,
        secure: true,
        auth: {
            user: 'true-face@abv.bg',
            pass: 'true-face1'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    await transporter.sendMail({
        from: 'true-face@abv.bg',
        to: email,
        subject: 'E-mail verification',
        text: `Hello, ${username}!\nTo verify please go to http://localhost:3000/verify-email/${_id}`,
    });
}

module.exports = {
    sendConfirmationEmail
}