"use strict";

var Sidebar = {};
(function() {
	let abilities = {};
	let detail;
	let shipList = [];
	this.loadedState = 0;
	let selectedHex;
	const UNIT_TYPES = Wasm.getUnitTypes();

	function initializeSidebar() {
		detail = document.getElementById("ship-detail-template");
		detail.removeAttribute("id");
		[...detail.getElementsByClassName("ship-stats-bar")[0].childNodes].forEach(node => {
			if (node.nodeType === Node.TEXT_NODE) node.remove();
		});
		
		for (let i = 0; true; i++) {
			let c = document.getElementById("ability" + i + "-template");
			if (!c) break;
			abilities[i] = c;
			abilities[i].removeAttribute("id");
			abilities[i].removeChild(abilities[i].firstChild);
			abilities[i].removeChild(abilities[i].lastChild);
		}
		
		let loadouts = Wasm.getFleetConstructions();
		let list = document.getElementById("loadout-select");
		let template = document.createElement("div");
		template.classList.add("loadout-select");
		for (let i = 0; i < loadouts.length; i++) {
			let newItem = template.cloneNode(true);
			newItem.innerHTML = loadouts[i];
			newItem.setAttribute("onclick", "Sidebar.loadPlayer('" + loadouts[i] + "'," + i + ")");
			list.append(newItem);
		}
		this.toggle("loadout-select");
	}

	document.addEventListener("DOMContentLoaded", initializeSidebar.bind(this), {once: true});

	this.toggle = function(section) {
		let target = document.getElementById(section);
		if (target.style.maxHeight === "0px" || !target.style.maxHeight) {
			target.style.maxHeight = target.scrollHeight + "px";
		} else {
			target.style.maxHeight = "0px";
		}
	};
	
	this.selectHex = function(event) {
		// Clear previous selection.
		if (selectedHex){
			selectedHex.classList.remove("selected");
		}
		
		let target = Utils.findHex(event.clientX, event.clientY);
		if (selectedHex === target || !target){
			selectedHex = null;
			return;
		}
		selectedHex = target;
		selectedHex.classList.add("selected");
		this.findShipsInHex();
		// Open the Selected Fleet tab.
		document.getElementById("selected-fleet").style.maxHeight = "0px";
		this.toggle("selected-fleet");
	};
	
	this.updateSelectedHex = function(id) {
		if (selectedHex && id === selectedHex.id){
			this.findShipsInHex();
			// Toggle twice - this will recalculate the height of the tab if it's open, but keep it closed if it's not.
			this.toggle("selected-fleet");
			this.toggle("selected-fleet");
		}
	};
	
	this.findShipsInHex = function() {
		let friendlyShips = document.getElementById("friendly-selected-ships");
		let enemyShips = document.getElementById("enemy-selected-ships");
		
		// Clear previous selection.
		friendlyShips.innerHTML = "";
		enemyShips.innerHTML = "";
		
		selectedHex.childNodes.forEach(unit => {
			if (unit.nodeName == "#text") return; // Ignore the text node(s).
			if (unit.classList.contains("trace")) return; // Ignore ship's initial positions.
			let id = unit.id.slice(4);
			let ship = Wasm.getShip(Map.getShipDBId(id));
			ship.id = id;
			if (ship.allied) {
				placeInList(ship.shipClass, ship.currentHull, friendlyShips, this.createShipNode(ship, "sflt"));
			} else {
				enemyShips.append(this.createShipNode(ship, "sflt"));
			}
		});
	}
	
	function placeInList(type, currentHull, list, node){
		let nodes = list.childNodes;
		for (var i = 0; i < nodes.length; i++){
			if (nodes[i].nodeName == "#text") continue;
			if (type < nodes[i].dataset.unitClass || (type == nodes[i].dataset.unitClass && currentHull < nodes[i].getElementsByClassName("current-hull")[0].innerHTML)){
				list.insertBefore(node, nodes[i]);
				return;
			}
		}
		list.append(node);
	}
	
	this.addShip = function(ship) {
		shipList.push(ship);
		this.updateSelectedHex("0.0");
	};
	
	this.createShipNode = function(ship, idPrefix) {
		let newShip = detail.cloneNode(true);
		newShip.dataset.unitClass = ship.shipClass;
		newShip.getElementsByClassName("image")[0].appendChild(Map.getShipNode(ship.hullClass));
		newShip.getElementsByClassName("power")[0].innerHTML = ship.power;
		newShip.getElementsByClassName("current-hull")[0].innerHTML = ship.currentHull;
		newShip.getElementsByClassName("max-hull")[0].innerHTML = ship.maxHull;
		newShip.getElementsByClassName("shield")[0].innerHTML = ship.shield;
		newShip.getElementsByClassName("repair")[0].innerHTML = ship.repair;
		newShip.getElementsByClassName("cost")[0].innerHTML = ship.cost ? ship.cost : "";
		newShip.id = idPrefix + ship.id;
		ship.abilities.forEach(a => {
			newShip.getElementsByClassName("ability-bar")[0].append(abilities[a].cloneNode(true));
		});
		return newShip;
	}
	
	function removeShip(id) {
		let shipDetails = document.getElementById(id);
		if (shipDetails) shipDetails.remove();
		let index = shipList.indexOf(ship => ship.id === id);
		if (index > -1) shipList.splice(index, 1);
	}
	
	function readPriority(inputId) {
		let value = document.getElementById(inputId).value;
		// Scale value from 0.5 to 2
		value = Math.pow(2, value / 50 - 1);
		console.log("readPriority: value", value);
	}
	
	this.beginGame = function() {
		[...document.getElementsByClassName("hide-when-loaded")].forEach(e => e.remove());
		this.loadedState = 2;
		Wasm.gameLoaded();
		Timer.startGame();
	}
	
	// This function will likely have to be replaced with an AJAX call through Wasm.
	// I'm not sure what it will look like, though, so it's sitting here for now.
	this.loadPlayer = function(name, index) {
		if (this.loadedState === 2) return;
		this.loadedState = 1;
		let designs = Wasm.loadPlayer(name);
		[...document.getElementsByClassName("loadout-select")].forEach((loadout, i) => {
			if (index == i){
				loadout.classList.add("selected");
			} else {
				loadout.classList.remove("selected");
			}
		});
		let friendlySection = document.getElementById("friendly-ships-available");
		friendlySection.innerHTML = "";
		for (let i = 0; i < UNIT_TYPES; i++) {
			designs[i].id = i;
			let newShip = this.createShipNode(designs[i], "friendly-ship-class");
			newShip.setAttribute("onclick", "Empire.buyShip(" + i + ")");
			if (!designs[i].purchasable) {
				newShip.getElementsByClassName("cost")[0].innerHTML = "";
			}
			friendlySection.append(newShip);
		}
		document.getElementById("ships-available").style.maxHeight = "0px";
		this.toggle("ships-available");
	};
}).apply(Sidebar);