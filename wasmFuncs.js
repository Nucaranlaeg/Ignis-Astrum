"use strict"

/*
* This file is just to hold functions which will later be moved into wasm.
* As such, they are stubs and may not have proper functionality.
*/

var Wasm = {};
(function() {
	let friendlyDesigns = [], enemyDesigns = [];
	let ships = [], bases = [];
	let hexes = [], grids = [];
	let income = 13;
	const SHIP_TYPES = 10, BASE_TYPES = 4, MAX_ABILITIES = 3;
	let incomeValues = {capital: 6, territory: 1, majorPlanets: 4, minorPlanets: 2};
	let seed = 0;
	
	this.getShipTypes = function() {return SHIP_TYPES;}
	this.getBaseTypes = function() {return BASE_TYPES;}
	this.getMaxAbilities = function() {return MAX_ABILITIES;}
	this.addHex = function(context){
		let newHex = {x: context.split('.')[1],
					  y: context.split('.')[0],
					  id: Math.floor(Math.random() * 1000000000),
					  owner: 0};
		if (newHex.x == 0 && newHex.y == 0){
			newHex.capital = true;
			newHex.owner = 1;
		} else if (newHex.x == 4 && newHex.y == 0){
			newHex.capital = true;
			newHex.owner = -1;
		} else {
			newHex.capital = false;
		}
		hexes.push(newHex);
		return newHex.id;
	}
	this.addBase = function(classNumber){
		let newBase = this.getBaseClass(classNumber);
		let treasury = grids[this.getHex(0,0).grids[0]].IPCs;
		if (newBase.cost > treasury) return -1;
		grids[this.getHex(0,0).grids[0]].IPCs = Math.round(treasury - newBase.cost);
		newBase.id = Math.floor(Math.random() * 1000000000);
		newBase.x = 0;
		newBase.y = 0;
		newBase.allied = true;
		newBase.currentHull = newBase.maxHull;
		bases.push(newBase);
		return newBase.id;
	}
	this.upgradeBase = function(id){
		// This should look at local IPCs, not empire global IPCs.
		let targetBase = this.getBase(id);
		if (targetBase.level == BASE_TYPES - 1) return -1;
		let upgradedBase = this.getBaseClass(targetBase.level + 1);
		let treasury = grids[targetBase.grid].IPCs;
		if (upgradedBase.cost > treasury) return -1;
		grids[targetBase.grid].IPCs = Math.round(treasury - upgradedBase.cost);
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
		let treasury = grids[this.getHex(0,0).grids[0]].IPCs;
		if (newShip.cost > treasury) return -1;
		grids[this.getHex(0,0).grids[0]].IPCs = Math.round(treasury - newShip.cost);
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
	this.processIncome = function() {
		let treasury = grids.length > 0 ? grids[this.getHex(0,0).grids[0]].IPCs : 0;
		hexes.forEach(hex => {
			hex.IPCs = hex.owner !== 0 ? incomeValues.territory : 0;
			// Increase the value of the capitals.
			if (hex.capital) hex.IPCs = 7;
			// TODO: Add planet values.
			hex.grids = [];
		});
		bases.forEach(base => base.grid = -1);
		this.deconstructGrids();
		grids = [];
		let gridCount = 0;
		let friendlyHexes = hexes.filter(hex => hex.owner);
		let enemyHexes = hexes.filter(hex => !hex.owner);
		for (let i = 0; i < bases.length; i++) {
			if (!bases[i].allied) continue;
			if (bases[i].grid == -1){
				this.addBaseToGrid(bases[i], gridCount);
				grids[gridCount] = {IPCs: 0, hexes: [], capitalDistance: 1000, gridNumber: gridCount, bases: []};
				let thisGrid = grids[gridCount];
				let gridBases = bases.filter(base => base.grid === gridCount);
				let possibleHexes = bases[i].allied ? friendlyHexes : enemyHexes;
				gridBases.forEach(base => {
					thisGrid.bases.push(base.id);
					thisGrid.IPCs += base.IPCs ? base.IPCs : 0;
					let odd = base.y % 2 === 0 ? -1 : 1;
					thisGrid.hexes.push(this.getHex(base.y, base.x));
					thisGrid.hexes.push(this.getHex(base.y, base.x - 1));
					thisGrid.hexes.push(this.getHex(base.y, base.x + 1));
					thisGrid.hexes.push(this.getHex(base.y - 1, base.x));
					thisGrid.hexes.push(this.getHex(base.y - 1, base.x + odd));
					thisGrid.hexes.push(this.getHex(base.y + 1, base.x));
					thisGrid.hexes.push(this.getHex(base.y + 1, base.x + odd));
					let capitalDistance = Math.max(Math.abs(base.x), Math.abs(base.y));
					thisGrid.capitalDistance = capitalDistance < thisGrid.capitalDistance ? capitalDistance : thisGrid.capitalDistance;
				});
				// Remove hexes that happen to be adjacent to a base but not allied.
				thisGrid.hexes = thisGrid.hexes.filter(hex => hex.owner === 1);
				// Removes duplicates.  This is quadratic time, so we may want to switch to a hash table if it's an issue.
				thisGrid.hexes = thisGrid.hexes.filter((hex, index) => {
					return thisGrid.hexes.findIndex(h => h.id === hex.id) === index;
				});
				gridCount++;
			}
		}
		grids.sort((a, b) => a.capitalDistance - b.capitalDistance);
		grids.forEach(grid => {
			grid.hexes.forEach(hex => {
				grid.IPCs += hex.IPCs;
				hex.IPCs = 0;
				hex.grids.push(grid.gridNumber);
			});
		});
		hexes.forEach(hex => {
			if (hex.grids.length > 0 || hex.owner !== 1) return;
			grids[gridCount] = {IPCs: hex.IPCs, hexes: [hex], capitalDistance: Math.max(Math.abs(hex.x), Math.abs(hex.y)), gridNumber: gridCount, bases: []};
			hex.grids.push(gridCount);
			gridCount++;
		});
		income = grids[0].IPCs;
		grids[0].IPCs += treasury;
		treasury = grids[0].IPCs;
		grids.sort((a, b) => a.gridNumber - b.gridNumber);
	}
	this.addBaseToGrid = function(sourceBase, grid) {
		let x = sourceBase.x, y = sourceBase.y;
		let nearbyBases = bases.filter(base => {
			if (base.allied !== sourceBase.allied || base.grid !== -1) return false;
			let diffx = x - base.x, diffy = Math.abs(y - base.y);
			if ((diffy <= 2 && Math.abs(diffx) <= 1) || (diffx === 2 && diffy <= 1) || (diffx === 0 && diffy === 2)) return true;
		});
		if (nearbyBases.length === 0) return;
		nearbyBases.forEach(base => base.grid = grid);
		nearbyBases.forEach(base => this.addBaseToGrid(base, grid));
	}
	this.deconstructGrids = function() {
		grids.forEach(grid => {
			if (grid.capitalDistance <= 1) return;
			let each = Math.floor(grid.IPCs / grid.bases.length), remainder = grid.IPCs - (each * grid.bases.length);
			grid.bases.forEach(baseId => {
				bases.find(base => base.id === baseId).IPCs = each + (remainder-- > 0 ? 1 : 0);
			});
		});
	}
	this.getCapitalIncome = function() {
		return income;
	}
	this.getHex = function(y, x){
		return hexes.find(hex => +hex.x == x && +hex.y == y);
	}
	this.getHexIPCs = function(y, x){
		return this.getHex(y, x).grids.reduce((sum, currentGrid) => sum + grids[currentGrid].IPCs, 0);
	}
	this.getEmpireTreasury = function() {
		return grids[this.getHex(0,0).grids[0]].IPCs;
	}
	this.signalTurnEnd = function() {
		window.setTimeout(() => {
			// Combat
			Timer.beginNewTurn();
			this.calculateMoves();
			this.findVisibleHexes();
			this.computeTerritoryOwnership();
			this.processIncome();
			Empire.updateEmpireSidebar();
		}, 0);
	}
	this.gameLoaded = function() {
		let newBase = this.getBaseClass(0);
		newBase.id = Math.floor(Math.random() * 1000000000);
		newBase.x = 0;
		newBase.y = 0;
		newBase.allied = true;
		bases.push(newBase);
		newBase.currentHull = newBase.maxHull;
		let baseId = newBase.id;
		
		newBase = this.getBaseClass(0);
		let id = Map.getNewBaseId(baseId);
		newBase.id = id.slice(4);
		Map.createBase(0, id, true);
		Sidebar.addBase(newBase);
		
		newBase = this.getBaseClass(0);
		newBase.id = Math.floor(Math.random() * 1000000000);
		newBase.x = 4;
		newBase.y = 0;
		newBase.allied = false;
		bases.push(newBase);
		
		this.signalTurnEnd();
	}
	this.signalContinueTurn = function() {
		return;
	}
	this.viewHex = function(y, x) {
		if (this.getHex(y, x).visible){
			let visibleShips = ships.filter(ship => !ship.allied && ship.y == y && ship.x == x);
			let visibleBases = bases.filter(base => !base.allied && base.y == y && base.x == x);
			return {ships: visibleShips.map(ship => {return {hull: ship.hullClass, id: ship.id}}),
					bases: visibleBases.map(base => {return {level: base.level, id: base.id}})};
		}
	}
	this.findVisibleHexes = function() {
		let scoutOccupiedHexes = hexes.filter(hex => {
			return ships.some(ship => ship.abilities.indexOf(this.ABILITY.SCOUT) !== -1 && ship.x == hex.x && ship.y == hex.y);
		});
		let occupiedHexes = hexes.filter(hex => {
			return ships.some(ship => ship.allied && ship.x == hex.x && ship.y == hex.y) || bases.some(base => base.allied && base.x == hex.x && base.y == hex.y) || this.isAdjacent(scoutOccupiedHexes, +hex.x, +hex.y);
		});
		let visibleHexes = hexes.filter(hex => this.isAdjacent(occupiedHexes, +hex.x, +hex.y));
		visibleHexes.forEach(hex => hex.visible = true);
	}
	this.isAdjacent = function(hexList, x, y) {
		let offset = y % 2 === 0 ? -1 : 1;
		return hexList.some(hex => (y == hex.y && x == hex.x) ||
								   (y == hex.y && x + 1 == hex.x) ||
								   (y == hex.y && x - 1 == hex.x) ||
								   (y - 1 == hex.y && x == hex.x) ||
								   (y + 1 == hex.y && x == hex.x) ||
								   (y - 1 == hex.y && x + offset == hex.x) ||
								   (y + 1 == hex.y && x + offset == hex.x));
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
	this.ABILITY = Object.freeze({
		SCOUT: 0,
		WARP_FIELDS: 1,
		BOOSTER_PACKS: 2,
		STABILIZERS: 3,
	});
	this.AVAILABLE = Object.freeze({
		SHIP_EXCLUSIVE: 0,
		BASE_EXCLUSIVE: 1,
		UNRESTRICTED: 2,
	});
	this.getAbilityDetails = function(index) {
		let abilities = [
			{cost: 3, name: "Scout Sensors", description: "Allows the ship to detect terrain and enemy units 2 hexes away.", available: this.AVAILABLE.SHIP_EXCLUSIVE},
			{cost: 3, name: "Efficient Warp Fields", description: "Allows the ship to enter combat if intercepted.", available: this.AVAILABLE.SHIP_EXCLUSIVE},
			{cost: 3, name: "Booster Packs", description: "Allows the ship to move 3 hexes and engage enemy units.", available: this.AVAILABLE.SHIP_EXCLUSIVE},
			{cost: 3, name: "Engine Stabilizers", description: "Allows the ship to move 4 hexes in a single turn.", available: this.AVAILABLE.SHIP_EXCLUSIVE},
		];
		return abilities[index];
	}
	this.computeTerritoryOwnership = function() {
		hexes.forEach(hex => {
			let nearbyBases = bases.filter(base => {
				if ((base.x == hex.x || (base.x + 1 == hex.x && (Math.abs(base.y % 2) === 1 || base.y == hex.y)) || (base.x - 1 == hex.x && (Math.abs(base.y % 2) === 0 || base.y == hex.y))) &&
				    (base.y == hex.y || base.y + 1 == hex.y || base.y - 1 == hex.y)) return true;
				return false;
			});
			let presentFriendlyBase = nearbyBases.some(base => {
				if (base.x == hex.x && base.y == hex.y && base.allied == true) return true;
			});
			let presentEnemyBase = nearbyBases.some(base => {
				if (base.x == hex.x && base.y == hex.y && base.allied == false) return true;
			});
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
			if (friendlyPresence === 0) friendlyPresence = nearbyBases.some(base => base.allied) ? 1 : 0;
			if (enemyPresence === 0) enemyPresence = nearbyBases.some(base => !base.allied) ? 1 : 0;
			if (hex.capital && 
				((hex.owner === 1 && (presentFriendlyBase || presentShips.some(ship => ship.allied) || (nearbyShips.some(ship => ship.allied) && !presentShips.some(ship => !ship.allied))))
				|| (hex.owner === -1 && (presentEnemyBase || presentShips.some(ship => !ship.allied) || (nearbyShips.some(ship => !ship.allied) && !presentShips.some(ship => ship.allied)))))){
					return;
			}
			if (hex.owner === 1 && (enemyPresence > friendlyPresence || friendlyPresence == 0) && !presentFriendlyBase) {
				hex.owner = 0;
			} else if (hex.owner === -1 && (friendlyPresence > enemyPresence || enemyPresence == 0) && !presentEnemyBase) {
				hex.owner = 0;
			}
			if (hex.owner === 0) {
				if (friendlyPresence > enemyPresence * 2 || presentFriendlyBase) {
					hex.owner = 1;
				} else if (enemyPresence > friendlyPresence * 2 || presentEnemyBase) {
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
	this.moveBase = function(id, y, x) {
		// Find out if there is an enemy unit here.
		// Also do validation.
		let targetBase = this.getBase(id);
		targetBase.moveGoal = {x: +x, y: +y};
		this.saveBase(targetBase);
	}
	this.moveShip = function(id, y1, x1, y2 = null, x2 = null, y3 = null, x3 = null, y4 = null, x4 = null) {
		// Find out about enemy movements.
		// Also do validation for each space.
		let targetShip = this.getShip(id);
		if ((x4 !== null || y4 !== null) && !targetShip.abilities.some(a => a.name === this.getAbilityDetails(this.ABILITY.STABILIZERS).name)) {
			throw "Error: Ship cannot move 4 spaces without " + this.getAbilityDetails(this.ABILITY.STABILIZERS).name;
		}
		targetShip.moveGoal = {x1: x1, y1: y1, x2: x2, y2: y2, x3: x3, y3: y3, x4: x4, y4: y4};
		this.saveShip(targetShip);
	}
	this.calculateMoves = function() {
		let friendlyShipLocations, enemyShipLocations;
		let friendlyBaseLocations = bases.filter(b => b.allied).map(b => {return {x: b.x, y: b.y};});
		let enemyBaseLocations = bases.filter(b => !b.allied).map(b => {return {x: b.x, y: b.y};});
		for (let movePulse = 1; movePulse <= 4; movePulse++){
			ships.forEach(ship => {
				if (ship.moveGoal && ship.moveGoal["x" + movePulse]) {
					ship.x = +ship.moveGoal["x" + movePulse];
					ship.y = +ship.moveGoal["y" + movePulse];
				}
			});
			friendlyShipLocations = ships.filter(s => s.allied).map(s => {return {x: s.x, y: s.y};});
			enemyShipLocations = ships.filter(s => s.allied).map(s => {return {x: s.x, y: s.y};});
			ships.forEach(ship => {
				if (ship.moveGoal) {
					if (ship.allied) {
						if ([...enemyBaseLocations, ...enemyShipLocations].some(loc => loc.x === ship.x && loc.y === ship.y)) {
							delete ship.moveGoal;
							ship.moves = movePulse;
						}
					} else {
						if ([...friendlyBaseLocations, ...friendlyShipLocations].some(loc => loc.x === ship.x && loc.y === ship.y)) {
							delete ship.moveGoal;
							ship.moves = movePulse;
						}
					}
				}
			});
		}
		bases.forEach(base => {
			if (base.moveGoal) {
				if (base.allied) {
					if (![...enemyBaseLocations, ...enemyShipLocations].some(loc => loc.x === base.x && loc.y === base.y)) {
						base.x = base.moveGoal.x;
						base.y = base.moveGoal.y;
					}
				} else {
					if (![...friendlyBaseLocations, ...friendlyShipLocations].some(loc => loc.x === base.x && loc.y === base.y)) {
						base.x = base.moveGoal.x;
						base.y = base.moveGoal.y;
					}
				}
			}
		});
	}
	this.loadPlayer = function(name) {
		if (!localStorage[name]) name = "default";
		let designs = JSON.parse(localStorage[name].slice(3));
		designs = designs.map((unit, index) => {
			return index < SHIP_TYPES ? calculateShip(unit, unit.id) : calculateBase(unit, unit.id, index, designs);
		});
		friendlyDesigns = designs;
		return designs;
	}
	this.getFleetConstructions = function() {
		return Object.keys(localStorage).filter(name => name != "default").sort();
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
		baseCalc.currentHull = baseCalc.maxHull;
		return baseCalc;
	}
	this.getDataToSend = function() {
		let shipsToSend = ships.filter(s => s.allied);
		let basesToSend = bases.filter(b => b.allied);
		seed = Math.random();
		return {ships: shipsToSend,
			bases: basesToSend,
			seed: seed};
	}
	function random() {
		var x = Math.sin(seed++) * 10000;
		return x - Math.floor(x);
	}
}).apply(Wasm);