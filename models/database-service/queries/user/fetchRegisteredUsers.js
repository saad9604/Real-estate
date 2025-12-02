const config = require('../../../../config/server-config');
const { contactTableAndSendDataToWebsocket } = require('../../../../utilities/db-utils');
const sendArrayResponseToClient = require('../../utils/sendArrayResponseToClient');

async function fetchRegisteredUsers(webSocket) {
    await contactTableAndSendDataToWebsocket(webSocket, config.actions.fetch_registered_users, [], (items, ws) => { 
        sendArrayResponseToClient(config.actions.fetch_registered_users_response, items, ws); 
    });
}

module.exports = fetchRegisteredUsers;