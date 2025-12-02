const config = require('../../../../config/server-config');
const { contactTableAndSendDataToWebsocket } = require('../../../../utilities/db-utils');
const sendResponseToClient = require('../../utils/sendResponseToClient');

async function insertExerciseResults(request, webSocket) {
    await contactTableAndSendDataToWebsocket(webSocket, config.actions.insert_exercise_results, Object.values(request.data), (item, ws) => { 
        const clientData = [{message: 'Exercise results inserted: ', user: request.data}]; 
        sendResponseToClient(config.actions.insert_exercise_results_response, clientData, ws); 
    });
}

module.exports = insertExerciseResults;