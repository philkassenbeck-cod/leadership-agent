// Authentification légère partagée entre le middleware (edge) et les routes API (node).
// Aucune dépendance externe : on utilise Web Crypto (crypto.subtle), disponible
// dans les deux runtimes. Tous les jetons sont signés HMAC-SHA256 avec AUTH_SECRET.
// Rien n'est stocké côté serveur : les codes et sessions portent leur propre expiration.

const enc = new TextEncoder();

async function hmacHex(message, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  const bytes = new Uint8Array(sig);
  let hex = "";
  for (const b of bytes) hex += b.toString(16).padStart(2, "0");
  return hex;
}

// Comparaison à temps constant (évite les fuites par timing).
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

// ---- Codes d'accès à durée limitée (distribués aux clients) ----
// Format lisible et copiable : "<exp base36>.<hmac 16 hex>".
// exp = timestamp d'expiration en millisecondes.
export async function makeCode(expMs, secret) {
  const exp = Math.floor(expMs).toString(36);
  const sig = (await hmacHex("code." + exp, secret)).slice(0, 16);
  return `${exp}.${sig}`;
}

// Renvoie l'expiration (ms) si le code est valide et non expiré, sinon null.
export async function verifyCode(code, secret, now) {
  if (typeof code !== "string" || code.indexOf(".") < 0) return null;
  const [exp, sig] = code.split(".");
  const expMs = parseInt(exp, 36);
  if (!Number.isFinite(expMs)) return null;
  const expected = (await hmacHex("code." + exp, secret)).slice(0, 16);
  if (!safeEqual(String(sig), expected)) return null;
  if (now > expMs) return null;
  return expMs;
}

// ---- Cookie de session ----
// Format : "<role>.<exp base36>.<hmac 24 hex>". role = "admin" | "user".
export async function makeSession(role, expMs, secret) {
  const exp = Math.floor(expMs).toString(36);
  const sig = (await hmacHex(`sess.${role}.${exp}`, secret)).slice(0, 24);
  return `${role}.${exp}.${sig}`;
}

// Renvoie { role, exp } si la session est valide et non expirée, sinon null.
export async function verifySession(token, secret, now) {
  if (typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [role, exp, sig] = parts;
  if (role !== "admin" && role !== "user") return null;
  const expMs = parseInt(exp, 36);
  if (!Number.isFinite(expMs)) return null;
  const expected = (await hmacHex(`sess.${role}.${exp}`, secret)).slice(0, 24);
  if (!safeEqual(sig, expected)) return null;
  if (now > expMs) return null;
  return { role, exp: expMs };
}

// Compare un mot de passe saisi au mot de passe maître, à temps constant.
export async function passwordMatches(input, expected, secret) {
  if (!expected) return false;
  const a = await hmacHex("pw." + String(input), secret);
  const b = await hmacHex("pw." + String(expected), secret);
  return safeEqual(a, b);
}
