import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE_NAMES } from "@/auth.config";

/**
 * Primera barrera del panel de administracion.
 *
 * En Next.js 16 este archivo sustituye a `middleware.ts` y se ejecuta en el
 * runtime de Node. Aqui solo se comprueba que EXISTA la cookie de sesion, para
 * mandar a /login sin gastar una consulta a la base de datos.
 *
 * La verificacion real (firma del JWT) la hace `requireAdmin()` en el layout de
 * /admin y en cada server action: una cookie inventada pasa por aqui pero es
 * rechazada alli, asi que el panel nunca queda expuesto.
 */
export function proxy(request: NextRequest) {
  const hasSessionCookie = SESSION_COOKIE_NAMES.some((name) =>
    request.cookies.has(name),
  );

  if (!hasSessionCookie) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
