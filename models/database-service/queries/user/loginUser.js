const config = require('../../../../config/server-config');
const { contactTableAndSendDataToWebsocket } = require('../../../../utilities/db-utils');
const sendResponseToClient = require('../../utils/sendResponseToClient');
const bcrypt = require('bcrypt');

async function loginUser(request, webSocket) {
    const email = request.data.email;
    const plainPassword = request.data.password;
    await contactTableAndSendDataToWebsocket(webSocket, config.actions.login_user, [email], async (items, ws) => { 
        if (items.length > 0) {
            let isMatchFound = false;
            let loggedInUser = null;

            for (const item of items) {
                const storedHashedPassword = item.password;
                try {
                    const isMatch = await bcrypt.compare(plainPassword, storedHashedPassword);
                    if (isMatch) {
                        isMatchFound = true;
                        loggedInUser = item;
                        break;
                    }
                } catch (err) {
                    const clientData = [{ message: 'Error logging in!', loginSuccessful: false }];
                    return sendResponseToClient(config.actions.login_user_response, clientData, ws);
                }
            }

            if (isMatchFound) {
                const clientData = [{ message: 'Login successful', user: loggedInUser, loginSuccessful: true }];
                return sendResponseToClient(config.actions.login_user_response, clientData, ws);
            } else {
                const clientData = [{ message: 'Login failed, password does not match, please try again!', loginSuccessful: false }];
                return sendResponseToClient(config.actions.login_user_response, clientData, ws);
            }
        } else {
            const clientData = [{ message: 'Login failed, email is not found, please try again!', loginSuccessful: false }];
            sendResponseToClient(config.actions.login_user_response, clientData, ws);
        } 
    });
}

module.exports = loginUser;