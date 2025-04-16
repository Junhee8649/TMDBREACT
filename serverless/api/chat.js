import OpenAI from "openai";
export default async function handler(req, res) {
  // 🔹 GET, POST 요청만 허용
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { role, content } = req.body;
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 100,
      temperature: 0.7,
      messages: [{ role: role, content: content }],
    });
    res.status(200).json({ message: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
