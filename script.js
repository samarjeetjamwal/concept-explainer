/**
 * Concept Explainer Tool - Frontend Logic
 * 
 * This script handles:
 * 1. Form submission
 * 2. Input validation
 * 3. Difficulty level selection
 * 4. Sending user input to backend
 * 5. Displaying explanations from backend
 * 
 * Updated to use fetch() POST to /explain endpoint
 */

// DOM Elements
const form = document.getElementById('explanationForm');
const topicInput = document.getElementById('topicInput');
const difficultyOptions = document.querySelectorAll('input[name="difficulty"]');
const explainButton = document.getElementById('explainButton');
const explanationResult = document.getElementById('explanationResult');

/**
 * Sends topic and difficulty to backend and retrieves explanation
 * @param {string} topic - The concept/topic to explain
 * @param {string} difficulty - Difficulty level (beginner/intermediate/advanced)
 * @returns {Promise<string>} Explanation HTML from backend
 */
async function fetchExplanation(topic, difficulty) {
    const response = await fetch('/explain', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic, difficulty })
    });

    if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.explanation || 'No explanation returned.';
}

/**
 * Displays explanation in the UI
 * @param {string} explanationHTML - HTML-formatted explanation to display
 */
function displayExplanation(explanationHTML) {
    explanationResult.innerHTML = explanationHTML;
    explanationResult.classList.add('visible');
    
    // Scroll to result smoothly
    explanationResult.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
}

/**
 * Handles form submission
 * @param {Event} e - Form submission event
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get user inputs
    const topic = topicInput.value.trim();
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked')?.value;
    
    // Validate input
    if (!topic) {
        alert('Please enter a topic to explain');
        return;
    }
    
    if (!selectedDifficulty) {
        alert('Please select a difficulty level');
        return;
    }
    
    // Show loading state
    const originalButtonText = explainButton.textContent;
    explainButton.textContent = 'Explaining...';
    explainButton.disabled = true;
    
    try {
        // Fetch explanation from backend
        const explanation = await fetchExplanation(topic, selectedDifficulty);
        
        // Display result
        displayExplanation(explanation);
    } catch (error) {
        console.error('Error fetching explanation:', error);
        explanationResult.innerHTML = `
            <h2>Error</h2>
            <p>Failed to generate explanation. Please try again.</p>
            <p><em>${error.message || 'An unknown error occurred.'}</em></p>
        `;
        explanationResult.classList.add('visible');
    } finally {
        // Restore button state
        explainButton.textContent = originalButtonText;
        explainButton.disabled = false;
    }
}

// Event Listeners
form.addEventListener('submit', handleFormSubmit);

// Initialize (optional): Focus on input when page loads
window.addEventListener('DOMContentLoaded', () => {
    topicInput.focus();
});
