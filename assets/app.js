"use strict";

const app = document.getElementById("app");
const navLinks = [...document.querySelectorAll("#main-nav a")];

const routes = {};
let defaultPath;

const normalizePath = (path) => path.replace(/\/index\.html$/, "").replace(/\/$/, "") || "/";

navLinks.forEach((a, i) => {
	const { path, title } = a.dataset;
	if (path) routes[path] = title || a.textContent;
	const url = new URL(a.href, location.origin);
	if (i === 0 || (normalizePath(url.pathname) === normalizePath(location.pathname) && !url.searchParams.has("p"))) defaultPath = path || defaultPath;
});

const updateView = (url) => {
	const p = url.searchParams.get("p");
	const viewId = routes[p] ? p : defaultPath;
	const hash = url.hash.slice(1);

	const render = () => {
		if (app.dataset.view !== viewId) {
			if (typeof window.stopSketch === "function") window.stopSketch();
			const template = document.getElementById(viewId);
			if (template) {
				app.replaceChildren(template.content.cloneNode(true));
				document.title = routes[viewId];
				navLinks.forEach((a) => (a.ariaCurrent = a.dataset.path === viewId ? "page" : null));
				app.dataset.view = viewId;
				if (typeof window.startSketch === "function") window.startSketch();
			}
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
	if (url.origin === location.origin && normalizePath(url.pathname) === normalizePath(location.pathname)) {
		e.intercept({ handler: () => updateView(url) });
	}
};

updateView(new URL(location.href));
