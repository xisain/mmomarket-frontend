type ApiOptions = Omit<RequestInit, "body"> & {
  json?: unknown;
};

export class ApiError extends Error {
  constructor(public readonly status: number) {
    super(`Request gagal (${status})`);
    this.name = "ApiError";
  }
}

export async function api<T>(
  path: string,
  { json, headers, ...options}: ApiOptions = {},
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_URL is not set");
  const requestHeaders = new Headers(headers);
  
  if (json !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(
    `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`,
    {
      ...options,
      headers: requestHeaders,
      credentials: "include",
      body: json !== undefined ? JSON.stringify(json) : undefined,
    },
  );

  if (!response.ok) {
    throw new ApiError(response.status);
  }

  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}
