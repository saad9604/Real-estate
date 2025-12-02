const routes = {
    root: '/', 
    pending_user_requests_route: '/api/pending-users-requests',  
    registered_users_route: '/api/registered-users',
    insert_pending_user_request_route: '/api/insert-pending-user-request',
    register_user_route: '/api/register-user',
    update_user_route: '/api/update-user',
    insert_exercise_video_route: '/api/insert-exercise-video', 
    insert_exercise_results_route: '/api/insert-exercise-results',
    login_user_route: '/api/login-user', 
    insert_notifications_route: '/api/insert-notifications',
    login_admin_route: '/api/login-admin',
    update_admin_route: '/api/update-admin',
    notifications_route: '/api/notifications',
    delete_notifications_route: '/api/delete-notifications',
    exercises_results_route: '/api/exercises-results',
    delete_exercise_route: '/api/delete-exercise',
    delete_partial_video_route: '/api/delete-partial-video'
}

const actions = {
    fetch_pending_users_requests: 'SELECT * FROM pendingusersrequests', 
    fetch_pending_user_requests_response: 'fetchPendingUsersRequestsResponse',
    fetch_registered_users: 'SELECT * FROM registeredusers',
    fetch_registered_users_response: 'fetchRegisteredUsersResponse',
    insert_pending_user_request: `INSERT INTO pendingusersrequests (email, password, first_name, last_name, birth_date, gender, height, weight) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`, 
    insert_pending_user_request_response: 'insertItemResponse', 
    register_user: ` INSERT INTO registeredusers (email, password, first_name, last_name, birth_date, gender, height, weight) 
                     SELECT email, password, first_name, last_name, birth_date, gender, height, weight FROM pendingusersrequests WHERE user_id = $1;
                   `, 
    register_user_response: 'registerItemResponse', 
    delete_pending_request_item: `DELETE FROM pendingusersrequests WHERE user_id = $1;`, 
    delete_pending_requets_item_response: 'deleteItemResponse', 
    update_user: `UPDATE registeredusers SET email = $2, password = $3, first_name = $4, last_name = $5, height = $6, weight = $7 WHERE user_id = $1;`,
    update_user_respose: `updateItemResponse`, 
    insert_exercise_video: `INSERT INTO exercisesvideos (user_id, video_path, exercise_start_time) VALUES ($1, $2, $3) RETURNING *`, 
    insert_exercise_video_response: `insertExerciseVideoResponse`,
    insert_exercise_results: `INSERT INTO exercisesresults (exercise_video_id, user_id, type_of_exercise, start_time, end_time, exercise_score, activated_muscles_on_off) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    insert_exercise_results_response: `insertExerciseResultsResponse`,
    login_user: `SELECT * FROM registeredusers WHERE email = $1`,
    login_user_response: `loginUserResponse`, 
    insert_notifications: `INSERT INTO notifications (user_id, message) VALUES ($1, $2) RETURNING *`,
    insert_notifications_response: `insertNotificationsResponse`,
    login_admin: `SELECT * FROM admin WHERE admin_username = $1`,
    login_admin_response: `adminLoginResponse`,
    update_admin: `UPDATE admin SET admin_username = $2, admin_password = $3 WHERE admin_id = $1`, 
    update_admin_response: `updateAdminResponse`,
    fetch_notifications: 'SELECT * FROM notifications WHERE user_id = $1',
    fetch_notifications_response: 'fetchNotificationsResponse',
    delete_notifications: 'DELETE FROM notifications WHERE user_id = $1',
    delete_notifications_response: 'deleteNotificationsResponse',
    fetch_exercises_results: 'SELECT * FROM exercisesresults WHERE user_id = $1',
    fetch_exercises_results_response: 'fetchExercisesResultsResponse',
    delete_exercise: `
        DELETE FROM exercisesresults 
        WHERE user_id = $1 AND exercisesresults_id = $2
        RETURNING (
            SELECT video_path FROM exercisesvideos 
            WHERE exercise_video_id = (
                SELECT exercise_video_id FROM exercisesresults 
                WHERE user_id = $1 AND exercisesresults_id = $2
            )
        ) as video_path, exercise_video_id
    `,
    delete_exercise_response: 'deleteExerciseResponse',
    fetch_exercise_video_urls: `
        SELECT ev.video_path 
        FROM exercisesvideos ev
        JOIN exercisesresults er ON ev.exercise_video_id = er.exercise_video_id
        WHERE er.exercisesresults_id = $1
    `,
    fetch_exercise_video_urls_response: 'fetchExerciseVideoUrlsResponse',
}

const ports = {
    server_port: 3001, 
    database_service_port: 3002
}

const config = {
    routes,
    actions,
    ports 
}

module.exports = config;
