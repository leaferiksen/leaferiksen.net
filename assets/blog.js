//open the accordion for the current url hash
window.onload = function openAccordion() {
  const hash = window.location.hash;
  if (hash) {
    const accordion = document.querySelector(`details${hash}`);
    if (accordion) {
      accordion.open = true;
    }
  } else {
    return; // Exit the function when there's an empty hash
  }
};

function addurl(newhash) {
  // When client opens an accordion close any other open accordions.
  const allAccordions = document.querySelectorAll("details");
  allAccordions.forEach((accordion) => {
    if (accordion.id !== newhash && accordion.open === true) {
      accordion.open = false;
    }
  });
  // Is client local? If so, include html file extension when adding the hash to the url
  if (window.location.protocol === "file:") {
    location.href = "blog.html#" + newhash;
  } else {
    location.href = "blog#" + newhash;
  }
}
