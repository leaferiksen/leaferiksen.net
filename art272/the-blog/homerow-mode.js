let keyBuffer = "";
let timeoutId;

function toggleHomerowMode() {
	document.body.classList.toggle("homerow-mode-active");

	if (document.body.classList.contains("homerow-mode-active")) {
		document.addEventListener("keydown", handleKeyDown);
	} else {
		document.removeEventListener("keydown", handleKeyDown);
		keyBuffer = "";
		clearTimeout(timeoutId);
	}
}

function handleKeyDown(event) {
	const key = event.key.toUpperCase();

	if (key.length === 1 && key >= "A" && key <= "Z") {
		keyBuffer += key;

		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			keyBuffer = "";
		}, 700); // Reset buffer after 700ms

		if (keyBuffer.length === 2) {
			const navItems = document.querySelectorAll("nav li");
			for (const item of navItems) {
				if (item.dataset.tooltip === keyBuffer) {
					item.querySelector("a").click();
					event.preventDefault();
					break;
				}
			}
			keyBuffer = ""; // Reset buffer after attempting a match
		}
	} else {
		keyBuffer = ""; // Reset buffer if a non-alphabetic key is pressed
		clearTimeout(timeoutId);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const homerowModeButton = document.getElementById("homerowModeButton");
	if (homerowModeButton) {
		homerowModeButton.addEventListener("click", toggleHomerowMode);
	}
});
