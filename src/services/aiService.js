const apiKey = ""; // API Key provided by environment

export const generateAIImage = async (prompt) => {
  return null; // Placeholder to prevent errors if no API key
};

export const generateAIText = async (userPrompt) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: userPrompt }] }] })
      }
    );
    if (!response.ok) throw new Error('Text generation failed');
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    return "I'm having trouble connecting to the network. Please try again later.";
  }
};