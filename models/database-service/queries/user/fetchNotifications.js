const config = require('../../../../config/server-config');
const { contactTableAndSendDataToWebsocket } = require('../../../../utilities/db-utils');
const sendArrayResponseToClient = require('../../utils/sendArrayResponseToClient');

async function fetchNotifications(request, webSocket) {
    const admin_id = request.data;
    await contactTableAndSendDataToWebsocket(webSocket, config.actions.fetch_notifications, [admin_id], (items, ws) => { 
        sendArrayResponseToClient(config.actions.fetch_notifications_response, items, ws); 
    });
}

module.exports = fetchNotifications;