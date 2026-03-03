export async function analyzeTicket(provider, apiKey, text) {
  if (provider === "openai") {
    return analyzeWithOpenAI(apiKey, text);
  }

  if (provider === "google") {
    return analyzeWithGemini(apiKey, text);
  }

  if (provider === "grok") {
    return analyzeWithGrok(apiKey, text);
  }

  throw new Error("Invalid provider selected.");
}

async function analyzeWithOpenAI(apiKey, text) {
  const prompt = buildPrompt(text);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a precise ERP triaging AI." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "OpenAI API Error");
  }

  const cleaned = data.choices[0].message.content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  return buildStructuredOutput(parsed);
}

async function analyzeWithGemini(apiKey, text) {
  const prompt = buildPrompt(text);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Gemini API Error");
  }

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  const cleaned = raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  const parsed = JSON.parse(cleaned);

  return buildStructuredOutput(parsed);
}

async function analyzeWithGrok(apiKey, text) {
  const prompt = buildPrompt(text);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a precise ERP triaging AI." },
          { role: "user", content: prompt },
        ],
        temperature: 0,
        stream: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg =
        data.error?.message || data.message || JSON.stringify(data);
      throw new Error(`Grok API Error (${response.status}): ${errorMsg}`);
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Grok API returned unexpected response structure");
    }

    const cleaned = data.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return buildStructuredOutput(parsed);
  } catch (error) {
    if (error.message.includes("Grok API")) {
      throw error;
    }
    throw new Error(`Grok API Error: ${error.message}`);
  }
}

function buildPrompt(ticket) {
  return `
Return strictly valid JSON:

{
  "business_category": "",
  "erp_module": "",
  "issue_type": "",
  "priority": "",
  "assigned_team": "",
  "confidence": ""
}

Ticket:
"${ticket}"
`;
}

function buildStructuredOutput(data) {
  const priority = data.priority || "Low";
  const confidence = parseInt(data.confidence) || 85;

  return {
    ticket_id: "TCK-" + Math.floor(100000 + Math.random() * 900000),
    timestamp: new Date().toLocaleString(),
    business_category: data.business_category,
    erp_module: data.erp_module,
    issue_type: data.issue_type,
    priority,
    assigned_team: data.assigned_team,
    confidence: confidence + "%",
    escalation_required: priority === "High",
    human_review_required: confidence < 75,
    sla_target_hours: priority === "High" ? 2 : priority === "Medium" ? 8 : 24,
    first_level_response:
      "Thank you for reporting this issue. Our team has been notified and will respond within SLA.",
  };
}
