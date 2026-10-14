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
// Deux portées (scope) :
//   - "full"  → accès complet : format inchangé "<exp>.<sig>" (rétrocompatible).
//   - "pitch" → accès « pitch seul » : format "p.<exp>.<sig>".
// exp = timestamp d'expiration en millisecondes.
export async function makeCode(expMs, secret, scope) {
  const exp = Math.floor(expMs).toString(36);
  if (scope === "pitch") {
    const sig = (await hmacHex("code.p." + exp, secret)).slice(0, 16);
    return `p.${exp}.${sig}`;
  }
  const sig = (await hmacHex("code." + exp, secret)).slice(0, 16);
  return `${exp}.${sig}`;
}

// Renvoie { exp, scope } si le code est valide et non expiré, sinon null.
export async function verifyCode(code, secret, now) {
  if (typeof code !== "string" || code.indexOf(".") < 0) return null;
  const parts = code.split(".");
  let scope = "full", exp, sig;
  if (parts.length === 3 && parts[0] === "p") {
    scope = "pitch"; exp = parts[1]; sig = parts[2];
  } else if (parts.length === 2) {
    exp = parts[0]; sig = parts[1];
  } else {
    return null;
  }
  const expMs = parseInt(exp, 36);
  if (!Number.isFinite(expMs)) return null;
  const msg = scope === "pitch" ? "code.p." + exp : "code." + exp;
  const expected = (await hmacHex(msg, secret)).slice(0, 16);
  if (!safeEqual(String(sig), expected)) return null;
  if (now > expMs) return null;
  return { exp: expMs, scope };
}

// ---- Cookie de session ----
// Deux formats, selon la portée :
//   - scope "full"  → "<role>.<exp>.<sig>" (3 parts, inchangé, rétrocompatible).
//   - scope "pitch" → "<role>.<scope>.<exp>.<sig>" (4 parts).
// role = "admin" | "user".
export async function makeSession(role, expMs, secret, scope) {
  const exp = Math.floor(expMs).toString(36);
  if (scope && scope !== "full") {
    const sig = (await hmacHex(`sess.${role}.${scope}.${exp}`, secret)).slice(0, 24);
    return `${role}.${scope}.${exp}.${sig}`;
  }
  const sig = (await hmacHex(`sess.${role}.${exp}`, secret)).slice(0, 24);
  return `${role}.${exp}.${sig}`;
}

// Renvoie { role, exp, scope } si la session est valide et non expirée, sinon null.
export async function verifySession(token, secret, now) {
  if (typeof token !== "string") return null;
  const parts = token.split(".");
  let role, scope = "full", exp, sig;
  if (parts.length === 3) {
    [role, exp, sig] = parts;
  } else if (parts.length === 4) {
    [role, scope, exp, sig] = parts;
  } else {
    return null;
  }
  if (role !== "admin" && role !== "user") return null;
  if (scope !== "full" && scope !== "pitch") return null;
  const expMs = parseInt(exp, 36);
  if (!Number.isFinite(expMs)) return null;
  const msg = scope === "full" ? `sess.${role}.${exp}` : `sess.${role}.${scope}.${exp}`;
  const expected = (await hmacHex(msg, secret)).slice(0, 24);
  if (!safeEqual(sig, expected)) return null;
  if (now > expMs) return null;
  return { role, exp: expMs, scope };
}

// Compare un mot de passe saisi au mot de passe maître, à temps constant.
export async function passwordMatches(input, expected, secret) {
  if (!expected) return false;
  const a = await hmacHex("pw." + String(input), secret);
  const b = await hmacHex("pw." + String(expected), secret);
  return safeEqual(a, b);
}
