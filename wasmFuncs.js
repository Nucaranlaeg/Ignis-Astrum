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
		if (id <= 1)
			return {level: 1, power: 5, currentHull: 5, maxHull: 5, shield: 1, repair: 3, id: id, allied: true};
		return {level: 2, power: 10, currentHull: 10, maxHull: 10, shield: 2, repair: 6, id: id, allied: false};
	}
	this.getShip = function(){
		return {shipClass: 1, power: 3, currentHull: 3, maxHull: 5, shield: 1, repair: 1, id: "ship0", allied: true};
	}
}).apply(Wasm);