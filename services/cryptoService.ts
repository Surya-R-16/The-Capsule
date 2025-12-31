
// Web Crypto API helpers for AES-GCM encryption

const PBKDF2_ITERATIONS = 100000;
const SALT = new TextEncoder().encode('capsule-salt-v1'); // In prod, ideally random per user, but fixed helps recovery for now

// Derive a key from the PIN
const deriveKey = async (pin: string): Promise<CryptoKey> => {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(pin),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: SALT,
            iterations: PBKDF2_ITERATIONS,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
};

// Encrypt data
export const encryptData = async (data: any, pin: string): Promise<string> => {
    try {
        const key = await deriveKey(pin);
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encodedData = new TextEncoder().encode(JSON.stringify(data));

        const encryptedContent = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv,
            },
            key,
            encodedData
        );

        // Combine IV and encrypted data into a single buffer
        const buffer = new Uint8Array(iv.byteLength + encryptedContent.byteLength);
        buffer.set(iv, 0);
        buffer.set(new Uint8Array(encryptedContent), iv.byteLength);

        // Convert to Base64 string for storage
        return btoa(String.fromCharCode(...buffer));
    } catch (e) {
        console.error("Encryption failed", e);
        throw new Error("Failed to encrypt data");
    }
};

// Decrypt data
export const decryptData = async (encryptedString: string, pin: string): Promise<any> => {
    try {
        const key = await deriveKey(pin);
        const data = Uint8Array.from(atob(encryptedString), c => c.charCodeAt(0));

        // Extract IV and content
        const iv = data.slice(0, 12);
        const content = data.slice(12);

        const decryptedContent = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv,
            },
            key,
            content
        );

        const decoded = new TextDecoder().decode(decryptedContent);
        return JSON.parse(decoded);
    } catch (e) {
        console.error("Decryption failed", e);
        // Return null serves as "incorrect PIN" signal often
        return null;
    }
};
