"use strict";

var Empire = {};
(function() {
	let treasury, territory, income;
	let sidebar, sidebarParts = {territory: null, treasury: null, income: null};
	const SHIP_TYPES = Wasm.getUnitTypes();
	
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
	
	this.upgradeShip = function(id) {
		let shipId = Map.getShipDBId(id);
		let targetShip = Wasm.upgradeShip(shipId);
		if (targetShip === -1) {
			ContextMenu.loadInfoWindow("Not enough IPCs available to that unit.");
			return;
		}
		this.updateEmpireSidebar();
		Map.deleteShip(id);
		Map.createShip(targetShip.hullClass, Map.getNewShipId(shipId), true, targetShip.y + "." + targetShip.x);
	};
}).apply(Empire);