"use strict";

const app = document.getElementById("app");
const navLinks = [...document.querySelectorAll("#main-nav a")];

const routes = {};
let defaultPath;

navLinks.forEach((a, i) => {
	const { path, title } = a.dataset;
	routes[path] = title || a.textContent;
	const url = new URL(a.href, location.origin);
	if (i === 0 || (url.pathname === location.pathname && !url.searchParams.has("p"))) defaultPath = path;
});

const updateView = (url) => {
	const viewId = routes[url.searchParams.get("p")] ? url.searchParams.get("p") : defaultPath;
	const hash = url.hash.slice(1);

	const render = () => {
		if (app.dataset.view !== viewId) {
			app.replaceChildren(document.getElementById(viewId).content.cloneNode(true));
			document.title = routes[viewId];
			navLinks.forEach((a) => (a.ariaCurrent = a.dataset.path === viewId ? "page" : null));
			app.dataset.view = viewId;
		}
		app.querySelectorAll("details").forEach((d) => (d.open = d.id === hash));
	};

	app.dataset.view !== viewId && document.startViewTransition ? document.startViewTransition(render) : render();
};

app.onclick = (e) => {
	const details = e.target.closest("summary")?.parentElement;
	if (details?.tagName === "DETAILS") {
		e.preventDefault();
		navigation.navigate(`?p=${app.dataset.view}${details.open ? "" : `#${details.id}`}`, { history: "replace" });
	}
};

navigation.onnavigate = (e) => {
	const url = new URL(e.destination.url);
	if (url.origin === location.origin && url.pathname === location.pathname) {
		e.intercept({ handler: () => updateView(url) });
	}
};

updateView(new URL(location.href));
