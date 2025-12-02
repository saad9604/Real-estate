const config = require('../../../../config/server-config');
const { contactTableAndSendDataToWebsocket } = require('../../../../utilities/db-utils');
const sendArrayResponseToClient = require('../../utils/sendArrayResponseToClient');

async function fetchExercisesResults(request, webSocket) {
    const userId = request.data;
    console.log('User id: ', userId);
    await contactTableAndSendDataToWebsocket(webSocket, config.actions.fetch_exercises_results, [userId], (items, ws) => { 
        sendArrayResponseToClient(config.actions.fetch_exercises_results_response, items, ws); 
    });
}

module.exports = fetchExercisesResults;
