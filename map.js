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
	let baseCount = 0, shipCount = 0, hexCount = 0;
	// DOM elements we don't want to keep searching for.
	let map, row, hex, friendlyCapital, enemyCapital, base = [];

	function initializeMap() {
		// Load references to DOM elements from the HTML.
		map = document.getElementById("map");
		row = document.getElementById("row-template");
		hex = document.getElementById("hex-template");
		for (let i = 0; i < 4; i++) {
			base[i] = document.getElementById("base" + i + "-template");
			base[i].removeAttribute("id");
		}
		row.removeAttribute("id");
		hex.removeAttribute("id");
		
		// Build the map.
		let numrows = Math.max(10, 2 * map.offsetHeight / HEX_HEIGHT + 3);
		let numcols = Math.max(12, map.offsetWidth / HEX_WIDTH + 2);
		for (let i = 0; i < numrows; i++){
			map.append(row.cloneNode(true));
		}
		[...document.getElementsByClassName("hex-row")].forEach((hexRow, index) => {
			for (let i = 0; i < numcols; i++) {
				let newHex = hex.cloneNode(true);
				newHex.id = getNewHexId();
				if (index === Math.floor(numrows / 2)) {
					if (i === Math.floor(numcols / 2)) {
						newHex.classList.add("blue");
						friendlyCapital = newHex;
						let newBase = base[0].cloneNode(true);
						newBase.id = getNewBaseId();
						newBase.draggable = true;
						newHex.append(newBase);
					} else if (i === Math.floor(numcols / 2) + 4) {
						newHex.classList.add("red");
						enemyCapital = newHex;
						let newBase = base[0].cloneNode(true);
						newBase.id = getNewBaseId();
						newHex.append(newBase);
					}
					hexRow.append(newHex);
					continue;
				}
				hexRow.append(newHex);
			}
		});
		this.recentre();
	}

	document.addEventListener("DOMContentLoaded", initializeMap.bind(this), {once: true});

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
					Ship.dragBase(event, target);
					return;
				}
			}
			if (target.classList.contains("ship")) {
				Ship.dragShip(event, target);
				return;
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
		dragging = false;
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
			newHex.id = getNewHexId();
			row.prepend(newHex);
		});
		map.scrollLeft += HEX_WIDTH;
		if (dragging) initialCoords.mapX += HEX_WIDTH;
	}

	function addHexToRowEnd() {
		[...document.getElementsByClassName("hex-row")].forEach(row => {
			let newHex = hex.cloneNode(true);
			newHex.id = getNewHexId();
			row.append(newHex);
		});
	}

	function addRowToTop() {
		// Add IDs to new hexes added when scrolling.
		map.prepend(row.cloneNode(true), row.cloneNode(true));
		map.scrollTop += HEX_HEIGHT;
		if (dragging) initialCoords.mapY += HEX_HEIGHT;
	}

	function addRowToBottom() {
		// Add IDs to new hexes added when scrolling.
		map.append(row.cloneNode(true), row.cloneNode(true));
	}

	this.recentre = function() {
		map.scrollTop = friendlyCapital.offsetTop + (friendlyCapital.clientHeight / 2) - (map.clientHeight / 2);
		map.scrollLeft = friendlyCapital.offsetLeft + (friendlyCapital.clientWidth / 2) - (map.clientWidth / 2);
	};

	function getNewBaseId() {
		return "base" + baseCount++;
	}

	function getNewHexId() {
		return "hex" + hexCount++;
	}

	function getNewShipId() {
		return "ship" + shipCount++;
	}
}).apply(Map);