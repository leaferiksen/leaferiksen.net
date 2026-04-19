"use strict";

const routes = {
	about: { title: "Leaf Eriksen" },
	projects: { title: "Leaf's Projects" },
	blog: { title: "Leaf's Blog" },
};

const app = document.getElementById("app");
const titleEl = document.getElementById("main-title");
const navLinks = document.querySelectorAll("#main-nav a");

let lastViewId = null;

function updateView(url) {
	const viewId = routes[url.searchParams.get("p")] ? url.searchParams.get("p") : "about";
	const { title } = routes[viewId];
	const hash = url.hash.slice(1);

	const render = () => {
		if (lastViewId !== viewId) {
			app.replaceChildren(document.getElementById(`template-${viewId}`).content.cloneNode(true));
			document.title = titleEl.textContent = title;

			navLinks.forEach((a) => {
				if (a.dataset.path === viewId) a.setAttribute("aria-current", "page");
				else a.removeAttribute("aria-current");
			});
			lastViewId = viewId;
		}

		if (viewId === "blog") {
			app.querySelectorAll("details").forEach((acc) => {
				acc.open = acc.id === hash;
			});
		}
	};

	lastViewId !== viewId ? document.startViewTransition(render) : render();
}

app.addEventListener("click", (e) => {
	const summary = e.target.closest("summary");
	if (!summary) return;

	const details = summary.parentElement;
	if (details.tagName !== "DETAILS") return;

	e.preventDefault();
	navigation.navigate(`?p=blog${details.open ? "" : `#${details.id}`}`, { history: "replace" });
});

navigation.addEventListener("navigate", (e) => {
	const url = new URL(e.destination.url);
	if (url.origin === location.origin) e.intercept({ handler: () => updateView(url) });
});

addEventListener("DOMContentLoaded", () => {
	const url = new URL(location.href);
	updateView(url);
});
