function sendArrayResponseToClient(response, rows, ws) {
    ws.send(JSON.stringify({ action: response, payload: rows }));
}

module.exports = sendArrayResponseToClient; 