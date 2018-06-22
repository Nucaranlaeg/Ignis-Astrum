"use strict"

var Connection = {};
(function() {
	let localConnection;
	let sendChannel;
	
	function initializeConnection() {
		localConnection = new RTCPeerConnection({"iceServers":[]});
		sendChannel = localConnection.createDataChannel('sendDataChannel', null);
	}
	
	document.addEventListener("DOMContentLoaded", initializeConnection.bind(this), {once: true});
	
	function sendEndTurn() {
		let dataToSend = Wasm.getDataToSend();
	}
	
}).apply(Connection);