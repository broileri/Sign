var ws;

function CreateWebSocket(callback) {
	ws = new WebSocket("ws://localhost:9999/");
	ws.onopen = function (event) {
		callback();
	};
	ws.onmessage = function (event) {
		console.log("Message is received..." + event.data)
		checkSignedAnswer(event.data);
	}
}

function CloseWebSocket() {
	ws.close();
}