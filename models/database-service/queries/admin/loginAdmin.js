const config = require('../../../../config/server-config');
const { contactTableAndSendDataToWebsocket } = require('../../../../utilities/db-utils');
const sendResponseToClient = require('../../utils/sendResponseToClient');
const bcrypt = require('bcrypt');

async function loginAdmin(request, webSocket) {
    console.log('=== LOGIN ADMIN FUNCTION START ===');
    console.log('Request object:', JSON.stringify(request, null, 2));
    console.log('WebSocket state:', webSocket.readyState);
    
    const username = request.data.admin_username;
    const plainPassword = request.data.admin_password;
    
    console.log('Extracted credentials:', {
        username: username,
        passwordLength: plainPassword ? plainPassword.length : 0,
        hasUsername: !!username,
        hasPassword: !!plainPassword
    });
    
    if (!username || !plainPassword) {
        console.log('Missing credentials - returning error');
        const clientData = [{ message: 'Admin username and password are required', loginSuccessful: false }];
        return sendResponseToClient(config.actions.login_admin_response, clientData, webSocket);
    }

    try {
        console.log('Calling contactTableAndSendDataToWebsocket with query:', config.actions.login_admin);
        console.log('Query parameters:', [username]);
        
        await contactTableAndSendDataToWebsocket(webSocket, config.actions.login_admin, [username], async (items, ws) => {
            console.log('Database query callback executed');
            console.log('Items returned from database:', items ? items.length : 'null');
            console.log('Items content:', JSON.stringify(items, null, 2));
            
            if (items && items.length > 0) {
                const admin = items[0];
                console.log('Admin record found:', {
                    admin_id: admin.admin_id,
                    admin_username: admin.admin_username,
                    hasPassword: !!admin.admin_password
                });
                
                const storedHashedPassword = admin.admin_password;
                try {
                    console.log('Attempting bcrypt comparison...');
                    const isMatch = await bcrypt.compare(plainPassword, storedHashedPassword);
                    console.log('Bcrypt comparison result:', isMatch);
                    
                    if (isMatch) {
                        console.log('Password match - sending success response');
                        const clientData = [{ message: 'Admin login successful', admin: { id: admin.admin_id, username: admin.admin_username, password: admin.admin_password }, loginSuccessful: true }];
                        return sendResponseToClient(config.actions.login_admin_response, clientData, ws);
                    } else {
                        console.log('Password mismatch - sending failure response');
                        const clientData = [{ message: 'Admin login failed, password does not match, please try again!', loginSuccessful: false }];
                        return sendResponseToClient(config.actions.login_admin_response, clientData, ws);
                    }
                } catch (err) {
                    console.error('Bcrypt comparison error:', err);
                    console.error('Bcrypt error stack:', err.stack);
                    const clientData = [{ message: 'Error logging in admin!', loginSuccessful: false }];
                    return sendResponseToClient(config.actions.login_admin_response, clientData, ws);
                }
            } else {
                console.log('No admin found with username:', username);
                const clientData = [{ message: 'Admin login failed, username is not found, please try again!', loginSuccessful: false }];
                sendResponseToClient(config.actions.login_admin_response, clientData, ws);
            }
        });
        
        console.log('=== LOGIN ADMIN FUNCTION END ===');
    } catch (error) {
        console.error('=== LOGIN ADMIN FUNCTION ERROR ===');
        console.error('Error in loginAdmin function:', error);
        console.error('Error stack:', error.stack);
        console.error('Error message:', error.message);
        console.error('=== LOGIN ADMIN FUNCTION ERROR END ===');
        
        const clientData = [{ message: 'An error occurred during login', loginSuccessful: false }];
        sendResponseToClient(config.actions.login_admin_response, clientData, webSocket);
    }
}

module.exports = loginAdmin;