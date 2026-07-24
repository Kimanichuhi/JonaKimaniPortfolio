import { useEffect, useState } from 'react';
import { Download, X, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

const DISMISS_KEY = 'pwa-install-dismissed-at';
const DISMISS_DAYS = 14;

function wasRecentlyDismissed(): boolean {
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  if (Number.isNaN(dismissedAt)) return false;
  return Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
}

export default function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone() || wasRecentlyDismissed()) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const handleAppInstalled = () => {
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    let iosTimer: ReturnType<typeof setTimeout> | undefined;
    if (isIos()) {
      iosTimer = setTimeout(() => {
        setShowIosHint(true);
        setVisible(true);
      }, 2000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
    } else {
      dismiss();
    }
    setDeferredPrompt(null);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] animate-slide-up">
      <div className="container-default pb-4">
        <div className="bg-primary-800/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-4 flex items-center gap-4 max-w-xl mx-auto">
          <div className="w-10 h-10 rounded-lg bg-accent-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
            JK
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium">Install this app</p>
            {showIosHint ? (
              <p className="text-white/50 text-xs flex items-center gap-1 flex-wrap">
                Tap <Share size={12} className="inline text-accent-400" /> then "Add to Home Screen"
              </p>
            ) : (
              <p className="text-white/50 text-xs">Get quick access from your home screen.</p>
            )}
          </div>
          {!showIosHint && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm font-medium transition-colors shrink-0"
            >
              <Download size={14} /> Install
            </button>
          )}
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
