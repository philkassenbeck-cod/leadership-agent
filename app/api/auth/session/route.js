import { cookies } from "next/headers";
import { verifySession } from "../../../../lib/auth";

// Renseigne le client sur l'état de connexion (utilisé par la porte d'entrée).
export async function GET() {
  const secret = process.env.AUTH_SECRET;
  const token = cookies().get("ls_session")?.value;
  const session = secret ? await verifySession(token, secret, Date.now()) : null;
  if (!session) return Response.json({ authed: false });
  return Response.json({ authed: true, role: session.role, exp: session.exp });
}
