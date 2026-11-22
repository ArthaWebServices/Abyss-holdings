'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';

interface IntroSplashProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

const SECTORS_LIST = [
  'Capital Investments',
  'Mega Construction & EPC',
  'Prime Realities & Urban Spaces',
  'Enterprise Technologies & AI',
  'Automobiles & Clean Mobility',
  'Earth Movers & Heavy Machinery',
  'Apparels & Global Textiles',
];

  export type SplashState =
  | { status: 'idle' }
  | { status: 'entering'; progress: number }
  | { status: 'pulsing'; progress: number }
  | { status: 'sectors'; sectorIndex: number; progress: number }
  | { status: 'crescendo'; progress: number }
  | { status: 'exiting' }
  | { status: 'dismissed' };

export default function IntroSplash({ onComplete, forceShow = false }: IntroSplashProps) {
  const [state, setState] = useState<SplashState>({ status: 'idle' });

  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stateRef = useRef<SplashState>(state);
  stateRef.current = state;

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const dismiss = useCallback(() => {
    // Prevent double dismissal if already exiting or dismissed
    if (stateRef.current.status === 'exiting' || stateRef.current.status === 'dismissed') {
      return;
    }

    clearAllTimers();
    setState({ status: 'exiting' });

    const exitTimer = setTimeout(() => {
      setState({ status: 'dismissed' });
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
    }, 700);

    timersRef.current.push(exitTimer);
  }, [clearAllTimers, onComplete]);

  // Main 10-second sequence orchestrator
  const startSequence = useCallback(() => {
    clearAllTimers();
    setState({ status: 'entering', progress: 0 });

    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('splash-active');
      document.body.style.overflow = 'hidden';
    }

    const startTime = Date.now();
    const TOTAL_DURATION_MS = 10000; // Exact 10 seconds

    // High-resolution progress interval (~60fps ticks)
    intervalRef.current = setInterval(() => {
      const current = stateRef.current;
      if (current.status === 'exiting' || current.status === 'dismissed' || current.status === 'idle') {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / TOTAL_DURATION_MS) * 100));

      // Keep progress synchronized within the active phase
      setState((prev) => {
        switch (prev.status) {
          case 'entering':
            return { status: 'entering', progress: pct };
          case 'pulsing':
            return { status: 'pulsing', progress: pct };
          case 'sectors':
            return { status: 'sectors', sectorIndex: prev.sectorIndex, progress: pct };
          case 'crescendo':
            return { status: 'crescendo', progress: pct };
          default:
            return prev;
        }
      });

      if (elapsed >= TOTAL_DURATION_MS) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 40);

    // Stage 2: Pulsing (1.8s)
    const t1 = setTimeout(() => {
      setState((prev) =>
        prev.status === 'exiting' || prev.status === 'dismissed'
          ? prev
          : { status: 'pulsing', progress: 18 }
      );
    }, 1800);
    timersRef.current.push(t1);

    // Stage 3: 7 Sectors Showcase (4.5s)
    const t2 = setTimeout(() => {
      setState((prev) =>
        prev.status === 'exiting' || prev.status === 'dismissed'
          ? prev
          : { status: 'sectors', sectorIndex: 0, progress: 45 }
      );
    }, 4500);
    timersRef.current.push(t2);

    // Rotate sectors through Stage 3
    for (let i = 1; i < SECTORS_LIST.length; i++) {
      const tSector = setTimeout(() => {
        setState((prev) =>
          prev.status === 'sectors'
            ? { status: 'sectors', sectorIndex: i, progress: prev.progress }
            : prev
        );
      }, 4500 + i * 450);
      timersRef.current.push(tSector);
    }

    // Stage 4: Crescendo (7.8s)
    const t3 = setTimeout(() => {
      setState((prev) =>
        prev.status === 'exiting' || prev.status === 'dismissed'
          ? prev
          : { status: 'crescendo', progress: 78 }
      );
    }, 7800);
    timersRef.current.push(t3);

    // Stage 5: Exit & Transition to Homepage (10.0s)
    const tEnd = setTimeout(() => {
      dismiss();
    }, 10000);
    timersRef.current.push(tEnd);
  }, [clearAllTimers, dismiss]);

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
      startSequence();
    } else {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('splash-active');
        const preloader = document.getElementById('splash-backdrop-preloader');
        if (preloader) preloader.style.display = 'none';
      }
    }

    return () => {
      clearAllTimers();
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('splash-active');
        document.body.style.overflow = '';
      }
    };
  }, [forceShow, startSequence, clearAllTimers]);

  // Global replay trigger listener
  useEffect(() => {
    function handleReplay() {
      startSequence();
    }
    window.addEventListener('abyss:replay-intro', handleReplay);
    return () => window.removeEventListener('abyss:replay-intro', handleReplay);
  }, [startSequence]);

  // Escape key shortcut
  useEffect(() => {
    if (state.status === 'idle' || state.status === 'dismissed') return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') dismiss();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.status, dismiss]);

  if (state.status === 'idle' || state.status === 'dismissed') return null;

  const isExiting = state.status === 'exiting';
  const progressValue =
    state.status === 'entering' ||
    state.status === 'pulsing' ||
    state.status === 'sectors' ||
    state.status === 'crescendo'
      ? state.progress
      : 100;

  return (
    <div
      role="dialog"
      aria-label="Welcome to Abyss Holdings"
      className={`fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden transition-all duration-700 ease-out select-none
        ${isExiting ? 'opacity-0 pointer-events-none scale-105 filter blur-sm' : 'opacity-100 scale-100'}`}
      style={{
        background: 'radial-gradient(ellipse 95% 85% at 50% 45%, #180509 0%, #0d0812 45%, #06070c 85%, #020305 100%)',
      }}
    >
      {/* Background ambient dark red illumination & constellation stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Core pulsating dark red radial glow */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px] pointer-events-none transition-all duration-1000
            ${state.status === 'crescendo'
              ? 'w-[750px] h-[750px] opacity-75'
              : state.status === 'pulsing'
              ? 'w-[640px] h-[640px] opacity-60'
              : 'w-[500px] h-[500px] opacity-40'}
          `}
          style={{
            background: 'radial-gradient(circle, rgba(166, 25, 46, 0.55) 0%, rgba(130, 16, 32, 0.25) 55%, transparent 75%)',
          }}
        />

        {/* Ambient constellation grid stars */}
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:36px_36px]" />

        {/* Atmospheric sweeping dark red light streak */}
        <div
          className="absolute inset-x-0 h-40 bg-gradient-to-r from-transparent via-[#A6192E]/15 to-transparent blur-3xl pointer-events-none transition-all duration-1000"
          style={{
            top: state.status === 'entering' ? '25%' : state.status === 'pulsing' ? '45%' : state.status === 'sectors' ? '60%' : '50%',
          }}
        />
      </div>

      {/* Skip Button (Top Right) */}
     

      {/* Center Cinematic Stage */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 max-w-xl w-full text-center">
        {/* ── The Globe / Ball Container ─────────────────────── */}
        <div className="relative w-52 h-52 sm:w-64 sm:h-64 flex items-center justify-center">
          {/* Outer Pulsing Aura Ripple */}
          <div
            className={`absolute inset-0 rounded-full border border-[#A6192E]/40 transition-all duration-1000
              ${state.status === 'entering' ? 'scale-75 opacity-0' : 'scale-125 opacity-100 animate-ping'}
            `}
            style={{ animationDuration: '3.2s' }}
          />

          <div
            className={`absolute -inset-6 rounded-full border border-rose-500/20 transition-all duration-1000
              ${state.status === 'entering' ? 'scale-50 opacity-0' : 'scale-110 opacity-70'}
            `}
          />

          {/* 3D Perspective Orbital Gyroscope Rings */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ perspective: '900px' }}
          >
            {/* Primary Horizontal Celestial Orbit */}
            <div
              className="w-full h-full rounded-full border border-[#A6192E]/50 border-dashed animate-[spin_18s_linear_infinite]"
              style={{
                transform: 'rotateX(72deg) rotateZ(0deg)',
                boxShadow: '0 0 25px rgba(166, 25, 46, 0.4)',
              }}
            />
            {/* Counter-Tilted Celestial Orbit */}
            <div
              className="absolute w-[88%] h-[88%] rounded-full border border-rose-400/35 animate-[spin_24s_linear_infinite_reverse]"
              style={{
                transform: 'rotateY(68deg) rotateX(25deg)',
              }}
            />
          </div>

          {/* ── Central Globe / Ball Logo ── */}
          {/* Zoom In, Zoom Out, Breathing & Dissolve / Reappear Animation */}
          <div
            className={`relative z-20 w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center transition-all duration-1000 ease-out
              ${state.status === 'entering' ? 'scale-40 opacity-0 filter blur-lg' : ''}
              ${state.status === 'pulsing' ? 'scale-110 opacity-100 filter blur-0 animate-[pulse_2.4s_ease-in-out_infinite]' : ''}
              ${state.status === 'sectors' ? 'scale-100 opacity-100 filter blur-0' : ''}
              ${state.status === 'crescendo' ? 'scale-115 opacity-100 filter blur-0 animate-pulse' : ''}
              ${state.status === 'exiting' ? 'scale-130 opacity-0 filter blur-xl' : ''}
            `}
          >
            {/* Center Core Dark Red Flare Ignition */}
            <div
              className={`absolute w-24 h-24 rounded-full bg-[#A6192E] blur-2xl transition-opacity duration-700
                ${state.status === 'crescendo' ? 'opacity-80 scale-125' : 'opacity-50 animate-pulse'}
              `}
            />

            {/* Rotating Geodesic Network Ball / Globe Logo */}
            <div className="relative z-10 w-full h-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
              <Image
                src="/images/abyss-logo-square.png"
                alt="Abyss Holdings Animated Geodesic Globe"
                width={240}
                height={240}
                priority
                className="w-full h-full object-contain drop-shadow-[0_0_45px_rgba(166,25,46,0.75)]"
              />
            </div>
          </div>
        </div>

        {/* ── Brand Typography & 10s Choreography ───────────── */}
        <div
          className={`mt-8 transition-all duration-1000 transform
            ${state.status !== 'entering' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}
        >
          {/* Main Title: ABYSS HOLDINGS */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-[0.28em] sm:tracking-[0.36em] uppercase drop-shadow-lg">
            Abyss <span className="text-[#E5506E]">Holdings</span>
          </h1>

          {/* Subtitle with Dark Red Accents */}
          <div className="flex items-center justify-center gap-3 mt-2.5">
            <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#A6192E]" />
            <p className="text-[10px] sm:text-xs font-semibold text-rose-200/90 tracking-[0.42em] uppercase">
              Group of Companies
            </p>
            <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#A6192E]" />
          </div>

          {/* Dynamic 7-Sector Showcase (Rotates smoothly during seconds 4.5 – 7.8) */}
          <div className="h-7 mt-4 flex items-center justify-center overflow-hidden">
            {state.status === 'sectors' ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A6192E] animate-ping" />
                <span className="text-xs font-medium text-rose-300/90 tracking-wider uppercase font-mono">
                  {SECTORS_LIST[state.sectorIndex]}
                </span>
              </div>
            ) : state.status === 'crescendo' ? (
              <span className="text-[11px] text-rose-300 font-semibold tracking-wider uppercase animate-pulse">
                Entering Corporate Portal...
              </span>
            ) : (
              <span className="text-[11px] text-gray-400 tracking-wider uppercase">
                National Conglomerate • Multi-Sector Execution
              </span>
            )}
          </div>

          {/* Subtle Ambient Brand Progress Filament */}
          <div className="w-52 sm:w-64 h-[2px] bg-white/10 rounded-full mx-auto mt-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#A6192E] via-rose-500 to-[#A6192E] transition-all duration-75 ease-linear rounded-full"
              style={{
                width: `${progressValue}%`,
                boxShadow: '0 0 10px rgba(229, 80, 110, 0.8)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
