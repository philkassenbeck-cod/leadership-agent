import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  try {
    const body = await req.json();
    const { systemPrompt, messages } = body;

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1500,
      system: systemPrompt,
      messages,
    });

    return Response.json({ content: response.content[0].text });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "API error" }, { status: 500 });
  }
}
