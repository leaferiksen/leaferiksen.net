//open the accordion for the current url hash
window.onload = function openAccordion() {
  const hash = window.location.hash;
  const accord = document.querySelector(`details${hash}`);
  if (accord) {
    accord.open = true;
  }
};

function addurl(hash) {
  // Close all currently open <details> elements except the one we want to open.
  const details = document.querySelectorAll("details");
  details.forEach((detail) => {
    if (detail.id !== hash && detail.open === true) {
      detail.open = false;
    }
  });
  // add the hash to the url
  location.href = "blog.html#" + hash;
}
