"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";

export interface LoginState {
  error?: string;
}

/**
 * Solo se permite volver a rutas internas del panel. Asi un enlace como
 * /login?next=https://otro-sitio.com no puede usar el formulario para
 * mandar al administrador fuera del cuaderno.
 */
function safeRedirect(target: string): string {
  return target.startsWith("/admin") ? target : "/admin";
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeRedirect(String(formData.get("next") ?? "/admin"));

  if (!username || !password) {
    return { error: "Escribe el usuario y la contraseña." };
  }

  try {
    await signIn("credentials", { username, password, redirectTo: next });
  } catch (error) {
    // signIn lanza una redireccion cuando todo sale bien; hay que dejarla pasar.
    if (error instanceof AuthError) {
      return { error: "Usuario o contraseña incorrectos." };
    }
    throw error;
  }

  return {};
}
