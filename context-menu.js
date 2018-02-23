var contextMenu;
const menuItems = [];
const contextMenuMask = {
	ship: [true, true, true],
	fleet: [false, true, true],
	hex: [false, true, false],
	all: [true, true, true]
}

function initializeContextMenu() {
	contextMenu = document.getElementById("context-menu");
	menuItems[0] = document.getElementById("context-target-priority");
	menuItems[1] = document.getElementById("context-supply-grid");
	menuItems[2] = document.getElementById("context-repair");
}

document.addEventListener("DOMContentLoaded", initializeContextMenu, {once: true});

window.oncontextmenu = function (event) {
	let targetHex = findHex(event.clientX, event.clientY);
	if (!targetHex) {
		event.preventDefault();
		return;
	}
	let target = contextMenuMask.all; // TODO: determine what kind of item was clicked on
	contextMenu.classList.add("active");
	contextMenu.style.top = event.clientY + "px";
	contextMenu.style.left = event.clientX + "px";
	menuItems.forEach((item, index) => {
		if (!item) return;
		if (target[index]) {
			item.classList.add("active");
		} else {
			item.classList.remove("active");
		}
	});
	return false;
}

document.addEventListener("click", () => {
	contextMenu.classList.remove("active");
});

document.addEventListener("keyup", (event) => {
	if (event.keyCode === 27) contextMenu.classList.remove("active");
});

function preventClose(event) {
	event.stopPropagation();
}

function findHex(x, y) {
	// If code is encapsulated, change references to map.
	// Can't cache this, as it might change when panning.
	let rows = [...map.children],
		rowNum = null,
		hexes = null,
		rowOffset = null;
	x += map.scrollLeft;
	y += map.scrollTop;
	// Remove the edge case where the click is above the first row.
	if (y < 122) return null;
	// Each row is 120 pixels, and the flat part is 80 pixels tall.
	// 122 is where the flat bit of the first hex row starts.
	// If it's in that band, we know exactly which row it's in - otherwise it's in one of two.
	rowNum = Math.floor((y - 122) / 120);
	if ((y - 122) % 120 > 80) {
		console.log((y - 202) % 120, Math.abs((x - 29 - ((rowNum + 1 % 2) * 66)) % 131 - 66) / (66 / 40));
		if (((y - 202) % 120) < Math.abs((x - 29 - ((rowNum + 1 % 2) * 66)) % 131 - 66) / (66 / 40)) {
			// We're good, nothing to see here, but this makes the math easier.
		} else if (((y - 202) % 120) > Math.abs((x - 29 - ((rowNum + 1 % 2) * 66)) % 131 - 66) / (131 / 40)) {
			rowNum++;
		} else {
			return null;
		}
	}
	hexes = [...rows[rowNum].children];
	if (rowNum % 2) { // Odd rows have an offset of 95 pixels.
		rowOffset = 95;
	} else { // Even rows have an offset of 29 pixels
		rowOffset = 29;
	}
	// Remove the edge case where the click is before the first hex.
	if (x < rowOffset) return null;
	// Hexes are 131 pixels wide, but from 127-131 the click is between hexes.
	if ((x - rowOffset) % 131 >= 127) return null;
	return hexes[Math.floor((x - rowOffset) / 131)];
}