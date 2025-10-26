let keyBuffer = "";
let timeoutId;
const HOMEROW_MODE_KEY = "homerowModeActive";

function toggleHomerowMode() {
	const isActive = document.body.classList.toggle("homerow-mode-active");
	localStorage.setItem(HOMEROW_MODE_KEY, isActive);

	if (isActive) {
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
					keyBuffer = ""; // Reset buffer after attempting a match
					return;
				}
			}

			const homerowModeButton = document.getElementById("homerowModeButton");
			if (homerowModeButton && homerowModeButton.dataset.tooltip === keyBuffer) {
				homerowModeButton.click();
				event.preventDefault();
			}
			keyBuffer = ""; // Reset buffer after attempting a match
		}
	} else {
		keyBuffer = ""; // Reset buffer if a non-alphabetic key is pressed
		clearTimeout(timeoutId);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	// Initialize mode from localStorage
	const savedMode = localStorage.getItem(HOMEROW_MODE_KEY);
	if (savedMode === "true") {
		document.body.classList.add("homerow-mode-active");
		document.addEventListener("keydown", handleKeyDown);
	}

	const homerowModeButton = document.getElementById("homerowModeButton");
	if (homerowModeButton) {
		homerowModeButton.addEventListener("click", toggleHomerowMode);
	}
});
