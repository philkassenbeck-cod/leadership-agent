import Anthropic from "@anthropic-ai/sdk";

// Laisse à Vercel jusqu'à 300 s pour générer (Opus est plus lent, les débriefs
// d'équipe sont longs). 300 s nécessite le plan Vercel Pro ; sur Hobby, Vercel
// ramène automatiquement à 60 s (donc sans Pro, les longs débriefs peuvent couper).
export const maxDuration = 300;

// .trim() protège contre un espace ou un retour à la ligne collé par erreur
// dans la variable ANTHROPIC_API_KEY (cause classique de "invalid x-api-key").
const client = new Anthropic({ apiKey: (process.env.ANTHROPIC_API_KEY || "").trim() });

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
    // Modèle : Opus par défaut (qualité du fond) ; "sonnet" pour les tâches rapides
    // comme la relecture (plus rapide, moins coûteux). Liste blanche stricte.
    const MODELS = { opus: "claude-opus-4-8", sonnet: "claude-sonnet-5" };
    const model = MODELS[body.model] || "claude-opus-4-8";
    // NB : le paramètre `temperature` est DÉPRÉCIÉ pour Opus 4.8 (renvoie une erreur
    // 400 « temperature is deprecated for this model »). On ne l'envoie donc pas ; la
    // stabilité de lecture passe par les consignes (poids du classement, collision =
    // stretch sur les forces du haut) plutôt que par la température.
    // 16000 : un débrief complet (6 sections + 3 questions + pitch), ancré sur la
    // référence, dépasse les 8000 tokens et se faisait tronquer en plein milieu
    // (section 5 coupée, pitch absent). Le modèle s'arrête de lui-même quand il a fini.
    // CACHE DE PROMPT : on met en cache la partie FIXE du prompt système (consignes,
    // exemples, lentilles) pour ne payer ~0,1x que sur les appels rapprochés (rafales :
    // pitchs d'équipe, débriefs à la suite). Le contexte du profil (après le séparateur
    // "<<<CTX>>>") n'est jamais mis en cache car il change à chaque appel.
    const SPLIT = "<<<CTX>>>";
    let systemParam;
    if (typeof systemPrompt === "string" && systemPrompt.includes(SPLIT)) {
      const i = systemPrompt.indexOf(SPLIT);
      const stable = systemPrompt.slice(0, i);
      const variable = systemPrompt.slice(i + SPLIT.length);
      systemParam = [{ type: "text", text: stable, cache_control: { type: "ephemeral" } }];
      if (variable && variable.trim()) systemParam.push({ type: "text", text: variable });
    } else if (typeof systemPrompt === "string") {
      // Prompt entièrement fixe (ex. relecteur) : tout peut être mis en cache.
      systemParam = [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }];
    } else {
      systemParam = systemPrompt;
    }
    const response = await client.messages.create({
      model,
      max_tokens: 16000,
      system: systemParam,
      messages,
    });
    if (response.stop_reason === "max_tokens") {
      console.warn("Analyze: output hit max_tokens (truncated).");
    }
    if (response.usage) {
      const u = response.usage;
      console.log("Analyze usage:", JSON.stringify({ input: u.input_tokens, cache_write: u.cache_creation_input_tokens, cache_read: u.cache_read_input_tokens, output: u.output_tokens }));
    }
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
