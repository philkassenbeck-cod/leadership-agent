import { cookies } from "next/headers";
import { verifySession, makeCode } from "../../../../lib/auth";

const DAY = 86400000;

// Génère un code d'accès à durée limitée. Réservé à l'administrateur (coach).
export async function POST(req) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return Response.json({ error: "Non configuré." }, { status: 500 });

  const token = cookies().get("ls_session")?.value;
  const session = await verifySession(token, secret, Date.now());
  if (!session || session.role !== "admin") {
    return Response.json({ error: "Réservé à l'administrateur." }, { status: 403 });
  }

  let days = 7;
  try {
    const body = await req.json();
    days = body && body.days;
  } catch (_) {}
  days = Math.max(1, Math.min(365, parseInt(days, 10) || 7));

  const expMs = Date.now() + days * DAY;
  const code = await makeCode(expMs, secret);
  return Response.json({ ok: true, code, expires: expMs, days });
}
