"use client";

import { upload } from "@vercel/blob/client";
import Link from "next/link";
import { useActionState, useState } from "react";

import {
  ALLOWED_CONTENT_TYPES,
  formatBytes,
  isUploadKind,
  MAX_UPLOAD_BYTES,
  MEDIA_KINDS,
  type MediaKindValue,
} from "@/lib/media";
import {
  SECTION_LIST,
  SUBSECTION_LIST,
  sectionByKey,
  type SectionKey,
  type SubsectionKey,
} from "@/lib/sections";

import { createPost, updatePost, type PostFormState } from "./actions";
import admin from "./admin.module.scss";
import styles from "./PostForm.module.scss";

/** Una fila de la lista de medios mientras se edita en el navegador. */
export interface MediaDraft {
  key: string;
  kind: MediaKindValue;
  url: string;
  label: string;
  blobPathname: string | null;
  sizeBytes: number | null;
  uploading?: boolean;
  progress?: number;
  error?: string;
}

export interface PostFormValues {
  title: string;
  summary: string;
  body: string;
  section: SectionKey;
  subsection: SubsectionKey;
  topic: string;
  published: boolean;
  media: MediaDraft[];
}

let keyCounter = 0;
const nextKey = () => `m-${Date.now()}-${keyCounter++}`;

const initialState: PostFormState = {};

export default function PostForm({
  postId,
  initialValues,
}: {
  postId?: string;
  initialValues: PostFormValues;
}) {
  const action = postId ? updatePost.bind(null, postId) : createPost;
  const [state, formAction, pending] = useActionState(action, initialState);

  const [section, setSection] = useState<SectionKey>(initialValues.section);
  const [subsection, setSubsection] = useState<SubsectionKey>(
    initialValues.subsection,
  );
  const [topic, setTopic] = useState(initialValues.topic);
  const [media, setMedia] = useState<MediaDraft[]>(initialValues.media);

  const topics = sectionByKey(section).topics;
  const uploading = media.some((item) => item.uploading);

  function patch(key: string, changes: Partial<MediaDraft>) {
    setMedia((rows) =>
      rows.map((row) => (row.key === key ? { ...row, ...changes } : row)),
    );
  }

  function addMedia(kind: MediaKindValue) {
    setMedia((rows) => [
      ...rows,
      {
        key: nextKey(),
        kind,
        url: "",
        label: "",
        blobPathname: null,
        sizeBytes: null,
      },
    ]);
  }

  function move(index: number, direction: -1 | 1) {
    setMedia((rows) => {
      const target = index + direction;
      if (target < 0 || target >= rows.length) return rows;
      const copy = [...rows];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  }

  async function handleFile(row: MediaDraft, file: File) {
    if (!isUploadKind(row.kind)) return;
    const limit = MAX_UPLOAD_BYTES[row.kind];

    if (file.size > limit) {
      patch(row.key, {
        error: `El archivo pesa ${formatBytes(file.size)} y el máximo es ${formatBytes(limit)}. Para videos largos usa un enlace de YouTube.`,
      });
      return;
    }

    patch(row.key, { uploading: true, progress: 0, error: undefined });

    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        clientPayload: JSON.stringify({ kind: row.kind }),
        // Los archivos grandes se parten en trozos: es lo que permite subir
        // videos sin chocar con el limite de tamano de una petición normal.
        multipart: file.size > 10 * 1024 * 1024,
        onUploadProgress: ({ percentage }) =>
          patch(row.key, { progress: Math.round(percentage) }),
      });

      patch(row.key, {
        url: blob.url,
        blobPathname: blob.pathname,
        sizeBytes: file.size,
        label: row.label || file.name,
        uploading: false,
        progress: 100,
      });
    } catch (error) {
      patch(row.key, {
        uploading: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo subir el archivo. Revisa la configuración de Vercel Blob.",
      });
    }
  }

  // Solo viajan al servidor las filas que ya tienen contenido.
  const payload = media
    .filter((row) => row.url.trim().length > 0)
    .map((row) => ({
      kind: row.kind,
      url: row.url.trim(),
      label: row.label.trim() || undefined,
      blobPathname: row.blobPathname,
      sizeBytes: row.sizeBytes,
    }));

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="media" value={JSON.stringify(payload)} />

      {state.error && <p className={admin.alert}>{state.error}</p>}

      <fieldset className={styles.group}>
        <legend className={styles.legend}>Contenido</legend>

        <label className={styles.field}>
          <span className={styles.label}>Título</span>
          <input
            name="title"
            defaultValue={initialValues.title}
            required
            minLength={3}
            className={styles.input}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Resumen</span>
          <input
            name="summary"
            defaultValue={initialValues.summary}
            maxLength={400}
            className={styles.input}
            placeholder="Una línea que explique de qué trata"
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Texto</span>
          <textarea
            name="body"
            defaultValue={initialValues.body}
            rows={6}
            className={styles.textarea}
            placeholder="Opcional: explicación, pasos, observaciones del profesor…"
          />
        </label>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>Dónde se publica</legend>

        <div className={styles.row}>
          <label className={styles.field}>
            <span className={styles.label}>Sección</span>
            <select
              name="section"
              value={section}
              onChange={(event) => {
                const value = event.target.value as SectionKey;
                setSection(value);
                // El tema pertenece a una seccion concreta: si ya no existe
                // en la nueva, se limpia para no guardar algo imposible.
                const stillValid = sectionByKey(value).topics.some(
                  (t) => t.slug === topic,
                );
                if (!stillValid) setTopic("");
              }}
              className={styles.input}
            >
              {SECTION_LIST.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Sub-página</span>
            <select
              name="subsection"
              value={subsection}
              onChange={(event) =>
                setSubsection(event.target.value as SubsectionKey)
              }
              className={styles.input}
            >
              {SUBSECTION_LIST.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          {subsection === "PLANOS" && (
            <label className={styles.field}>
              <span className={styles.label}>Lámina</span>
              <select
                name="topic"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                required
                className={styles.input}
              >
                <option value="">Elige una lámina…</option>
                {topics.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <label className={styles.check}>
          <input
            type="checkbox"
            name="published"
            defaultChecked={initialValues.published}
          />
          <span>Visible en el sitio público</span>
        </label>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>Videos, fotos y enlaces</legend>

        {media.length === 0 && (
          <p className={styles.hint}>
            Todavía no has agregado nada. Usa los botones de abajo para sumar un
            video de YouTube, subir un archivo o pegar un enlace.
          </p>
        )}

        <ul className={styles.media}>
          {media.map((row, index) => (
            <li key={row.key} className={styles.mediaRow}>
              <div className={styles.mediaHead}>
                <select
                  value={row.kind}
                  onChange={(event) =>
                    patch(row.key, {
                      kind: event.target.value as MediaKindValue,
                      url: "",
                      blobPathname: null,
                      sizeBytes: null,
                      error: undefined,
                      progress: undefined,
                    })
                  }
                  className={styles.input}
                  aria-label="Tipo de contenido"
                >
                  {MEDIA_KINDS.map((kind) => (
                    <option key={kind.value} value={kind.value}>
                      {kind.label}
                    </option>
                  ))}
                </select>

                <div className={styles.mediaTools}>
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="Subir en la lista"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={() => move(index, 1)}
                    disabled={index === media.length - 1}
                    aria-label="Bajar en la lista"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={() =>
                      setMedia((rows) => rows.filter((r) => r.key !== row.key))
                    }
                    aria-label="Quitar de la lista"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {isUploadKind(row.kind) ? (
                <div className={styles.field}>
                  <input
                    type="file"
                    accept={ALLOWED_CONTENT_TYPES[row.kind].join(",")}
                    className={styles.file}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void handleFile(row, file);
                    }}
                  />
                  {row.uploading && (
                    <p className={styles.progress}>
                      Subiendo… {row.progress ?? 0}%
                    </p>
                  )}
                  {row.url && !row.uploading && (
                    <p className={styles.ready}>
                      Archivo listo
                      {row.sizeBytes ? ` · ${formatBytes(row.sizeBytes)}` : ""} ·{" "}
                      <a href={row.url} target="_blank" rel="noopener noreferrer">
                        ver
                      </a>
                    </p>
                  )}
                </div>
              ) : (
                <label className={styles.field}>
                  <span className={styles.label}>
                    {row.kind === "YOUTUBE" ? "Enlace de YouTube" : "Dirección"}
                  </span>
                  <input
                    value={row.url}
                    onChange={(event) => patch(row.key, { url: event.target.value })}
                    className={styles.input}
                    placeholder={
                      row.kind === "YOUTUBE"
                        ? "https://www.youtube.com/watch?v=…"
                        : "https://…"
                    }
                  />
                </label>
              )}

              <label className={styles.field}>
                <span className={styles.label}>Nombre que se muestra</span>
                <input
                  value={row.label}
                  onChange={(event) => patch(row.key, { label: event.target.value })}
                  className={styles.input}
                  placeholder="Opcional"
                />
              </label>

              {row.error && <p className={styles.mediaError}>{row.error}</p>}
            </li>
          ))}
        </ul>

        <div className={styles.addRow}>
          {MEDIA_KINDS.map((kind) => (
            <button
              key={kind.value}
              type="button"
              className={admin.secondary}
              onClick={() => addMedia(kind.value)}
              title={kind.hint}
            >
              + {kind.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className={styles.actions}>
        <button
          type="submit"
          className={admin.primary}
          disabled={pending || uploading}
        >
          {uploading
            ? "Esperando la subida…"
            : pending
              ? "Guardando…"
              : postId
                ? "Guardar cambios"
                : "Crear publicación"}
        </button>
        <Link href="/admin" className={admin.secondary}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}
