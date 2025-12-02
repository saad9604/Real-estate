const config = require('../../../../config/server-config');
const { contactTableAndSendDataToWebsocket } = require('../../../../utilities/db-utils');
const sendResponseToClient = require('../../utils/sendResponseToClient');

async function deleteNotifications(request, webSocket) {
    const user_id = request.data;
    await contactTableAndSendDataToWebsocket(webSocket, config.actions.delete_notifications, [user_id], (result, ws) => { 
        const clientData = [{ message: 'Notifications deleted successfully' }];
        sendResponseToClient(config.actions.delete_notifications_response, clientData, ws); 
    });
}

module.exports = deleteNotifications;