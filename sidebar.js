var abilities = {};

function initializeSidebar() {
	detail = document.getElementById("ship-detail-template");
	detail.removeAttribute("id");
	
	addShip({power: 3, currentHull: 4, maxHull: 5}, true);
	addShip({power: 2, currentHull: 6, maxHull: 7}, false);
}

document.addEventListener("DOMContentLoaded", initializeSidebar, {once: true});

function toggle(section) {
	let target = document.getElementById(section);
	if (target.style.maxHeight === "0px" || !target.style.maxHeight) {
		target.style.maxHeight = target.scrollHeight + "px";
	} else {
		target.style.maxHeight = "0px";
	}
}

function addShip(ship, allied) {
	section = allied ? document.getElementById("friendly-ships-seen") : document.getElementById("enemy-ships-seen");
	newShip = detail.cloneNode(true);
	newShip.getElementsByClassName("power")[0].innerHTML = ship.power;
	newShip.getElementsByClassName("current-hull")[0].innerHTML = ship.currentHull;
	newShip.getElementsByClassName("max-hull")[0].innerHTML = ship.maxHull;
	for (let i in ship.abilities) {
		newShip.getElementsByClassName("ability-bar")[0].append(abilities[i]);
	}
	section.append(newShip);
}

function readPriority(inputId) {
	let value = document.getElementById(inputId).value;
	// Scale value from 0.5 to 2
	value = Math.pow(2, value / 50 - 1);
	console.log(value);
}