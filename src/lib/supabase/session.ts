import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresca la sesion de Supabase en cada peticion.
 * No fuerza login: las paginas privadas (/perfil, /admin) hacen su propio
 * redirect cuando corresponde. El home, menu y carrito quedan accesibles
 * sin cuenta; el login solo se exige al confirmar el pedido.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // No metas codigo entre createServerClient y getUser():
  // getUser() es lo que refresca el token de sesion en cada peticion.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Si ya hay sesion y estas en login o registro, te mando al inicio.
  if (user && (path === "/login" || path === "/registro")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return copyCookies(response, NextResponse.redirect(url));
  }

  return response;
}

// Conserva las cookies de sesion al redirigir.
function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value);
  });
  return to;
}
