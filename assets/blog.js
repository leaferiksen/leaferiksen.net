//open the accordion for the current url hash
window.onload = function openAccordion() {
  const hash = window.location.hash;
  if (hash) {
    const accord = document.querySelector(`details${hash}`);
    if (accord) {
      accord.open = true;
    }
  } else {
    return; // Exit the function when there's an empty hash
  }
};

function addurl(newhash) {
  // Close all currently open <details> elements except the one we want to open.
  const details = document.querySelectorAll("details");
  details.forEach((detail) => {
    if (detail.id !== newhash && detail.open === true) {
      detail.open = false;
    }
  });
  // add the hash to the url
  location.href = "blog#" + newhash;
}
