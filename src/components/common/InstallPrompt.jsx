import { useState, useEffect } from 'react';
import { Download, X, Share, Plus } from 'lucide-react';

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
const isInStandaloneMode = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showAndroid, setShowAndroid] = useState(false);
  const [showIOS, setShowIOS] = useState(false);

  useEffect(() => {
    if (isInStandaloneMode()) return; // Allaqachon o'rnatilgan

    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) return;

    if (isIOS()) {
      // iOS uchun qo'lda ko'rsatma
      setTimeout(() => setShowIOS(true), 3000);
      return;
    }

    // Android / Desktop
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowAndroid(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowAndroid(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowAndroid(false);
    setShowIOS(false);
    localStorage.setItem('pwa-install-dismissed', '1');
  };

  if (showAndroid) {
    return (
      <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50 animate-slide-up">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Ilovani o'rnatish</p>
                <p className="text-xs text-gray-500">Uy ekraniga qo'shing</p>
              </div>
            </div>
            <button onClick={handleDismiss} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            EduCenter ilovasini telefonga o'rnating — tezroq ochiladi, offline ham ishlaydi.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDismiss}
              className="flex-1 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl transition"
            >
              Keyinroq
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition"
            >
              O'rnatish
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showIOS) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-start justify-between mb-3">
            <p className="font-semibold text-gray-900 dark:text-gray-100">Uy ekraniga qo'shish</p>
            <button onClick={handleDismiss} className="p-1 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Share className="w-4 h-4 text-blue-600" />
              </div>
              <span>Pastdagi <strong>"Ulashish"</strong> tugmasini bosing</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Plus className="w-4 h-4 text-gray-600" />
              </div>
              <span><strong>"Uy ekraniga qo'shish"</strong> ni tanlang</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default InstallPrompt;
