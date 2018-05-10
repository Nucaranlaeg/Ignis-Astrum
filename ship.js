"use strict"

var Ship = {};
(function() {
	let movingUnit = null, dragElement = null;
	
	this.dragBase = function (event, base) {
		// For now, just pretend it's a ship.
		return this.dragShip(event, base);
	};
	
	this.dragShip = function (event, ship) {
		if (!ship.classList.contains("controlled")) return false;
		map.addEventListener("mousemove", continueDrag);
		window.addEventListener("mouseup", endDrag, {capture: true, once: true});
		window.addEventListener("keypress", escDrag);
		movingUnit = ship;
		dragElement = movingUnit.cloneNode(true);
		dragElement.classList.add("moving");
		dragElement.removeAttribute("id");
		map.append(dragElement);
		dragElement.top = event.clientY;
		dragElement.left = event.clientX;
		return true;
	};
	
	function attemptMove(hex) {
		let source = movingUnit.name ? movingUnit.name.split(".") : movingUnit.parentNode.id.split(".");
		let target = hex.id.split(".");
		if (movingUnit.id.slice(0,4) === "ship") {
			
		} else {
			// It's a base.
			if (Utils.calculateDistance(source, target) <= 1) {
				if (!movingUnit.name){
					movingUnit.name = movingUnit.parentNode.id;
					let sourceBase = movingUnit.cloneNode(true);
					sourceBase.classList.add("trace");
					sourceBase.classList.remove("controlled");
					movingUnit.parentNode.appendChild(sourceBase);
				}
				hex.appendChild(movingUnit);
			}
		}
		// Attempt to move to said hex.
	}
	
	function continueDrag(event) {
		movingUnit.classList.add("moving");
		dragElement.classList.remove("moving");
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
			movingUnit.classList.remove("moving");
			movingUnit = null;
			dragElement.remove();
			dragElement = null;
		}
	}
	
	function endDrag(event) {
		window.removeEventListener("keypress", escDrag);
		map.removeEventListener("mousemove", continueDrag);
		attemptMove(Utils.findHex(event.clientX, event.clientY));
		movingUnit.classList.remove("moving");
		movingUnit = null;
		dragElement.remove();
		dragElement = null;
	}
}).apply(Ship);