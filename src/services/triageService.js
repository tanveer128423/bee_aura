export async function analyzeTicket(provider, apiKey, text) {
  if (provider === "mock") {
    return generateMock(text);
  }

  if (provider === "openai") {
    return analyzeWithOpenAI(apiKey, text);
  }

  if (provider === "google") {
    return analyzeWithGemini(apiKey, text);
  }

  throw new Error("Invalid provider selected.");
}

function generateMock(text) {
  const lower = text.toLowerCase();

  let business_category = "General";
  let erp_module = "SAP";
  let issue_type = "Support Request";
  let priority = "Low";
  let assigned_team = "General Support";

  if (lower.includes("invoice") || lower.includes("finance")) {
    business_category = "Finance";
    assigned_team = "Finance Support Team";
  }

  if (lower.includes("inventory")) {
    business_category = "Inventory";
    assigned_team = "Inventory Team";
  }

  if (lower.includes("error") || lower.includes("unable")) {
    issue_type = "Issue";
    priority = "Medium";
  }

  if (lower.includes("system down") || lower.includes("blocked")) {
    priority = "High";
  }

  const confidence = Math.floor(70 + Math.random() * 25);

  return buildStructuredOutput({
    business_category,
    erp_module,
    issue_type,
    priority,
    assigned_team,
    confidence,
  });
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
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Gemini API Error");
  }

  const raw =
    data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(cleaned);

  return buildStructuredOutput(parsed);
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
    sla_target_hours:
      priority === "High" ? 2 : priority === "Medium" ? 8 : 24,
    first_level_response:
      "Thank you for reporting this issue. Our team has been notified and will respond within SLA.",
  };
}