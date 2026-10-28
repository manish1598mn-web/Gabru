/**
 * GABRU — CONSOLE LOG FILTER UTIL
 * 
 * Intercepts WebAssembly / Emscripten / TensorFlow Lite stderr output.
 * In Next.js dev server (Turbopack), any console.error() triggers a developer
 * error modal overlay. C++ libraries write status info (e.g. "INFO: Created
 * TensorFlow Lite XNNPACK delegate for CPU.") to stderr, which Emscripten routes
 * directly to console.error.
 * 
 * We downgrade informational status messages to console.info so the dev overlay
 * does not falsely report an application crash.
 */

export function isTfLiteInformationalMessage(args: unknown[]): boolean {
  try {
    const text = args
      .map((a) => {
        if (typeof a === 'string') return a;
        if (a && typeof (a as { message?: string }).message === 'string') {
          return (a as { message: string }).message;
        }
        try {
          return JSON.stringify(a);
        } catch {
          return String(a);
        }
      })
      .join(' ');

    return (
      text.includes('Created TensorFlow Lite') ||
      text.includes('XNNPACK delegate') ||
      text.includes('INFO: Created') ||
      text.startsWith('INFO:') ||
      text.includes('TensorFlow Lite XNNPACK') ||
      text.includes('delegate for CPU') ||
      text.includes('delegate for GPU') ||
      text.includes('Applying delegate') ||
      text.includes('OpenGL error checking')
    );
  } catch {
    return false;
  }
}

// Global browser-level guard
if (typeof window !== 'undefined') {
  const win = window as unknown as Record<string, unknown>;
  if (!win.__tflite_global_filter_installed) {
    win.__tflite_global_filter_installed = true;
    const originalConsoleError = console.error;
    console.error = function (...args: unknown[]) {
      if (isTfLiteInformationalMessage(args)) {
        console.info('[TFLite Info]:', ...args);
        return;
      }
      return originalConsoleError.apply(console, args);
    };
  }
}

export function executeWithConsoleFilter<T>(fn: () => T): T {
  if (typeof window === 'undefined') return fn();
  const prevError = console.error;
  try {
    console.error = (...args: unknown[]) => {
      if (isTfLiteInformationalMessage(args)) {
        console.info('[TFLite Info]:', ...args);
        return;
      }
      prevError.apply(console, args);
    };
    return fn();
  } finally {
    console.error = prevError;
  }
}

export async function executeWithConsoleFilterAsync<T>(fn: () => Promise<T>): Promise<T> {
  if (typeof window === 'undefined') return fn();
  const prevError = console.error;
  try {
    console.error = (...args: unknown[]) => {
      if (isTfLiteInformationalMessage(args)) {
        console.info('[TFLite Info]:', ...args);
        return;
      }
      prevError.apply(console, args);
    };
    return await fn();
  } finally {
    console.error = prevError;
  }
}
