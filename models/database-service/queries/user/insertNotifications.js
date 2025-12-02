const config = require('../../../../config/server-config');
const { contactTableAndSendDataToWebsocket } = require('../../../../utilities/db-utils');
const sendResponseToClient = require('../../utils/sendResponseToClient');

async function insertNotifications(request, webSocket) {
    await contactTableAndSendDataToWebsocket(webSocket, config.actions.insert_notifications, Object.values(request.data), (item, ws) => { 
        const clientData = [{ message: 'Notification sent successfully!', notification: item}];
        sendResponseToClient(config.actions.insert_notifications_response, clientData, ws); 
    });
}

module.exports = insertNotifications;