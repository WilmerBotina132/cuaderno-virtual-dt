import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/auth";
import {
  ALLOWED_CONTENT_TYPES,
  isUploadKind,
  MAX_UPLOAD_BYTES,
  type MediaKindValue,
} from "@/lib/media";

/**
 * Entrega los permisos para que el navegador suba el archivo DIRECTAMENTE a
 * Vercel Blob, sin pasar por este servidor.
 *
 * Es lo que permite subir videos grandes: una peticion normal a una funcion de
 * Vercel esta limitada a 4,5 MB de cuerpo, mientras que la subida directa parte
 * el archivo en trozos y no toca ese limite.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        // Sin esta comprobacion cualquiera podria subir archivos a la cuenta.
        const session = await requireAdmin();
        if (!session) {
          throw new Error("Necesitas iniciar sesión para subir archivos.");
        }

        let kind: MediaKindValue = "IMAGE";
        try {
          const parsed = JSON.parse(clientPayload ?? "{}") as { kind?: string };
          if (parsed.kind) kind = parsed.kind as MediaKindValue;
        } catch {
          // Sin dato utilizable: se queda con IMAGE, el caso mas restrictivo.
        }

        if (!isUploadKind(kind)) {
          throw new Error("Ese tipo de archivo no se puede subir.");
        }

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES[kind],
          maximumSizeInBytes: MAX_UPLOAD_BYTES[kind],
          addRandomSuffix: true,
        };
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo preparar la subida.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
