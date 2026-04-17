"use client";

const DEFAULT_API_URL = "http://localhost:8080";
const TOKEN_STORAGE_KEY = "sanem_token";

function getApiBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL;
  return (configuredUrl || DEFAULT_API_URL).replace(/\/$/, "");
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getStoredToken() {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token) {
  if (!canUseStorage() || !token) {
    return;
  }

  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}

async function readResponseBody(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractToken(payload) {
  if (!payload) {
    return null;
  }

  if (typeof payload === "string") {
    return payload.split(".").length === 3 ? payload : null;
  }

  return (
    payload.token ||
    payload.accessToken ||
    payload.jwt ||
    payload?.data?.token ||
    payload?.data?.accessToken ||
    null
  );
}

function extractErrorMessage(payload, fallbackMessage) {
  if (!payload) {
    return fallbackMessage;
  }

  if (typeof payload === "string") {
    return payload;
  }

  return payload.message || payload.error || payload.details || fallbackMessage;
}

export async function apiFetch(path, options = {}) {
  const { auth = false, headers, body, ...fetchOptions } = options;
  const token = auth ? getStoredToken() : null;
  const requestHeaders = new Headers(headers || {});

  if (body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...fetchOptions,
    headers: requestHeaders,
    body:
      body === undefined || typeof body === "string" ? body : JSON.stringify(body),
  });

  const payload = await readResponseBody(response);

  if (!response.ok) {
    const error = new Error(
      extractErrorMessage(payload, "Nao foi possivel concluir a requisicao.")
    );
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export async function login(credentials) {
  const payload = await apiFetch("/api/auth/login", {
    method: "POST",
    body: credentials,
  });
  const token = extractToken(payload);

  if (token) {
    setStoredToken(token);
  }

  return { payload, token };
}

export { TOKEN_STORAGE_KEY };
