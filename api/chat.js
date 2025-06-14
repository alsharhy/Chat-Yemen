export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "الطريقة غير مسموحة" });
  }

  const { messages, model } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer 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`,
        "HTTP-Referer": "https://chat-yemen.vercel.app",
        "X-Title": "Chat Yemen"
      },
      body: JSON.stringify({
        model: model || "openai/gpt-3.5-turbo",
        messages,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenRouter Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "فشل الاتصال بالخادم الذكي." });
  }
}