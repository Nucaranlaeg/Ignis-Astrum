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
	this.getBase = function(id){
		let base = {level: Math.floor(Math.random() * 4), power: 5, currentHull: 5, maxHull: 5, shield: 1, repair: 3, id: id, allied: false};
		if (id <= 1) base.allied = true;
		return base;
	}
	this.getShip = function(id){
		return {shipClass: 1, power: 3, currentHull: 3, maxHull: 5, shield: 1, repair: 1, id: "ship0", allied: true};
	}
	this.getEmpireIncome = function() {
		return {total: 7, capital: 6, territory: 1, majorPlanets: 0, minorPlanets: 0};
	}
	this.getEmpireTreasury = function() {
		return 7;
	}
	this.signalTurnEnd = function() {
		Timer.beginNewTurn();
	}
}).apply(Wasm);