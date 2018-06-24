"use strict"

var Timer = {};
(function() {
	var circumference = 130; // Actual circumference is 124; 130 gives the appearance of 5% grace time.
	var turnTime = 0;
	var maxTurnTime = 60;
	var timerUpdater;
	var timerCircle;
	
	function initializeTimer() {
		timerCircle = document.getElementById("timer-circle");
		timerCircle.setAttribute('stroke-dasharray', "0, " + circumference);
	}
	
	function updateTimer() {
		if (turnTime >= maxTurnTime) {
			this.signalTurnEnd();
			timerUpdater.clearInterval;
			turnTime = 0;
			return;
		}
		timerCircle.setAttribute('stroke-dasharray', Math.floor(turnTime * circumference / maxTurnTime) + ", " + circumference);
		turnTime += 0.25;
	}
	
	document.addEventListener("DOMContentLoaded", initializeTimer.bind(this), {once: true});
	
	this.signalTurnEnd = function() {
		if (Sidebar.loadedState != 2) return;
		if (timerCircle.classList.contains("turn-ended")) {
			Wasm.signalContinueTurn();
			timerCircle.classList.remove("turn-ended");
		} else {
			Wasm.signalTurnEnd();
			timerCircle.classList.add("turn-ended");
		}
	}
	
	this.beginNewTurn = function() {
		clearInterval(timerUpdater);
		timerUpdater = setInterval(updateTimer.bind(this), 250);
		turnTime = 0;
		timerCircle.classList.remove("turn-ended");
		Map.moveShips();
		ContextMenu.closeContextMenu();
	}
	
	this.startGame = function() {
		timerUpdater = setInterval(updateTimer.bind(this), 250);
	}
}).apply(Timer);