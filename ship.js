"use strict"

var Ship = {};
(function() {
	let movingUnit = null, dragElement = null;
	
	this.dragBase = function (event, base) {
		// For now, just pretend it's a ship.
		this.dragShip(event, base);
	};
	
	this.dragShip = function (event, ship) {
		map.addEventListener("mousemove", continueDrag);
		window.addEventListener("mouseup", endDrag, {capture: true, once: true});
		window.addEventListener("keypress", escDrag);
		movingUnit = ship;
		dragElement = movingUnit.cloneNode(true);
		dragElement.style.visibility = "hidden";
		dragElement.removeAttribute("id");
		map.append(dragElement);
		dragElement.top = event.clientY;
		dragElement.left = event.clientX;
	};
	
	function attemptMove(hex) {
		// Attempt to move to said hex.
	}
	
	function continueDrag(event) {
		movingUnit.style.visibility = "hidden";
		dragElement.style.visibility = "visible";
		if (!movingUnit) {
			map.removeEventListener("mousemove", continueDrag);
			if (dragElement) {
				dragElement.remove();
				dragElement = null;
			}
			return;
		}
		dragElement.style.top = event.clientY - (dragElement.width.baseVal.value / 2) + "px";
		dragElement.style.left = event.clientX - (dragElement.width.baseVal.value / 2) + "px";
	}
	
	function escDrag(event) {
		if (event.keyCode === 27){
			window.removeEventListener("mouseup", endDrag, {capture: true, once: true});
			window.removeEventListener("keypress", escDrag);
			map.removeEventListener("mousemove", continueDrag);
			movingUnit.style.visibility = "visible";
			movingUnit = null;
			dragElement.remove();
			dragElement = null;
		}
	}
	
	function endDrag(event) {
		window.removeEventListener("keypress", escDrag);
		map.removeEventListener("mousemove", continueDrag);
		attemptMove(Utils.findHex(event.clientX, event.clientY));
		movingUnit.style.visibility = "visible";
		movingUnit = null;
		dragElement.remove();
		dragElement = null;
	}
}).apply(Ship);