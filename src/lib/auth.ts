import { api } from "@/lib/api";
import type { SellerSummary } from "@/lib/seller";

export type CurrentUser = {
  id: string | number;
  email: string;
  display_name: string;
  seller?: SellerSummary | null;
};

type CurrentUserResponse = {
  data: CurrentUser;
  success: boolean;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = LoginInput & {
  display_name: string;
};

type AuthResponse = {
  success: boolean;
  message?: string;
} | undefined;

async function authRequest(path: string, json?: LoginInput | RegisterInput) {
  const response = await api<AuthResponse>(path, { method: "POST", json });

  if (response?.success === false) {
    throw new Error(response.message || "Permintaan akun gagal.");
  }
}

export function login(input: LoginInput) {
  return authRequest("/auth/login", input);
}

export function register(input: RegisterInput) {
  return authRequest("/auth/register", input);
}

export function logout() {
  return authRequest("/auth/logout");
}

export async function getCurrentUser(signal?: AbortSignal): Promise<CurrentUser> {
  const response = await api<CurrentUserResponse>("/auth/me", {
    signal,
    cache: "no-store",
  });

  if (!response || response.success !== true) {
    throw new Error("Backend gagal mengambil data user.");
  }

  const user = response.data;
  // console.log(user);
  if (
    !user ||
    (typeof user.id !== "string" && typeof user.id !== "number") ||
    typeof user.email !== "string" ||
    typeof user.display_name !== "string"
  ) {
    throw new Error("Format respons user tidak sesuai kontrak backend.");
  }

  return user;
}
