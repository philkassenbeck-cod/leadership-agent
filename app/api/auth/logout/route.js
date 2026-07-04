import { cookies } from "next/headers";

export async function POST() {
  cookies().set("ls_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
  return Response.json({ ok: true });
}
