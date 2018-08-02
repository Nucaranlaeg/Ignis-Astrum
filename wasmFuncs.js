"use strict"

/*
* This file is just to hold functions which will later be moved into wasm.
* As such, they are stubs and may not have proper functionality.
*/

var Wasm = {};
(function() {
	let friendlyDesigns = [], enemyDesigns = [];
	let ships = [];
	let hexes = [], grids = [];
	let income = 13;
	const SHIP_TYPES = 10, BASE_TYPES = 4, MAX_ABILITIES = 3, SHIPS_IN_COMBAT = 5;
	let incomeValues = {capital: 6, territory: 1, majorPlanets: 4, minorPlanets: 2};
	let seed = 0;
	// A value which lets the game decide who to apply rolls to first.
	// TODO: Ensure that this is negotiated upon connection
	let playerOne = true;
	
	this.getShipTypes = function() {return SHIP_TYPES;}
	this.getBaseTypes = function() {return BASE_TYPES;}
	this.getUnitTypes = function() {return SHIP_TYPES + BASE_TYPES;}
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
		newShip.currentHull = newShip.maxHull;
		ships.push(newShip);
		return newShip.id;
	}
	this.destroyShip = function(id) {
		destroyed = ships.findIndex(s => s.id === id);
		if (destroyed === -1) throw "Destroyed ship not found.";
		ships.splice(destroyed, 1);
	}
	this.getHullClass = function(classNumber) {
		let instance;
		switch (parseInt(classNumber)) {
			case 0:
				instance = {power: 3, maxHull: 3, shield: 0, repair: 1, cost: 3, isBase: false};
				break;
			case 1:
				instance = {power: 5, maxHull: 5, shield: 0, repair: 1, cost: 5, isBase: false};
				break;
			case 2:
				instance = {power: 8, maxHull: 8, shield: 1, repair: 1, cost: 10, isBase: false};
				break;
			case 3:
				instance = {power: 10, maxHull: 10, shield: 1, repair: 1, cost: 13, isBase: false};
				break;
			case 4:
				instance = {power: 15, maxHull: 15, shield: 2, repair: 1, cost: 18, isBase: false};
				break;
			case 5:
				instance = {power: 3, maxHull: 2, shield: 1, repair: 0, cost: 3, isBase: false};
				break;
			case 6:
				instance = {power: 5, maxHull: 4, shield: 1, repair: 0, cost: 5, isBase: false};
				break;
			case 7:
				instance = {power: 8, maxHull: 6, shield: 2, repair: 0, cost: 10, isBase: false};
				break;
			case 8:
				instance = {power: 10, maxHull: 8, shield: 2, repair: 0, cost: 13, isBase: false};
				break;
			case 9:
				instance = {power: 15, maxHull: 12, shield: 3, repair: 0, cost: 18, isBase: false};
				break;
			case 10:
				instance = {power: 3, maxHull: 3, shield: 1, repair: 3, cost: 4.32, isBase: true, assault: false, range: 1, centralDisplay: true, upgradeable: true, upgradeTo: 11};
				break;
			case 11:
				instance = {power: 6, maxHull: 6, shield: 2, repair: 6, cost: 4.32, isBase: true, assault: false, range: 0, centralDisplay: true, upgradeable: true, purchaseable: false, upgradeFrom: 10, upgradeTo: 12};
				break;
			case 12:
				instance = {power: 9, maxHull: 9, shield: 3, repair: 9, cost: 4.32, isBase: true, assault: false, range: 0, centralDisplay: true, upgradeable: true, purchaseable: false, upgradeFrom: 11, upgradeTo: 13};
				break;
			case 13:
				instance = {power: 12, maxHull: 12, shield: 4, repair: 12, cost: 4.32, isBase: true, assault: false, range: 0, centralDisplay: true, purchaseable: false, upgradeFrom: 12};
				break;
			default:
				instance = {power: 0, maxHull: 0, shield: 0, repair: 0, cost: 0};
		}
		if (instance.isBase === undefined) instance.isBase = false;
		if (instance.purchaseable === undefined) instance.purchaseable = true;
		if (instance.upgradeable === undefined) instance.upgradeable = false;
		if (instance.centralDisplay === undefined) instance.centralDisplay = false;
		if (instance.assault === undefined) instance.assault = true;
		if (instance.range === undefined) instance.range = 3;
		instance.currentHull = instance.maxHull;
		instance.shipClass = classNumber;
		instance.hullClass = classNumber;
		instance.id = null;
		instance.allied = true;
		instance.abilities = [];
		return instance;
	}
	// In this function, classNumber is 0-13 for friendly ships, 14-27 for enemy ships.
	this.getShipClass = function (classNumber) {
		if (classNumber < SHIP_TYPES + BASE_TYPES){
			return JSON.parse(JSON.stringify(friendlyDesigns[classNumber]));
		} else {
			return JSON.parse(JSON.stringify(enemyDesigns[classNumber - SHIP_TYPES - BASE_TYPES]));
		}
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
		let bases = ships.filter(ship => ship.isBase).forEach(base => base.grid = -1) || [];
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
		let nearbyBases = ships.filter(base => {
			if (!base.isBase || base.allied !== sourceBase.allied || base.grid !== -1) return false;
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
				ships.find(base => base.isBase && base.id === baseId).IPCs = each + (remainder-- > 0 ? 1 : 0);
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
	this.calculateCombat = function() {
		// This list will be the same regardless of the initial order of the ships.
		let hexList = ships.map(s => {return {x: s.x, y:s.y, allied: s.allied}})
			// Sort the ships' locations by x, then y, then whether they're allied
			.sort((a, b) => a.x - b.x === 0 ? a.y - b.y === 0 ? a.allied ? 1 : -1 : a.y - b.y : a.x - b.x)
			// Keep one representative of each group.
			.filter((s, index, array) => index === 0 ? true : ((s.x !== array[index - 1].x) || (s.y !== array[index - 1].y) || s.allied !== array[index - 1].allied))
			// Remove those hexes without both allied and enemy units.
			.filter((s, index, array) => s.allied ? array[index + 1] !== undefined ? (s.x === array[index + 1].x) && (s.y === array[index + 1].y) : false
												  : index > 0 ? (s.x === array[index - 1].x) && (s.y === array[index - 1].y) : false)
			// Keep only one representative of each hex.
			.filter(s => s.allied);
		hexList.forEach(this.battle);
	}
	this.battle = function(hex) {
		let shipsInHex = ships.filter(s => s.x === hex.x && s.y === hex.y);
		let friendlyBattleLine = this.getBattleLine(shipsInHex.filter(s => s.allied));
		let enemyBattleLine = this.getBattleLine(shipsInHex.filter(s => !s.allied));
		
		let friendlyPower = friendlyBattleLine.reduce((s, val) => {return s.power + val}, 0);
		let enemyPower = enemyBattleLine.reduce((s, val) => {return s.power + val}, 0);
		// Apply combat abilities
		
		// Ships deal damage somewhere between 30% of their power and 70% of their power.
		if (playerOne) {
			friendlyPower = friendlyPower * (0.3 + this.random() * 0.2 + this.random() * 0.2);
			enemyPower = enemyPower * (0.3 + this.random() * 0.2 + this.random() * 0.2);
		} else {
			enemyPower = enemyPower * (0.3 + this.random() * 0.2 + this.random() * 0.2);
			friendlyPower = friendlyPower * (0.3 + this.random() * 0.2 + this.random() * 0.2);
		}
		friendlyPower = friendlyPower < friendlyBattleLine.length ? friendlyBattleLine.length : Math.floor(friendlyPower);
		enemyPower = enemyPower < enemyBattleLine.length ? enemyBattleLine.length : Math.floor(enemyPower);
		
		if (playerOne) {
			this.dealDamage(friendlyPower, enemyBattleLine);
			this.dealDamage(enemyPower, friendlyBattleLine);
		} else {
			this.dealDamage(enemyPower, friendlyBattleLine);
			this.dealDamage(friendlyPower, enemyBattleLine);
		}
	}
	// This function must return the same list regardless of the order of the ships passed in.
	this.getBattleLine = function(shipList) {
		let battleLine = [];
		let basesInHex = shipList.filter(s => s.isBase);
		let shipsInHex = shipList.filter(s => !s.isBase);
		if (shipList.length <= SHIPS_IN_COMBAT || (shipList.length === SHIPS_IN_COMBAT + 1 && basesInHex.length !== 0)) return shipList;
		
		// Select ships for battle line.
		if (shipsInHex.length > SHIPS_IN_COMBAT) {
			// TODO: Implement ship target priority and select (up to) two highest priority ships
			while (battleLine.length < SHIPS_IN_COMBAT){
				let currentShipList = shipsInHex;
				// Current algorithm: Use the ship with the highest power.
				// If two or more are tied, use the ship with the higher current hull + (shield * 1.01).
				// If two or more are still tied, use the ship with the higher max hull.
				let best = currentShipList.map(b => b.power).sort((a, b) => b - a)[0];
				currentShipList = currentShipList.filter(b => b.power === best);
				best = currentShipList.map(b => b.currentHull + b.shield * 1.01).sort((a, b) => b - a)[0];
				currentShipList = currentShipList.filter(b => b.currentHull + b.shield * 1.01 === best);
				best = currentShipList.map(b => b.maxHull).sort((a, b) => b - a)[0];
				currentShipList = currentShipList.filter(b => b.maxHull === best);
				// Pick the lower id if two ships are otherwise identical.
				currentShipList = currentShipList.sort((a, b) => a.id - b.id);
				battleLine.push(currentShipList[0]);
				// Don't pick the same ship twice.
				shipsInHex = shipsInHex.filter(s => s.id !== currentShipList[0].id);
			}
		} else {
			battleLine = shipsInHex;
		}
		
		// Select base.  At this point, there is no possibility of multiple bases being in the battle line.
		if (basesInHex.length > 0) {
			// Current algorithm: Use the base with the highest current hull.
			// If two or more are tied, use the one with the higher max hull.
			let best = basesInHex.map(b => b.currentHull).sort((a, b) => b - a)[0];
			basesInHex = basesInHex.filter(b => b.currentHull === best);
			best = basesInHex.map(b => b.maxHull).sort((a, b) => b - a)[0];
			basesInHex = basesInHex.filter(b => b.maxHull === best);
			// Pick the lower id if two bases are otherwise identical.
			basesInHex = basesInHex.sort((a, b) => a.id - b.id)
			battleLine.push(basesInHex[0]);
		}
		return battleLine;
	}
	this.dealDamage(damage, battleLine) {
		while (damage > 0 && battleLine.length > 0){
			let damagedShip = Math.floor(this.random() * battleLine.length);
			if (battleLine[damagedShip].shield > 0){
				battleLine[damagedShip].shield--;
			} else {
				battleLine[damagedShip].currentHull--;
				if (battleLine[damagedShip].currentHull === 0){
					this.destroyShip(battleLine[damagedShip].id);
					battleLine.splice(damagedShip, 1);
				}
			}
		}
		// Replenish damaged shields.
		battleLine.forEach(s => {
			s.shield = this.getShipClass(s.shipClass + (!s.allied ? SHIP_TYPES + BASE_TYPES : 0)).shield;
		});
	}
	this.signalTurnEnd = function() {
		window.setTimeout(() => {
			Timer.beginNewTurn();
			this.calculateMoves();
			this.calculateCombat();
			this.findVisibleHexes();
			this.computeTerritoryOwnership();
			this.processIncome();
			Empire.updateEmpireSidebar();
		}, 0);
	}
	this.gameLoaded = function() {
		let newBase = this.getShipClass(10);
		newBase.id = Math.floor(Math.random() * 1000000000);
		newBase.x = 0;
		newBase.y = 0;
		newBase.allied = true;
		ships.push(newBase);
		let baseId = newBase.id;
		
		let id = Map.getNewShipId(baseId);
		Map.createShip(10, id, true);
		Sidebar.addShip(newBase);
		
		this.signalTurnEnd();
	}
	this.signalContinueTurn = function() {
		return;
	}
	this.viewHex = function(y, x) {
		if (this.getHex(y, x).visible){
			return ships.filter(ship => !ship.allied && ship.y == y && ship.x == x);
		}
	}
	this.findVisibleHexes = function() {
		let scoutOccupiedHexes = hexes.filter(hex => {
			return ships.some(ship => ship.abilities.indexOf(this.ABILITY.SCOUT) !== -1 && ship.x == hex.x && ship.y == hex.y);
		});
		let occupiedHexes = hexes.filter(hex => {
			return ships.some(ship => ship.allied && ship.x == hex.x && ship.y == hex.y) || this.isAdjacent(scoutOccupiedHexes, +hex.x, +hex.y);
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
			{cost: 1, power: 1, available: this.AVAILABLE.UNRESTRICTED},
			{cost: 2, power: 2, available: this.AVAILABLE.UNRESTRICTED},
			{cost: 3, power: 4, available: this.AVAILABLE.UNRESTRICTED},
			{cost: 5, power: 8, available: this.AVAILABLE.UNRESTRICTED},
			{cost: 1, maxHull: 1, available: this.AVAILABLE.UNRESTRICTED},
			{cost: 2, maxHull: 3, available: this.AVAILABLE.UNRESTRICTED},
			{cost: 4, maxHull: 7, available: this.AVAILABLE.UNRESTRICTED},
			{cost: 8, maxHull: 15, available: this.AVAILABLE.UNRESTRICTED},
			{cost: 2, shield: 1, available: this.AVAILABLE.UNRESTRICTED},
			{cost: 3.5, shield: 2, available: this.AVAILABLE.UNRESTRICTED},
			{cost: 5, shield: 3, available: this.AVAILABLE.UNRESTRICTED},
			{cost: 6, shield: 4, available: this.AVAILABLE.UNRESTRICTED},
			{cost: 3, repair: 2, available: this.AVAILABLE.UNRESTRICTED},
			{cost: 5, repair: 4, available: this.AVAILABLE.UNRESTRICTED},
			{cost: 7, repair: 7, available: this.AVAILABLE.UNRESTRICTED},
			{cost: 9, repair: 10, available: this.AVAILABLE.UNRESTRICTED},
		];
		return parts[index];
	}
	this.ABILITY = Object.freeze({
		SCOUT: 0,
		WARP_FIELDS: 1,
		BOOSTER_PACKS: 2,
		STABILIZERS: 3,
		BASE_0: 4,
		BASE_1: 5,
		BASE_2: 6,
		BASE_3: 7,
		ANY: 8,
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
			{cost: 1, name: "Base Ability Placeholder", description: "Placeholder.", available: this.AVAILABLE.BASE_EXCLUSIVE},
			{cost: 2, name: "Base Ability Placeholder", description: "Placeholder.", available: this.AVAILABLE.BASE_EXCLUSIVE},
			{cost: 3, name: "Base Ability Placeholder", description: "Placeholder.", available: this.AVAILABLE.BASE_EXCLUSIVE},
			{cost: 4, name: "Base Ability Placeholder", description: "Placeholder.", available: this.AVAILABLE.BASE_EXCLUSIVE},
			{cost: 3, name: "Ship/Base Ability", description: "Placeholder.", available: this.AVAILABLE.UNRESTRICTED},
		];
		return abilities[index];
	}
	this.computeTerritoryOwnership = function() {
		hexes.forEach(hex => {
			let nearbyBases = ships.filter(base => {
				if (!base.isBase) return false;
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
			if (hex.owner === 1 && (enemyPresence > friendlyPresence || (friendlyPresence == 0 && !hex.capital)) && !presentFriendlyBase) {
				hex.owner = 0;
			} else if (hex.owner === -1 && (friendlyPresence > enemyPresence || (enemyPresence == 0 && !hex.capital)) && !presentEnemyBase) {
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
	this.moveShip = function(id, ...moveGoal) {
		// Find out about enemy movements.
		// Also do validation for each space.
		let targetShip = this.getShip(id);
		if (!targetShip.moveGoal) targetShip.moveGoal = [];
		for (let i = 0; i < targetShip.range; i++){
			if (moveGoal[i] === undefined) break;
			targetShip.moveGoal["y" + (2 * i + 1)] = moveGoal[2 * i];
			if (moveGoal[i] === undefined) throw "Ship attempted to move with an odd number of coordinates.";
			targetShip.moveGoal["x" + (2 * i + 1)] = moveGoal[2 * i + 1];
		}
		this.saveShip(targetShip);
	}
	this.calculateMoves = function() {
		let friendlyShipLocations, enemyShipLocations;
		let friendlyBaseLocations = ships.filter(b => b.isBase && b.allied).map(b => {return {x: b.x, y: b.y};});
		let enemyBaseLocations = ships.filter(b => b.isBase && !b.allied).map(b => {return {x: b.x, y: b.y};});
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
	}
	this.loadPlayer = function(name) {
		if (!localStorage[name]) name = "default";
		let designs = JSON.parse(localStorage[name].slice(3));
		designs = designs.map((unit, index) => {
			return this.calculateShip(index, designs);
		});
		friendlyDesigns = designs;
		return designs;
	}
	this.getFleetConstructions = function() {
		return Object.keys(localStorage).filter(name => name != "default").sort();
	}
	this.calculateShip = function(index, designs) {
		let design = designs[index];
		let shipCalc = Wasm.getHullClass(design.hullClass);
		// Add values for bases of level higher than 1.
		for (var i = SHIP_TYPES; i < index; i++) {
			designs[i].parts.forEach(p => {
				let partVals = Wasm.getPartDetails(p);
				shipCalc.power += partVals.power ? partVals.power : 0;
				shipCalc.maxHull += partVals.maxHull ? partVals.maxHull : 0;
				shipCalc.shield += partVals.shield ? partVals.shield : 0;
				shipCalc.repair += partVals.repair ? partVals.repair : 0;
				if (i === index) shipCalc.cost += partVals.cost;
			});
		}
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
		shipCalc.id = design.id;
		return shipCalc;
	}
	this.getDataToSend = function() {
		let shipsToSend = ships.filter(s => s.allied);
		seed = Math.random();
		return {ships: shipsToSend,
			seed: seed};
	}
	function random() {
		var x = Math.sin(seed++) * 10000;
		return x - Math.floor(x);
	}
}).apply(Wasm);