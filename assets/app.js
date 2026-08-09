"use strict";

// Main content area and header nav links used throughout
const app = document.getElementById("app");
const navLinks = [...document.querySelectorAll("#main-nav a")];

// Maps a view id (matches a <template id="..."> and a nav link's data-path) to its page title
const routes = {};
// View id shown when no ?p= is given
let defaultPath;

navLinks.forEach((a, i) => {
	const { path, title } = a.dataset;
	if (path) routes[path] = title || a.textContent;
	// The nav link with no query string (just "/") is the default view;
	// first link is a fallback in case none match
	if (i === 0 || !a.search) defaultPath = path || defaultPath;
});

// Swaps the visible template based on the given URL's ?p= param
const updateView = (url) => {
	const p = url.searchParams.get("p");
	const viewId = p in routes ? p : defaultPath;
	const render = () => {
		// Skip if we're already showing this view (e.g. reload, or only the hash changed)
		if (app.dataset.view !== viewId) {
			// Tear down any running p5 sketch before swapping content out
			if (typeof window.stopSketch === "function") window.stopSketch();
			const template = document.getElementById(viewId);
			if (template) {
				app.replaceChildren(template.content.cloneNode(true));
				document.title = routes[viewId];
				// Mark the matching nav link as the current page for styling/a11y
				navLinks.forEach((a) => (a.ariaCurrent = a.dataset.path === viewId ? "page" : null));
				app.dataset.view = viewId;
				// Start a p5 sketch if the new view defines one
				if (typeof window.startSketch === "function") window.startSketch();
			}
		}
	};
	// Animate the swap with a view transition, but only if the view is actually changing
	app.dataset.view !== viewId && document.startViewTransition ? document.startViewTransition(render) : render();
};

// Strips a trailing "/index.html" or "/" so path comparisons ignore those variants
const normalizePath = (path) => path.replace(/\/index\.html$/, "").replace(/\/$/, "") || "/";

// Intercept same-page link clicks (and back/forward) so we swap templates
// instead of doing a full page load. Navigations to a different page
// (other site sections, PDFs, mailto:, external links, etc.) are left alone.
navigation.addEventListener("navigate", (e) => {
	const url = new URL(e.destination.url);
	if (e.canIntercept && !e.hashChange && e.downloadRequest === null && normalizePath(url.pathname) === normalizePath(location.pathname)) e.intercept({ handler: () => updateView(url) });
});

// Render whatever view the page was loaded with
updateView(new URL(location.href));
