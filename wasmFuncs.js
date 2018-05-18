"use strict"

/*
* This file is just to hold functions which will later be moved into wasm.
* As such, they are stubs and may not have proper functionality.
*/

var Wasm = {};
(function() {
	this.addHex = function(context){
		return Math.floor(Math.random() * 1000000);
	}
	this.addBase = function(){
		return Math.floor(Math.random() * 1000000);
	}
	this.addShip = function(){
		return Math.floor(Math.random() * 1000000);
	}
	this.getShipClass = function(classNumber) {
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
	this.getBase = function(id){
		let base = {level: Math.floor(Math.random() * 4), power: 5, currentHull: 5, maxHull: 5, shield: 1, repair: 3, id: id, allied: false};
		if (id <= 1) base.allied = true;
		return base;
	}
	this.getShip = function(id){
		return {shipClass: 1, hullClass: 0, power: 3, currentHull: 3, maxHull: 5, shield: 1, repair: 1, id: "id", allied: true};
	}
	this.getEmpireIncome = function() {
		return {total: 7, capital: 6, territory: 1, majorPlanets: 0, minorPlanets: 0};
	}
	this.getEmpireTreasury = function() {
		return 7;
	}
	this.signalTurnEnd = function() {
		window.setTimeout(() => {
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
}).apply(Wasm);