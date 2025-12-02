const config = require('../../../config/server-config');
const sendResponseToClient = require('./sendResponseToClient');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.SERVICE_PROVIDER_EMAIL,
        pass: process.env.SERVICE_PROVIDER_PASSWORD
    }
});

// send email to the user
function sendEmailToClient(clientData, webSocket) {
    const mailOptions = {
        from: process.env.SERVICE_PROVIDER_EMAIL,
        to: clientData.mail,
        subject: clientData.first_name,
        text: clientData.message
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            const errorData = [{ message: error.message }];
            sendResponseToClient(config.actions.register_user_response, errorData, webSocket);
        } else {
            const successData = [{ registrationSuccessful: clientData.approved, message: clientData.message }];
            sendResponseToClient(config.actions.register_user_response, successData, webSocket);
        }
    });
}

module.exports = sendEmailToClient;