function toggle(section) {
	var target = document.getElementById(section);
	if (!target.style.height) {
		throw ("Initialization error " + section);
	}
	target.style.maxHeight = target.style.maxHeight == '0px' ? target.style.height : '0px';
}

function initialize() {
	[...document.getElementsByClassName("accordion")].forEach(accordion => {
		accordion.style.height = window.getComputedStyle(accordion).height;
		accordion.style.maxHeight = '0px';
	});
}

document.addEventListener("DOMContentLoaded", initialize);