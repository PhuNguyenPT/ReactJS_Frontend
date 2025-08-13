export interface DecodedJWT {
  exp?: number;
  [key: string]: unknown;
}

export function decodeJWT(token: string): DecodedJWT {
  if (!token.includes(".")) {
    throw new Error("Invalid JWT format");
  }

  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

  try {
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    );
    return JSON.parse(jsonPayload) as DecodedJWT;
  } catch {
    throw new Error("Failed to decode JWT payload");
  }
}
