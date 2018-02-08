function toggle(section) {
	var target = document.getElementById(section);
	if (target.style.maxHeight === "0px" || !target.style.maxHeight) {
		target.style.maxHeight = target.scrollHeight + "px";
	} else {
		target.style.maxHeight = "0px";
	}
}

function reflow(section) {
	var target = document.getElementById(section);
	if (target.style.maxHeight === "0px") return;
	target.style.maxHeight = target.scrollHeight + "px";
}
