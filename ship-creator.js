"use strict"

var Creator = {};
(function() {
	let ship = [], designs = [];
	let shipDetails, partDetails, abilityDetails, shipList, hulls, parts, abilities, hanger = [], partList = [], abilityList = [], abilityIcons = [];
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
		for (let i = 0; true; i++) {
			let c = document.getElementById("ability" + i + "-template");
			if (!c) break;
			abilityIcons[i] = c;
			abilityIcons[i].removeAttribute("id");
			abilityIcons[i].removeChild(abilityIcons[i].firstChild);
			abilityIcons[i].removeChild(abilityIcons[i].lastChild);
		}
		shipDetails = document.getElementById("ship-detail-template");
		shipDetails.removeAttribute("id");
		partDetails = document.getElementById("part-template");
		partDetails.removeAttribute("id");
		abilityDetails = document.getElementById("ability-template");
		abilityDetails.removeAttribute("id");
		shipList = document.getElementById("ship-list");
		hulls = document.getElementById("hulls");
		parts = document.getElementById("parts");
		abilities = document.getElementById("abilities");
		
		ship.forEach(s => {
			let newShipDetail = shipDetails.cloneNode(true);
			let shipClass = Wasm.getShipClass(s.dataset.hullClass);
			shipClass.cost = Math.floor(Math.pow(shipClass.cost, 1.1));
			updateShip(newShipDetail, shipClass);
			newShipDetail.onclick = () => {changeShipHull(s.dataset.hullClass)};
			hulls.append(newShipDetail);
		});
		
		for (let i = 0; i < 10; i++){
			let newShipDetail = shipDetails.cloneNode(true);
			designs[i] = {hullClass: 0, parts: [], abilities: []};
			newShipDetail.onclick = () => {activate(i)};
			shipList.append(newShipDetail);
			hanger[i] = newShipDetail;
			calculateShip(i);
		}
		
		let nextPart;
		for (let i = 0; nextPart = Wasm.getPartDetails(i); i++) {
			let newPart = partDetails.cloneNode(true);
			// This is to ensure that each part gets a reference to the correct part number.
			let k = i.valueOf();
			newPart.onclick = () => {selectPart(k)};
			let type = nextPart.power ? "power" : nextPart.maxHull ? "max-hull" : nextPart.shield ? "shield" : nextPart.repair ? "repair" : "";
			newPart.getElementsByClassName("value")[0].classList.add(type);
			let value = nextPart.power ? nextPart.power : nextPart.maxHull ? nextPart.maxHull : nextPart.shield ? nextPart.shield : nextPart.repair ? nextPart.repair : "";
			type = nextPart.power ? "Power" : nextPart.maxHull ? "Hull" : nextPart.shield ? "Shield" : nextPart.repair ? "Repair" : "";
			newPart.getElementsByClassName("type")[0].innerHTML = type;
			newPart.getElementsByClassName("value")[0].innerHTML = value;
			newPart.getElementsByClassName("cost")[0].innerHTML = nextPart.cost;
			partList.push(newPart);
			parts.append(newPart);
		}
		
		for (let i = 0; i < abilityIcons.length; i++) {
			let	nextability = Wasm.getabilityDetails(i);
			let newability = abilityDetails.cloneNode(true);
			// This is to ensure that each ability gets a reference to the correct ability number.
			let k = i.valueOf();
			newability.onclick = () => {selectability(k)};
			newability.onmouseover = () => {expandability(newability)};
			newability.onmouseout = () => {collapseability(newability)};
			newability.getElementsByClassName("image")[0].append(abilityIcons[i].cloneNode(true));
			newability.getElementsByClassName("type")[0].innerHTML = nextability.name;
			newability.getElementsByClassName("description")[0].innerHTML = nextability.description;
			newability.getElementsByClassName("cost")[0].innerHTML = nextability.cost;
			abilityList.push(newability);
			abilities.append(newability);
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
		target.getElementsByClassName("ability-bar")[0].innerHTML = "";
		shipValues.abilities.forEach(a => {
			target.getElementsByClassName("ability-bar")[0].append(abilityIcons[a.index].cloneNode(true));
		});
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
		shipCalc.abilities = [];
		designs[designNumber].abilities.forEach(c => {
			let abilityVals = Wasm.getabilityDetails(c);
			shipCalc.abilities.push({index: c, description: abilityVals.description});
			shipCalc.power += abilityVals.power ? abilityVals.power : 0;
			shipCalc.maxHull += abilityVals.maxHull ? abilityVals.maxHull : 0;
			shipCalc.shield += abilityVals.shield ? abilityVals.shield : 0;
			shipCalc.repair += abilityVals.repair ? abilityVals.repair : 0;
			shipCalc.cost += abilityVals.cost;
		});
		
		// Calculate the total cost of the ship.
		shipCalc.cost = Math.floor(Math.pow(shipCalc.cost, 1.1));
		updateShip(hanger[designNumber], shipCalc);
	}
	
	function activate(hangerNumber) {
		if (active !== null) {
			hanger[active].classList.remove("active");
			designs[active].parts.forEach(p => {
				partList[p].classList.remove("active");
			});
			designs[active].abilities.forEach(c => {
				abilityList[c].classList.remove("active");
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
		designs[active].abilities.forEach(c => {
			abilityList[c].classList.add("active");
		});
	}
	
	function changeShipHull(hull) {
		designs[active].hullClass = hull;
		calculateShip(active);
	}
	
	function selectPart(partNumber) {
		if (active === null) return;
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
	
	function selectability(abilityNumber) {
		if (active === null) return;
		let index = designs[active].abilities.findIndex(c => c === abilityNumber);
		if (index === -1) {
			designs[active].abilities.push(abilityNumber);
			abilityList[abilityNumber].classList.add("active");
		} else {
			designs[active].abilities.splice(index, 1);
			abilityList[abilityNumber].classList.remove("active");
		}
		calculateShip(active);
	}
	
	function expandability(ability) {
		ability.style.height = ability.scrollHeight + "px";
	}
	
	function collapseability(ability) {
		ability.style.height = "30px";
	}
}).apply(Creator);