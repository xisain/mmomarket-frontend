"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Link2, Store } from "lucide-react";
import { ApiError } from "@/lib/api";
import { applyForSeller } from "@/lib/seller";

type Fields = { shop_name: string; slug: string; description: string };
type Errors = Partial<Record<keyof Fields, string>>;

export function SellerApplicationForm() {
  const [fields, setFields] = useState<Fields>({
    shop_name: "",
    slug: "",
    description: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const inFlight = useRef(false);

  function update(name: keyof Fields, value: string) {
    setFields((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    setApiError("");
    const input = {
      shop_name: fields.shop_name.trim(),
      slug: fields.slug.trim(),
      description: fields.description.trim(),
    };
    const next: Errors = {};
    const nameLength = Array.from(input.shop_name).length;
    if (nameLength < 3 || nameLength > 150)
      next.shop_name = "Nama toko harus berisi 3–150 karakter.";
    if (
      input.slug.length < 3 ||
      input.slug.length > 180 ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)
    )
      next.slug =
        "Gunakan 3–180 karakter berupa huruf kecil, angka, dan tanda hubung di antara kata.";
    if (Array.from(input.description).length > 2000)
      next.description = "Deskripsi maksimal 2.000 karakter.";
    setErrors(next);
    if (Object.keys(next).length) {
      form.current
        ?.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)
        ?.focus();
      return;
    }
    inFlight.current = true;
    setLoading(true);
    try {
      await applyForSeller(input);
      setSubmitted(true);
    } catch (error) {
      setApiError(
        error instanceof ApiError
          ? error.status === 401
            ? "Masuk ke akunmu terlebih dahulu, lalu kembali ke halaman ini untuk mengajukan toko."
            : error.status === 409
              ? "Akunmu sudah memiliki toko atau slug sudah digunakan. Gunakan slug lain jika belum punya toko."
              : "Pengajuan belum berhasil dikirim. Periksa data dan coba lagi."
          : "Pengajuan belum berhasil dikirim. Periksa koneksi dan coba lagi.",
      );
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={22} aria-hidden="true" />
        <div>
          <strong>Pengajuan toko berhasil dikirim!</strong>
          <p>
            Toko {fields.shop_name.trim()} berstatus menunggu review admin. Kamu
            dapat mulai berjualan setelah pengajuan disetujui.
          </p>
          <Link href="/" className="back-link">
            Kembali ke marketplace <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={form}
      noValidate
      onSubmit={submit}
      className="auth-form"
      aria-busy={loading}
    >
      <fieldset disabled={loading} className="seller-fields">
        {(["shop_name", "slug"] as const).map((name) => (
          <div className="form-field" key={name}>
            <label htmlFor={name}>
              {name === "shop_name" ? "Nama toko" : "Slug toko"}
            </label>
            <div className={`input-wrap ${errors[name] ? "invalid" : ""}`}>
              {name === "shop_name" ? (
                <Store size={18} aria-hidden="true" />
              ) : (
                <Link2 size={18} aria-hidden="true" />
              )}
              <input
                id={name}
                name={name}
                value={fields[name]}
                onChange={(event) => update(name, event.target.value)}
                placeholder={
                  name === "shop_name"
                    ? "Contoh: Goldsmith Guild"
                    : "goldsmith-guild"
                }
                autoComplete={name === "shop_name" ? "organization" : "off"}
                autoCapitalize={name === "slug" ? "none" : "words"}
                spellCheck={false}
                required
                aria-invalid={!!errors[name]}
                aria-describedby={
                  errors[name]
                    ? `${name}-error`
                    : name === "slug"
                      ? "slug-hint"
                      : undefined
                }
              />
            </div>
            {errors[name] ? (
              <p className="field-error" id={`${name}-error`}>
                {errors[name]}
              </p>
            ) : (
              name === "slug" && (
                <p className="field-hint" id="slug-hint">
                  Identitas unik toko, misalnya goldsmith-guild. Gunakan huruf
                  kecil, angka, dan tanda hubung.
                </p>
              )
            )}
          </div>
        ))}
        <div className="form-field">
          <label htmlFor="description">
            Deskripsi toko <span className="field-optional">(opsional)</span>
          </label>
          <div className={`input-wrap ${errors.description ? "invalid" : ""}`}>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={fields.description}
              onChange={(event) => update("description", event.target.value)}
              placeholder="Ceritakan produk game dan layanan yang ingin kamu tawarkan."
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? "description-error" : "description-hint"
              }
            />
          </div>
          {errors.description ? (
            <p className="field-error" id="description-error">
              {errors.description}
            </p>
          ) : (
            <p className="field-hint" id="description-hint">
              Maksimal 2.000 karakter.
            </p>
          )}
        </div>
      </fieldset>
      <p className="registration-note">
        Pengajuan akan ditinjau oleh admin sebelum toko dapat berjualan. Belum
        punya akun? <Link href="/register">Daftar akun terlebih dahulu.</Link>
      </p>
      {apiError && (
        <p role="alert" className="field-error">
          {apiError}
        </p>
      )}
      <button
        type="submit"
        className="neo-button full-width"
        disabled={loading}
      >
        {loading ? "Mengirim pengajuan..." : "Daftar jadi seller"}
        <ArrowRight size={19} aria-hidden="true" />
      </button>
    </form>
  );
}
