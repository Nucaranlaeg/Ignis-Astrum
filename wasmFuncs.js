"use strict"

/*
* This file is just to hold functions which will later be moved into wasm.
* As such, they are stubs and may not have proper functionality.
*/

var Wasm = {};
(function() {
	let friendlyDesigns = [], enemyDesigns = [];
	let ships = [];
	let hexes = [];
	let treasury = 7;
	let income = {capital: 6, territory: 1, majorPlanets: 0, minorPlanets: 0};
	
	this.addHex = function(context){
		let newHex = {x: context.split('.')[1],
					  y: context.split('.')[0],
					  id: Math.floor(Math.random() * 1000000000),
					  owner: 0};
		if (newHex.x == 0 && newHex.y == 0) newHex.owner = 1;
		if (newHex.x == 4 && newHex.y == 0) newHex.owner = -1;
		hexes.push(newHex);
		return newHex.id;
	}
	this.addBase = function(){
		return Math.floor(Math.random() * 1000000000);
	}
	this.addShip = function(classNumber){
		let newShip = this.getShipClass(classNumber);
		if (treasury < newShip.cost) return -1;
		treasury = Math.round(treasury - newShip.cost);
		newShip.id = Math.floor(Math.random() * 1000000000);
		newShip.x = 0;
		newShip.y = 0;
		newShip.allied = true;
		ships.push(newShip);
		return newShip.id;
	}
	this.getHullClass = function(classNumber) {
		let instance;
		switch (parseInt(classNumber)) {
			case 0:
				instance = {power: 3, maxHull: 3, shield: 0, repair: 1, cost: 3};
				break;
			case 1:
				instance = {power: 5, maxHull: 5, shield: 0, repair: 1, cost: 5};
				break;
			case 2:
				instance = {power: 8, maxHull: 8, shield: 1, repair: 1, cost: 10};
				break;
			case 3:
				instance = {power: 10, maxHull: 10, shield: 1, repair: 1, cost: 13};
				break;
			case 4:
				instance = {power: 15, maxHull: 15, shield: 2, repair: 1, cost: 18};
				break;
			case 5:
				instance = {power: 3, maxHull: 2, shield: 1, repair: 0, cost: 3};
				break;
			case 6:
				instance = {power: 5, maxHull: 4, shield: 1, repair: 0, cost: 5};
				break;
			case 7:
				instance = {power: 8, maxHull: 6, shield: 2, repair: 0, cost: 10};
				break;
			case 8:
				instance = {power: 10, maxHull: 8, shield: 2, repair: 0, cost: 13};
				break;
			case 9:
				instance = {power: 15, maxHull: 12, shield: 3, repair: 0, cost: 18};
				break;
			default:
				instance = {power: 0, maxHull: 0, shield: 0, repair: 0, cost: 0};
		}
		instance.currentHull = instance.maxHull;
		instance.shipClass = classNumber;
		instance.hullClass = classNumber;
		instance.id = null;
		instance.allied = true;
		instance.abilities = [];
		return instance;
	}
	this.getBaseClass = function(classNumber){
		let instance;
		switch (parseInt(classNumber)) {
			case 0:
				instance = {power: 3, maxHull: 3, shield: 1, repair: 3, cost: 4.32};
				break;
			case 1:
				instance = {power: 6, maxHull: 6, shield: 2, repair: 6, cost: 4.32};
				break;
			case 2:
				instance = {power: 9, maxHull: 9, shield: 3, repair: 9, cost: 4.32};
				break;
			case 3:
				instance = {power: 12, maxHull: 12, shield: 4, repair: 12, cost: 4.32};
				break;
		}
		instance.currentHull = instance.maxHull;
		instance.hullClass = classNumber;
		instance.id = null;
		instance.allied = true;
		instance.abilities = [];
		return instance;
	}
	// In this function, classNumber is 0-9 for friendly ships, 10-19 for enemy ships.
	this.getShipClass = function (classNumber) {
		if (classNumber < 10){
			return JSON.parse(JSON.stringify(friendlyDesigns[classNumber]));
		} else {
			return JSON.parse(JSON.stringify(enemyDesigns[classNumber - 10]));
		}
	}
	this.getBase = function(id){
		let base = {level: Math.floor(Math.random() * 4), power: 5, currentHull: 5, maxHull: 5, shield: 1, repair: 3, id: id, allied: false};
		if (id <= 1) base.allied = true;
		return base;
	}
	this.getShip = function(id){
		let requestedShip = ships.find(ship => ship.id === id);
		if (!requestedShip) throw "Error: Ship with ID " + id + " does not exist.";
		return requestedShip;
	}
	this.getEmpireIncome = function() {
		let sum = Object.keys(income).reduce((s, k) => {return s + income[k]}, 0);
		return {total: sum,
			capital: income.capital,
			territory: income.territory,
			majorPlanets: income.minorPlanets,
			minorPlanets: income.majorPlanets};
	}
	this.getEmpireTreasury = function() {
		return treasury;
	}
	this.signalTurnEnd = function() {
		window.setTimeout(() => {
			// Combat
			this.computeTerritoryOwnership();
			treasury += this.getEmpireIncome().total;
			Map.drawVision();
			Timer.beginNewTurn();
		}, 0);
	}
	this.signalContinueTurn = function() {
		return;
	}
	this.getPartDetails = function(index) {
		let parts = [
			{cost: 1, power: 1},
			{cost: 2, power: 2},
			{cost: 3, power: 4},
			{cost: 5, power: 8},
			{cost: 1, maxHull: 1},
			{cost: 2, maxHull: 3},
			{cost: 4, maxHull: 7},
			{cost: 8, maxHull: 15},
			{cost: 2, shield: 1},
			{cost: 3.5, shield: 2},
			{cost: 5, shield: 3},
			{cost: 6, shield: 4},
			{cost: 3, repair: 2},
			{cost: 5, repair: 4},
			{cost: 7, repair: 7},
			{cost: 9, repair: 10},
		];
		return parts[index];
	}
	this.getabilityDetails = function(index) {
		let abilities = [
			{cost: 3, name: "Scout Sensors", description: "Allows the ship to detect terrain and enemy units 2 hexes away."},
			{cost: 3, name: "Efficient Warp Fields", description: "Allows the ship to enter combat if intercepted."},
			{cost: 3, name: "Booster Packs", description: "Allows the ship to move 3 hexes and engage enemy units."},
			{cost: 3, name: "Engine Stabilizers", description: "Allows the ship to move 4 hexes in a single turn."},
		];
		return abilities[index];
	}
	this.computeTerritoryOwnership = function() {
		console.log("Calculating...");
		hexes.forEach(hex => {
			let nearbyShips = ships.filter(ship => {
				if ((ship.x == hex.x || (ship.x + 1 == hex.x && (ship.y % 2 === 1 || ship.y == hex.y)) || (ship.x - 1 == hex.x && (ship.y % 2 === 0 || ship.y == hex.y))) &&
				    (ship.y == hex.y || ship.y + 1 == hex.y || ship.y - 1 == hex.y)) return true;
				return false;
			});
			let presentShips = nearbyShips.filter(ship => {
				if (ship.x == hex.x && ship.y == hex.y) return true;
			});
			let friendlyPresence = nearbyShips.reduce((count, ship) => {return ship.allied ? ++count : count}, 0) +
								  presentShips.reduce((count, ship) => {return ship.allied ? ++count : count}, 0);
			let enemyPresence = nearbyShips.length + presentShips.length - friendlyPresence;
			if (hex.owner === 1 && (enemyPresence > friendlyPresence || friendlyPresence == 0)) {
				hex.owner = 0;
				income.territory--;
			} else if (hex.owner === -1 && (friendlyPresence > enemyPresence || enemyPresence == 0)) {
				hex.owner = 0;
			}
			if (hex.owner === 0) {
				if (friendlyPresence > enemyPresence * 2) {
					hex.owner = 1;
					income.territory++;
				} else if (enemyPresence > friendlyPresence * 2) {
					hex.owner = -1;
				}
			}
		});
	}
	this.getHexOwner = function(id) {
		let requestedHex = hexes.find(hex => hex.id === id);
		if (!requestedHex) throw "Error: Hex with ID " + id + " does not exist.";
		return requestedHex.owner;
	}
	this.loadPlayer = function(name, friendly) {
		if (!localStorage[name]) name = "default";
		let designs = JSON.parse(localStorage[name].slice(3));
		designs = designs.map((ship, index) => {
			return index < 10 ? calculateShip(ship, ship.id) : calculateBase(base, base.id);
		});
		if (friendly) {
			friendlyDesigns = designs;
		} else {
			enemyDesigns = designs;
		}
		return designs;
	}
	function calculateShip(design, id) {
		let shipCalc = Wasm.getHullClass(design.hullClass);
		design.parts.forEach(p => {
			let partVals = Wasm.getPartDetails(p);
			shipCalc.power += partVals.power ? partVals.power : 0;
			shipCalc.maxHull += partVals.maxHull ? partVals.maxHull : 0;
			shipCalc.shield += partVals.shield ? partVals.shield : 0;
			shipCalc.repair += partVals.repair ? partVals.repair : 0;
			shipCalc.cost += partVals.cost;
		});
		shipCalc.abilities = [];
		design.abilities.forEach(c => {
			let abilityVals = Wasm.getabilityDetails(c);
			shipCalc.abilities.push(c);
			shipCalc.power += abilityVals.power ? abilityVals.power : 0;
			shipCalc.maxHull += abilityVals.maxHull ? abilityVals.maxHull : 0;
			shipCalc.shield += abilityVals.shield ? abilityVals.shield : 0;
			shipCalc.repair += abilityVals.repair ? abilityVals.repair : 0;
			shipCalc.cost += abilityVals.cost;
		});
		
		// Calculate the total cost of the ship.
		shipCalc.cost = Math.floor(Math.pow(shipCalc.cost, 1.1));
		shipCalc.id = id;
		return shipCalc;
	}
}).apply(Wasm);