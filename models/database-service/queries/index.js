const fetchPendingUsersRequests = require('./user/fetchPendingUsersRequests');
const fetchRegisteredUsers = require('./user/fetchRegisteredUsers');
const insertPendingUserRequest = require('./user/insertPendingUserRequest');
const registerUser = require('./user/registerUser');
const updateUser = require('./user/updateUser');
const insertExerciseVideo = require('./user/insertExerciseVideo');
const insertExerciseResults = require('./user/insertExerciseResults');
const loginUser = require('./user/loginUser');
const insertNotifications = require('./user/insertNotifications');
const fetchNotifications = require('./user/fetchNotifications');
const deleteNotifications = require('./user/deleteNotifications');
const loginAdmin = require('./admin/loginAdmin');
const updateAdmin = require('./admin/updateAdmin');
const fetchExercisesResults = require('./user/fetchExercisesResults');
const deleteExercise = require('./user/deleteExercise');
const fetchExerciseVideoUrls = require('./user/fetchExerciseVideoUrls');

module.exports = {
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
    fetchExerciseVideoUrls
};
