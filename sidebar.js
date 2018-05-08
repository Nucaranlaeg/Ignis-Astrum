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
		
		// Build the ships available list
		let friendlySection = document.getElementById("friendly-ships-available");
		let enemySection = document.getElementById("enemy-ships-available");
		let newShip;
		for (let i = 0; i < SHIP_CLASSES; i++){
			newShip = detail.cloneNode(true);
			newShip.id = "friendly-ship-class" + i;
			friendlySection.append(newShip);
			
			newShip = detail.cloneNode(true);
			newShip.id = "enemy-ship-class" + i;
			newShip.style.display = "none";
			enemySection.append(newShip);
		}
		
		//addShip({shipClass: 1, power: 3, currentHull: 3, maxHull: 5, shield: 1, repair: 1, id: "ship0", allied: true});
		//addShip({shipClass: 1, power: 2, currentHull: 4, maxHull: 7, shield: 0, repair: 1, id: "ship1", allied: false});
	}

	document.addEventListener("DOMContentLoaded", initializeSidebar, {once: true});

	this.toggle = function(section) {
		let target = document.getElementById(section);
		if (target.style.maxHeight === "0px" || !target.style.maxHeight) {
			target.style.maxHeight = target.scrollHeight + "px";
		} else {
			target.style.maxHeight = "0px";
		}
	};
	
	this.selectHex = function(event) {
		let friendlyShips = document.getElementById("friendly-selected-ships");
		let enemyShips = document.getElementById("enemy-selected-ships");
		let friendlyBases = document.getElementById("friendly-selected-bases");
		let enemyBases = document.getElementById("enemy-selected-bases");
		
		// Clear previous selection
		if (selectedHex){
			selectedHex.classList.remove("selected");
			friendlyShips.innerHTML = "";
			enemyShips.innerHTML = "";
			friendlyBases.innerHTML = "";
			enemyBases.innerHTML = "";
		}
		
		let target = Utils.findHex(event.clientX, event.clientY);
		if (selectedHex === target){
			selectedHex = null;
			return;
		}
		selectedHex = target;
		selectedHex.classList.add("selected");
		selectedHex.childNodes.forEach(e => {
			if (e.nodeName == "#text") return; // Ignore the text node.
			if (e.classList.contains("source")) return; // Ignore ship's initial positions.
			let type = e.id.slice(0,4);
			switch (type) {
				case "ship":
					let ship = Wasm.getShip(e.id.slice(4));
					if (ship.allied) {
						friendlyShips.append(createShipNode(ship));
					} else {
						enemyShips.append(createShipNode(ship));
					}
					break;
				case "base":
					let base = Wasm.getBase(e.id.slice(4));
					if (base.allied) {
						friendlyBases.append(createBaseNode(base));
					} else {
						enemyBases.append(createBaseNode(base));
					}
					break;
			}
		});
		// Open the Selected Fleet tab.
		document.getElementById("selected-fleet").style.maxHeight = "0px";
		this.toggle("selected-fleet");
	}
	
	function addShip(ship) {
		shipList.push(ship);
	};

	function createShipNode(ship) {
		let newShip = detail.cloneNode(true);
		newShip.getElementsByClassName("power")[0].innerHTML = ship.power;
		newShip.getElementsByClassName("current-hull")[0].innerHTML = ship.currentHull;
		newShip.getElementsByClassName("max-hull")[0].innerHTML = ship.maxHull;
		newShip.getElementsByClassName("shield")[0].innerHTML = ship.shield;
		newShip.getElementsByClassName("repair")[0].innerHTML = ship.repair;
		newShip.id = ship.id;
		for (let i in ship.abilities) {
			newShip.getElementsByClassName("ability-bar")[0].append(abilities[i]);
		}
		return newShip;
	}

	function createBaseNode(base) {
		let newBase = detail.cloneNode(true);
		newBase.getElementsByClassName("power")[0].innerHTML = base.power;
		newBase.getElementsByClassName("current-hull")[0].innerHTML = base.currentHull;
		newBase.getElementsByClassName("max-hull")[0].innerHTML = base.maxHull;
		newBase.getElementsByClassName("shield")[0].innerHTML = base.shield;
		newBase.getElementsByClassName("repair")[0].innerHTML = base.repair;
		newBase.id = base.id;
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
		let section = document.getElementById("friendly-ships-seen")
		while (section.firstChild) {
			section.firstChild.remove();
		}
		section = document.getElementById("enemy-ships-seen");
		while (section.firstChild) {
			section.firstChild.remove();
		}
		shipList.sort((shipA, shipB) => {
			if (shipA.shipClass - shipB.shipClass !== 0) return shipA.shipClass - shipB.shipClass;
			return shipA.currentHull - shipB.currentHull;
		});
		shipList.forEach(ship => {
			let section = ship.allied ? document.getElementById("friendly-ships-seen") : document.getElementById("enemy-ships-seen");
			section.append(createShipNode(ship));
		});
	}

	function readPriority(inputId) {
		let value = document.getElementById(inputId).value;
		// Scale value from 0.5 to 2
		value = Math.pow(2, value / 50 - 1);
		console.log("readPriority: value", value);
	}
}).apply(Sidebar);