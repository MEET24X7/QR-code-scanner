// Selecting elements from the HTML document using their class names and tags.
const wrapper = document.querySelector(".wrapper"),
  form = document.querySelector("form"),
  fileInp = form.querySelector("input"),
  infoText = form.querySelector("p"),
  closeBtn = document.querySelector(".close"),
  copyBtn = document.querySelector(".copy");

// Function to handle the fetch request for scanning the QR code.
function fetchRequest(file, formData) {
  infoText.innerText = "Scanning QR Code...";

  // Sending a POST request to the QR code scanning API.
  fetch("http://api.qrserver.com/v1/read-qr-code/", {
    method: 'POST',
    body: formData
  }).then(res => res.json()).then(result => {
    result = result[0].symbol[0].data;
    infoText.innerText = result ? "Upload QR Code to Scan" : "Couldn't scan QR Code";
    if (!result) return;

    // If a QR code is successfully scanned, display the content and image.
    document.querySelector("textarea").innerText = result;
    form.querySelector("img").src = URL.createObjectURL(file);
    wrapper.classList.add("active");
  }).catch(() => {
    infoText.innerText = "Couldn't scan QR Code";
  });
}

// Event listener for the file input to trigger QR code scanning when a file is selected.
fileInp.addEventListener("change", async e => {
  let file = e.target.files[0];
  if (!file) return;

  // Create a FormData object to send the file.
  let formData = new FormData();
  formData.append('file', file);

  // Call the fetchRequest function to handle the fetch request.
  fetchRequest(file, formData);
});

// Event listener for the "Copy Text" button to copy the scanned text to the clipboard.
copyBtn.addEventListener("click", () => {
  let text = document.querySelector("textarea").textContent;

  // Use the Clipboard API to copy the text to the clipboard.
  navigator.clipboard.writeText(text);
});

// Event listener for the form element to open the file input when the form is clicked.
form.addEventListener("click", () => fileInp.click());

// Event listener for the "Close" button to remove the "active" class from the wrapper and hide details.
closeBtn.addEventListener("click", () => wrapper.classList.remove("active"));
