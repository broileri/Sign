var ws;

function CreateWebSocket(callback) {
	ws = new WebSocket("ws://localhost:9999/");
	ws.onopen = function (event) {
		callback();
	};
	ws.onmessage = function (event) {
		console.log("Message is received..." + event.data)
		if ($("#startScreen").css("display") === "none") { //Game is going on
			checkSignedAnswer(event.data);	
		}
	}
}

function CloseWebSocket() {
	ws.close();
}