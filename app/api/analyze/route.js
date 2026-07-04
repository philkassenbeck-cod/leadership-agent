import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export async function POST(req) {
  try {
    const body = await req.json();
    const { systemPrompt, messages } = body;
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: "Missing ANTHROPIC_API_KEY environment variable." },
        { status: 500 }
      );
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "No messages provided." }, { status: 400 });
    }
    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 8000,
      system: systemPrompt,
      messages,
    });
    // Concatenate every text block rather than assuming a single one.
    const text = (response.content || [])
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();
    return Response.json({ content: text });
  } catch (e) {
    console.error("Analyze route error:", e);
    // Renvoie le vrai message d'erreur pour ne plus rester dans le flou.
    const detail = e && e.message ? e.message : String(e);
    return Response.json({ error: "API error: " + detail }, { status: 500 });
  }
}
