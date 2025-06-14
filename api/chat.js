export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const OPENROUTER_API_KEY = "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";

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API Response Error:", data);
      return res.status(response.status).json({ error: data.message || "API Error" });
    }

    const reply = data.choices?.[0]?.message?.content || "لا يوجد رد.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Fetch Error:", error);
    return res.status(500).json({ error: "Server Error" });
  }
}