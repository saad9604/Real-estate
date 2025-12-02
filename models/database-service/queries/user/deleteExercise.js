const config = require('../../../../config/server-config');
const { contactTableAndSendDataToWebsocket } = require('../../../../utilities/db-utils');
const sendResponseToClient = require('../../utils/sendResponseToClient');
const fs = require('fs').promises;
const path = require('path');

async function deleteExercise(request, webSocket) {
    const { user_id, exercisesresults_id } = request.data;
    
    try {
        await contactTableAndSendDataToWebsocket(
            webSocket, 
            config.actions.delete_exercise, 
            [user_id, exercisesresults_id], 
            async (result, ws) => {
                if (result && result.length > 0) {
                    const { video_path, exercise_video_id } = result[0];
                    if (video_path) {
                        try {
                            await fs.unlink(video_path);
                            console.log(`Video file deleted: ${video_path}`);
                        } catch (fileError) {
                            console.error(`Error deleting video file: ${video_path}`, fileError);
                        }
                    }
                    if (exercise_video_id) {
                        await contactTableAndSendDataToWebsocket(
                            webSocket,
                            `DELETE FROM exercisesvideos WHERE exercise_video_id = $1`,
                            [exercise_video_id]
                        );
                    }
                }
                const clientData = [{ message: 'Exercise and video deleted successfully' }];
                sendResponseToClient(config.actions.delete_exercise_response, clientData, ws);
            }
        );
    } catch (error) {
        console.error('Error deleting exercise:', error);
        const clientData = [{ message: 'Error deleting exercise', error: error.message }];
        sendResponseToClient(config.actions.delete_exercise_response, clientData, webSocket);
    }
}

module.exports = deleteExercise;
