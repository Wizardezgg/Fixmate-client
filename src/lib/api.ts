const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

let cachedToken: string | null = null;
let cachedTokenExpiresAt = 0;

export function clearCachedApiToken(): void {
  cachedToken = null;
  cachedTokenExpiresAt = 0;
}

async function getApiToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < cachedTokenExpiresAt) {
    return cachedToken;
  }

  const res = await fetch("/api/auth/token", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    clearCachedApiToken();
    throw new Error("Please sign in to continue.");
  }

  const data = (await res.json()) as { token?: string };
  if (!data.token) {
    throw new Error("Unable to retrieve authentication token.");
  }

  cachedToken = data.token;
  cachedTokenExpiresAt = now + 50 * 60 * 1000;
  return cachedToken;
}

interface ApiRequestOptions extends RequestInit {
  auth?: boolean;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { auth = false, headers = {}, ...rest } = options;
  const finalHeaders = new Headers(headers);

  if (!finalHeaders.has("Content-Type") && rest.body) {
    finalHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = await getApiToken();
    finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      clearCachedApiToken();
    }
    const message =
      (payload as { message?: string }).message ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload as T;
}

export async function uploadImageToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("ImgBB API key is not configured.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = (await res.json()) as {
    success?: boolean;
    data?: { display_url?: string; url?: string };
    error?: { message?: string };
  };

  if (!res.ok || !data.success || !data.data?.display_url) {
    throw new Error(data.error?.message || "Image upload failed");
  }

  return data.data.display_url;
}
