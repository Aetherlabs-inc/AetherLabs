/**
 * Cryptographic utilities for NTAG 424 DNA verification
 *
 * NTAG 424 DNA tags generate a SUN (Secure Unique NFC) message containing:
 * - UID: Tag unique identifier
 * - Counter: Read counter that increments with each tap
 * - CMAC: Cipher-based Message Authentication Code
 *
 * The CMAC is calculated using AES-128 with a pre-shared key
 */

/**
 * Generate a random verification code (8 alphanumeric characters)
 * Used as the short code in verification URLs
 */
export function generateVerificationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Removed ambiguous chars (0,O,I,1,L)
  let code = ''
  const randomValues = new Uint8Array(8)
  crypto.getRandomValues(randomValues)

  for (let i = 0; i < 8; i++) {
    code += chars[randomValues[i] % chars.length]
  }

  return code
}

/**
 * Generate a random AES-128 key (32 hex characters = 16 bytes)
 * This key is programmed into the NTAG 424 DNA tag
 */
export function generateAESKey(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

/**
 * Convert hex string to Uint8Array
 */
export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
  }
  return bytes
}

/**
 * Convert Uint8Array to hex string
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

/**
 * Validate NTAG 424 DNA CMAC
 *
 * The CMAC is calculated over the SUN message which includes:
 * - UID (7 bytes)
 * - Read counter (3 bytes, little-endian)
 *
 * Note: This is a simplified validation. In production, you may need
 * to use the exact NTAG 424 DNA specification which includes additional
 * parameters like file data and command counter.
 *
 * For full security, consider using NXP's NTAG 424 DNA server-side
 * validation libraries or implementing AES-CMAC per RFC 4493.
 */
export async function validateCMAC(
  aesKeyHex: string,
  uid: string,
  counter: number,
  receivedCmac: string
): Promise<boolean> {
  try {
    // Import the AES key
    const keyBytes = hexToBytes(aesKeyHex)
    const keyBuffer = new Uint8Array(keyBytes).buffer as ArrayBuffer
    const key = await crypto.subtle.importKey('raw', keyBuffer, { name: 'AES-CBC', length: 128 }, false, ['encrypt'])

    // Build the message to authenticate
    // NTAG 424 DNA SUN message format:
    // UID (7 bytes) + ReadCounter (3 bytes, little-endian)
    const uidBytes = hexToBytes(uid.replace(/[^0-9A-Fa-f]/g, ''))
    const counterBytes = new Uint8Array([counter & 0xff, (counter >> 8) & 0xff, (counter >> 16) & 0xff])

    // Combine UID and counter
    const message = new Uint8Array(uidBytes.length + counterBytes.length)
    message.set(uidBytes)
    message.set(counterBytes, uidBytes.length)

    // Pad to 16 bytes (AES block size) with 0x80 followed by zeros
    const padded = new Uint8Array(16)
    padded.set(message)
    if (message.length < 16) {
      padded[message.length] = 0x80
    }

    // Calculate CMAC using AES-CBC with zero IV
    // This is a simplified CMAC - proper implementation should use RFC 4493
    const iv = new Uint8Array(16) // Zero IV
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, padded)

    // Take last block as CMAC, then first 8 bytes
    const encryptedBytes = new Uint8Array(encrypted)
    const cmacBytes = encryptedBytes.slice(-16, -8) // Last block, first 8 bytes
    const calculatedCmac = bytesToHex(cmacBytes)

    // Compare (constant-time comparison for security)
    return constantTimeCompare(calculatedCmac.toLowerCase(), receivedCmac.toLowerCase())
  } catch (error) {
    console.error('CMAC validation error:', error)
    return false
  }
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}

/**
 * Parse verification URL parameters
 * URL format: /v/{code}?c={counter}&m={cmac}
 */
export function parseVerificationParams(
  code: string,
  searchParams: URLSearchParams
): {
  code: string
  counter: number | null
  cmac: string | null
} {
  const counterStr = searchParams.get('c')
  const cmac = searchParams.get('m')

  return {
    code: code.toUpperCase(),
    counter: counterStr ? parseInt(counterStr, 16) : null,
    cmac: cmac?.toUpperCase() || null,
  }
}
