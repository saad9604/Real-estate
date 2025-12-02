const config = require('../../../../config/server-config');
const { contactTableAndSendDataToWebsocket } = require('../../../../utilities/db-utils');
const sendResponseToClient = require('../../utils/sendResponseToClient');
const checkIfClientExists = require('../../utils/checkIfClientExists');
const bcrypt = require('bcrypt');

async function insertPendingUserRequest(request, webSocket) {
    const userExists = await checkIfClientExists(webSocket, request.data.password);
    if (userExists) {
        const clientData = [{ message: 'Password already exists in the database. Please choose a different one!.', registrationSuccessful: false }];
        return sendResponseToClient(config.actions.insert_pending_user_request_response, clientData, webSocket);
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(request.data.password, saltRounds);
    
    const userData = {
        email: request.data.email,
        password: hashedPassword,
        firstName: request.data.firstName,
        lastName: request.data.lastName,
        birthDate: request.data.birthDate,
        gender: request.data.gender,
        height: request.data.height,
        weight: request.data.weight
    };

    await contactTableAndSendDataToWebsocket(webSocket, config.actions.insert_pending_user_request, Object.values(userData), (item, ws) => { 
        sendResponseToClient(config.actions.insert_pending_user_request_response, item, ws); 
    });
}

module.exports = insertPendingUserRequest;