const config = require('../../../../config/server-config');
const { contactTableAndSendDataToWebsocket } = require('../../../../utilities/db-utils');
const sendEmailToUser = require('../../utils/sendEmailToClient');

async function registerUser(request, webSocket) {
    if (request.data.approve === true) {
        await contactTableAndSendDataToWebsocket(webSocket, config.actions.register_user, [request.data.user_id], (item, ws) => { 
            const clientData = {approved: true, message: `Hello ${request.data.first_name}, your registration has been approved by the administrator. You may now log into your account.`, 
                first_name: request.data.first_name, mail: request.data.email};
            sendEmailToUser(clientData, ws);
        });
        await contactTableAndSendDataToWebsocket(webSocket, config.actions.delete_pending_request_item, [request.data.user_id], (item, ws) => {});
    } else {
        await contactTableAndSendDataToWebsocket(webSocket, config.actions.delete_pending_request_item, [request.data.user_id], (item, ws) => { 
            const clientData = {approved: false, message: `Hello ${request.data.first_name}, your registration has been denied by the administrator. For more information contact ${process.env.SERVICE_PROVIDER_EMAIL}.`,
                first_name: request.data.first_name, mail: request.data.email};
            sendEmailToUser(clientData, ws);
        }); 
    }
}

module.exports = registerUser;