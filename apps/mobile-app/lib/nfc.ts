import { Platform, Alert } from 'react-native';

// Import NFC Manager - now enabled for development/production builds
let NfcManager: any = null;
let NfcTech: any = null;
let NfcAvailable = false;

try {
  const nfcModule = require('react-native-nfc-manager');
  NfcManager = nfcModule.default || nfcModule;
  NfcTech = nfcModule.NfcTech;
  NfcAvailable = true;
} catch (error) {
  console.error('NFC Manager not available. Make sure react-native-nfc-manager is installed and you are using a development build:', error);
  NfcAvailable = false;
}

/**
 * Check if NFC module is available
 */
export function isNfcModuleAvailable(): boolean {
  return NfcAvailable && NfcManager !== null;
}

/**
 * Check if NFC is supported on the device
 */
export async function isNfcSupported(): Promise<boolean> {
  if (!isNfcModuleAvailable()) {
    return false;
  }
  try {
    return await NfcManager.isSupported();
  } catch (error) {
    console.error('Error checking NFC support:', error);
    return false;
  }
}

/**
 * Check if NFC is enabled on the device
 */
export async function isNfcEnabled(): Promise<boolean> {
  if (!isNfcModuleAvailable()) {
    return false;
  }
  try {
    return await NfcManager.isEnabled();
  } catch (error) {
    console.error('Error checking NFC enabled:', error);
    return false;
  }
}

/**
 * Start NFC manager
 */
export async function startNfc(): Promise<void> {
  if (!isNfcModuleAvailable()) {
    throw new Error('NFC Manager is not available. Please ensure react-native-nfc-manager is properly installed and you are using a development or production build.');
  }
  try {
    await NfcManager.start();
  } catch (error) {
    console.error('Error starting NFC:', error);
    throw new Error('Failed to start NFC. Please make sure NFC is enabled in your device settings.');
  }
}

/**
 * Stop NFC manager
 */
export async function stopNfc(): Promise<void> {
  if (!isNfcModuleAvailable()) {
    return;
  }
  try {
    await NfcManager.cancelTechnologyRequest().catch(() => 0);
  } catch (error) {
    console.error('Error stopping NFC:', error);
  }
}

/**
 * Read NFC tag UID
 * Returns the UID as a string
 */
export async function readNfcTag(): Promise<string> {
  if (!isNfcModuleAvailable() || !NfcTech) {
    throw new Error('NFC Manager is not available. Please ensure react-native-nfc-manager is properly installed and you are using a development or production build.');
  }
  
  try {
    // Request NFC technology
    await NfcManager.requestTechnology(NfcTech.Ndef);
    
    // Get the tag
    const tag = await NfcManager.getTag();
    
    if (!tag) {
      throw new Error('No tag found');
    }

    // Extract UID from tag
    // The UID format varies by platform
    let uid: string = '';
    
    if (Platform.OS === 'ios') {
      // iOS: UID is in tag.id
      uid = tag.id || '';
    } else {
      // Android: UID is in tag.id as a byte array, convert to hex string
      if (Array.isArray(tag.id)) {
        uid = tag.id.map((byte: number) => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
      } else if (typeof tag.id === 'string') {
        uid = tag.id.toUpperCase();
      }
    }

    if (!uid) {
      throw new Error('Could not extract UID from tag');
    }

    return uid;
  } catch (error: any) {
    console.error('Error reading NFC tag:', error);
    
    if (error.message?.includes('cancelled') || error.message?.includes('User')) {
      throw new Error('NFC scan cancelled');
    }
    
    throw new Error(error.message || 'Failed to read NFC tag. Please try again.');
  } finally {
    // Clean up
    try {
      if (isNfcModuleAvailable()) {
        await NfcManager.cancelTechnologyRequest();
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }
}

/**
 * Request NFC permissions and check availability
 */
export async function requestNfcPermission(): Promise<boolean> {
  if (!isNfcModuleAvailable()) {
    Alert.alert(
      'NFC Not Available',
      'NFC Manager is not available. Please ensure react-native-nfc-manager is properly installed and you are using a development or production build.'
    );
    return false;
  }

  try {
    const supported = await isNfcSupported();
    if (!supported) {
      Alert.alert(
        'NFC Not Supported',
        'Your device does not support NFC functionality.'
      );
      return false;
    }

    const enabled = await isNfcEnabled();
    if (!enabled) {
      Alert.alert(
        'NFC Disabled',
        'Please enable NFC in your device settings to scan tags.',
        [
          { text: 'OK', style: 'default' },
        ]
      );
      return false;
    }

    await startNfc();
    return true;
  } catch (error: any) {
    Alert.alert(
      'NFC Error',
      error.message || 'Failed to initialize NFC. Please check your device settings.'
    );
    return false;
  }
}

/**
 * NTAG 424 DNA verification URL parameters
 */
export interface NTAG424UrlParams {
  url: string;
  code: string;
  counter: number | null;
  cmac: string | null;
}

/**
 * Read NTAG 424 DNA verification URL from NFC tag
 * Returns parsed URL with verification code, counter, and CMAC
 */
export async function readNfcTagUrl(): Promise<NTAG424UrlParams | null> {
  if (!isNfcModuleAvailable() || !NfcTech) {
    throw new Error('NFC Manager is not available.');
  }

  try {
    // Request NFC technology
    await NfcManager.requestTechnology(NfcTech.Ndef);

    // Get the tag
    const tag = await NfcManager.getTag();

    if (!tag) {
      throw new Error('No tag found');
    }

    // Look for NDEF URL record
    const ndefRecords = tag.ndefMessage;
    if (!ndefRecords || ndefRecords.length === 0) {
      return null;
    }

    // Find URL record (TNF 0x01 = Well-Known, RTD 0x55 = URI)
    for (const record of ndefRecords) {
      if (record.tnf === 1 && record.type && record.type[0] === 0x55) {
        // Parse URI record
        const payload = record.payload;
        if (!payload || payload.length === 0) continue;

        // First byte is URI identifier code
        const uriCode = payload[0];
        const uriPrefixes: Record<number, string> = {
          0x00: '',
          0x01: 'http://www.',
          0x02: 'https://www.',
          0x03: 'http://',
          0x04: 'https://',
        };

        const prefix = uriPrefixes[uriCode] || '';
        const uriBody = String.fromCharCode(...payload.slice(1));
        const url = prefix + uriBody;

        // Parse AetherLabs verification URL
        // Format: https://aetherlabs.art/v/{code}?c={counter}&m={cmac}
        const parsed = parseVerificationUrl(url);
        if (parsed) {
          return parsed;
        }
      }
    }

    return null;
  } catch (error: any) {
    console.error('Error reading NFC tag URL:', error);

    if (error.message?.includes('cancelled') || error.message?.includes('User')) {
      throw new Error('NFC scan cancelled');
    }

    throw new Error(error.message || 'Failed to read NFC tag URL.');
  } finally {
    try {
      if (isNfcModuleAvailable()) {
        await NfcManager.cancelTechnologyRequest();
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }
}

/**
 * Parse AetherLabs verification URL
 * Format: https://aetherlabs.art/v/{code}?c={counter}&m={cmac}
 */
function parseVerificationUrl(url: string): NTAG424UrlParams | null {
  try {
    const urlObj = new URL(url);

    // Check if it's an AetherLabs verification URL
    const pathMatch = urlObj.pathname.match(/^\/v\/([A-Z0-9]{8})$/i);
    if (!pathMatch) {
      return null;
    }

    const code = pathMatch[1].toUpperCase();
    const counterStr = urlObj.searchParams.get('c');
    const cmac = urlObj.searchParams.get('m');

    return {
      url,
      code,
      counter: counterStr ? parseInt(counterStr, 16) : null,
      cmac: cmac?.toUpperCase() || null,
    };
  } catch {
    return null;
  }
}

/**
 * Read NFC tag and return either UID (standard tag) or URL params (NTAG 424 DNA)
 */
export interface NFCReadResult {
  type: 'standard' | 'ntag424';
  uid: string;
  urlParams?: NTAG424UrlParams;
}

export async function readNfcTagSmart(): Promise<NFCReadResult> {
  if (!isNfcModuleAvailable() || !NfcTech) {
    throw new Error('NFC Manager is not available.');
  }

  try {
    // Request NFC technology
    await NfcManager.requestTechnology(NfcTech.Ndef);

    // Get the tag
    const tag = await NfcManager.getTag();

    if (!tag) {
      throw new Error('No tag found');
    }

    // Extract UID
    let uid: string = '';
    if (Platform.OS === 'ios') {
      uid = tag.id || '';
    } else {
      if (Array.isArray(tag.id)) {
        uid = tag.id.map((byte: number) => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
      } else if (typeof tag.id === 'string') {
        uid = tag.id.toUpperCase();
      }
    }

    if (!uid) {
      throw new Error('Could not extract UID from tag');
    }

    // Try to read NTAG 424 DNA URL
    const ndefRecords = tag.ndefMessage;
    if (ndefRecords && ndefRecords.length > 0) {
      for (const record of ndefRecords) {
        if (record.tnf === 1 && record.type && record.type[0] === 0x55) {
          const payload = record.payload;
          if (!payload || payload.length === 0) continue;

          const uriCode = payload[0];
          const uriPrefixes: Record<number, string> = {
            0x00: '',
            0x01: 'http://www.',
            0x02: 'https://www.',
            0x03: 'http://',
            0x04: 'https://',
          };

          const prefix = uriPrefixes[uriCode] || '';
          const uriBody = String.fromCharCode(...payload.slice(1));
          const url = prefix + uriBody;

          const urlParams = parseVerificationUrl(url);
          if (urlParams) {
            return {
              type: 'ntag424',
              uid,
              urlParams,
            };
          }
        }
      }
    }

    // Standard tag - just return UID
    return {
      type: 'standard',
      uid,
    };
  } catch (error: any) {
    console.error('Error reading NFC tag:', error);

    if (error.message?.includes('cancelled') || error.message?.includes('User')) {
      throw new Error('NFC scan cancelled');
    }

    throw new Error(error.message || 'Failed to read NFC tag.');
  } finally {
    try {
      if (isNfcModuleAvailable()) {
        await NfcManager.cancelTechnologyRequest();
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }
}
