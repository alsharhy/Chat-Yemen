import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://chatyemen.vercel.app',
    'X-Title': 'ChatYemen AI',
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [{ role: 'user', content: message }],
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: 'حدث خطأ أثناء الاتصال بالنموذج.' });
  }
}