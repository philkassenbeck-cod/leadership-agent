import { cookies } from "next/headers";
import { verifyCode, makeSession, passwordMatches } from "../../../../lib/auth";

const DAY = 86400000;
const MAX_SESSION = 30 * DAY; // une session ne dépasse jamais 30 jours

export async function POST(req) {
  const secret = process.env.AUTH_SECRET;
  const master = process.env.ACCESS_PASSWORD;
  if (!secret || !master) {
    return Response.json(
      { error: "Authentification non configurée (ACCESS_PASSWORD / AUTH_SECRET)." },
      { status: 500 }
    );
  }

  let password = "";
  try {
    const body = await req.json();
    password = body && body.password;
  } catch (_) {}
  password = String(password || "").trim();
  if (!password) return Response.json({ error: "Mot de passe requis." }, { status: 400 });

  const now = Date.now();
  let role = null;
  let sessionExp = null;

  if (await passwordMatches(password, master, secret)) {
    // Mot de passe maître du coach → accès admin (génération de codes).
    role = "admin";
    sessionExp = now + MAX_SESSION;
  } else {
    // Sinon, peut-être un code d'accès à durée limitée.
    const codeExp = await verifyCode(password, secret, now);
    if (codeExp) {
      role = "user";
      sessionExp = Math.min(codeExp, now + MAX_SESSION);
    }
  }

  if (!role) {
    return Response.json({ error: "Mot de passe invalide ou expiré." }, { status: 401 });
  }

  const token = await makeSession(role, sessionExp, secret);
  cookies().set("ls_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(sessionExp),
  });
  return Response.json({ ok: true, role, exp: sessionExp });
}
