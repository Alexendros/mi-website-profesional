// Helper `updateSession` para Next.js 16 `proxy.ts`.
// Refresca el cookie de sesión (rotación segura) y devuelve la NextResponse
// para que `proxy.ts` la propague.
//
// CP-01: usar siempre `auth.getUser()` (verifica el JWT contra GoTrue) en
// vez de `auth.getSession()` (que sólo lee la cookie local).

import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@repo/db";

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const supabase = createServerSupabase({
    getAll() {
      return request.cookies.getAll().map((c) => ({ name: c.name, value: c.value }));
    },
    set(name, value, options) {
      // Mantener la response actualizada con la cookie refrescada.
      response.cookies.set({ name, value, ...options });
    },
  });

  // CP-01: NO usar getSession(); getUser() valida el JWT contra GoTrue.
  await supabase.auth.getUser();

  return response;
}
