// 1. Initialize global array
let quotes = [];

// --- STORAGE HELPER FUNCTIONS ---

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // Default data if storage is empty
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

// --- NEW: POPULATE CATEGORIES ---

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");

  // 1. Get all unique categories using Set
  // We map the quotes array to get just categories, then use Set to remove duplicates
  const categories = [...new Set(quotes.map((quote) => quote.category))];

  // 2. Clear existing options (keep the first "All Categories" option)
  // We start loop from index 1 because index 0 is "All Categories"
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }

  // 3. Add new options
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // 4. Restore last selected filter from Local Storage
  const lastSelectedFilter = localStorage.getItem("lastSelectedFilter");
  if (lastSelectedFilter) {
    categoryFilter.value = lastSelectedFilter;
  }
}

// --- NEW: FILTER LOGIC ---

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;

  // Save the selection to Local Storage
  localStorage.setItem("lastSelectedFilter", selectedCategory);

  // Refresh the displayed quote based on the new filter
  showRandomQuote();
}

// --- UPDATED: SHOW RANDOM QUOTE ---

function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const selectedCategory = document.getElementById("categoryFilter").value;

  // 1. Filter the array based on selection
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(
      (quote) => quote.category === selectedCategory
    );
  }

  // 2. Handle empty results
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
    return;
  }

  // 3. Pick random quote from the FILTERED list
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
        <p><strong>"${randomQuote.text}"</strong></p>
        <p><em>Category: ${randomQuote.category}</em></p>
    `;
}

// --- FORM CREATION & ADDING ---

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
  saveQuotes();

  // UPDATE: Refresh categories immediately in case user typed a new one
  populateCategories();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
  showRandomQuote(); // Refresh display
}

// --- IMPORT / EXPORT ---

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", "quotes.json");
  linkElement.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (!Array.isArray(importedQuotes)) {
        alert("Invalid file format.");
        return;
      }
      quotes.push(...importedQuotes);
      saveQuotes();

      // UPDATE: Refresh categories after import
      populateCategories();

      alert("Quotes imported successfully!");
      showRandomQuote();
    } catch (error) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// --- INITIALIZATION ---

// 1. Load data
loadQuotes();

// 2. Build Form
createAddQuoteForm();

// 3. Populate Dropdown (must happen after loading quotes)
populateCategories();

// 4. Attach Listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// 5. Initial Display (This will respect the restored filter from step 3)
filterQuotes();
