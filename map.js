const HEX_WIDTH = 131,
	HEX_HEIGHT = 240;
var map = null,
	row = null;
var dragging = false;
var initialCoords = {};
var homeCoords = {
	x: HEX_WIDTH,
	y: HEX_HEIGHT
};

function initializeMap() {
	map = document.getElementById("map"),
	row = document.getElementById("row-template"),
	hex = document.getElementById("hex-template");
	row.removeAttribute("id");
	hex.removeAttribute("id");
	for (var i = 0; i < 10; i++){
		map.append(row.cloneNode(true));
	}
	[...document.getElementsByClassName("hex-row")].forEach((hexRow, index) => {
		for (var i = 0; i < 10; i++) {
			if (index === 5) {
				let newHex = hex.cloneNode(true);
				if (i === 3) {
					newHex.id = "friendly-capital";
					newHex.classList.add("blue");
				} else if (i === 7) {
					newHex.id = "enemy-capital";
					newHex.classList.add("red");
				}
				hexRow.append(newHex);
				continue;
			}
			hexRow.append(hex.cloneNode(true));
		}
	});
	map.scrollTop = HEX_HEIGHT;
	map.scrollLeft = HEX_WIDTH;
}

document.addEventListener("DOMContentLoaded", initializeMap, {once: true});

function beginDrag(event) {
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
	homeCoords.x += HEX_WIDTH;
	if (dragging) initialCoords.mapX += HEX_WIDTH;
}

function addHexToRowEnd() {
	[...document.getElementsByClassName("hex-row")].forEach(row => {
		row.append(hex.cloneNode(true));
	});
}

function addRowToTop() {
	var newRow = row.cloneNode(true);
	map.prepend(newRow, newRow.cloneNode(true));
	map.scrollTop += HEX_HEIGHT;
	homeCoords.y += HEX_HEIGHT;
	if (dragging) initialCoords.mapY += HEX_HEIGHT;
}

function addRowToBottom() {
	var newRow = row.cloneNode(true);
	map.append(newRow, newRow.cloneNode(true));
}

function recentre() {
	map.scrollTop = homeCoords.y;
	map.scrollLeft = homeCoords.x;
}