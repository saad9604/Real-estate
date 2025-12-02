// send all items to controller
function sendResponseToClient(response, rows, ws) {
    if (rows.length > 1) {
	    ws.send(JSON.stringify({ action: response, payload: rows }));
    } else {
        ws.send(JSON.stringify({ action: response, payload: rows[0] }));
    }
}

module.exports = sendResponseToClient; 