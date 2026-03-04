/**
 * Base URL of the web app (dashboard). Used for verification links, shares, etc.
 * The landing site (www.aetherlabs.art) does not host /v/ or /login - the web app does.
 * Set NEXT_PUBLIC_APP_URL in .env.local (e.g. https://app.aetherlabs.art)
 */
export const APP_BASE_URL =
  typeof window !== 'undefined'
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.aetherlabs.art')

export function verificationUrl(code: string): string {
  return `${APP_BASE_URL}/v/${code}`
}
