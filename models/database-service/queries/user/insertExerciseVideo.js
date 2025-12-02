const config = require('../../../../config/server-config');
const { contactTableAndSendDataToWebsocket } = require('../../../../utilities/db-utils');
const sendResponseToClient = require('../../utils/sendResponseToClient');
const {spawn} = require('child_process');
const path = require('path');
const insertExerciseResults = require('./insertExerciseResults');


async function insertExerciseVideo(request, webSocket) {
    const insertedVideoDetails = await contactTableAndSendDataToWebsocket(webSocket, config.actions.insert_exercise_video, [request.data.user_id, request.data.video_path, request.data.exercise_start_time], (item, ws) => { 
        const clientData = [{message: 'Exercise video inserted: ', video_file_name: request.data.video_file_name, video_path: request.data.video_path}]; 
        sendResponseToClient(config.actions.insert_exercise_video_response, clientData, ws); 
    });
    if (insertedVideoDetails.length > 0) {
        console.log("Inserted video details: ", insertedVideoDetails);
        const pythonExecutable = 'python';
        const pythonScriptPath = path.join(__dirname,'../../../../scripts/ai_service_script.py');
        const videoData = insertedVideoDetails[0];
        const pythonScriptArgs = ['--video_path', videoData.video_path.toString(), '--exercise_video_id', videoData.exercise_video_id.toString(), 
            '--user_id', videoData.user_id.toString()];
        const pythonProcess = spawn(pythonExecutable, [pythonScriptPath, ...pythonScriptArgs]);
        let pythonStdOut = '';
        let pythonStdErr = '';

        pythonProcess.stdout.on('data', (data) => {
            pythonStdOut += data;
        });    

        pythonProcess.stderr.on('data', (data) => {
            console.log(data.toString('utf8'));
            pythonStdErr += data;
        });

        pythonProcess.on('close', async (code) => {
            if (code === 0) {
                console.log(`Process exited with code ${code}`);
                if (pythonStdOut) {
                    try {
                        const processedResults = JSON.parse(pythonStdOut);
                        console.log('Processed results: ', processedResults);
                        await insertExerciseResults({data: processedResults},  webSocket);
                    } catch (error) {
                        console.error('Error while parsing python script: ', error);
                    }
                } else {
                    console.log('Python script exited successfully, and produced no output');
                }
            } else {
                console.error('Error, Python script failed, error code: ', code);
                if (pythonStdErr) {
                    console.error('Python script stderr: ', pythonStdErr);
                }
            }
        });
    }
    
}

module.exports = insertExerciseVideo;