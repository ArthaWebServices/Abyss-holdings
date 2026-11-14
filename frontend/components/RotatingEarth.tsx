'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import createGlobe from '@/lib/createGlobe';

interface OfficeLocation {
  id: string;
  name: string;
  state: string;
  role: string;
  address?: string;
  lat: number;
  lng: number;
  isHeadquarter?: boolean;
}

const OFFICES: OfficeLocation[] = [
  {
    id: '1',
    name: 'Mumbai',
    state: 'Maharashtra',
    role: 'Corporate Headquarters',
    address: '46/48 maruti cross lane, Borabazaar precint, Fort, Mumbai, Maharashtra 400001, India',
    lat: 18.9348,
    lng: 72.8354,
    isHeadquarter: true,
  },
  {
    id: '2',
    name: 'Delhi',
    state: 'Delhi',
    role: 'Northern Regional Hub',
    address: '1313, Pocket 1, Jasola Vihar, New Delhi, Delhi 110025, India',
    lat: 28.5397,
    lng: 77.2913,
  },
  {
    id: '3',
    name: 'Bengaluru',
    state: 'Karnataka',
    role: 'Technology & Innovation Hub',
    address: '3A/21, No. 05, WOOD STREET, ASHOK NAGAR, Bengaluru - 560025',
    lat: 12.9698,
    lng: 77.6080,
  },
  {
    id: '4',
    name: 'Telangana',
    state: 'Telangana',
    role: 'Financial District & Strategic Operations',
    address: '225, Nanakramguda Rd, Financial District, Nanakramguda, Makthakousarali, Telangana 500032, India',
    lat: 17.4140,
    lng: 78.3444,
  },
  {
    id: '5',
    name: 'Chennai',
    state: 'Tamil Nadu',
    role: 'Southern Maritime & Logistics Hub',
    address: 'No 13, Railway Station Rd, near Railyway Gate, Sakthi Puram, Tiruvottiyur, Chennai, Tamil Nadu 600019, India',
    lat: 13.1610,
    lng: 80.3015,
  },
  {
    id: '6',
    name: 'Kolkata',
    state: 'West Bengal',
    role: 'Eastern Regional Hub',
    address: '92, Circus Ave, Lower Range, Beck Bagan, Ballygunge, Kolkata, West Bengal 700017, India',
    lat: 22.5411,
    lng: 88.3615,
  },
];

const PI = Math.PI;

/**
 * Explicit State Machine for Globe Interaction.
 * Replaces uncoordinated refs and flags with discrete modes:
 * - auto_rotating: Free idle rotation
 * - dragging: User pointer/touch interaction has full priority
 * - gliding_to_focus: Smooth cinematic interpolation to office coordinates
 * - locked_on_office: Fixed coordinates displaying office details
 */
export type GlobeInteractionState =
  | { mode: 'auto_rotating' }
  | { mode: 'dragging'; movement: number }
  | { mode: 'gliding_to_focus'; office: OfficeLocation; targetPhi: number; targetTheta: number }
  | { mode: 'locked_on_office'; office: OfficeLocation };

export default function RotatingEarth() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragStartRef = useRef<number | null>(null);

  // Spherical coordinates
  const phiRef = useRef(3.4);
  const thetaRef = useRef(0.25);

  // Active interaction state machine
  const stateRef = useRef<GlobeInteractionState>({ mode: 'auto_rotating' });

  // Selected office for UI card overlay
  const [selectedOffice, setSelectedOffice] = useState<OfficeLocation | null>(null);
  const selectedOfficeRef = useRef<OfficeLocation | null>(null);
  selectedOfficeRef.current = selectedOffice;

  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);

  // Focus a specific office with state machine transition
  const handleSelectOffice = useCallback((office: OfficeLocation) => {
    // If clicking the currently active office, toggle off and resume auto-rotation
    if (selectedOfficeRef.current?.id === office.id) {
      setSelectedOffice(null);
      selectedOfficeRef.current = null;
      stateRef.current = { mode: 'auto_rotating' };
      if (globeRef.current) {
        globeRef.current.update({ markers: [] });
      }
      return;
    }

    setSelectedOffice(office);
    selectedOfficeRef.current = office;

    // Geometric pointing formula to center coordinates directly on screen
    const targetPhi = (PI * 1.5) - (office.lng * PI / 180);
    const targetTheta = (office.lat * PI / 180);

    const current = phiRef.current;
    const twoPi = 2 * PI;
    let normalized = targetPhi;
    while (normalized < current - PI) normalized += twoPi;
    while (normalized > current + PI) normalized -= twoPi;

    // Transition state machine to gliding_to_focus
    stateRef.current = {
      mode: 'gliding_to_focus',
      office,
      targetPhi: normalized,
      targetTheta,
    };

    if (globeRef.current) {
      globeRef.current.update({
        markers: [
          {
            location: [office.lat, office.lng],
            size: 0.1,
            color: [166 / 255, 25 / 255, 46 / 255],
          },
        ],
      });
    }
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedOffice(null);
    selectedOfficeRef.current = null;
    stateRef.current = { mode: 'auto_rotating' };
    if (globeRef.current) {
      globeRef.current.update({ markers: [] });
    }
  }, []);

  // Pointer event handlers with explicit state transitions
  const handlePointerDown = (clientX: number) => {
    dragStartRef.current = clientX;
    stateRef.current = { mode: 'dragging', movement: 0 };
    if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
  };

  const handlePointerMove = (clientX: number) => {
    if (dragStartRef.current === null) return;
    const delta = clientX - dragStartRef.current;
    dragStartRef.current = clientX;
    stateRef.current = { mode: 'dragging', movement: delta };
  };

  const handlePointerUp = () => {
    dragStartRef.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
    if (selectedOfficeRef.current) {
      stateRef.current = { mode: 'locked_on_office', office: selectedOfficeRef.current };
    } else {
      stateRef.current = { mode: 'auto_rotating' };
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

    // Authentic Brand Crimson (#A6192E)
    const primaryRGB: [number, number, number] = [166 / 255, 25 / 255, 46 / 255];

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
      markers: [],
      arcs: [],
    });

    globeRef.current = globe;

    const animate = () => {
      const currentState = stateRef.current;

      switch (currentState.mode) {
        case 'gliding_to_focus': {
          const diffPhi = currentState.targetPhi - phiRef.current;
          const diffTheta = currentState.targetTheta - thetaRef.current;

          if (Math.abs(diffPhi) > 0.001) {
            phiRef.current += diffPhi * 0.08;
          } else {
            phiRef.current = currentState.targetPhi;
          }

          if (Math.abs(diffTheta) > 0.001) {
            thetaRef.current += diffTheta * 0.08;
          } else {
            thetaRef.current = currentState.targetTheta;
          }

          // Transition to locked once close enough to target
          if (Math.abs(diffPhi) <= 0.001 && Math.abs(diffTheta) <= 0.001) {
            stateRef.current = { mode: 'locked_on_office', office: currentState.office };
          }
          break;
        }

        case 'dragging': {
          phiRef.current += currentState.movement * 0.005;
          stateRef.current = { mode: 'dragging', movement: 0 };
          break;
        }

        case 'locked_on_office': {
          // Stationary view on focused office
          break;
        }

        case 'auto_rotating':
        default: {
          phiRef.current += 0.003;
          break;
        }
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
          onPointerDown={(e) => handlePointerDown(e.clientX)}
          onPointerUp={handlePointerUp}
          onPointerOut={handlePointerUp}
          onMouseMove={(e) => handlePointerMove(e.clientX)}
          onTouchStart={(e) => e.touches[0] && handlePointerDown(e.touches[0].clientX)}
          onTouchEnd={handlePointerUp}
          onTouchMove={(e) => e.touches[0] && handlePointerMove(e.touches[0].clientX)}
        />

        {/* Highlight notification when an office is active */}
        {selectedOffice && (
          <div className="absolute top-4 left-4 right-4 md:left-6 md:right-auto bg-white/95 backdrop-blur-md border border-red-200 rounded-2xl p-3.5 shadow-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 max-w-sm z-10">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md shadow-red-200 mt-0.5">
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
              <p className="text-[11px] text-gray-500 font-medium truncate">{selectedOffice.role}</p>
              {selectedOffice.address && (
                <p className="text-[10px] text-gray-600 line-clamp-2 mt-1 leading-snug">
                  {selectedOffice.address}
                </p>
              )}
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
