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
}).apply(Wasm);