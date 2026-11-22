'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';

interface IntroSplashProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export type SplashStatus = 'idle' | 'loading' | 'exiting' | 'dismissed';

export default function IntroSplash({ onComplete, forceShow = false }: IntroSplashProps) {
  const [status, setStatus] = useState<SplashStatus>('idle');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const statusRef = useRef<SplashStatus>(status);
  statusRef.current = status;

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
  }, []);

  const dismiss = useCallback(() => {
    if (statusRef.current === 'exiting' || statusRef.current === 'dismissed') {
      return;
    }

    cleanup();
    setStatus('exiting');

    if (typeof document !== 'undefined') {
      const preloader = document.getElementById('splash-backdrop-preloader');
      if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.pointerEvents = 'none';
        preloader.style.transition = 'opacity 500ms ease-out';
      }
    }

    exitTimerRef.current = setTimeout(() => {
      setStatus('dismissed');
      try {
        sessionStorage.setItem('abyss_has_seen_splash', 'true');
      } catch {
        // Ignore storage errors in private browsing modes
      }
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('splash-active');
        document.body.style.overflow = '';
        const preloader = document.getElementById('splash-backdrop-preloader');
        if (preloader) preloader.style.display = 'none';
      }
      if (onComplete) onComplete();
    }, 500); // 500ms smooth fade transition
  }, [cleanup, onComplete]);

  // Main 3-second loader
  const startLoading = useCallback(() => {
    cleanup();
    setStatus('loading');

    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('splash-active');
      document.body.style.overflow = 'hidden';
    }

    // Exactly 3 seconds (3000ms), then dismiss
    timerRef.current = setTimeout(() => {
      dismiss();
    }, 3000);
  }, [cleanup, dismiss]);

  // Initial mount trigger
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const hasParam = urlParams.has('intro') || urlParams.has('splash');
    let hasSeen = false;
    try {
      hasSeen = !!sessionStorage.getItem('abyss_has_seen_splash');
    } catch {
      hasSeen = false;
    }

    if (forceShow || hasParam || !hasSeen) {
      startLoading();
    } else {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('splash-active');
        const preloader = document.getElementById('splash-backdrop-preloader');
        if (preloader) preloader.style.display = 'none';
      }
    }

    return () => {
      cleanup();
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('splash-active');
        document.body.style.overflow = '';
      }
    };
  }, [forceShow, startLoading, cleanup]);

  // Global replay trigger listener
  useEffect(() => {
    function handleReplay() {
      startLoading();
    }
    window.addEventListener('abyss:replay-intro', handleReplay);
    return () => window.removeEventListener('abyss:replay-intro', handleReplay);
  }, [startLoading]);

  // Escape key shortcut to skip immediately
  useEffect(() => {
    if (status === 'idle' || status === 'dismissed') return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') dismiss();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, dismiss]);

  if (status === 'idle' || status === 'dismissed') return null;

  const isExiting = status === 'exiting';

  return (
    <div
      role="status"
      aria-label="Loading Abyss Holdings"
      className={`fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden transition-all duration-500 ease-out select-none
        ${isExiting ? 'opacity-0 pointer-events-none scale-102 filter blur-sm' : 'opacity-100 scale-100'}`}
      style={{
        background: 'radial-gradient(ellipse 95% 85% at 50% 45%, #180509 0%, #0d0812 45%, #06070c 85%, #020305 100%)',
      }}
    >
      {/* Background ambient dark red illumination & constellation stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Core dark red radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-[130px] pointer-events-none opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(166, 25, 46, 0.55) 0%, rgba(130, 16, 32, 0.25) 55%, transparent 75%)',
          }}
        />

        {/* Ambient constellation grid stars */}
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:36px_36px]" />
      </div>

      {/* Center Branded Stage */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 max-w-xl w-full text-center">
        {/* Central Logo Sphere */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center mb-6">
          <Image
            src="/images/abyss-logo-square.png"
            alt="Abyss Holdings"
            width={200}
            height={200}
            priority
            className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(166,25,46,0.7)]"
          />
        </div>

        {/* Brand Typography */}
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-[0.32em] uppercase drop-shadow-md">
          Abyss <span className="text-[#E5506E]">Holdings</span>
        </h1>

        <p className="text-[11px] sm:text-xs font-semibold text-rose-200/90 tracking-[0.42em] uppercase mt-2.5">
          Group of Companies
        </p>
      </div>
    </div>
  );
}
