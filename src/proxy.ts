import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/session";

// En Next.js 16 el antiguo "middleware" se llama "proxy".
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Corre en todas las rutas EXCEPTO:
     * - _next/static, _next/image (archivos internos de Next)
     * - favicon.ico
     * - archivos de imagen (svg, png, jpg, jpeg, gif, webp)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
