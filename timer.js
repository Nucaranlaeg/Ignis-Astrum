"use strict"

var Timer = {};
(function() {
	var circumference = 120;
	var turnTime = 0;
	var maxTurnTime = 10;
	var timerUpdater;
	
	function initializeTimer() {
		document.getElementById("timer-circle").setAttribute('stroke-dasharray', "0, 120");
		
		timerUpdater = setInterval(updateTimer.bind(Timer), 250);
	}
	
	function updateTimer() {
		if (turnTime >= maxTurnTime) {
			this.signalTurnEnd();
			timerUpdater.clearInterval;
			turnTime = 0;
			return;
		}
		document.getElementById("timer-circle").setAttribute('stroke-dasharray', Math.floor(turnTime * circumference / maxTurnTime) + ",120");
		turnTime += 0.25;
	}
	
	document.addEventListener("DOMContentLoaded", initializeTimer.bind(this), {once: true});
	
	this.signalTurnEnd = function() {
		Wasm.signalTurnEnd();
	}
	
	this.beginNewTurn = function() {
		clearInterval(timerUpdater);
		timerUpdater = setInterval(updateTimer, 250);
		turnTime = 0;
		Empire.updateEmpireSidebar();
		Map.clearTraces();
	}
}).apply(Timer);