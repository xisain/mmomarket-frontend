"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { LootArt } from "@/components/game-art";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/auth";
import { SellerApplicationForm } from "@/components/seller-application-form";

type Fields = {
  display_name: string;
  email: string;
  password: string;
  confirm_password: string;
};
type Errors = Partial<Record<keyof Fields, string>>;

export function AuthForm({ mode }: { mode: "login" | "register" | "seller" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const registering = mode === "register";
  const seller = mode === "seller";
  const [fields, setFields] = useState<Fields>({
    display_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  function update(field: keyof Fields, value: string) {
    setFields((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setApiError("");
    const next: Errors = {};
    if (
      registering &&
      (Array.from(fields.display_name.trim()).length < 2 ||
        Array.from(fields.display_name.trim()).length > 150)
    )
      next.display_name = "Nama tampilan harus berisi 2–150 karakter.";
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()) ||
      fields.email.trim().length > 255
    )
      next.email = "Masukkan alamat email yang valid (maksimal 255 karakter).";
    const passwordLength = Array.from(fields.password).length;
    if (!passwordLength) next.password = "Masukkan password kamu.";
    else if (registering && (passwordLength < 8 || passwordLength > 128))
      next.password = "Password harus berisi 8–128 karakter.";
    if (registering && fields.confirm_password !== fields.password)
      next.confirm_password = "Konfirmasi password belum sama.";
    setErrors(next);
    if (Object.keys(next).length) {
      form.current
        ?.querySelector<HTMLInputElement>(`[name="${Object.keys(next)[0]}"]`)
        ?.focus();
      return;
    }
    setLoading(true);
    try {
      if (registering) {
        await register({
          display_name: fields.display_name.trim(),
          email: fields.email.trim(),
          password: fields.password,
        });
      } else {
        await login({
          email: fields.email.trim(),
          password: fields.password,
        });
      }
      setFields((previous) => ({
        ...previous,
        password: "",
        confirm_password: "",
      }));
      router.replace(registering ? "/login" : "/");
      router.refresh();
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Permintaan akun gagal.",
      );
    } finally {
      setLoading(false);
    }
  }

  function field(
    name: keyof Fields,
    label: string,
    placeholder: string,
    icon: React.ReactNode,
    password = false,
  ) {
    return (
      <div className="form-field">
        <label htmlFor={name}>{label}</label>
        <div className={`input-wrap ${errors[name] ? "invalid" : ""}`}>
          {icon}
          <input
            id={name}
            name={name}
            value={fields[name]}
            onChange={(event) => update(name, event.target.value)}
            placeholder={placeholder}
            type={
              password
                ? showPassword
                  ? "text"
                  : "password"
                : name === "email"
                  ? "email"
                  : "text"
            }
            autoComplete={
              name === "display_name"
                ? "nickname"
                : name === "email"
                  ? "email"
                  : registering
                    ? "new-password"
                    : "current-password"
            }
            required
            aria-invalid={!!errors[name]}
            aria-describedby={
              errors[name]
                ? `${name}-error`
                : name === "password" && registering
                  ? "password-hint"
                  : undefined
            }
            spellCheck={false}
            autoCapitalize={name === "display_name" ? "words" : "none"}
          />
          {password && name === "password" && (
            <button
              className="password-toggle"
              type="button"
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
              aria-pressed={showPassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          )}
        </div>
        {errors[name] && (
          <p className="field-error" id={`${name}-error`}>
            {errors[name]}
          </p>
        )}
        {name === "password" && registering && !errors.password && (
          <p className="field-hint" id="password-hint">
            Gunakan 8–128 karakter untuk password kamu.
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <main className="auth-main" id="main-content">
        <section className="auth-story grid-paper">
          <div className="auth-story-inner">
            <span className="eyebrow">
              <span /> YOUR NEXT CHAPTER
            </span>
            <h1>
              {seller ? (
                <>
                  Buka tokomu,
                  <br />
                  mulai langkah
                  <br />
                  <span className="highlight">jadi seller.</span>
                </>
              ) : registering ? (
                <>
                  Petualangan besar
                  <br />
                  dimulai dari
                  <br />
                  <span className="highlight">satu langkah.</span>
                </>
              ) : (
                <>
                  Welcome back,
                  <br />
                  <span className="highlight">adventurer.</span>
                </>
              )}
            </h1>
            <p>
              {seller
                ? "Ubah bekal dan pengalamanmu menjadi peluang. Daftarkan toko dan temukan pelanggan di dunia game favoritmu."
                : registering
                  ? "Dunia baru, peluang baru. Buat akunmu dan temukan bekal untuk perjalanan berikutnya."
                  : "Duniamu masih menunggu. Temukan bekal baru dan lanjutkan perjalananmu."}
            </p>
            <div className="auth-art">
              <LootArt />
              <span className="auth-sticker">
                <Sparkles size={16} />{" "}
                {seller
                  ? "YOUR SHOP, YOUR NEXT CHAPTER"
                  : registering
                    ? "NEW PLAYER, NEW POSSIBILITIES"
                    : "READY FOR THE NEXT QUEST"}
              </span>
            </div>
            <div className="auth-story-bottom">
              <ShieldCheck size={21} />
              <span>
                {seller
                  ? "Daftarkan toko dengan akunmu."
                  : "Satu akun untuk menjelajah."}
                <br />
                <strong>
                  {seller
                    ? "Tim kami akan meninjau pengajuanmu."
                    : "Satu tempat untuk bertumbuh."}
                </strong>
              </span>
            </div>
          </div>
        </section>
        <section className="auth-form-section">
          <div className="auth-form-inner">
            <Link href="/" className="back-link">
              <ArrowLeft size={16} /> Kembali ke marketplace
            </Link>
            <div className="auth-heading">
              <span className="section-kicker">
                {seller
                  ? "START YOUR SELLER JOURNEY"
                  : registering
                    ? "JOIN THE ADVENTURE"
                    : "LET’S PICK UP WHERE YOU LEFT OFF"}
              </span>
              <h2>
                {seller
                  ? "Daftarkan tokomu."
                  : registering
                    ? "Buat akun baru."
                    : "Masuk ke akunmu."}
              </h2>
              <p>
                {seller
                  ? "Gunakan akun MMO Market kamu."
                  : registering
                    ? "Sudah punya akun?"
                    : "Belum punya akun?"}{" "}
                <Link href={seller || registering ? "/login" : "/register"}>
                  {seller || registering ? "Masuk di sini" : "Daftar gratis"}{" "}
                  <ArrowUpRight size={14} />
                </Link>
              </p>
            </div>
            {seller ? (
              <SellerApplicationForm />
            ) : (
              <form
                ref={form}
                noValidate
                onSubmit={submit}
                className="auth-form"
              >
                {registering &&
                  field(
                    "display_name",
                    "Nama tampilan",
                    "Nama petualang kamu",
                    <UserRound size={18} />,
                  )}
                {field(
                  "email",
                  "Alamat email",
                  "kamu@email.com",
                  <Mail size={18} />,
                )}
                {field(
                  "password",
                  "Password",
                  registering ? "Buat password kamu" : "Masukkan password kamu",
                  <KeyRound size={18} />,
                  true,
                )}
                {registering &&
                  field(
                    "confirm_password",
                    "Konfirmasi password",
                    "Ketik ulang password kamu",
                    <KeyRound size={18} />,
                    true,
                  )}
                {registering && (
                  <p className="registration-note">
                    Daftarkan akun untuk mulai menjelajahi marketplace.
                  </p>
                )}
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
                  {loading
                    ? "Memproses..."
                    : registering
                      ? "Buat akun"
                      : "Masuk"}
                  <ArrowRight size={19} />
                </button>
              </form>
            )}
          </div>
          <div className="auth-copyright">
            © 2026 MMO Market. Let the adventure begin.
          </div>
        </section>
      </main>
    </>
  );
}
