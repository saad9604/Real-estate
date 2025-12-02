const { contactTableAndSendDataToWebsocket } = require('../../../utilities/db-utils');
const config = require('../../../config/server-config');
const bcrypt = require('bcrypt');

async function checkIfClientExists(webSocket, password) {
    const pendingUsers = await contactTableAndSendDataToWebsocket(webSocket, config.actions.fetch_pending_users_requests);
    const registeredUsers = await contactTableAndSendDataToWebsocket(webSocket, config.actions.fetch_registered_users);
    
    const passwordMatches = async (users) => {
        for (const user of users) {
            const match = await bcrypt.compare(password, user.password);
            if (match) return true;
        }
        return false;
    };
    const pendingMatch = await passwordMatches(pendingUsers);
    const registeredMatch = await passwordMatches(registeredUsers);
    return pendingMatch || registeredMatch;
}

module.exports = checkIfClientExists; 

