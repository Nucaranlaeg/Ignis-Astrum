"use strict"

var Ship = {};
(function() {
	let movingUnit = null, dragElement = null;
	let traceCount = 0;
	
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
		let origin = movingUnit.parentNode;
		let source = movingUnit.name ? movingUnit.name.split(".") : origin.id.split(".");
		if (!hex) return;
		let target = hex.id.split(".");
		if (movingUnit.id.slice(0,4) === "ship") {
			if (Utils.calculateDistance(source, target) <= 3) {
				if (!movingUnit.name){
					movingUnit.name = movingUnit.parentNode.id;
					let sourceShip = movingUnit.cloneNode(true);
					sourceShip.classList.add("trace");
					sourceShip.name = sourceShip.id;
					sourceShip.dataset.traceNumber = traceCount++;
					sourceShip.removeAttribute("id");
					sourceShip.classList.remove("moving");
					movingUnit.parentNode.appendChild(sourceShip);
					// Add some kind of movement trace.
				}
				Map.placeShip(movingUnit, true, hex);
				Map.replaceShips(origin);
			}
		} else {
			// It's a base.
			// Test if there's an enemy unit in the hex - bases can't be a part of offensive operations.
			if ([...hex.childNodes].some(unit => {
				if (unit.nodeName === "#text") return false; // Ignore text nodes.
				// Need to also test for enemy-controlled planets.
				return !unit.classList.contains("controlled") && (unit.classList.contains("base") || unit.classList.contains("ship"));
			})) {
				ContextMenu.loadInfoWindow("Bases cannot participate in offensive operations.");
				return;
			}
			if (Utils.calculateDistance(source, target) <= 1) {
				if (!movingUnit.name){
					movingUnit.name = origin.id;
					let sourceBase = movingUnit.cloneNode(true);
					sourceBase.classList.add("trace");
					sourceBase.name = sourceBase.id;
					sourceBase.dataset.traceNumber = traceCount++;
					sourceBase.removeAttribute("id");
					sourceBase.classList.remove("moving");
					movingUnit.parentNode.appendChild(sourceBase);
				}
				hex.appendChild(movingUnit);
			}
		}
		// Attempt to move to said hex.
		// Update to and from hexes.
		Sidebar.updateSelectedHex(hex.id);
		Sidebar.updateSelectedHex(origin.id);
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