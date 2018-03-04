"use strict";

var Map = {};
(function() {
	const HEX_WIDTH = 131,
		HEX_HEIGHT = 240;
	var dragging = false;
	var initialCoords = {};
	// Lists of pairs of ids.  First is the map id, second is the database id.
	// An element is removed from this list if it is not displayed.
	var bases = [], ships = [], hexes = [];
	// Count of each element so we can always assign new IDs.
	var baseCount = 0, shipCount = 0, hexCount = 0;
	// DOM elements we don't want to keep searching for.
	var map, row, hex, friendlyCapital, enemyCapital, base = [];

	function initializeMap() {
		map = document.getElementById("map");
		row = document.getElementById("row-template");
		hex = document.getElementById("hex-template");
		for (let i = 0; i < 4; i++) {
			base[i] = document.getElementById("base" + i + "-template");
			base[i].removeAttribute("id");
		}
		row.removeAttribute("id");
		hex.removeAttribute("id");
		for (let i = 0; i < 10; i++){
			map.append(row.cloneNode(true));
		}
		[...document.getElementsByClassName("hex-row")].forEach((hexRow, index) => {
			for (let i = 0; i < 12; i++) {
				let newHex = hex.cloneNode(true);
				newHex.id = getNewHexId();
				if (index === 5) {
					if (i === 5) {
						newHex.classList.add("blue");
						friendlyCapital = newHex;
						let newBase = base[0].cloneNode(true);
						newBase.id = getNewBaseId();
						newHex.append(newBase);
					} else if (i === 9) {
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
		let target = ContextMenu.findItem(ContextMenu.findHex(event.clientX, event.clientY), event.clientX, event.clientY);
		if (target && !target.classList.contains("base")) return; // Add that base level 1 stops drags.
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
			row.prepend(hex.cloneNode(true));
		});
		map.scrollLeft += HEX_WIDTH;
		if (dragging) initialCoords.mapX += HEX_WIDTH;
	}

	function addHexToRowEnd() {
		[...document.getElementsByClassName("hex-row")].forEach(row => {
			row.append(hex.cloneNode(true));
		});
	}

	function addRowToTop() {
		map.prepend(row.cloneNode(true), row.cloneNode(true));
		map.scrollTop += HEX_HEIGHT;
		if (dragging) initialCoords.mapY += HEX_HEIGHT;
	}

	function addRowToBottom() {
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