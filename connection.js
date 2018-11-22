"use strict"

var Connection = {};
(function() {
	let localConnection;
	let channel;
	// Keep track of whether the players have indicated that the turn is over.
	let localEndTurn = false, remoteEndTurn = false, sentTurn = false;
	// Arbitrary channel id.
	let channelId = 1472;
	// Connection data.
	let connectionData;
	
	function initializeConnection() {
		let configuration = {
			iceServers: [{urls: "stun:stun1.l.google.com:19302" }]
		};
		localConnection = new RTCPeerConnection(configuration);
		localConnection.createOffer().then((data) => {
			localConnection.setLocalDescription(data);
			connectionData = window.prompt("Please input the other player's connectionData.\nYour connectionData:\n\n" + data.sdp.replace(/\n/g, "\\n"))
			localConnection.setRemoteDescription(connectionData);
		});
		channel = localConnection.createDataChannel('sendDataChannel', {negotiated: true, id: channelId});
	}
	
	document.addEventListener("DOMContentLoaded", initializeConnection.bind(this), {once: true});
	
	// Use this to notify the remote game that the local game is ready to end the turn.
	this.sendEndTurnSignal = function(isEndTurn) {
		localEndTurn = isEndTurn;
		if (localEndTurn && remoteEndTurn) return sendTurnData();
		channel.send({endTurn: isEndTurn});
	}
	
	// Begins completion of the turn.
	function sendTurnData() {
		let dataToSend = Wasm.getDataToSend();
		channel.send(dataToSend);
		localEndTurn = false;
		remoteEndTurn = false;
		sentTurn = true;
	}
	
	function recieveData(data) {
		if (data.endTurn !== undefined){
			remoteEndTurn = data.endTurn;
			return;
		}
		if (data.seed === undefined || data.ships === undefined){
			throw "Incoming data was not formatted correctly.";
		}
		if (!sentTurn){
			// Check to make sure that the local turn should have ended
			if (!localEndTurn && !Timer.isTurnEnded()) return;
			sendTurnData();
		}
		Wasm.parseIncomingData(data);
		Wasm.startNewTurn();
	}
	
}).apply(Connection);