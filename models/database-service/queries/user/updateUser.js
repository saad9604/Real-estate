const config = require('../../../../config/server-config');
const { contactTableAndSendDataToWebsocket } = require('../../../../utilities/db-utils');
const sendResponseToClient = require('../../utils/sendResponseToClient');
const checkIfClientExists = require('../../utils/checkIfClientExists');
const bcrypt = require('bcrypt');

async function updateUser(request, webSocket) {
    const userExists = await checkIfClientExists(webSocket, request.data.password);
    if (userExists) {
        const clientData = [{ message: 'Password already exists in the database. Please choose a different one!', updateSuccessful: false }];
        return sendResponseToClient(config.actions.update_user_respose, clientData, webSocket);
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(request.data.password, saltRounds);
    
    const updatedData = {
        user_id: request.data.user_id,
        email: request.data.email,
        password: hashedPassword,
        first_name: request.data.first_name,
        last_name: request.data.last_name,
        height: request.data.height,
        weight: request.data.weight
    };

    console.log('Updated data: ', updatedData);

    await contactTableAndSendDataToWebsocket(webSocket, config.actions.update_user, Object.values(updatedData), (item, ws) => {
        const clientData = [{message: 'User details updated.', user: updatedData}]; 
        sendResponseToClient(config.actions.update_user_respose, clientData, ws); 
    });
}

module.exports = updateUser;