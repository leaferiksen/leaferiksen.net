			"use strict";

			const routes = {
				about: { template: "template-about", title: "Leaf Eriksen", header: "Leaf Eriksen", showSidebar: true },
				projects: { template: "template-projects", title: "Leaf's Projects", header: "Leaf's Projects", showSidebar: false },
				blog: { template: "template-blog", title: "Leaf's Blog", header: "Leaf's Blog", showSidebar: false },
			};

			let lastViewId = null;

			function updateView(url) {
				const viewId = url.searchParams.get("p") || "about";
				const hash = url.hash;
				const route = routes[viewId] || routes.about;
				const template = document.getElementById(route.template);
				const app = document.getElementById("app");
				const sidebar = document.getElementById("app-sidebar");
				const titleEl = document.getElementById("main-title");
				const nav = document.getElementById("main-nav");

				const render = () => {
					if (lastViewId !== viewId) {
						app.innerHTML = "";
						app.appendChild(template.content.cloneNode(true));
						document.title = route.title;
						titleEl.textContent = route.header;
						lastViewId = viewId;

						// Toggle Sidebar
						if (route.showSidebar) {
							sidebar.classList.remove("hidden");
							sidebar.classList.add("flex");
							app.classList.add("sm:w-2/3", "sm:border-l", "sm:pl-8");
						} else {
							sidebar.classList.add("hidden");
							sidebar.classList.remove("flex");
							app.classList.remove("sm:w-2/3", "sm:border-l", "sm:pl-8");
						}
					}

					// Update navigation links visibility/active state
					document.querySelectorAll("#main-nav a").forEach((link) => {
						if (link.dataset.path === viewId) {
							link.setAttribute("aria-current", "page");
						} else {
							link.removeAttribute("aria-current");
						}
					});

					if (viewId === "blog") {
						const targetId = hash.substring(1);
						const accordions = app.querySelectorAll("details");
						accordions.forEach((acc) => {
							if (targetId && acc.id === targetId) {
								acc.open = true;
								requestAnimationFrame(() => acc.scrollIntoView({ behavior: "smooth" }));
							} else {
								acc.open = false;
							}
						});
					}
				};

				if (lastViewId !== viewId) {
					document.startViewTransition(render);
				} else {
					render();
				}
			}

			window.addurl = (event, newhash) => {
				event.preventDefault();
				const url = new URL(window.location.href);
				url.hash = url.hash === `#${newhash}` ? "" : newhash;
				navigation.navigate(url.href, { history: "replace" });
			};

			navigation.addEventListener("navigate", (event) => {
				const url = new URL(event.destination.url);
				if (url.origin === location.origin) {
					event.intercept({
						async handler() {
							updateView(url);
						},
					});
				}
			});

			window.addEventListener("DOMContentLoaded", () => {
				updateView(new URL(window.location.href));
			});
