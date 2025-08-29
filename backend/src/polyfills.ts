// Polyfill for crypto.randomUUID() in Node.js environments
import { randomUUID } from 'crypto';

// Ensure crypto is available globally for TypeORM
if (typeof globalThis !== 'undefined') {
  if (!globalThis.crypto) {
    globalThis.crypto = {
      randomUUID: randomUUID
    } as any;
  }
}

// Also ensure it's available on global for older Node.js versions
if (typeof global !== 'undefined') {
  if (!(global as any).crypto) {
    (global as any).crypto = {
      randomUUID: randomUUID
    };
  }
}

export {};