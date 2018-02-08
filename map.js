var map = null;
var row = null;
var dragging = false;
var initialCoords = {};
const hex = "<div class='hex'></div>",
	HEX_WIDTH = 150,
	HEX_HEIGHT = 264;

function initialize() {
	map = document.getElementById("map");
	row = document.getElementById("row-template");
	addRowToTop();
}

document.addEventListener("DOMContentLoaded", initialize);

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
		row.insertAdjacentHTML('afterbegin', hex);
	});
	map.scrollLeft += HEX_WIDTH;
	if (dragging) initialCoords.mapX += HEX_WIDTH;
}

function addHexToRowEnd() {
	[...document.getElementsByClassName("hex-row")].forEach(row => {
		row.insertAdjacentHTML('beforeend', hex);
	});
}

function addRowToTop() {
	var newRow = row.cloneNode(true);
	newRow.id = null;
	map.prepend(newRow, newRow.cloneNode(true));
	map.scrollTop += HEX_HEIGHT;
	if (dragging) initialCoords.mapY += HEX_HEIGHT;
}

function addRowToBottom() {
	var newRow = row.cloneNode(true);
	newRow.id = null;
	map.append(newRow, newRow.cloneNode(true));
}