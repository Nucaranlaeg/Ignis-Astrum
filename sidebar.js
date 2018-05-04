"use strict";

var Sidebar = {};
(function() {
	var abilities = {};
	var detail;
	var shipList = [];

	function initializeSidebar() {
		detail = document.getElementById("ship-detail-template");
		detail.removeAttribute("id");
		
		addShip({shipClass: 1, power: 3, currentHull: 3, maxHull: 5, shield: 1, repair: 1, id: "ship0", allied: true});
		addShip({shipClass: 1, power: 2, currentHull: 4, maxHull: 7, shield: 0, repair: 1, id: "ship1", allied: false});
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
	
	function silentAddShip(ship) {
		shipList.push(ship);
	};

	function addShip(ship) {
		let section = ship.allied ? document.getElementById("friendly-ships-seen") : document.getElementById("enemy-ships-seen");
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
		shipList.push(ship);
		section.append(newShip);
	}
	
	function removeShip(id) {
		let node = document.getElementById(id);
		if (node) node.remove();
		let index = shipList.indexOf(ship => ship.id === id);
		if (index > -1) shipList.splice(index, 1);
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
		shipList.forEach(ship => addShip);
	}

	function readPriority(inputId) {
		let value = document.getElementById(inputId).value;
		// Scale value from 0.5 to 2
		value = Math.pow(2, value / 50 - 1);
		console.log(value);
	}
}).apply(Sidebar);