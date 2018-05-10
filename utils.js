"use strict"

var Utils = {};
(function() {
	this.findHex = function(x, y) {
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
	};
	
	// Returns the first element clicked on.
	this.findItem = function(targetHex, x, y) {
		return this.findItems(targetHex, x, y)[0];
	};
	
	// Returns all elements clicked on.
	this.findItems = function(targetHex, x, y) {
		if (!targetHex) return [];
		return [...targetHex.children].filter(item => {
			// Ignore whatever has moved away.
			if (item.classList.contains("trace")) return false;
			let target = item.getBoundingClientRect();
			return (x >= target.left && x <= target.right && y >= target.top && y <= target.bottom);
		});
	};
	
	this.calculateDistance = function(source, target) {
		let dx = (source[1] - Math.floor(source[0] / 2)) - (target[1] - Math.floor(target[0] / 2));
		let dy = source[0] - target[0];
		if (dx * dy > 0) {
			return Math.abs(dx + dy);
		} else {
			return Math.max(Math.abs(dx), Math.abs(dy));
		}
	};
}).apply(Utils);