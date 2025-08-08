interface JWTPayload {
  exp: number;
  [key: string]: unknown;
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as JWTPayload;
    const currentTime = Math.floor(Date.now() / 1000); // seconds
    return payload.exp < currentTime;
  } catch (err) {
    console.error("Failed to parse token:", err);
    return true; // Treat malformed token as expired
  }
}
