// 1. Define the Array of Quote Objects
let quotes = [
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

// 2. Function to Display a Random Quote
function showRandomQuote() {
  // Get the HTML container
  const quoteDisplay = document.getElementById("quoteDisplay");

  // Check if quotes exist
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available.</p>";
    return;
  }

  // Generate a random index
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Create HTML elements for the quote
  // We use createElement for better DOM practice, but innerHTML is fine too.
  quoteDisplay.innerHTML = `
        <p><strong>"${randomQuote.text}"</strong></p>
        <p><em>Category: ${randomQuote.category}</em></p>
    `;
}

// 4. Function to Add a New Quote
function addQuote() {
  // Get values from the input fields
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  // Validate inputs (ensure they aren't empty)
  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Create a new quote object
  const newQuote = {
    text: newQuoteText,
    category: newQuoteCategory,
  };

  // Add to the array
  quotes.push(newQuote);

  // Clear the input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Optional: Immediately show the new quote or confirm addition
  alert("Quote added successfully!");
  showRandomQuote(); // Refresh display to potentially show the new one
}

// 5. Initial Setup
// Attach the 'Show New Quote' button listener
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Display a random quote when the page first loads
showRandomQuote();
