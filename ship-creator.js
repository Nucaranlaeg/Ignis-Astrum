"use strict"

var Creator = {};
(function() {
	let ship = [];
	let shipDetails, shipList, hulls;
	
	function initializeCreator() {
		// Load references to DOM elements from the HTML.
		for (let i = 0; true; i++) {
			let s = document.getElementById("ship" + i + "-template");
			if (!s) break;
			ship[i] = s;
			ship[i].removeAttribute("id");
			ship[i].removeChild(ship[i].firstChild);
			ship[i].removeChild(ship[i].lastChild);
		}
		shipDetails = document.getElementById("ship-detail-template");
		shipList = document.getElementById("ship-list");
		hulls = document.getElementById("hulls");
		
		ship.forEach(s => {
			let newShipDetail = shipDetails.cloneNode(true);
			window.foo = newShipDetail.getElementsByClassName("image");
			newShipDetail.getElementsByClassName("image")[0].append(s.cloneNode(true));
			hulls.append(newShipDetail);
		});
	}
	
	document.addEventListener("DOMContentLoaded", initializeCreator.bind(this), {once: true});
	
}).apply(Creator);