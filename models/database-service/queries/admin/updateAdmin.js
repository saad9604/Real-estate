const config = require('../../../../config/server-config');
const { contactTableAndSendDataToWebsocket } = require('../../../../utilities/db-utils');
const sendResponseToClient = require('../../utils/sendResponseToClient');
const bcrypt = require('bcrypt');

async function updateAdmin(request, webSocket) {
    const { admin_id, admin_username, admin_password } = request.data;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(admin_password, saltRounds);

    await contactTableAndSendDataToWebsocket(webSocket, config.actions.update_admin, [admin_id, admin_username, hashedPassword], (item, ws) => {
        const clientData = [{ message: 'Admin details updated successfully.', admin: { admin_id, admin_username, admin_password }, updateSuccessful: true }];
        sendResponseToClient(config.actions.update_admin_response, clientData, ws);
    });
}

module.exports = updateAdmin;