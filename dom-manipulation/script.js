// 1. Initialize empty array (we will fill it from Local Storage)
let quotes = [];

// 2. Helper Function: Save Quotes to Local Storage
function saveQuotes() {
  // Convert the array to a JSON string and save it
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// 3. Helper Function: Load Quotes from Local Storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    // If data exists, parse it back into an array
    quotes = JSON.parse(storedQuotes);
  } else {
    // Default quotes if nothing is in storage
    quotes = [
      {
        text: "The only way to do great work is to love what you do.",
        category: "Inspiration",
      },
      {
        text: "Life is what happens when you're busy making other plans.",
        category: "Life",
      },
      { text: "Get busy living or get busy dying.", category: "Motivation" },
    ];
  }
}

// 4. Function to Display a Random Quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
        <p><strong>"${randomQuote.text}"</strong></p>
        <p><em>Category: ${randomQuote.category}</em></p>
    `;

  // Optional: Store the last viewed quote in Session Storage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// 5. Function to Create the Form
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const inputQuote = document.createElement("input");
  inputQuote.id = "newQuoteText";
  inputQuote.type = "text";
  inputQuote.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  formContainer.appendChild(inputQuote);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// 6. Function to Add a New Quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = {
    text: newQuoteText,
    category: newQuoteCategory,
  };

  quotes.push(newQuote);

  // SAVE to Local Storage whenever we add a quote
  saveQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
  showRandomQuote();
}

// 7. JSON Export Function
function exportToJsonFile() {
  // Convert quotes array to JSON string
  const dataStr = JSON.stringify(quotes);

  // Create a Blob (a file-like object of immutable raw data)
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  // Create a fake hidden link to trigger the download
  const exportFileDefaultName = "quotes.json";

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click(); // Trigger the click
}

// 8. JSON Import Function
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);

      // Check if imported data is an array
      if (!Array.isArray(importedQuotes)) {
        alert(
          "Invalid file format. Please upload a valid JSON array of quotes."
        );
        return;
      }

      // Add imported quotes to existing array
      quotes.push(...importedQuotes);

      // Save updated array to local storage
      saveQuotes();

      alert("Quotes imported successfully!");
      showRandomQuote(); // Refresh display
    } catch (error) {
      alert("Error parsing JSON file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// --- INITIALIZATION ---

// Load existing quotes from storage
loadQuotes();

// Build the form
createAddQuoteForm();

// Setup event listener
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Optional: Check if we have a "last viewed" quote in session storage
const lastViewed = sessionStorage.getItem("lastViewedQuote");
if (lastViewed) {
  // If we have one from this session, show it
  const quote = JSON.parse(lastViewed);
  document.getElementById("quoteDisplay").innerHTML = `
        <p><strong>"${quote.text}"</strong></p>
        <p><em>Category: ${quote.category}</em></p>
    `;
} else {
  // Otherwise show random
  showRandomQuote();
}
