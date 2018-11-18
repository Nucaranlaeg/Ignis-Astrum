"use strict";

var ContextMenu = {};
(function() {
	let contextMenu, shipMenu, infoWindow, upgradeMenu, IPCs;
	let menuItems = [], supplyGrid;
	let shipMenuClick = false;
	let closeInfoWindow;
	const contextMenuMask = {
		friendlyShip: [true, false, true, true, false],
		friendlyShipMenu: [true, false, false, true, false],
		enemyShip: [true, true, false, false, false],
		friendlyFleet: [true, false, true, true, false],
		enemyFleet: [true, false, false, false, false],
		friendlyBase: [true, false, true, true, true],
		friendlyBaseMenu: [true, false, false, true, true],
		enemyBase: [true, true, false, false, false],
		hex: [false, false, true, false, false],
		all: [true, true, true, true, true]
	};
	const loadContextMenuEntry = [() => {return true}, () => {return true}, getIPCs, repairPossible, upgradePossible];

	function initializeContextMenu() {
		contextMenu = document.getElementById("context-menu");
		menuItems[0] = document.getElementById("context-target-info");
		menuItems[1] = document.getElementById("context-target-priority");
		menuItems[2] = supplyGrid = document.getElementById("context-supply-grid");
		menuItems[3] = document.getElementById("context-repair");
		menuItems[4] = document.getElementById("context-upgrade");
		shipMenu = document.getElementById("ship-menu");
		shipMenu.oncontextmenu = () => {shipMenuClick = true;}
		infoWindow = document.getElementById("info-window");
		upgradeMenu = document.getElementById("context-upgrade-base");
		IPCs = document.getElementById("context-ipcs");
	}

	document.addEventListener("DOMContentLoaded", initializeContextMenu, {once: true});

	function loadContextMenu(event) {
		let targetMenu;
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
			target = Utils.findHex(event.clientX, event.clientY);
		} else {
			let type = target.id.slice(0, 4);
			switch (type) {
				case "ship":
					if (target.classList.contains("base")){
						targetMenu = contextMenuMask.friendlyBase;
						break;
					}
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
		contextMenu.style.top = event.clientY + "px";
		contextMenu.style.left = event.clientX + "px";
		let someEntry = false;
		menuItems.forEach((item, index) => {
			if (!item) return;
			if (targetMenu[index] && loadContextMenuEntry[index](target)) {
				item.classList.add("active");
				someEntry = true;
			} else {
				item.classList.remove("active");
			}
		});
		if (someEntry) contextMenu.classList.add("active");
		return false;
	}
	
	window.oncontextmenu = loadContextMenu.bind(this);
	
	function loadShipMenu(units, x, y) {
		shipMenu.innerHTML = "";
		getIPCs(units[0].parentNode);
		shipMenu.append(supplyGrid.cloneNode(true));
		units.forEach(unit => {
			let node;
			let id = unit.id.slice(4);
			let ship = Wasm.getShip(Map.getShipDBId(id));
			ship.id = id;
			node = Sidebar.createShipNode(ship, ship.isBase ? "bxcm" : "scxm");
			if (ship.allied) {
				node.classList.add("friendly");
			} else {
				node.classList.add("enemy");
			}
			shipMenu.append(node);
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
		infoWindow.classList.remove("active");
	};

	this.preventClose = function(event) {
		event.stopPropagation();
	};
	
	function repairPossible(target) {
        let type = target.id.slice(0, 4), id = target.id.slice(4);
	    let targetShip;
		switch (type) {
			case "ship":
				targetShip = Wasm.getShip(Map.getShipDBId(id));
				if (targetShip.currentHull === targetShip.maxHull) return false;
				break;
			case "scxm":
				targetShip = Wasm.getShip(Map.getShipDBId(id));
				if (targetShip.currentHull === targetShip.maxHull) return false;
				break;
			case "bcxm":
				targetShip = Wasm.getShip(Map.getShipDBId(id));
				if (targetShip.currentHull === targetShip.maxHull) return false;
				break;
			default:
				return false;
		}
		return true;
	}
	
	function upgradePossible(target) {
		if ([...document.getElementsByClassName("trace")].some(trace => trace.name == target.id)) return;
		let id = target.id.slice(4);
		let targetBase = Wasm.getShip(Map.getShipDBId(id));
		if (!targetBase.upgradeable) return false;
		let upgradedBase = Wasm.getShipClass(targetBase.upgradeTo);
		upgradedBase.currentHull = upgradedBase.maxHull - targetBase.maxHull + targetBase.currentHull;
		upgradedBase.id = id;
		let node = Sidebar.createShipNode(upgradedBase, "bupm");
		node.getElementsByClassName("cost")[0].innerHTML = "";
		node.classList.add("friendly");
		node.setAttribute("onclick", "ContextMenu.closeContextMenu(); Empire.upgradeBase(" + id + "); Sidebar.updateSelectedHex('" + target.parentNode.id + "')");
		upgradeMenu.innerHTML = "";
		upgradeMenu.append(node);
		return true;
	}
	
	function getIPCs(target) {
		let loc = target.classList.contains("hex") ? target.id : target.parentNode.id;
		IPCs.innerHTML = Wasm.getHexIPCs(...loc.split('.'));
		return true;
	}
	
	this.loadInfoWindow = function(message, x = 75, y = 40) {
		infoWindow.innerHTML = message;
		infoWindow.classList.add("active");
		infoWindow.style.top = y + "px";
		infoWindow.style.left = x + "px";
		window.clearTimeout(closeInfoWindow);
		closeInfoWindow = window.setTimeout(() => {infoWindow.classList.remove("active")}, 2500);
	}
	
}).apply(ContextMenu);