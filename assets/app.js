"use strict";

const app = document.getElementById("app");
const navLinks = document.querySelectorAll("#main-nav a");

const routes = {};
let defaultPath = null;

navLinks.forEach((a, i) => {
	const path = a.dataset.path;
	routes[path] = { title: a.dataset.title || a.textContent };
	if (i === 0) defaultPath = path;

	const url = new URL(a.href, location.origin);
	if (url.pathname === location.pathname && !url.searchParams.has("p")) defaultPath = path;
});

let lastViewId = null;

function updateView(url) {
	const p = url.searchParams.get("p");
	const viewId = routes[p] ? p : defaultPath;
	const { title } = routes[viewId];
	const hash = url.hash.slice(1);

	const render = () => {
		if (lastViewId !== viewId) {
			app.replaceChildren(document.getElementById(viewId).content.cloneNode(true));
			document.title = title;

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
	navigation.navigate(`?p=${lastViewId}${details.open ? "" : `#${details.id}`}`, { history: "replace" });
});

navigation.addEventListener("navigate", (e) => {
	const url = new URL(e.destination.url);
	if (url.origin === location.origin && url.pathname === location.pathname) e.intercept({ handler: () => updateView(url) });
});

addEventListener("DOMContentLoaded", () => {
	const url = new URL(location.href);
	updateView(url);
});
