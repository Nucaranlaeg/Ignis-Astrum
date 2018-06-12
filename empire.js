"use strict";

var Empire = {};
(function() {
	let treasury;
	let income = {total: 7, capital: 6, territory: 1, majorPlanets: 0, minorPlanets: 0};
	let sidebar, sidebarParts = {total: null, capital: null, territory: null, majorPlanets: null, minorPlanets: null, treasury: null};
	const SHIP_TYPES = Wasm.getShipTypes();
	
	function initializeEmpire() {
		sidebar = document.getElementById("empire-summary");
		sidebarParts.minorPlanets = document.getElementById("minor-planet-income");
		sidebarParts.majorPlanets = document.getElementById("major-planet-income");
		sidebarParts.territory = document.getElementById("territory-income");
		sidebarParts.capital = document.getElementById("capital-income");
		sidebarParts.total = document.getElementById("total-income");
		sidebarParts.treasury = document.getElementById("empire-treasury");
		
		this.updateEmpireSidebar();
	}

	document.addEventListener("DOMContentLoaded", initializeEmpire.bind(this), {once: true});
	
	this.updateEmpireSidebar = function() {
		treasury = Wasm.getEmpireTreasury();
		income = Wasm.getEmpireIncome();
		sidebarParts.treasury.innerHTML = treasury;
		sidebarParts.minorPlanets.innerHTML = income.minorPlanets;
		sidebarParts.majorPlanets.innerHTML = income.majorPlanets;
		sidebarParts.territory.innerHTML = income.territory;
		sidebarParts.capital.innerHTML = income.capital;
		sidebarParts.total.innerHTML = income.total;
	};
	
	this.buyShip = function(type) {
		let shipId = Wasm.addShip(type);
		if (shipId === -1) {
			ContextMenu.loadInfoWindow("Not enough IPCs in the capital.");
			return;
		}
		let newShip = Wasm.getShipClass(type);
		this.updateEmpireSidebar();
		let id = Map.getNewShipId(shipId);
		newShip.id = id.slice(4);
		Map.createShip(newShip.hullClass, id, true);
		Sidebar.addShip(newShip);
	};
	
	this.buyBase = function() {
		let baseId = Wasm.addBase(0);
		if (baseId === -1) {
			ContextMenu.loadInfoWindow("Not enough IPCs in the capital.");
			return;
		}
		let newBase = Wasm.getBaseClass(0);
		this.updateEmpireSidebar();
		let id = Map.getNewBaseId(baseId);
		newBase.id = id.slice(4);
		Map.createBase(0, id, true);
		Sidebar.addBase(newBase);
	};
	
	this.upgradeBase = function(id) {
		let baseId = Map.getBaseDBId(id);
		let targetBase = Wasm.upgradeBase(baseId);
		if (targetBase === -1) {
			ContextMenu.loadInfoWindow("Not enough IPCs available to that base.");
			return;
		}
		this.updateEmpireSidebar();
		Map.deleteBase(id);
		Map.createBase(targetBase.level, Map.getNewBaseId(baseId), true, targetBase.y + "." + targetBase.x);
	};
}).apply(Empire);