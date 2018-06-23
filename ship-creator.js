"use strict"

var Creator = {};
(function() {
	let ship = [], designs = [], base = [];
	let shipDetails, partDetails, abilityDetails, shipList, baseList, hulls, parts, abilities, hanger = [], partList = [], abilityList = [], abilityIcons = [];
	let players;
	let active = null;
	const SHIP_TYPES = Wasm.getShipTypes(), BASE_TYPES = Wasm.getBaseTypes(), MAX_ABILITIES = Wasm.getMaxAbilities();
	
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
		for (let i = 0; true; i++) {
			let b = document.getElementById("base" + i + "-template");
			if (!b) break;
			base[i] = b;
			base[i].removeAttribute("id");
			base[i].removeChild(base[i].firstChild);
			base[i].removeChild(base[i].lastChild);
			base[i].dataset.hullClass = i;
		}
		players = document.getElementById("players");
		shipDetails = document.getElementById("ship-detail-template");
		shipDetails.removeAttribute("id");
		partDetails = document.getElementById("part-template");
		partDetails.removeAttribute("id");
		abilityDetails = document.getElementById("ability-template");
		abilityDetails.removeAttribute("id");
		shipList = document.getElementById("ship-list");
		baseList = document.getElementById("base-list");
		hulls = document.getElementById("hulls");
		parts = document.getElementById("parts");
		abilities = document.getElementById("abilities");
		
		// Populate the available hulls list
		ship.forEach(s => {
			let newShipDetail = shipDetails.cloneNode(true);
			let shipClass = Wasm.getHullClass(s.dataset.hullClass);
			shipClass.cost = Math.floor(Math.pow(shipClass.cost, 1.1));
			updateShip(newShipDetail, shipClass);
			newShipDetail.onclick = () => {changeShipHull(s.dataset.hullClass)};
			hulls.append(newShipDetail);
		});
		
		// Populate the player's ship list
		for (let i = 0; i < SHIP_TYPES; i++){
			let newShipDetail = shipDetails.cloneNode(true);
			designs[i] = {hullClass: 0, parts: [], abilities: []};
			newShipDetail.onclick = () => {activate(i)};
			shipList.append(newShipDetail);
			hanger[i] = newShipDetail;
			calculateShip(i);
		}
		
		// Populate the base list
		base.forEach(b => {
			let newBaseDetail = shipDetails.cloneNode(true);
			let baseClass = Wasm.getBaseHullClass(b.dataset.hullClass);
			let hangerNumber = +b.dataset.hullClass + SHIP_TYPES;
			baseClass.cost = Math.floor(Math.pow(baseClass.cost, 1.1));
			newBaseDetail.onclick = () => {activate(hangerNumber)};
			designs[hangerNumber] = {hullClass: +b.dataset.hullClass, parts: [], abilities: []};
			hanger[hangerNumber] = newBaseDetail;
			updateBase(newBaseDetail, baseClass);
			baseList.append(newBaseDetail);
		});
		
		// Populate the available parts list
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
		
		// Populate the available abilities list
		for (let i = 0; i < abilityIcons.length; i++) {
			let	nextability = Wasm.getAbilityDetails(i);
			let newability = abilityDetails.cloneNode(true);
			// This is to ensure that each ability gets a reference to the correct ability number.
			let k = i.valueOf();
			newability.onclick = () => {selectAbility(k)};
			newability.onmouseover = () => {expandAbility(newability)};
			newability.onmouseout = () => {collapseAbility(newability)};
			newability.getElementsByClassName("image")[0].append(abilityIcons[i].cloneNode(true));
			newability.getElementsByClassName("type")[0].innerHTML = nextability.name;
			newability.getElementsByClassName("description")[0].innerHTML = nextability.description;
			newability.getElementsByClassName("cost")[0].innerHTML = nextability.cost;
			abilityList.push(newability);
			abilities.append(newability);
		}
		
		this.saveShips("default");
		Object.keys(localStorage).sort().forEach(key => {
			if (localStorage[key].slice(0,3) !== "sds") return;
			players.innerHTML += "<button onclick='Creator.loadShips(\"" + key + "\")'>Load " + key + "</button>";
			if (key != "default") players.innerHTML += "<button onclick='Creator.deleteFleet(\"" + key + "\")'>Delete " + key + "</button>";
			players.innerHTML += "<br>";
		});
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
	
	function updateBase(target, baseValues) {
		target.getElementsByClassName("image")[0].innerHTML = "";
		target.getElementsByClassName("image")[0].append(base[baseValues.level].cloneNode(true));
		target.getElementsByClassName("power")[0].innerHTML = baseValues.power;
		target.getElementsByClassName("max-hull")[0].innerHTML = baseValues.maxHull;
		target.getElementsByClassName("shield")[0].innerHTML = baseValues.shield;
		target.getElementsByClassName("repair")[0].innerHTML = baseValues.repair;
		target.getElementsByClassName("cost")[0].innerHTML = baseValues.cost ? baseValues.cost : "";
		target.getElementsByClassName("ability-bar")[0].innerHTML = "";
		baseValues.abilities.forEach(a => {
			target.getElementsByClassName("ability-bar")[0].append(abilityIcons[a.index].cloneNode(true));
		});
	}
	
	function calculateBase(designNumber) {
		let baseCalc = Wasm.getBaseHullClass(designs[designNumber].hullClass);
		for (var i = SHIP_TYPES; i <= designNumber; i++) {
			designs[i].parts.forEach(p => {
				let partVals = Wasm.getPartDetails(p);
				baseCalc.power += partVals.power ? partVals.power : 0;
				baseCalc.maxHull += partVals.maxHull ? partVals.maxHull : 0;
				baseCalc.shield += partVals.shield ? partVals.shield : 0;
				baseCalc.repair += partVals.repair ? partVals.repair : 0;
				if (i === designNumber) baseCalc.cost += partVals.cost;
			});
		}
		baseCalc.abilities = [];
		for (var i = SHIP_TYPES; i <= designNumber; i++) {
			designs[i].abilities.forEach(c => {
				let abilityVals = Wasm.getAbilityDetails(c);
				baseCalc.abilities.push({index: c, description: abilityVals.description});
				baseCalc.power += abilityVals.power ? abilityVals.power : 0;
				baseCalc.maxHull += abilityVals.maxHull ? abilityVals.maxHull : 0;
				baseCalc.shield += abilityVals.shield ? abilityVals.shield : 0;
				baseCalc.repair += abilityVals.repair ? abilityVals.repair : 0;
				if (i === designNumber) baseCalc.cost += abilityVals.cost;
			});
		}
		
		// Calculate the total cost of the base.
		baseCalc.cost = Math.floor(Math.pow(baseCalc.cost, 1.1));
		updateBase(hanger[designNumber], baseCalc);
		if (designNumber < SHIP_TYPES + BASE_TYPES - 1) calculateBase(designNumber + 1);
	}
	
	function calculateShip(designNumber) {
		let shipCalc = Wasm.getHullClass(designs[designNumber].hullClass);
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
			let abilityVals = Wasm.getAbilityDetails(c);
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
		abilityList.forEach(c => {
			c.classList.remove("unavailable");
		});
		if (active === hangerNumber || hangerNumber === null) {
			active = null;
			return;
		}
		active = hangerNumber;
		if (active >= SHIP_TYPES) {
			abilityList.forEach((c, index) => {
				if (Wasm.getAbilityDetails(index).available === Wasm.AVAILABLE.SHIP_EXCLUSIVE) {
					c.classList.add("unavailable");
				}
				for (let i = SHIP_TYPES; i < active; i++){
					if (designs[i].abilities.findIndex(a => a === index) !== -1) c.classList.add("unavailable");
				}
			});
		}
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
		active < SHIP_TYPES ? calculateShip(active) : calculateBase(active);
	}
	
	function selectAbility(abilityNumber) {
		if (active === null) return;
		let index = designs[active].abilities.findIndex(c => c === abilityNumber);
		if (index === -1) {
			// Prevent a ship from having more than the maximum number of abilities.
			if (designs[active].abilities.length === MAX_ABILITIES) return;
			// Prevent a base from having more than the maximum number of abilities.
			if (active >= SHIP_TYPES){
				let abilityCount = 0;
				for (let i = SHIP_TYPES; i < SHIP_TYPES + BASE_TYPES; i++){
					abilityCount += designs[i].abilities.length;
					// Prevent a base from having the same ability twice.
					if (designs[i].abilities.findIndex(c => c === abilityNumber) !== -1) return;
				}
				if (abilityCount === MAX_ABILITIES) return;
			}
			designs[active].abilities.push(abilityNumber);
			abilityList[abilityNumber].classList.add("active");
		} else {
			designs[active].abilities.splice(index, 1);
			abilityList[abilityNumber].classList.remove("active");
		}
		active < SHIP_TYPES ? calculateShip(active) : calculateBase(active);
	}
	
	function expandAbility(ability) {
		ability.style.height = ability.scrollHeight + "px";
	}
	
	function collapseAbility(ability) {
		ability.style.height = "30px";
	}
	
	this.saveShips = function(name) {
		let player = name || document.getElementById("player-name").value;
		localStorage[player] = "sds" + JSON.stringify(designs);
	};
	
	this.loadShips = function(name) {
		if (!localStorage[name]) name = "default";
		designs = JSON.parse(localStorage[name].slice(3));
		for (let i = 0; i < 10; i++) calculateShip(i);
		for (let i = 10; i < 13; i++) calculateBase(i);
		[...document.getElementsByClassName("active")].forEach(node => {
			node.classList.remove("active");
		});
		activate(null);
	};
	
	this.deleteFleet = function(name) {
		if (!localStorage[name]) return;
		localStorage.removeItem(name);
	};
}).apply(Creator);