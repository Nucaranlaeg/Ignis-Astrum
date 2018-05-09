"use strict";

var ContextMenu = {};
(function() {
	let contextMenu, shipMenu;
	let menuItems = [];
	let shipMenuClick = false;
	const contextMenuMask = {
		friendlyShip: [false, true, true],
		friendlyShipMenu: [false, false, true],
		enemyShip: [true, false, false],
		friendlyFleet: [false, true, true],
		enemyFleet: [false, false, false],
		friendlyBase: [false, true, true],
		friendlyBaseMenu: [false, false, true],
		enemyBase: [true, false, false],
		hex: [false, true, false],
		all: [true, true, true]
	}

	function initializeContextMenu() {
		contextMenu = document.getElementById("context-menu");
		menuItems[0] = document.getElementById("context-target-priority");
		menuItems[1] = document.getElementById("context-supply-grid");
		menuItems[2] = document.getElementById("context-repair");
		shipMenu = document.getElementById("ship-menu");
		shipMenu.oncontextmenu = () => {shipMenuClick = true;}
	}

	document.addEventListener("DOMContentLoaded", initializeContextMenu, {once: true});

	function loadContextMenu(event) {
		let targetMenu = null;
		let target;
		if (shipMenuClick) {
			shipMenuClick = false;
			target = event.target;
			while (target != shipMenu && target.parentNode != shipMenu) {
				target = target.parentNode;
			}
			if (target === shipMenu) {
				contextMenu.classList.remove("active");
				return false;
			}
		} else {
			this.closeContextMenu();
			let targetHex = Utils.findHex(event.clientX, event.clientY);
			if (!targetHex) {
				event.preventDefault();
				return;
			}
			target = Utils.findItems(targetHex, event.clientX, event.clientY);
			if (target.length > 1) {
				this.closeContextMenu();
				loadShipMenu(target, event.clientX, event.clientY);
				return false;
			} else {
				target = target !== undefined ? target[0] : undefined;
			}
		}
		if (target === undefined) {
			targetMenu = contextMenuMask.hex;
		} else {
			let type = target.id.slice(0, 4);
			switch (type) {
				case "base":
					targetMenu = contextMenuMask.friendlyBase;
					break;
				case "ship":
					targetMenu = contextMenuMask.friendlyShip;
					break;
				case "flet":
					targetMenu = contextMenuMask.friendlyFleet;
					break;
				case "bcxm":
					targetMenu = contextMenuMask.friendlyBaseMenu;
					break;
				case "scxm":
					targetMenu = contextMenuMask.friendlyShipMenu;
					break;
				default:
					return true;
			}
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
	
	function loadShipMenu(units, x, y) {
		shipMenu.innerHTML = "";
		units.forEach(unit => {
			let node;
			let type = unit.id.slice(0,4);
			switch (type) {
				case "ship":
					let ship = Wasm.getShip(unit.id.slice(4));
					node = Sidebar.createShipNode(ship, "scxm");
					if (ship.allied) {
						node.classList.add("friendly");
					} else {
						node.classList.add("enemy");
					}
					shipMenu.append(node);
					break;
				case "base":
					let base = Wasm.getBase(unit.id.slice(4));
					node = Sidebar.createBaseNode(base, "bcxm");
					if (base.allied) {
						node.classList.add("friendly");
					} else {
						node.classList.add("enemy");
					}
					shipMenu.append(node);
					break;
			}
		});
		shipMenu.classList.add("active");
		shipMenu.style.top = y + "px";
		shipMenu.style.left = x + "px";
	}

	document.addEventListener("click", this.closeContextMenu);

	document.addEventListener("keyup", (event) => {
		if (event.keyCode === 27) this.closeContextMenu();
	});
	
	this.closeContextMenu = function() {
		contextMenu.classList.remove("active");
		shipMenu.classList.remove("active");
	};

	this.preventClose = function(event) {
		event.stopPropagation();
	};
}).apply(ContextMenu);