const config = require('../../../../config/server-config');
const { contactTableAndSendDataToWebsocket } =  require('../../../../utilities/db-utils');
const sendArrayResponseToClient = require('../../utils/sendArrayResponseToClient');

async function fetchPendingUsersRequests(webSocket) {
    await contactTableAndSendDataToWebsocket(webSocket, config.actions.fetch_pending_users_requests, [], (items, ws) => { 
        sendArrayResponseToClient(config.actions.fetch_pending_user_requests_response, items, ws); 
    });
}

module.exports = fetchPendingUsersRequests;
