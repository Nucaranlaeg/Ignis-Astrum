"use strict"

var Creator = {};
(function() {
	let ship = [], designs = [];
	let shipDetails, partDetails, shipList, hulls, parts, hanger = [], partList = [];
	let active = null;
	
	function initializeCreator() {
		// Load references to DOM elements from the HTML.
		for (let i = 0; true; i++) {
			let s = document.getElementById("ship" + i + "-template");
			if (!s) break;
			ship[i] = s;
			ship[i].removeAttribute("id");
			ship[i].removeChild(ship[i].firstChild);
			ship[i].removeChild(ship[i].lastChild);
			ship[i].dataset.hullClass = i;
		}
		shipDetails = document.getElementById("ship-detail-template");
		shipDetails.removeAttribute("id");
		partDetails = document.getElementById("part-template");
		partDetails.removeAttribute("id");
		shipList = document.getElementById("ship-list");
		hulls = document.getElementById("hulls");
		parts = document.getElementById("parts");
		
		ship.forEach(s => {
			let newShipDetail = shipDetails.cloneNode(true);
			updateShip(newShipDetail, Wasm.getShipClass(s.dataset.hullClass));
			newShipDetail.onclick = () => {changeShipHull(s.dataset.hullClass)};
			hulls.append(newShipDetail);
		});
		
		for (let i = 0; i < 10; i++){
			let newShipDetail = shipDetails.cloneNode(true);
			designs[i] = {hullClass: 0, parts: [], components: []};
			newShipDetail.onclick = () => {activate(i)};
			shipList.append(newShipDetail);
			hanger[i] = newShipDetail;
			calculateShip(i);
		}
		
		let nextPart;
		for (let i = 0; nextPart = Wasm.getPartDetails(i); i++) {
			let newPart = partDetails.cloneNode(true);
			newPart.getElementsByClassName("power")[0].innerHTML = nextPart.power ? nextPart.power : "";
			newPart.getElementsByClassName("max-hull")[0].innerHTML = nextPart.maxHull ? nextPart.maxHull : "";
			newPart.getElementsByClassName("shield")[0].innerHTML = nextPart.shield ? nextPart.shield : "";
			newPart.getElementsByClassName("repair")[0].innerHTML = nextPart.repair ? nextPart.repair : "";
			newPart.getElementsByClassName("cost")[0].innerHTML = nextPart.cost ? nextPart.cost : "";
			// This is to ensure that each part gets a reference to the correct part number.
			let k = i.valueOf();
			newPart.onclick = () => {selectPart(k)};
			partList.push(newPart);
			parts.append(newPart);
		}
	}
	
	document.addEventListener("DOMContentLoaded", initializeCreator.bind(this), {once: true});
	
	function updateShip(target, shipValues) {
		target.getElementsByClassName("image")[0].innerHTML = "";
		target.getElementsByClassName("image")[0].append(ship[shipValues.hullClass].cloneNode(true));
		target.getElementsByClassName("power")[0].innerHTML = shipValues.power;
		target.getElementsByClassName("max-hull")[0].innerHTML = shipValues.maxHull;
		target.getElementsByClassName("shield")[0].innerHTML = shipValues.shield;
		target.getElementsByClassName("repair")[0].innerHTML = shipValues.repair;
		target.getElementsByClassName("cost")[0].innerHTML = shipValues.cost ? shipValues.cost : "";
		for (let i in shipValues.abilities) {
			target.getElementsByClassName("ability-bar")[0].append(abilities[i]);
		}
	}
	
	function calculateShip(designNumber) {
		let shipCalc = Wasm.getShipClass(designs[designNumber].hullClass);
		designs[designNumber].parts.forEach(p => {
			let partVals = Wasm.getPartDetails(p);
			shipCalc.power += partVals.power ? partVals.power : 0;
			shipCalc.maxHull += partVals.maxHull ? partVals.maxHull : 0;
			shipCalc.shield += partVals.shield ? partVals.shield : 0;
			shipCalc.repair += partVals.repair ? partVals.repair : 0;
			shipCalc.cost += partVals.cost;
		});
		shipCalc.cost = Math.floor(Math.pow(shipCalc.cost, 1.1));
		updateShip(hanger[designNumber], shipCalc);
	}
	
	function activate(hangerNumber) {
		if (active) {
			hanger[active].classList.remove("active");
			designs[active].parts.forEach(p => {
				partList[p].classList.remove("active");
			});
		}
		if (active === hangerNumber) {
			active = null;
			return;
		}
		active = hangerNumber;
		hanger[hangerNumber].classList.add("active");
		designs[active].parts.forEach(p => {
			partList[p].classList.add("active");
		});
	}
	
	function changeShipHull(hull) {
		designs[active].hullClass = hull;
		calculateShip(active);
	}
	
	function selectPart(partNumber) {
		if (!active) return;
		let index = designs[active].parts.findIndex(p => p === partNumber);
		if (index === -1) {
			designs[active].parts.push(partNumber);
			partList[partNumber].classList.add("active");
		} else {
			designs[active].parts.splice(index, 1);
			partList[partNumber].classList.remove("active");
		}
		calculateShip(active);
	}
}).apply(Creator);