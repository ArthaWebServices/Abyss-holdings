'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import createGlobe from '@/lib/createGlobe';

interface OfficeLocation {
  id: string;
  name: string;
  state: string;
  role: string;
  lat: number;
  lng: number;
  isHeadquarter?: boolean;
}

const OFFICES: OfficeLocation[] = [
  { id: '1', name: 'Mumbai', state: 'Maharashtra', role: 'Corporate Headquarters', lat: 19.076, lng: 72.8777, isHeadquarter: true },
  { id: '2', name: 'Bengaluru', state: 'Karnataka', role: 'Technology & Innovation Hub', lat: 12.9716, lng: 77.5946 },
  { id: '3', name: 'Hyderabad', state: 'Telangana', role: 'Strategic Operations', lat: 17.385, lng: 78.4867 },
  { id: '4', name: 'Gujarat', state: 'Gujarat', role: 'Industrial & Real Estate', lat: 23.0225, lng: 72.5714 },
  { id: '5', name: 'Madhya Pradesh', state: 'Madhya Pradesh', role: 'Infrastructure Projects', lat: 23.2599, lng: 77.4126 },
  { id: '6', name: 'Trivandrum', state: 'Kerala', role: 'Regional Center', lat: 8.5241, lng: 76.9366 },
];

const PI = Math.PI;

export default function RotatingEarth() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  // Default view oriented towards India (phi ~ 3.4)
  const phiRef = useRef(3.4);
  const thetaRef = useRef(0.25);
  const targetPhiRef = useRef<number | null>(null);
  const targetThetaRef = useRef<number | null>(null);

  // Selected office (null by default -> 0 dots on map, totally clean Earth)
  const [selectedOffice, setSelectedOffice] = useState<OfficeLocation | null>(null);
  const selectedOfficeRef = useRef<OfficeLocation | null>(null);
  selectedOfficeRef.current = selectedOffice;

  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);

  // Focus a specific office when clicked
  const handleSelectOffice = useCallback((office: OfficeLocation) => {
    // If clicking the currently active office, toggle it off to return to clean globe
    if (selectedOfficeRef.current?.id === office.id) {
      setSelectedOffice(null);
      selectedOfficeRef.current = null;
      if (globeRef.current) {
        globeRef.current.update({ markers: [] });
      }
      return;
    }

    setSelectedOffice(office);
    selectedOfficeRef.current = office;

    // Exact geometric pointing formula to center this location directly on screen
    const targetPhi = (PI * 1.5) - (office.lng * PI / 180);
    const targetTheta = (office.lat * PI / 180);

    const current = phiRef.current;
    const twoPi = 2 * PI;
    let normalized = targetPhi;
    while (normalized < current - PI) normalized += twoPi;
    while (normalized > current + PI) normalized -= twoPi;

    targetPhiRef.current = normalized;
    targetThetaRef.current = targetTheta;

    // Highlight ONLY this single clicked location on the map!
    if (globeRef.current) {
      globeRef.current.update({
        markers: [
          {
            location: [office.lat, office.lng],
            size: 0.1,
            color: [232 / 255, 69 / 255, 69 / 255],
          },
        ],
      });
    }
  }, []);

  const handleClearSelection = () => {
    setSelectedOffice(null);
    selectedOfficeRef.current = null;
    targetPhiRef.current = null;
    targetThetaRef.current = null;
    if (globeRef.current) {
      globeRef.current.update({ markers: [] });
    }
  };

  useEffect(() => {
    let width = 0;
    let animationFrameId: number;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    if (!canvasRef.current) return;

    // Brand crimson (#E84545)
    const primaryRGB: [number, number, number] = [232 / 255, 69 / 255, 69 / 255];

    // Clean initial globe: ZERO DOTS by default (markers: [])
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width: width * 2,
      height: width * 2,
      phi: phiRef.current,
      theta: thetaRef.current,
      scale: 1.25,
      dark: 0,
      diffuse: 1.3,
      mapSamples: 25000,
      mapBrightness: 5.2,
      baseColor: [0.94, 0.95, 0.97],
      markerColor: primaryRGB,
      glowColor: [1, 0.88, 0.88],
      markers: [], // No dots by default
      arcs: [],    // No lines
    });

    globeRef.current = globe;

    const animate = () => {
      if (selectedOfficeRef.current && targetPhiRef.current !== null && targetThetaRef.current !== null) {
        // STRICTLY STOP ROTATING: Glide directly to office location and LOCK in place
        const diffPhi = targetPhiRef.current - phiRef.current;
        const diffTheta = targetThetaRef.current - thetaRef.current;

        if (Math.abs(diffPhi) > 0.001) {
          phiRef.current += diffPhi * 0.08;
        } else {
          phiRef.current = targetPhiRef.current;
        }

        if (Math.abs(diffTheta) > 0.001) {
          thetaRef.current += diffTheta * 0.08;
        } else {
          thetaRef.current = targetThetaRef.current;
        }
        // ZERO rotation while office location is selected!
      } else if (pointerInteracting.current === null) {
        // Free continuous auto-rotation only when NO office is selected
        phiRef.current += 0.003;
      } else {
        // Free user dragging with mouse or touch
        phiRef.current += pointerInteractionMovement.current * 0.005;
        pointerInteractionMovement.current = 0;
      }

      globe.update({
        phi: phiRef.current,
        theta: thetaRef.current,
        width: width * 2,
        height: width * 2,
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      globe.destroy();
      globeRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-full max-w-[560px] mx-auto flex flex-col items-center select-none">
      {/* 3D Earth Container with ambient glow */}
      <div className="relative w-full aspect-square flex items-center justify-center">
        <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-red-500/10 via-red-500/5 to-transparent blur-3xl pointer-events-none" />

        {/* Clean WebGL Canvas (no floating UI buttons cluttering it) */}
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none transition-opacity duration-700"
          onPointerDown={(e) => {
            pointerInteracting.current = e.clientX;
            if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
          }}
          onPointerUp={() => {
            pointerInteracting.current = null;
            if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
          }}
          onPointerOut={() => {
            pointerInteracting.current = null;
            if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
          }}
          onMouseMove={(e) => {
            if (pointerInteracting.current !== null) {
              const delta = e.clientX - pointerInteracting.current;
              pointerInteractionMovement.current = delta;
              pointerInteracting.current = e.clientX;
            }
          }}
          onTouchMove={(e) => {
            if (pointerInteracting.current !== null && e.touches[0]) {
              const delta = e.touches[0].clientX - pointerInteracting.current;
              pointerInteractionMovement.current = delta;
              pointerInteracting.current = e.touches[0].clientX;
            }
          }}
        />

        {/* Highlight notification when an office is active */}
        {selectedOffice && (
          <div className="absolute top-4 left-4 right-4 md:left-6 md:right-auto bg-white/95 backdrop-blur-md border border-red-200 rounded-2xl p-3.5 shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 max-w-xs z-10">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md shadow-red-200">
              📍
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-dark">{selectedOffice.name}</p>
                {selectedOffice.isHeadquarter && (
                  <span className="text-[9px] bg-red-100 text-primary font-bold px-1.5 py-0.2 rounded-full">
                    HQ
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 truncate">{selectedOffice.role}</p>
            </div>
            <button
              onClick={handleClearSelection}
              className="text-gray-400 hover:text-dark p-1 text-xs font-bold"
              title="Close highlight"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Office Location Selector Bar: Clicking any office highlights it on the 3D Earth */}
      <div className="w-full mt-2 bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl p-3 shadow-md">
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
            Click Location to Highlight on Globe
          </p>
          {selectedOffice && (
            <button
              onClick={handleClearSelection}
              className="text-[10px] text-primary hover:underline font-semibold"
            >
              Clear highlight
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {OFFICES.map((office) => {
            const isSelected = selectedOffice?.id === office.id;
            return (
              <button
                key={office.id}
                onClick={() => handleSelectOffice(office)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-primary text-white shadow-md shadow-red-200 scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200/70'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected ? 'bg-white animate-ping' : 'bg-primary'
                  }`}
                />
                {office.name}
                {office.isHeadquarter && (
                  <span
                    className={`text-[9px] px-1 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-red-50 text-primary'
                    }`}
                  >
                    HQ
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
