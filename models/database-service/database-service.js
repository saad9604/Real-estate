const WebSocket = require('ws');
const config = require('../../config/server-config');

const {
    fetchPendingUsersRequests,
    fetchRegisteredUsers,
    insertPendingUserRequest,
    registerUser,
    updateUser,
    insertExerciseVideo,
    insertExerciseResults,
    loginUser,
    insertNotifications,
    fetchNotifications,
    deleteNotifications,
    loginAdmin,
    updateAdmin,
    fetchExercisesResults,
    deleteExercise,
    fetchExerciseVideoUrls // Add this
} = require('./queries');

// dotenv configured
require('dotenv').config();

const wsServer = new WebSocket.Server({ port: config.ports.database_service_port });

// fetch and send all users from db table to controller via WebSocket 
wsServer.on('connection', wsSocket => {
    wsSocket.on('message', async message => {
        const request = JSON.parse(message);
        contactTableAndRespond(request, wsSocket);
    });
});


// function to interact with db tables and send a response to client
async function contactTableAndRespond(request, webSocket) {
    switch(request.action) {
        case config.actions.fetch_pending_users_requests:
            await fetchPendingUsersRequests(webSocket);
            break;
        case config.actions.fetch_registered_users:
            await fetchRegisteredUsers(webSocket);
            break;
        case config.actions.insert_pending_user_request:
            await insertPendingUserRequest(request, webSocket);
            break;
        case config.actions.register_user:
            await registerUser(request, webSocket);
            break;
        case config.actions.update_user:
            await updateUser(request, webSocket);
            break;
        case config.actions.insert_exercise_video:
            await insertExerciseVideo(request, webSocket);
            break;
        case config.actions.insert_exercise_results:
            await insertExerciseResults(request, webSocket);
            break;
        case config.actions.login_user:
            await loginUser(request, webSocket);
            break;
        case config.actions.insert_notifications:
            await insertNotifications(request, webSocket);
            break;
        case config.actions.login_admin:
            await loginAdmin(request, webSocket);
            break;   
        case config.actions.update_admin:
            await updateAdmin(request, webSocket);
            break;
        case config.actions.fetch_notifications:
            await fetchNotifications(request, webSocket);
            break;       
        case config.actions.delete_notifications:
            await deleteNotifications(request, webSocket);
            break;
        case config.actions.fetch_exercises_results:
            await fetchExercisesResults(request, webSocket);
            break;
        case config.actions.delete_exercise:
            await deleteExercise(request, webSocket);
            break;
        case config.actions.fetch_exercise_video_urls: // Add this case
            await fetchExerciseVideoUrls(request, webSocket);
            break;
        default:
            console.log(`Unhandled action: ${request.action}`);
    }
}



