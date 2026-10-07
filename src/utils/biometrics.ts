/**
 * Biometrics (Fingerprint / Face ID / Touch ID) utility using WebAuthn API.
 * Fully client-side, zero server dependencies, secure, and privacy-first.
 */

const CREDENTIAL_STORAGE_KEY = 'masrofy_biometric_cred_id';

/**
 * Checks if the user's device/browser supports platform biometrics (Face ID, Touch ID, Fingerprint, Windows Hello).
 */
export async function isBiometricsSupported(): Promise<boolean> {
  try {
    if (typeof window === 'undefined') return false;
    if (!window.isSecureContext) return false;
    if (!window.PublicKeyCredential) return false;
    if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !== 'function') {
      return false;
    }
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return Boolean(available);
  } catch (err) {
    console.warn('Biometrics check error:', err);
    return false;
  }
}

/**
 * Checks if biometric credential is already registered in local storage.
 */
export function hasBiometricCredential(): boolean {
  try {
    return Boolean(localStorage.getItem(CREDENTIAL_STORAGE_KEY));
  } catch {
    return false;
  }
}

/**
 * Registers biometric authentication on this device.
 * Triggers the native OS fingerprint/Face ID enrollment prompt.
 */
export async function registerBiometrics(username = 'masrofy_user'): Promise<{ success: boolean; error?: string }> {
  try {
    const supported = await isBiometricsSupported();
    if (!supported) {
      return { success: false, error: 'unsupported' };
    }

    // Generate random 32-byte challenge
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    // Random user ID
    const userId = new Uint8Array(16);
    window.crypto.getRandomValues(userId);

    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: 'مصروفي (Masrofy)',
        id: window.location.hostname,
      },
      user: {
        id: userId,
        name: username,
        displayName: 'مستخدم مصروفي',
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },   // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Native sensor (fingerprint, Face ID)
        userVerification: 'required',
        residentKey: 'preferred',
      },
      timeout: 60000,
      attestation: 'none',
    };

    const credential = (await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    })) as PublicKeyCredential | null;

    if (!credential) {
      return { success: false, error: 'cancelled' };
    }

    // Convert rawId to Base64 to store locally
    const rawId = new Uint8Array(credential.rawId);
    let binary = '';
    for (let i = 0; i < rawId.byteLength; i++) {
      binary += String.fromCharCode(rawId[i]);
    }
    const b64Id = btoa(binary);

    localStorage.setItem(CREDENTIAL_STORAGE_KEY, b64Id);
    return { success: true };
  } catch (err: any) {
    console.warn('Biometric registration error:', err);
    if (err?.name === 'NotAllowedError') {
      return { success: false, error: 'cancelled_or_denied' };
    }
    return { success: false, error: err?.message || 'unknown' };
  }
}

/**
 * Authenticates using device biometrics (Fingerprint / Face ID).
 */
export async function authenticateWithBiometrics(): Promise<{ success: boolean; error?: string }> {
  try {
    const supported = await isBiometricsSupported();
    if (!supported) {
      return { success: false, error: 'unsupported' };
    }

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const storedB64Id = localStorage.getItem(CREDENTIAL_STORAGE_KEY);
    let allowCredentials: PublicKeyCredentialDescriptor[] | undefined = undefined;

    if (storedB64Id) {
      try {
        const binary = atob(storedB64Id);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        allowCredentials = [
          {
            id: bytes,
            type: 'public-key',
            transports: ['internal'],
          },
        ];
      } catch (e) {
        console.warn('Could not parse stored credential ID:', e);
      }
    }

    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      rpId: window.location.hostname,
      allowCredentials,
      userVerification: 'required',
      timeout: 60000,
    };

    const assertion = (await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    })) as PublicKeyCredential | null;

    if (!assertion) {
      return { success: false, error: 'failed' };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Biometric authentication error:', err);
    if (err?.name === 'NotAllowedError') {
      return { success: false, error: 'cancelled_or_denied' };
    }
    return { success: false, error: err?.message || 'failed' };
  }
}

/**
 * Deletes any biometric registration credentials.
 */
export function removeBiometricCredential(): void {
  try {
    localStorage.removeItem(CREDENTIAL_STORAGE_KEY);
  } catch {}
}
