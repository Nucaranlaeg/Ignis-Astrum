"use strict";

var Sidebar = {};
(function() {
	let abilities = {};
	let detail;
	let shipList = [];
	let selectedHex;
	const SHIP_CLASSES = 10;

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
		let friendlyBases = document.getElementById("friendly-selected-bases");
		let enemyBases = document.getElementById("enemy-selected-bases");
		
		// Clear previous selection.
		friendlyShips.innerHTML = "";
		enemyShips.innerHTML = "";
		friendlyBases.innerHTML = "";
		enemyBases.innerHTML = "";
		
		selectedHex.childNodes.forEach(unit => {
			if (unit.nodeName == "#text") return; // Ignore the text node.
			if (unit.classList.contains("trace")) return; // Ignore ship's initial positions.
			let type = unit.id.slice(0,4);
			switch (type) {
				case "ship":
					let ship = Wasm.getShip(unit.id.slice(4));
					if (ship.allied) {
						friendlyShips.append(this.createShipNode(ship, "sflt"));
					} else {
						enemyShips.append(this.createShipNode(ship, "sflt"));
					}
					break;
				case "base":
					let base = Wasm.getBase(unit.id.slice(4));
					if (base.allied) {
						friendlyBases.append(this.createBaseNode(base, "bflt"));
					} else {
						enemyBases.append(this.createBaseNode(base, "bflt"));
					}
					break;
			}
		});
	}
	
	this.addShip = function(ship) {
		shipList.push(ship);
	};

	this.createShipNode = function(ship, idPrefix) {
		let newShip = detail.cloneNode(true);
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

	this.createBaseNode = function(base, idPrefix) {
		let newBase = detail.cloneNode(true);
		newBase.getElementsByClassName("image")[0].appendChild(Map.getBaseNode(base.level));
		newBase.getElementsByClassName("power")[0].innerHTML = base.power;
		newBase.getElementsByClassName("current-hull")[0].innerHTML = base.currentHull;
		newBase.getElementsByClassName("max-hull")[0].innerHTML = base.maxHull;
		newBase.getElementsByClassName("shield")[0].innerHTML = base.shield;
		newBase.getElementsByClassName("repair")[0].innerHTML = base.repair;
		newBase.id = idPrefix + base.id;
		for (let i in base.abilities) {
			newBase.getElementsByClassName("ability-bar")[0].append(abilities[i]);
		}
		return newBase;
	}
	
	function removeShip(id) {
		let shipDetails = document.getElementById(id);
		if (shipDetails) shipDetails.remove();
		let index = shipList.indexOf(ship => ship.id === id);
		if (index > -1) shipList.splice(index, 1);
	}
	
	function identifyShip(ship){
		shipClass = document.getElementById("enemy-ship-class" + ship.shipClass);
		shipClass.getElementsByClassName("power")[0].innerHTML = ship.power;
		shipClass.getElementsByClassName("current-hull")[0].innerHTML = ship.maxHull;
		shipClass.getElementsByClassName("max-hull")[0].innerHTML = ship.maxHull;
		shipClass.getElementsByClassName("shield")[0].innerHTML = ship.shield;
		shipClass.getElementsByClassName("repair")[0].innerHTML = ship.repair;
		shipClass.style.display = "block";
	}
	
	function sortList() {
		document.getElementById("friendly-ships-seen").innerHTML = "";
		document.getElementById("enemy-ships-seen").innerHTML = "";
		shipList.sort((shipA, shipB) => {
			if (shipA.shipClass - shipB.shipClass !== 0) return shipA.shipClass - shipB.shipClass;
			return shipA.currentHull - shipB.currentHull;
		});
		shipList.forEach(ship => {
			let section = ship.allied ? document.getElementById("friendly-ships-seen") : document.getElementById("enemy-ships-seen");
			section.append(this.createShipNode(ship, "list"));
		});
	}

	function readPriority(inputId) {
		let value = document.getElementById(inputId).value;
		// Scale value from 0.5 to 2
		value = Math.pow(2, value / 50 - 1);
		console.log("readPriority: value", value);
	}
	
	this.loadPlayers = function() {
		let player1Name = document.getElementById("player1-name").value;
		let player2Name = document.getElementById("player2-name").value;
		if (!player1Name || !player2Name) return;
		(loadPlayer.bind(Sidebar))(player1Name, true);
		(loadPlayer.bind(Sidebar))(player2Name, false);
		document.getElementById("load-player").remove();
	}
	
	// This function will likely have to be replaced with an AJAX call through Wasm.
	// I'm not sure what it will look like, though, so it's sitting here for now.
	function loadPlayer(name, friendly) {
		let designs = Wasm.loadPlayer(name, friendly);
		if (!friendly) return;
		let friendlySection = document.getElementById("friendly-ships-available");
		let enemySection = document.getElementById("enemy-ships-available");
		let thisSection;
		if (friendly) {
			thisSection = friendlySection;
		} else {
			thisSection = enemySection;
		}
		thisSection.innerHTML = "";
		for (let i = 0; i < 10; i++) {
			let newShip = this.createShipNode(designs[i], friendly ? "friendly-ship-class" : "enemy-ship-class");
			newShip.setAttribute("onclick", "Empire.buyShip(" + i + ")");
			thisSection.append(newShip);
		}
	};
}).apply(Sidebar);