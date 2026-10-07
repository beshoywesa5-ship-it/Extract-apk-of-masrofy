import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

/**
 * Unified Navigation & Back Stack Manager
 * Handles hardware/browser back button, modal stacks, Android APK lifecycle,
 * and double-back to exit on Home or Lock screen.
 */

type ModalEntry = {
  id: string;
  close: () => void;
};

class NavigationManager {
  private modalStack: ModalEntry[] = [];
  private currentTab: string = 'home';
  private tabHistory: string[] = ['home'];
  private onTabChangeCallback: ((tab: any) => void) | null = null;
  private isInitialized: boolean = false;
  private lastBackPressTime: number = 0;
  private lastActionTimestamp: number = 0;
  private lastModalAttemptId: string | null = null;
  private lastModalAttemptCount: number = 0;
  private onExitPromptCallback: (() => void) | null = null;
  private isLocked: boolean = false;

  public init(
    initialTab: string, 
    onTabChange: (tab: any) => void,
    onExitPrompt?: () => void
  ) {
    this.currentTab = initialTab;
    this.tabHistory = [initialTab];
    this.onTabChangeCallback = onTabChange;
    if (onExitPrompt) this.onExitPromptCallback = onExitPrompt;

    if (this.isInitialized) return;
    this.isInitialized = true;

    // Trap root history entry so browser back button doesn't immediately close/leave app
    try {
      window.history.replaceState({ app: 'masrofy', tab: 'home' }, '');
      window.history.pushState({ app: 'masrofy', tab: initialTab }, '');
    } catch {}

    window.addEventListener('popstate', this.handlePopState);
    window.addEventListener('keydown', this.handleKeyDown);

    // 1. Official Capacitor Native Android Hardware Back Button listener
    try {
      if (Capacitor.isNativePlatform()) {
        CapacitorApp.addListener('backButton', () => {
          this.handleBackAction();
        });
      }
    } catch (err) {
      console.warn('Could not register Capacitor backButton listener:', err);
    }

    // 2. Global window.Capacitor fallback (for APK builds where plugins are injected globally)
    try {
      const globalCap = (window as any).Capacitor;
      if (globalCap?.Plugins?.App?.addListener) {
        globalCap.Plugins.App.addListener('backButton', () => {
          this.handleBackAction();
        });
      }
    } catch {}

    // 3. Standard Android WebView / Cordova backbutton event
    try {
      document.addEventListener('backbutton', (e: Event) => {
        e.preventDefault();
        this.handleBackAction();
      }, false);
    } catch {}
  }

  public setTab(tab: string) {
    if (this.currentTab === tab) return;
    this.currentTab = tab;
    if (tab === 'home') {
      this.tabHistory = ['home'];
    } else {
      if (this.tabHistory[this.tabHistory.length - 1] !== tab) {
        this.tabHistory.push(tab);
      }
    }
  }

  public setLocked(locked: boolean) {
    this.isLocked = locked;
  }

  public pushModal(id: string, close: () => void) {
    const existingIndex = this.modalStack.findIndex(m => m.id === id);
    if (existingIndex !== -1) {
      this.modalStack[existingIndex].close = close;
      return;
    }
    this.modalStack.push({ id, close });
  }

  public removeModal(id: string) {
    const index = this.modalStack.findIndex(m => m.id === id);
    if (index !== -1) {
      this.modalStack.splice(index, 1);
    }
    if (this.lastModalAttemptId === id) {
      this.lastModalAttemptId = null;
      this.lastModalAttemptCount = 0;
    }
  }

  public exitApplication(): void {
    try {
      if (Capacitor.isNativePlatform()) {
        CapacitorApp.exitApp();
        return;
      }
    } catch {}

    try {
      const globalCap = (window as any).Capacitor;
      if (globalCap?.Plugins?.App?.exitApp) {
        globalCap.Plugins.App.exitApp();
        return;
      }
    } catch {}

    try {
      const nav = navigator as any;
      if (nav.app && typeof nav.app.exitApp === 'function') {
        nav.app.exitApp();
        return;
      }
      if (nav.device && typeof nav.device.exitApp === 'function') {
        nav.device.exitApp();
        return;
      }
    } catch {}
  }

  public handleBackAction(): boolean {
    const now = Date.now();
    // Prevent duplicate rapid back bounces within 250ms (debounces native + webview events)
    if (now - this.lastActionTimestamp < 250) {
      return true;
    }
    this.lastActionTimestamp = now;

    // 0. If application is locked, strictly isolate back actions to lock-screen dialogs
    if (this.isLocked) {
      const lockModalIndex = this.modalStack.slice().reverse().findIndex(m => m.id.startsWith('lock-'));
      if (lockModalIndex !== -1) {
        const actualIndex = this.modalStack.length - 1 - lockModalIndex;
        const lockModal = this.modalStack[actualIndex];
        if (lockModal) {
          lockModal.close();
          return true;
        }
      }

      // Double-back to exit on lock screen
      if (now - this.lastBackPressTime < 2000) {
        this.exitApplication();
        return false;
      }
      this.lastBackPressTime = now;
      if (this.onExitPromptCallback) {
        this.onExitPromptCallback();
      }
      return true;
    }

    // 1. If any modal, sheet, or confirm dialog is active, invoke top modal close handler
    if (this.modalStack.length > 0) {
      const topIndex = this.modalStack.length - 1;
      const topModal = this.modalStack[topIndex];
      if (topModal) {
        if (this.lastModalAttemptId === topModal.id) {
          this.lastModalAttemptCount++;
        } else {
          this.lastModalAttemptId = topModal.id;
          this.lastModalAttemptCount = 1;
        }

        // Safety fallback: if top modal failed to close or launch child modal after multiple back presses, pop it
        if (this.lastModalAttemptCount > 2) {
          this.modalStack.pop();
          this.lastModalAttemptId = null;
          this.lastModalAttemptCount = 0;
          return true;
        }

        topModal.close();
      }
      return true;
    }

    // 2. Tab history navigation: step back through visited tabs
    if (this.tabHistory.length > 1) {
      this.tabHistory.pop();
      const prevTab = this.tabHistory[this.tabHistory.length - 1] || 'home';
      this.currentTab = prevTab;
      if (this.onTabChangeCallback) {
        this.onTabChangeCallback(prevTab);
      }
      return true;
    }

    if (this.currentTab !== 'home') {
      this.currentTab = 'home';
      this.tabHistory = ['home'];
      if (this.onTabChangeCallback) {
        this.onTabChangeCallback('home');
      }
      return true;
    }

    // 3. If on 'home' tab: guard against accidental app exit (Double-Back to Exit)
    if (now - this.lastBackPressTime < 2000) {
      this.exitApplication();
      return false; // allow exit
    }

    // First back press on Home: trap and prompt user
    this.lastBackPressTime = now;
    if (this.onExitPromptCallback) {
      this.onExitPromptCallback();
    } else {
      window.dispatchEvent(new CustomEvent('masrofy_back_exit_prompt'));
    }
    return true;
  }

  private handlePopState = (_e: PopStateEvent) => {
    // Re-trap state immediately so web browser history doesn't pop out
    try {
      window.history.pushState({ app: 'masrofy', tab: this.currentTab }, '');
    } catch {}

    this.handleBackAction();
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.modalStack.length > 0) {
      e.preventDefault();
      const topModal = this.modalStack[this.modalStack.length - 1];
      if (topModal) {
        topModal.close();
      }
    }
  };
}

export const navigationManager = new NavigationManager();
