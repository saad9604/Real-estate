const config = require('../../../../config/server-config');
const { contactTableAndSendDataToWebsocket } = require('../../../../utilities/db-utils');
const sendResponseToClient = require('../../utils/sendResponseToClient');
const path = require('path'); 
require('dotenv').config();

async function fetchExerciseVideoUrls(request, webSocket) {
    const exerciseResultId = request.data;
    try {
        const rows = await contactTableAndSendDataToWebsocket(
            webSocket,
            config.actions.fetch_exercise_video_urls,
            [exerciseResultId],
            null
        );

        if (rows && rows.length > 0) {
            const dbOriginalVideoPath = rows[0].video_path;
            const videosDirectoryPath = process.env.VIDEOS_DIRECTORY_PATH;

            let originalVideoUrl = '';
            let processedVideoUrl = ''; 

            if (dbOriginalVideoPath && videosDirectoryPath) {
                let relativePath = path.relative(videosDirectoryPath, dbOriginalVideoPath);
                relativePath = relativePath.replace(/\\/g, '/');

                if (relativePath && !relativePath.startsWith('/')) {
                    relativePath = '/' + relativePath;
                }
                originalVideoUrl = `/media${relativePath}`;
            } 
            sendResponseToClient(config.actions.fetch_exercise_video_urls_response, [{ originalVideoUrl, processedVideoUrl }], webSocket);
        } else {
            sendResponseToClient(config.actions.fetch_exercise_video_urls_response, [{ originalVideoUrl: '', processedVideoUrl: '', error: 'Video not found for the given exercise result ID.' }], webSocket);
        }
    } catch (error) {
        sendResponseToClient(config.actions.fetch_exercise_video_urls_response, [{ originalVideoUrl: '', processedVideoUrl: '', error: 'Error fetching video URLs.' }], webSocket);
    }
}

module.exports = fetchExerciseVideoUrls;