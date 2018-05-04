"use strict";

var ContextMenu = {};
(function() {
	let contextMenu;
	const menuItems = [];
	const contextMenuMask = {
		friendlyShip: [false, true, true],
		enemyShip: [true, false, false],
		friendlyFleet: [false, true, true],
		enemyFleet: [false, false, false],
		friendlyBase: [false, true, true],
		enemyBase: [true, false, false],
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

	function loadContextMenu(event) {
		let targetHex = Utils.findHex(event.clientX, event.clientY);
		if (!targetHex) {
			event.preventDefault();
			return;
		}
		let target = Utils.findItem(targetHex, event.clientX, event.clientY);
		let targetMenu = null;
		if (target === undefined) {
			targetMenu = contextMenuMask.hex;
		} else if (target.classList.contains("base")) {
			targetMenu = contextMenuMask.friendlyBase;
			// targetMenu = contextMenuMask[(target.classList.contains("player" + playerId) ? "friendly" : "enemy") + "Base"];
		} else if (target.classList.contains("ship")) {
			targetMenu = contextMenuMask.friendlyShip;
			// targetMenu = contextMenuMask[(target.classList.contains("player" + playerId) ? "friendly" : "enemy") + "Ship"];
		} else if (target.classList.contains("ship")) {
			targetMenu = contextMenuMask.friendlyFleet;
			// targetMenu = contextMenuMask[(target.classList.contains("player" + playerId) ? "friendly" : "enemy") + "Fleet"];
		} else {
			return;
		}
		contextMenu.classList.add("active");
		contextMenu.style.top = event.clientY + "px";
		contextMenu.style.left = event.clientX + "px";
		menuItems.forEach((item, index) => {
			if (!item) return;
			if (targetMenu[index]) {
				item.classList.add("active");
			} else {
				item.classList.remove("active");
			}
		});
		return false;
	}
	window.oncontextmenu = loadContextMenu.bind(this);

	document.addEventListener("click", () => {
		contextMenu.classList.remove("active");
	});

	document.addEventListener("keyup", (event) => {
		if (event.keyCode === 27) this.closeContextMenu();
	});
	
	this.closeContextMenu = function() {
		contextMenu.classList.remove("active");
	}

	this.preventClose = function(event) {
		event.stopPropagation();
	};
}).apply(ContextMenu);