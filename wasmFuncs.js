"use strict"

/*
* This file is just to hold functions which will later be moved into wasm.
* As such, they are stubs and may not have proper functionality.
*/

var Wasm = {};
(function() {
	let friendlyDesigns = [], enemyDesigns = [];
	let ships = [], bases = [];
	let hexes = [];
	let treasury = 12; // This is equivalent to two turns of capital income, with no hexes captured.
	const SHIP_TYPES = 10, BASE_TYPES = 4, MAX_ABILITIES = 3;
	let income = {capital: 6, territory: 1, majorPlanets: 0, minorPlanets: 0};
	
	this.getShipTypes = function() {return SHIP_TYPES;}
	this.getBaseTypes = function() {return BASE_TYPES;}
	this.getMaxAbilities = function() {return MAX_ABILITIES;}
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
	this.addBase = function(classNumber){
		let newBase = this.getBaseClass(classNumber);
		if (treasury < newBase.cost) return -1;
		treasury = Math.round(treasury - newBase.cost);
		newBase.id = Math.floor(Math.random() * 1000000000);
		newBase.x = 0;
		newBase.y = 0;
		newBase.allied = true;
		bases.push(newBase);
		return newBase.id;
	}
	this.upgradeBase = function(id){
		// This should look at local IPCs, not empire global IPCs.
		let targetBase = this.getBase(id);
		if (targetBase.level == BASE_TYPES - 1) return -1;
		let upgradedBase = this.getBaseClass(targetBase.level + 1);
		if (upgradedBase.cost > treasury) return -1;
		treasury = Math.round(treasury - upgradedBase.cost);
		targetBase.power = upgradedBase.power;
		targetBase.currentHull += upgradedBase.maxHull - targetBase.maxHull;
		targetBase.maxHull = upgradedBase.maxHull;
		targetBase.shield = upgradedBase.shield;
		targetBase.repair = upgradedBase.repair;
		targetBase.level++;
		this.saveBase(targetBase);
		return targetBase;
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
	this.getBaseHullClass = function(classNumber){
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
			default:
				throw "Error: Base of level " + classNumber + " does not exist.";
		}
		instance.currentHull = instance.maxHull;
		instance.level = classNumber;
		instance.id = null;
		instance.allied = true;
		instance.abilities = [];
		return instance;
	}
	// In this function, classNumber is 0-9 for friendly ships, 10-19 for enemy ships.
	this.getShipClass = function (classNumber) {
		if (classNumber < SHIP_TYPES){
			return JSON.parse(JSON.stringify(friendlyDesigns[classNumber]));
		} else {
			return JSON.parse(JSON.stringify(enemyDesigns[classNumber - SHIP_TYPES]));
		}
	}
	// In this function, classNumber is 0-3 for friendly bases, 4-7 for enemy bases.
	this.getBaseClass = function (classNumber) {
		if (classNumber < BASE_TYPES){
			return JSON.parse(JSON.stringify(friendlyDesigns[SHIP_TYPES + classNumber]));
		} else {
			return JSON.parse(JSON.stringify(enemyDesigns[SHIP_TYPES + classNumber - BASE_TYPES]));
		}
	}
	this.getBase = function(id){
		let requestedBase = bases.find(base => base.id === id);
		if (!requestedBase) throw "Error: Base with ID " + id + " does not exist.";
		return JSON.parse(JSON.stringify(requestedBase));
	}
	this.saveBase = function(base){
		let requestedBaseId = bases.findIndex(b => b.id === base.id);
		if (requestedBaseId === -1) throw "Error: Base with ID " + id + " does not exist.";
		bases[requestedBaseId] = base;
	}
	this.getShip = function(id){
		let requestedShip = ships.find(ship => ship.id === id);
		if (!requestedShip) throw "Error: Ship with ID " + id + " does not exist.";
		return JSON.parse(JSON.stringify(requestedShip));
	}
	this.saveShip = function(ship){
		let requestedShipId = ships.findIndex(s => s.id === ship.id);
		if (requestedShipId === -1) throw "Error: Ship with ID " + id + " does not exist.";
		ships[requestedShipId] = ship;
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
			treasury += this.getEmpireIncome().total;
			Timer.beginNewTurn();
			this.computeTerritoryOwnership();
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
	this.getAbilityDetails = function(index) {
		let abilities = [
			{cost: 3, name: "Scout Sensors", description: "Allows the ship to detect terrain and enemy units 2 hexes away.", base: false},
			{cost: 3, name: "Efficient Warp Fields", description: "Allows the ship to enter combat if intercepted.", base: false},
			{cost: 3, name: "Booster Packs", description: "Allows the ship to move 3 hexes and engage enemy units.", base: false},
			{cost: 3, name: "Engine Stabilizers", description: "Allows the ship to move 4 hexes in a single turn.", base: false},
		];
		return abilities[index];
	}
	this.computeTerritoryOwnership = function() {
		hexes.forEach(hex => {
			let nearbyShips = ships.filter(ship => {
				if ((ship.x == hex.x || (ship.x + 1 == hex.x && (Math.abs(ship.y % 2) === 1 || ship.y == hex.y)) || (ship.x - 1 == hex.x && (Math.abs(ship.y % 2) === 0 || ship.y == hex.y))) &&
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
		Map.drawVision();
	}
	this.getHexOwner = function(id) {
		let requestedHex = hexes.find(hex => hex.id === id);
		if (!requestedHex) throw "Error: Hex with ID " + id + " does not exist.";
		return requestedHex.owner;
	}
	this.moveBase = function(id, y, x){
		// Find out if there is an enemy unit here.
		// Also do validation.
		let targetBase = this.getBase(id);
		targetBase.x = +x;
		targetBase.y = +y;
		this.saveBase(targetBase);
	}
	this.moveShip = function(id, y1, x1, y2 = null, x2 = null, y3 = null, x3 = null, y4 = null, x4 = null){
		// Find out about enemy movements.
		// Also do validation for each space.
		let targetShip = this.getShip(id);
		targetShip.x = +(x4 || x3 || x2 || x1);
		targetShip.y = +(y4 || y3 || y2 || y1);
		this.saveShip(targetShip);
	}
	this.loadPlayer = function(name, friendly) {
		if (!localStorage[name]) name = "default";
		let designs = JSON.parse(localStorage[name].slice(3));
		designs = designs.map((unit, index) => {
			return index < SHIP_TYPES ? calculateShip(unit, unit.id) : calculateBase(unit, unit.id, index, designs);
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
			let abilityVals = Wasm.getAbilityDetails(c);
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
	function calculateBase(design, id, index, designs) {
		let baseCalc = Wasm.getBaseHullClass(design.hullClass);
		for (var i = SHIP_TYPES; i <= index; i++) {
			designs[i].parts.forEach(p => {
				let partVals = Wasm.getPartDetails(p);
				baseCalc.power += partVals.power ? partVals.power : 0;
				baseCalc.maxHull += partVals.maxHull ? partVals.maxHull : 0;
				baseCalc.shield += partVals.shield ? partVals.shield : 0;
				baseCalc.repair += partVals.repair ? partVals.repair : 0;
				if (i === index) baseCalc.cost += partVals.cost;
			});
		}
		baseCalc.abilities = [];
		design.abilities.forEach(c => {
			let abilityVals = Wasm.getAbilityDetails(c);
			baseCalc.abilities.push(c);
			baseCalc.power += abilityVals.power ? abilityVals.power : 0;
			baseCalc.maxHull += abilityVals.maxHull ? abilityVals.maxHull : 0;
			baseCalc.shield += abilityVals.shield ? abilityVals.shield : 0;
			baseCalc.repair += abilityVals.repair ? abilityVals.repair : 0;
			baseCalc.cost += abilityVals.cost;
		});
		
		// Calculate the total cost of the base.
		baseCalc.cost = Math.floor(Math.pow(baseCalc.cost, 1.1));
		baseCalc.id = id;
		baseCalc.level = index - SHIP_TYPES;
		return baseCalc;
	}
}).apply(Wasm);