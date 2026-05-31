// api/judge.js — Vercel serverless function (Node runtime)
// Holds the Anthropic API key server-side. The browser NEVER sees it.
// Set ANTHROPIC_API_KEY in Vercel → Project → Settings → Environment Variables.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    // Lets the front-end fall back to a clearly-labeled illustrative mode.
    return res.status(200).json({ demo: true });
  }

  try {
    const { model, system, content } = req.body;
    // `content` is an array of Anthropic content blocks (text / image / document).

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model || "claude-sonnet-4-20250514",
        max_tokens: 300,
        system,
        messages: [{ role: "user", content }],
      }),
    });

    const data = await r.json();
    if (data.error) return res.status(200).json({ error: data.error.message });

    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(200).json({ error: e.message });
  }
}
