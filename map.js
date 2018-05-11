"use strict";

var Map = {};
(function() {
	const HEX_WIDTH = 131,
		HEX_HEIGHT = 240;
	let dragging = false;
	let initialCoords = {};
	// Lists of pairs of ids.  First is the map id, second is the database id.
	// An element is removed from this list if it is not displayed.
	let bases = [], ships = [], hexes = [];
	// Count of each element so we can always assign new IDs.
	let baseCount = 0, shipCount = 0;
	// DOM elements we don't want to keep searching for.
	let map, row, hex, friendlyCapital, enemyCapital, base = [], ship = [];

	function initializeMap() {
		// Load references to DOM elements from the HTML.
		map = document.getElementById("map");
		row = document.getElementById("row-template");
		hex = document.getElementById("hex-template");
		for (let i = 0; true; i++) {
			let b = document.getElementById("base" + i + "-template");
			if (!b) break;
			base[i] = b;
			base[i].removeAttribute("id");
			base[i].removeChild(base[i].firstChild);
			base[i].removeChild(base[i].lastChild);
		}
		for (let i = 0; true; i++) {
			let s = document.getElementById("ship" + i + "-template");
			if (!s) break;
			ship[i] = s;
			ship[i].removeAttribute("id");
			ship[i].removeChild(ship[i].firstChild);
			ship[i].removeChild(ship[i].lastChild);
		}
		row.removeAttribute("id");
		hex.removeAttribute("id");
		
		// Build the map.
		let numrows = Math.max(10, 2 * map.offsetHeight / HEX_HEIGHT + 3);
		let numcols = Math.max(12, map.offsetWidth / HEX_WIDTH + 2);
		for (let i = 0; i < numrows; i++){
			let newRow = row.cloneNode(true);
			// Number the rows; Row 0 has the capitals.
			newRow.id = (i - Math.floor(numrows / 2) + 1);
			map.append(newRow);
		}
		[...document.getElementsByClassName("hex-row")].forEach((hexRow, index) => {
			for (let i = 0; i < numcols; i++) {
				let newHex = hex.cloneNode(true);
				// Number the hexes: hex "0.0" is the friendly capital.
				newHex.id = hexRow.id + "." + (i - Math.floor(numcols / 2));
				if (index === Math.floor(numrows / 2)) {
					if (i === Math.floor(numcols / 2)) {
						newHex.classList.add("blue");
						friendlyCapital = newHex;
						let newBase = this.getBaseNode(0);
						newBase.id = getNewBaseId();
						newBase.classList.add("controlled");
						newHex.append(newBase);
					} else if (i === Math.floor(numcols / 2) + 4) {
						// Hex "0.4" is the enemy capital
						newHex.classList.add("red");
						enemyCapital = newHex;
						let newBase = this.getBaseNode(0);
						newBase.id = getNewBaseId();
						newHex.append(newBase);
					}
					hexRow.append(newHex);
					continue;
				}
				hexRow.append(newHex);
				createHex(newHex.id);
			}
		});
		this.recentre();
	}

	document.addEventListener("DOMContentLoaded", initializeMap.bind(this), {once: true});
	
	this.selectHex = function(event) {
		// Don't click after a drag.
		if (dragging) return;
		Sidebar.selectHex(event);
	}

	this.beginDrag = function(event) {
		if (event.which !== 1) return;
		let target = Utils.findItem(Utils.findHex(event.clientX, event.clientY), event.clientX, event.clientY);
		window.foo = target;
		ContextMenu.closeContextMenu();
		if (target){
			if (target.classList.contains("base")) {
				let id = target.id.slice(4);
				// Get base data from wasm.
				//if (base.level === 0) {
				if (true) {
					if (Ship.dragBase(event, target)) return;
				}
			}
			if (target.classList.contains("ship")) {
				if (Ship.dragShip(event, target)) return;
			}
		}
		window.addEventListener("mouseup", endDrag, {capture: true, once: true});
		map.addEventListener("mousemove", continueDrag);
		initialCoords = {
			x: event.clientX,
			y: event.clientY,
			mapX: map.scrollLeft,
			mapY: map.scrollTop,
			width: Number(window.getComputedStyle(map).width.slice(0,window.getComputedStyle(map).width.length - 2)),
			height: Number(window.getComputedStyle(map).height.slice(0,window.getComputedStyle(map).height.length - 2))
		};
	}

	function endDrag(event) {
		event.preventDefault(); // Prevent scrolling from also activating click events
		map.removeEventListener("mousemove", continueDrag);
		window.setTimeout(() =>	{dragging = false}, 0);
	}

	function continueDrag(event) {
		dragging = true; // Only set to dragging if the mouse moves.
		map.scrollLeft = initialCoords.mapX - event.clientX + initialCoords.x;
		map.scrollTop = initialCoords.mapY - event.clientY + initialCoords.y;
		if (map.scrollLeft < 100) {
			addHexToRowStart();
		}
		if (map.scrollTop < 100) {
			addRowToTop();
		}
		if (map.scrollWidth - map.scrollLeft - initialCoords.width < 100) {
			addHexToRowEnd();
		}
		if (map.scrollHeight - map.scrollTop - initialCoords.height < 100) {
			addRowToBottom();
		}
	}

	function addHexToRowStart() {
		[...document.getElementsByClassName("hex-row")].forEach(row => {
			let newHex = hex.cloneNode(true);
			newHex.id = row.id + "." + (parseInt(row.firstChild.id.slice(row.firstChild.id.indexOf(".") + 1)) - 1);
			row.prepend(newHex);
			createHex(newHex.id);
		});
		map.scrollLeft += HEX_WIDTH;
		if (dragging) initialCoords.mapX += HEX_WIDTH;
	}

	function addHexToRowEnd() {
		[...document.getElementsByClassName("hex-row")].forEach(row => {
			let newHex = hex.cloneNode(true);
			newHex.id = row.id + "." + (parseInt(row.lastChild.id.slice(row.lastChild.id.indexOf(".") + 1)) + 1);
			row.append(newHex);
			createHex(newHex.id);
		});
	}

	function addRowToTop() {
		// Add IDs to new hexes added when scrolling.
		let firstRowNum = parseInt(map.firstChild.id);
		let newRow = row.cloneNode(true);
		newRow.id = firstRowNum - 1;
		map.prepend(newRow);
		newRow = row.cloneNode(true);
		newRow.id = firstRowNum - 2;
		map.prepend(newRow);
		map.scrollTop += HEX_HEIGHT;
		if (dragging) initialCoords.mapY += HEX_HEIGHT;
	}

	function addRowToBottom() {
		// Add IDs to new hexes added when scrolling.
		let lastRowNum = parseInt(map.lastChild.id);
		let newRow = row.cloneNode(true);
		newRow.id = lastRowNum + 1;
		map.append(newRow);
		newRow = row.cloneNode(true);
		newRow.id = lastRowNum + 2;
		map.append(newRow);
	}
	
	function createHex(id) {
		if (id.substring(0,1) == ".") return;
		hexes.push({id: id, DBid: Wasm.addHex(id)});
	}

	this.recentre = function() {
		map.scrollTop = friendlyCapital.offsetTop + (friendlyCapital.clientHeight / 2) - (map.clientHeight / 2);
		map.scrollLeft = friendlyCapital.offsetLeft + (friendlyCapital.clientWidth / 2) - (map.clientWidth / 2);
	};

	function getNewBaseId() {
		let baseId = Wasm.addBase();
		let index = bases.findIndex(base => {
			return base.DBid === baseId;
		});
		if (index === -1){
			bases.push({id: baseCount, DBid: baseId});
		} else {
			bases[index].id = baseCount;
		}
		return "base" + baseCount++;
	}

	this.getNewShipId = function() {
		let shipId = Wasm.addShip();
		let index = ships.findIndex(ship => {
			return ship.DBid === shipId;
		});
		if (index === -1){
			ships.push({id: shipCount, DBid: shipId});
		} else {
			ships[index].id = shipCount;
		}
		return "ship" + shipCount++;
	}
	
	this.getBaseNode = function(type) {
		if (type > base.length - 1 || type < 0) type = 0;
		return base[type].cloneNode(true);
	};
	
	this.getShipNode = function(type) {
		if (type > ship.length - 1 || type < 0) type = 0;
		return ship[type].cloneNode(true);
	};
	
	this.clearTraces = function() {
		[...map.getElementsByClassName("trace")].forEach(trace => trace.remove());
		[...map.getElementsByClassName("ship")].forEach(ship => ship.name = "");
		[...map.getElementsByClassName("base")].forEach(base => base.name = "");
	};
	
	this.createShip = function(type, id, allied, location) {
		let targetHex;
		if (!location) {
			targetHex = friendlyCapital;
		} else {
			targetHex = document.getElementById(location);
		}
		let newShip = this.getShipNode(type);
		newShip.id = id;
		if (allied) newShip.classList.add("controlled");
		this.placeShip(newShip, allied, targetHex);
	};
	
	this.placeShip = function(movingShip, allied, targetHex) {
		movingShip.classList.remove([...movingShip.classList].find(c => {
			return c.slice(0, 14) === "ship-position-";
		}));
		let friendlyShipCount = 0 + [...targetHex.getElementsByClassName("ship")].reduce((count, unit) => {
			return count + ((unit.classList ? unit.classList.contains("controlled") : false) ? 1 : 0);
		}, 0);
		let enemyShipCount = 0 + [...targetHex.getElementsByClassName("ship")].reduce((count, unit) => {
			return count + ((unit.classList ? !unit.classList.contains("controlled") : false) ? 1 : 0);
		}, 0);
		if (allied && (friendlyShipCount < 5 || (friendlyShipCount < 10 && enemyShipCount === 0))) {
			movingShip.classList.add("ship-position-" + friendlyShipCount);
		} else if (!allied && enemyShipCount < 5) {
			movingShip.classList.add("ship-position-" + (enemyShipCount + 5));
		} else if (!allied && enemyShipCount < 10 && friendlyShipCount === 0) {
			movingShip.classList.add("ship-position-" + enemyShipCount - 5);
		} else {
			throw "NotImplementedError: Too many ships";
		}
		targetHex.append(movingShip);
	};
	
	this.replaceShips = function(targetHex){
		[...targetHex.getElementsByClassName("ship")].forEach(unit => {
			// Temporarily put ships on the template hex.
			hex.append(unit);
		});
		[...hex.getElementsByClassName("ship")].forEach(unit => {
			this.placeShip(unit, true, targetHex);
		});
	};
}).apply(Map);