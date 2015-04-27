var ws;

function CreateWebSocket(callback) {
	ws = new WebSocket("ws://", "");
	ws.onopen = function (event) {
		callback();
	};
	ws.onmessage = function (event) {
		checkSignedAnswer(JSON.parse(event.data));
	}
}

function CloseWebSocket() {
	ws.close();
}