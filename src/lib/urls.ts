export function getSafeRedirectOrigin(): string {
  const origin = window.location.origin;
  // Supabase allows localhost by default in dev, but not 127.0.0.1 unless added.
  // Normalize 127.0.0.1 to localhost to avoid redirect_to validation/CORS issues.
  const normalized = origin.includes('127.0.0.1')
    ? origin.replace('127.0.0.1', 'localhost')
    : origin;

  const envOverride = (import.meta as any).env?.VITE_AUTH_REDIRECT_URL as string | undefined;
  // Prefer explicit env override if provided.
  const base = envOverride?.trim() || normalized;

  // Remove trailing slash to avoid double slashes when appending paths
  return base.endsWith('/') ? base.slice(0, -1) : base;
}