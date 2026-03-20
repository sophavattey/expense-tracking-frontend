"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("pwa_dismissed")) return;

    setIsMobile(window.innerWidth < 768);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShow(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // DEV PREVIEW — remove before production
    if (process.env.NODE_ENV === "development") {
      setTimeout(() => setShow(true), 0);
    }
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShow(false);
      setDeferredPrompt(null);
    }
    setInstalling(false);
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem("pwa_dismissed", "1");
  };

  if (!show || dismissed) return null;

  /* ── Mobile: bottom sheet ── */
  if (isMobile) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/30 z-50 transition-opacity"
          onClick={handleDismiss}
        />
        <div
          className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl px-5 pt-2 pb-8 shadow-2xl"
          style={{ animation: "slideUp 0.3s ease both" }}
        >
          <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}`}</style>

          {/* Drag handle */}
          <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/25">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-black text-base font-['Sora',sans-serif]">
                Install My Luy
              </p>
              <p className="text-gray-400 text-xs mt-0.5">
                Add to your home screen
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0"
            >
              <X size={14} strokeWidth={2.5} className="text-gray-500" />
            </button>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed mb-4">
            Install My Luy on your home screen for quick access.
          </p>

          <button
            onClick={handleInstall}
            disabled={installing}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98] disabled:opacity-60"
          >
            {installing ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Installing…
              </>
            ) : (
              <>
                <Download size={16} strokeWidth={2} />
                Add to Home Screen
              </>
            )}
          </button>

          <button
            onClick={handleDismiss}
            className="w-full text-center text-gray-400 text-sm font-medium py-3 mt-2 rounded-2xl hover:bg-gray-50 transition-colors"
          >
            Not now
          </button>
        </div>
      </>
    );
  }

  /* ── Desktop: bottom-right toast ── */
  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-[340px] bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-gray-200/80 overflow-hidden"
      style={{ animation: "toastIn 0.3s ease both" }}
    >
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Blue top accent line */}
      <div className="h-1 w-full bg-blue-600" />

      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/25">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-gray-800 font-black text-sm font-['Sora',sans-serif]">
                Install FinSet
              </p>
              <button
                onClick={handleDismiss}
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0 ml-2"
              >
                <X size={12} strokeWidth={2.5} className="text-gray-500" />
              </button>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed mb-3">
              Install FinSet on your home screen for quick access.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Maybe later
              </button>
              <button
                onClick={handleInstall}
                disabled={installing}
                className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-xl transition-all hover:shadow-md hover:shadow-blue-600/25 active:scale-[0.98] disabled:opacity-60"
              >
                {installing ? (
                  <>
                    <svg
                      className="w-3 h-3 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Installing…
                  </>
                ) : (
                  <>
                    <Download size={12} strokeWidth={2} />
                    Install App
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
