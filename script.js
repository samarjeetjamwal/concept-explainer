/**
 * Concept Explainer Tool - Frontend Logic
 * 
 * This script handles:
 * 1. Form submission
 * 2. Input validation
 * 3. Difficulty level selection
 * 4. Generating structured AI prompts
 * 5. Displaying explanations (placeholder)
 * 
 * Note: This is a frontend-only implementation.
 * In a real app, you would send the prompt to an AI API.
 */

// DOM Elements
const form = document.getElementById('explanationForm');
const topicInput = document.getElementById('topicInput');
const difficultyOptions = document.querySelectorAll('input[name="difficulty"]');
const explainButton = document.getElementById('explainButton');
const explanationResult = document.getElementById('explanationResult');

/**
 * Generates a structured prompt for an AI model based on user input
 * @param {string} topic - The concept/topic to explain
 * @param {string} difficulty - Difficulty level (beginner/intermediate/advanced)
 * @returns {string} Structured prompt for AI
 */
function generateAIPrompt(topic, difficulty) {
    // Map difficulty levels to descriptive terms for the AI
    const difficultyDescriptions = {
        beginner: "simple terms for someone with no prior knowledge",
        intermediate: "detailed explanation for someone with basic understanding",
        advanced: "in-depth technical explanation for experts"
    };

    // Create a structured prompt with clear instructions
    return `Explain the concept of "${topic}" in ${difficultyDescriptions[difficulty]}.
    
Requirements:
- Start with a clear definition
- Use 3-5 short paragraphs
- Include 1-2 real-world examples
- Avoid jargon where possible (unless advanced level)
- End with a summary sentence
    
Format your response in clean HTML with appropriate paragraph tags.`;
}

/**
 * Simulates AI explanation generation (placeholder)
 * In a real implementation, this would call an AI API
 * @param {string} prompt - The generated AI prompt
 * @returns {Promise<string>} Mock explanation HTML
 */
async function getAIExplanation(prompt) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Extract topic from prompt for mock response
    const topicMatch = prompt.match(/"([^"]+)"/);
    const topic = topicMatch ? topicMatch[1] : "your concept";
    
    // Determine difficulty from prompt
    let difficultyLevel = "beginner";
    if (prompt.includes("detailed explanation")) difficultyLevel = "intermediate";
    if (prompt.includes("in-depth technical")) difficultyLevel = "advanced";
    
    // Generate mock explanation based on difficulty
    const explanations = {
        beginner: `
            <h2>Simple Explanation of ${topic}</h2>
            <p>${topic} is a fundamental concept in its field. Think of it like explaining how a bicycle works - you start with the basic parts and how they fit together.</p>
            <p>For example, in everyday life, you might encounter ${topic} when... [real-world example].</p>
            <p>The key takeaway is that ${topic} helps us understand... [simple principle].</p>
            <p><em>This is a beginner-friendly explanation generated as a placeholder.</em></p>
        `,
        intermediate: `
            <h2>Detailed Explanation of ${topic}</h2>
            <p>${topic} involves several interconnected components that work together to... [core mechanism]. Understanding this requires familiarity with foundational concepts like...</p>
            <p>A practical application includes... [industry example]. For instance, engineers use ${topic} to solve... [specific problem].</p>
            <p>Compared to simpler approaches, ${topic} offers advantages such as... [benefits] but also presents challenges like... [limitations].</p>
            <p><em>This intermediate explanation is a simulation for demonstration purposes.</em></p>
        `,
        advanced: `
            <h2>Technical Explanation of ${topic}</h2>
            <p>The mathematical foundations of ${topic} derive from... [advanced theory]. Key equations include... [formula reference] which describes... [technical relationship].</p>
            <p>In cutting-edge research, ${topic} enables... [advanced application]. Recent papers by [Researcher] demonstrate... [technical achievement].</p>
            <p>Current limitations in the field involve... [open problem], with proposed solutions leveraging... [advanced technique]. Optimization requires consideration of... [complex factors].</p>
            <p><em>This advanced technical explanation is a placeholder simulation.</em></p>
        `
    };
    
    return explanations[difficultyLevel];
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
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
    
    // Validate input
    if (!topic) {
        alert('Please enter a topic to explain');
        return;
    }
    
    // Show loading state
    const originalButtonText = explainButton.textContent;
    explainButton.textContent = 'Explaining...';
    explainButton.disabled = true;
    
    try {
        // Generate AI prompt
        const prompt = generateAIPrompt(topic, selectedDifficulty);
        console.log('Generated AI Prompt:', prompt);
        
        // Get explanation (in real app, this would be an API call)
        const explanation = await getAIExplanation(prompt);
        
        // Display result
        displayExplanation(explanation);
    } catch (error) {
        console.error('Error generating explanation:', error);
        explanationResult.innerHTML = `
            <h2>Error</h2>
            <p>Failed to generate explanation. Please try again.</p>
            <p><em>${error.message || 'Unknown error'}</em></p>
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
