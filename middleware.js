import { NextResponse } from "next/server";
import { verifySession } from "./lib/auth";

// Protège l'appel coûteux au modèle : sans session valide, /api/analyze renvoie 401.
// Le cookie httpOnly est vérifié côté serveur (edge), impossible à contourner par le client.
export const config = { matcher: ["/api/analyze"] };

export async function middleware(req) {
  const secret = process.env.AUTH_SECRET;
  const token = req.cookies.get("ls_session")?.value;
  const session = secret ? await verifySession(token, secret, Date.now()) : null;
  if (!session) {
    return NextResponse.json(
      { error: "Session expirée ou absente. Reconnectez-vous." },
      { status: 401 }
    );
  }
  return NextResponse.next();
}
