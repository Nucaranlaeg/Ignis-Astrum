"use strict"

var Timer = {};
(function() {
	var circumference = 120;
	var turnTime = 0;
	var maxTurnTime = 60;
	var timerUpdater;
	
	function initializeTimer() {
		document.getElementById("timer-circle").setAttribute('stroke-dasharray', "0, 120");
		
		var timerUpdater = setInterval(updateTimer, 250);
	}
	
	function updateTimer() {
		if (turnTime >= maxTurnTime) {
			// End the turn.
			turnTime = 0;
			return;
		}
		document.getElementById("timer-circle").setAttribute('stroke-dasharray', Math.floor(turnTime * circumference / maxTurnTime) + ",120");
		turnTime += 0.25;
	}
	
	document.addEventListener("DOMContentLoaded", initializeTimer.bind(this), {once: true});
}).apply(Timer);