"use strict";

var Empire = {};
(function() {
	let treasury, territory, income;
	let sidebar, sidebarParts = {territory: null, treasury: null, income: null};
	const SHIP_TYPES = Wasm.getShipTypes();
	
	function initializeEmpire() {
		sidebar = document.getElementById("empire-summary");
		sidebarParts.territory = document.getElementById("territory-owned");
		sidebarParts.treasury = document.getElementById("empire-treasury");
		sidebarParts.income = document.getElementById("capital-income");
	}

	document.addEventListener("DOMContentLoaded", initializeEmpire.bind(this), {once: true});
	
	this.updateEmpireSidebar = function() {
		treasury = Wasm.getEmpireTreasury();
		territory = [...document.getElementsByClassName("blue")].filter(hex => hex.classList.contains("seen")).length;
		income = Wasm.getCapitalIncome();
		sidebarParts.treasury.innerHTML = treasury;
		sidebarParts.territory.innerHTML = territory;
		sidebarParts.income.innerHTML = income;
	};
	
	this.buyShip = function(type) {
		if (Sidebar.loadedState != 2) return;
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
		if (Sidebar.loadedState != 2) return;
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