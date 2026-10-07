/**
 * Simple web haptics utility using Navigator.vibrate
 */
export function triggerHaptic(type: 'light' | 'medium' | 'success' | 'error' = 'light'): void {
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      if (type === 'light') {
        navigator.vibrate?.(12);
      } else if (type === 'medium') {
        navigator.vibrate?.(25);
      } else if (type === 'success') {
        navigator.vibrate?.([15, 35, 20]);
      } else if (type === 'error') {
        navigator.vibrate?.([40, 40, 40]);
      }
    }
  } catch {
    // Graceful fallback on devices that don't support vibration
  }
}
