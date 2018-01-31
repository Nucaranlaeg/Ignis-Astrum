function toggle(section) {
	var target = document.getElementById(section);
	console.log(target.style.maxHeight);
	if (!target.style.height) {
		target.style.height = window.getComputedStyle(target).height;
		target.style.maxHeight = target.style.height;
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