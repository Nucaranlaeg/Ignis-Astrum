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
		return {level: 1, power: 5, currentHull: 4, maxHull: 5, shield: 1, repair: 3, id: id, allied: true};
	}
	this.getShip = function(){
		return {shipClass: 1, power: 3, currentHull: 3, maxHull: 5, shield: 1, repair: 1, id: "ship0", allied: true};
	}
}).apply(Wasm);