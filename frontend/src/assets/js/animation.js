// Function to show or hide the suggestion buttons area (slide to left)
function toggleSuggestions() {
    console.log("toggleSuggestions called"); // Debugging log
    const suggestionsBox = document.querySelector('.suggestion-buttons-box');
    console.log("Suggestions Box:", suggestionsBox); // Debugging log

    if (suggestionsBox) {
        if (suggestionsBox.classList.contains('hide-left')) {
            // Slide to the left (show)
            suggestionsBox.classList.remove('hide-left');
            suggestionsBox.classList.add('show-left');
            console.log("Showing suggestions"); // Debugging log
        } else {
            // Slide back to the center (hide)
            suggestionsBox.classList.remove('show-left');
            suggestionsBox.classList.add('hide-left');
            console.log("Hiding suggestions"); // Debugging log
        }
    } else {
        console.error("Suggestions Box not found"); // Error log
    }
}

// Function to show or hide the inventory slots area (slide to right)
function toggleInventory() {
    console.log("toggleInventory called"); // Debugging log
    const inventoryArea = document.querySelector('.inventory-slots-area');
    console.log("Inventory Area:", inventoryArea); // Debugging log

    if (inventoryArea) {
        if (inventoryArea.classList.contains('hide-right')) {
            // Slide to the right (show)
            inventoryArea.classList.remove('hide-right');
            inventoryArea.classList.add('show-right');
            console.log("Showing inventory"); // Debugging log
        } else {
            // Slide back to the center (hide)
            inventoryArea.classList.remove('show-right');
            inventoryArea.classList.add('hide-right');
            console.log("Hiding inventory"); // Debugging log
        }
    } else {
        console.error("Inventory Area not found"); // Error log
    }
}

// Ensure that DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed"); // Debugging log

    const inventoryButton = document.querySelector('.inventory-button');
    const partnerButton = document.querySelector('.partner-button');
    
    console.log("Inventory Button:", inventoryButton); // Debugging log
    console.log("Partner Button:", partnerButton); // Debugging log

    if (inventoryButton) {
        inventoryButton.addEventListener('click', toggleInventory);
    } else {
        console.error("Inventory Button not found"); // Error log
    }

    if (partnerButton) {
        partnerButton.addEventListener('click', toggleSuggestions);
    } else {
        console.error("Partner Button not found"); // Error log
    }
});
