const pool = require('../config/db-config');
const moment = require('moment-timezone');

async function queryDatabase(query, params, webSocket) {   
    console.log('=== QUERY DATABASE START ===');
    console.log('Query:', query);
    console.log('Parameters:', params);
    console.log('WebSocket state:', webSocket ? webSocket.readyState : 'null');
    
    try {
        console.log('Executing database query...');
        const result = await pool.query(query, params);
        console.log('Database query executed successfully');
        console.log('Result rows count:', result.rows ? result.rows.length : 'null');
        console.log('Result rows:', JSON.stringify(result.rows, null, 2));
        
        const adjustedResult = withAdjustedTimezone(result);
        console.log('Adjusted result:', JSON.stringify(adjustedResult, null, 2));
        console.log('=== QUERY DATABASE END ===');
        return adjustedResult;
    } catch (error) {
        console.error('=== QUERY DATABASE ERROR ===');
        console.error('Database query error:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('=== QUERY DATABASE ERROR END ===');
        
        if (webSocket) {
            console.log('Sending error to WebSocket');
            webSocket.send(JSON.stringify({action: 'error', message: error.message}));
        }
        throw error; // Re-throw the error so it can be caught by the calling function
    }
}

function getSystemTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function withAdjustedTimezone(queryResult) {
	const systemTimezone = getSystemTimezone();
	const adjustedResult = queryResult.rows.map(row => {
		row.request_date = moment.utc(row.request_date).tz(systemTimezone).format(); 
		return row;
	});
	return adjustedResult;
}

async function contactTableAndSendDataToWebsocket(webSocket, query, queryParams, callback) {
	console.log('=== CONTACT TABLE AND SEND DATA TO WEBSOCKET START ===');
	console.log('Query:', query);
	console.log('Query parameters:', queryParams);
	console.log('WebSocket state:', webSocket ? webSocket.readyState : 'null');
	console.log('Callback provided:', !!callback);
	
	try {
		console.log('Calling queryDatabase...');
		const rows = await queryDatabase(query, queryParams, webSocket);
		console.log('QueryDatabase returned rows:', rows ? rows.length : 'null');
		console.log('Rows content:', JSON.stringify(rows, null, 2));
		
        if (callback) {
            console.log('Executing callback...');
            callback(rows, webSocket);
			console.log('Callback executed successfully');
			return rows;
        }
        console.log('No callback provided, returning rows directly');
        return rows; // Return the query result
	} catch(error) {
		console.error('=== CONTACT TABLE AND SEND DATA TO WEBSOCKET ERROR ===');
		console.error('Error in contactTableAndSendDataToWebsocket:', error);
		console.error('Error stack:', error.stack);
		console.error('=== CONTACT TABLE AND SEND DATA TO WEBSOCKET ERROR END ===');
		
		if (webSocket) {
            console.log('Sending error message to WebSocket');
            webSocket.send(JSON.stringify({action: 'error', message: error.message}));
        }
		return []; // Return an empty array in case of error
	}
}

module.exports = {
   contactTableAndSendDataToWebsocket
};