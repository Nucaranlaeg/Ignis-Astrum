"use strict"

var Ship = {};
(function() {
	let movingUnit = null, dragElement = null;
	let traceCount = 0;
	let movingUnitTraces = null;
	
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
		let movingUnitDetails = Wasm.getShip(Map.getShipDBId(movingUnit.id.slice(4)));
		if (Utils.calculateDistance(source, target) <= movingUnitDetails.range) {
			// Test if there's an enemy unit in the hex - bases can't be a part of offensive operations.
			// Don't prevent this movement; it's valid if the enemy moves out.
			if ([...hex.childNodes].some(unit => {
				if (unit.nodeName === "#text") return false; // Ignore text nodes.
				// Need to also test for enemy-controlled planets.
				return !unit.classList.contains("controlled") && (unit.classList.contains("base") || unit.classList.contains("ship"));
			})) {
				// Add setting to suppress this message.
				ContextMenu.loadInfoWindow("Note that Bases cannot participate in offensive operations.");
			}
			
			if (!movingUnit.name){
				movingUnit.name = movingUnit.parentNode.id;
				let sourceShip = movingUnit.cloneNode(true);
				sourceShip.classList.add("trace");
				sourceShip.name = sourceShip.id;
				sourceShip.dataset.traceNumber = traceCount++;
				sourceShip.removeAttribute("id");
				sourceShip.classList.remove("moving");
				movingUnit.parentNode.appendChild(sourceShip);
				// Add some kind of movement arrow.
			}
			movingUnitDetails.centralDisplay ? Map.placeBase(movingUnit, hex) : Map.placeShip(movingUnit, true, hex);
			Map.replaceShips(origin);
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
	
	// Add info message that holding down ctrl will allow moving into a hex that was previously entered.
	// Add info message that holding down shift will restrict movement to 2 hexes.
	function enterHex(hex, ctrl, shift) {
		// If shift is held down, reduce the maximum number of hexes to 2.
		// If the ship has fewer than the maximum number of traces...
			// ...and the hex is not adjacent to the previous one, pick one that is adjacent to the previous trace and call EnterHex on it first, then on the current one, then return.
			// ...and a hex with a trace is entered and ctrl is not held down, remove the most recent traces until that hex no longer has one.
			// ...add a trace.
		// If the hex is too distant, just return.
		// If one of the traces is adjacent to three others, one can be removed and a trace added.
		// Try removing the most recent trace and then calling the in-between hex.
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