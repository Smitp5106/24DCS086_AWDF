/**
 * AI Service for Task Management
 * Supports Google Gemini API and OpenAI API.
 * Uses backend-only environment variables (.env).
 * Includes timeout protection (AbortController) and offline heuristic fallback.
 */

const fetchWithTimeout = async (url, options = {}, timeoutMs = 8000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
};

/**
 * Intelligent local heuristic fallback if API key is missing or call fails/times out
 */
const generateHeuristicSuggestions = (title = "Task", currentDescription = "") => {
  const t = title.toLowerCase();

  let priority = "medium";
  let priorityReason = "Standard task priority based on typical development workflow.";
  let suggestedDeadline = "In 3 days";
  let estimatedTime = "2-3 hours";
  let actionVerb = "Implement and review";

  if (
    t.includes("urgent") ||
    t.includes("critical") ||
    t.includes("crash") ||
    t.includes("hotfix") ||
    t.includes("down") ||
    t.includes("security")
  ) {
    priority = "urgent";
    priorityReason = "Detected critical keywords requiring immediate resolution.";
    suggestedDeadline = "Today (ASAP)";
    estimatedTime = "1-2 hours";
    actionVerb = "Immediately investigate, fix, and verify";
  } else if (
    t.includes("bug") ||
    t.includes("fix") ||
    t.includes("error") ||
    t.includes("fail") ||
    t.includes("broken")
  ) {
    priority = "high";
    priorityReason = "Bug fixes impact application stability and user experience.";
    suggestedDeadline = "Tomorrow";
    estimatedTime = "2-4 hours";
    actionVerb = "Debug root cause, create fix, and test";
  } else if (
    t.includes("doc") ||
    t.includes("readme") ||
    t.includes("clean") ||
    t.includes("format") ||
    t.includes("style")
  ) {
    priority = "low";
    priorityReason = "Non-blocking documentation or housekeeping item.";
    suggestedDeadline = "Within 1 week";
    estimatedTime = "1 hour";
    actionVerb = "Review and polish";
  } else if (
    t.includes("deploy") ||
    t.includes("release") ||
    t.includes("docker") ||
    t.includes("ci") ||
    t.includes("test")
  ) {
    priority = "high";
    priorityReason = "Deployment and testing tasks directly affect delivery readiness.";
    suggestedDeadline = "In 2 days";
    estimatedTime = "3 hours";
    actionVerb = "Configure, validate, and verify in pipeline";
  }

  const cleanTitle = title.charAt(0).toUpperCase() + title.slice(1);
  const suggestedDescription = currentDescription.trim()
    ? `${currentDescription.trim()} (Plan: ${actionVerb.toLowerCase()} ${cleanTitle.toLowerCase()} with proper verification and unit tests.)`
    : `${actionVerb} ${cleanTitle.toLowerCase()}, ensuring all edge cases, proper documentation, and automated tests are covered.`;

  const subtasks = [
    `Analyze requirements and scope for "${title}"`,
    `Execute core implementation/resolution steps`,
    `Run tests and verify against success criteria`
  ];

  return {
    title,
    suggestedDescription,
    suggestedPriority: priority,
    priorityReason,
    suggestedDeadline,
    estimatedTime,
    subtasks,
    source: "smart-heuristics"
  };
};

/**
 * Call Google Gemini API
 */
const callGeminiApi = async (apiKey, title, currentDescription) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const prompt = `You are a productivity AI assistant in a task management application.
Analyze the following task title: "${title}".
${currentDescription ? `Existing notes: "${currentDescription}"` : ""}

Respond ONLY with a valid JSON object matching this schema:
{
  "suggestedDescription": "a clear, concise, professional description (2-3 sentences)",
  "suggestedPriority": "low" | "medium" | "high" | "urgent",
  "priorityReason": "brief explanation for the chosen priority level (1 sentence)",
  "suggestedDeadline": "realistic timeframe string (e.g. 'Today', 'Tomorrow', 'In 3 days', 'Next week')",
  "estimatedTime": "estimated duration string (e.g. '1-2 hours', '30 minutes')",
  "subtasks": ["subtask 1", "subtask 2", "subtask 3"]
}`;

  const response = await fetchWithTimeout(
    url,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json"
        }
      })
    },
    8000
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (Status ${response.status}): ${errorText}`);
  }

  const json = await response.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini API");

  const parsed = JSON.parse(text);
  return {
    title,
    suggestedDescription: parsed.suggestedDescription || "",
    suggestedPriority: ["low", "medium", "high", "urgent"].includes(
      parsed.suggestedPriority?.toLowerCase()
    )
      ? parsed.suggestedPriority.toLowerCase()
      : "medium",
    priorityReason: parsed.priorityReason || "Determined by task scope.",
    suggestedDeadline: parsed.suggestedDeadline || "In 3 days",
    estimatedTime: parsed.estimatedTime || "2 hours",
    subtasks: Array.isArray(parsed.subtasks) ? parsed.subtasks : [],
    source: "gemini"
  };
};

/**
 * Call OpenAI API
 */
const callOpenAiApi = async (apiKey, title, currentDescription) => {
  const url = "https://api.openai.com/v1/chat/completions";
  const systemPrompt = `You are a productivity AI assistant in a task management application.
Respond ONLY with a valid JSON object containing:
- suggestedDescription (string)
- suggestedPriority ('low' | 'medium' | 'high' | 'urgent')
- priorityReason (string)
- suggestedDeadline (string)
- estimatedTime (string)
- subtasks (array of 3 strings)`;

  const response = await fetchWithTimeout(
    url,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Task Title: "${title}". ${
              currentDescription ? `Context: "${currentDescription}"` : ""
            }`
          }
        ],
        response_format: { type: "json_object" }
      })
    },
    8000
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error (Status ${response.status}): ${errorText}`);
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from OpenAI");

  const parsed = JSON.parse(content);
  return {
    title,
    suggestedDescription: parsed.suggestedDescription || "",
    suggestedPriority: ["low", "medium", "high", "urgent"].includes(
      parsed.suggestedPriority?.toLowerCase()
    )
      ? parsed.suggestedPriority.toLowerCase()
      : "medium",
    priorityReason: parsed.priorityReason || "Determined by task scope.",
    suggestedDeadline: parsed.suggestedDeadline || "In 3 days",
    estimatedTime: parsed.estimatedTime || "2 hours",
    subtasks: Array.isArray(parsed.subtasks) ? parsed.subtasks : [],
    source: "openai"
  };
};

/**
 * Main AI suggestion coordinator with graceful fallback
 */
const generateTaskSuggestions = async (title, currentDescription = "") => {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  if (geminiKey && geminiKey.trim() && geminiKey !== "your_gemini_api_key_here") {
    try {
      return await callGeminiApi(geminiKey.trim(), title, currentDescription);
    } catch (err) {
      console.warn(`[AI Service] Gemini call failed (${err.message}). Using fallback.`);
    }
  }

  if (openAiKey && openAiKey.trim() && openAiKey !== "your_openai_api_key_here") {
    try {
      return await callOpenAiApi(openAiKey.trim(), title, currentDescription);
    } catch (err) {
      console.warn(`[AI Service] OpenAI call failed (${err.message}). Using fallback.`);
    }
  }

  // Graceful fallback if keys not configured or external call failed
  return generateHeuristicSuggestions(title, currentDescription);
};

module.exports = {
  generateTaskSuggestions,
  generateHeuristicSuggestions
};
