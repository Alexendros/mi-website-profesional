// proxy.ts (Next.js 16) — reemplaza middleware.ts.
//
// Refresca la sesión Supabase en cada request y la propaga a Server Components.
// Excluimos rutas estáticas y la API de webhooks Stripe (que no requiere sesión
// y debe verificar firma — penalty si tocamos sus cookies).

import type { NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Excluye: assets estáticos, _next, favicons, webhooks
    "/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
