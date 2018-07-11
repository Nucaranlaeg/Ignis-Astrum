"use strict"

var Creator = {};
(function() {
	// Internal to JS
	let ship = [], designs = []; 
	let active = null;
	
	// DOM Elements
	let players, shipDetails, partDetails, abilityDetails, shipList, baseList, hulls, parts, abilities;
	let hanger = [], hullList = [], partList = [], abilityList = [], abilityIcons = [];
	
	// Constants
	const SHIP_TYPES = Wasm.getShipTypes(), BASE_TYPES = Wasm.getBaseTypes(), MAX_ABILITIES = Wasm.getMaxAbilities();
	
	function initializeCreator() {
		// Load references to DOM elements from the HTML.
		for (let i = 0; i < SHIP_TYPES; i++) {
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
			hullList.push(newShipDetail);
			hulls.append(newShipDetail);
		});
		
		// Add bases to the ship list late; they shouldn't be selectable as options for hulls.
		for (let i = SHIP_TYPES; i < SHIP_TYPES + BASE_TYPES; i++) {
			let b = document.getElementById("ship" + i + "-template");
			if (!b) break;
			ship[i] = b;
			ship[i].removeAttribute("id");
			ship[i].removeChild(ship[i].firstChild);
			ship[i].removeChild(ship[i].lastChild);
			ship[i].dataset.hullClass = i;
		}
		
		// Populate the player's ship list
		for (let i = 0; i < SHIP_TYPES; i++){
			let newShipDetail = shipDetails.cloneNode(true);
			designs[i] = {hullClass: 0, parts: [], abilities: [], isBase: false};
			newShipDetail.onclick = () => {activate(i)};
			shipList.append(newShipDetail);
			hanger[i] = newShipDetail;
		}
		
		// Populate the player's base list
		for (let i = SHIP_TYPES; i < SHIP_TYPES + BASE_TYPES; i++){
			let newShipDetail = shipDetails.cloneNode(true);
			designs[i] = {hullClass: i, parts: [], abilities: [], isBase: true};
			newShipDetail.onclick = () => {activate(i)};
			baseList.append(newShipDetail);
			hanger[i] = newShipDetail;
		}
		
		// Calculate the lists' values
		for (let i = 0; i < SHIP_TYPES + BASE_TYPES; i++){
			calculateShip(i);
		}
		
		// Populate the available parts list
		let nextPart;
		for (let i = 0; nextPart = Wasm.getPartDetails(i); i++) { // Assignment here is intentional.
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
			target.getElementsByClassName("ability-bar")[0].append(abilityIcons[a].cloneNode(true));
		});
	}
	
	function calculateShip(designNumber) {
		updateShip(hanger[designNumber], Wasm.calculateShip(designNumber, designs));
		// Calculate base upgrade values at the same time.
		if (designNumber >= SHIP_TYPES && designNumber < SHIP_TYPES + BASE_TYPES - 1)
			calculateShip(designNumber + 1);
	}
	
	function activate(hangerNumber) {
		// Remove all "Active" indicators
		if (active !== null) {
			hanger[active].classList.remove("active");						// on Ship or Base
			hullList.forEach(i => i.classList.remove("active"));			// on Available Hulls
			hullList.forEach(i => i.classList.remove("unavailable"));		// on Available Hulls
			partList.forEach(i => i.classList.remove("active"));			// on Available Parts
			partList.forEach(i => i.classList.remove("unavailable"));		// on Available Parts
			abilityList.forEach(i => i.classList.remove("active"));			// on Available Abili
			abilityList.forEach(i => i.classList.remove("unavailable"));	// on Available Abilities
		}

		// Check if we are just deactivating the current selection
		if (active === hangerNumber || hangerNumber === null) {
			active = null;
			return;
			
		} else {	// Proceed to set which components are available or selected	
			active = hangerNumber;
			hanger[active].classList.add("active");
		
					// Hulls
			if (designs[active].isBase)
				hullList.forEach(i => i.classList.add("unavailable"));
			else
				hullList[designs[active].hullClass].classList.add("active");
			
					// Parts
			partList.forEach(i => {
				if  ((!designs[active].isBase && i.available === Wasm.AVAILABLE.BASE_EXCLUSIVE) ||
					(designs[active].isBase && i.available === Wasm.AVAILABLE.SHIP_EXCLUSIVE)) {
						i.classList.add("unavailable");
				}
			} );			
			designs[active].parts.forEach( i => partList[i].classList.add("active") );
			
					// Abilities
			abilityList.forEach((i, index) => {
				let abilityAvailable = Wasm.getAbilityDetails(index).available;
				if  ((!designs[active].isBase && abilityAvailable === Wasm.AVAILABLE.BASE_EXCLUSIVE) ||
					(designs[active].isBase && abilityAvailable === Wasm.AVAILABLE.SHIP_EXCLUSIVE)) {
						i.classList.add("unavailable");
				}
			} );			
			designs[active].abilities.forEach( i => abilityList[i].classList.add("active") );
		}
	}
	
	function changeShipHull(hull) {
		if (active == null) 
			return;
		
		hullList[designs[active].hullClass].classList.remove("active");
		hullList[hull].classList.add("active");
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
		calculateShip(active);
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
		for (let i = 0; i < SHIP_TYPES + BASE_TYPES; i++) calculateShip(i);
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