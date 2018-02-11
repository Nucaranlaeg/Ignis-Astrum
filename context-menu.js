var contextMenu;
const menuItems = [];
const contextMenuMask = {
	ship: [true],
	fleet: [false],
	hex: [false],
	all: [true]
}

function initializeContextMenu() {
	contextMenu = document.getElementById("context-menu");
	menuItems[0] = document.getElementById("context-target-priority");
}

document.addEventListener("DOMContentLoaded", initializeContextMenu, {once: true});

window.oncontextmenu = function (event) {
	let target = contextMenuMask.all; // TODO: determine what kind of item was clicked on
	contextMenu.classList.add("active");
	contextMenu.style.top = event.clientY + "px";
	contextMenu.style.left = event.clientX + "px";
	menuItems.forEach((item, index) => {
		if (target[index]) {
			item.classList.add("active");
		} else {
			item.classList.remove("active");
		}
	});
	return false;
}

document.addEventListener("click", () => {
	contextMenu.classList.remove("active");
});

document.addEventListener("keyup", (event) => {
	if (event.keyCode === 27) contextMenu.classList.remove("active");
});

function preventClose(event) {
	event.stopPropagation();
}