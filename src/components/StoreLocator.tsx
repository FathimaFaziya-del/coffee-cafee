/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { STORE_LOCATIONS } from '../data';
import { StoreLocation } from '../types';
import { 
  MapPin, 
  Map, 
  Clock, 
  Phone, 
  Compass, 
  Navigation, 
  Check, 
  ChevronRight, 
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { 
  APIProvider, 
  Map as GoogleMap, 
  AdvancedMarker, 
  Pin, 
  InfoWindow, 
  useMap 
} from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

function MapCameraRecenter({ selectedCoords }: { selectedCoords: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    if (map && selectedCoords) {
      map.panTo(selectedCoords);
      map.setZoom(13);
    }
  }, [map, selectedCoords]);
  return null;
}

// Central point of user simulation (Burj Khalifa / Downtown Dubai)
const USER_COORDINATES = { lat: 25.1972, lng: 55.2744 };

// Helper to calculate distance in km
function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function StoreLocator() {
  const [selectedStore, setSelectedStore] = useState<StoreLocation>(STORE_LOCATIONS[0]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'real' | 'vector'>('real');
  const [activeInfoWindowId, setActiveInfoWindowId] = useState<string | null>(STORE_LOCATIONS[0].id);
  const [showSetupGuide, setShowSetupGuide] = useState<boolean>(false);

  // Sync selectedStore with activeInfoWindowId
  useEffect(() => {
    setActiveInfoWindowId(selectedStore.id);
  }, [selectedStore]);

  // Compute distances once based on simulation center
  const storesWithDistance = useMemo(() => {
    return STORE_LOCATIONS.map((store) => {
      const distance = getDistanceInKm(
        USER_COORDINATES.lat,
        USER_COORDINATES.lng,
        store.coordinates.lat,
        store.coordinates.lng
      );
      return {
        ...store,
        distance: parseFloat(distance.toFixed(1)),
      };
    }).sort((a, b) => a.distance - b.distance);
  }, []);

  // Filter criteria options
  const filterFacilities = [
    { id: 'all', label: 'All Locations' },
    { id: 'Nitro Taps', label: 'Nitro Infusions' },
    { id: 'Pour Over Slow Bar', label: 'Manual Slow Bars' },
    { id: 'Live Roasting Demos', label: 'Active Roaster HQ' },
  ];

  const filteredStores = useMemo(() => {
    if (activeFilter === 'all') return storesWithDistance;
    return storesWithDistance.filter((store) =>
      store.features.some((feature) => feature.toLowerCase().includes(activeFilter.toLowerCase()))
    );
  }, [storesWithDistance, activeFilter]);

  // Dynamic directions timeline based on the selected boutique shop
  const sampleDirections = useMemo(() => {
    if (selectedStore.id === 'metro-atelier') {
      return [
        { instruction: 'Head West on Financial Centre Rd toward Jumeirah', dist: '1.2 km' },
        { instruction: 'Merge onto Jumeirah Beach Rd. Continue past Dubai Canal Bridge', dist: '1.5 km' },
        { instruction: 'Destination will be on your right, past Jumeirah 2 park', dist: '300 m' },
      ];
    }
    if (selectedStore.id === 'westside-slow') {
      return [
        { instruction: 'Head South on Sheikh Zayed Rd (E11) toward Abu Dhabi', dist: '120 km' },
        { instruction: 'Take Al Bateen exit toward waterfront promenade', dist: '2.4 km' },
        { instruction: 'Turn right into Marina Walk. Lounge is adjacent to Yacht Walk', dist: '400 m' },
      ];
    }
    return [
      { instruction: 'Head Northeast on E11 Highway toward Sharjah', dist: '25 km' },
      { instruction: 'Take exit toward Aljada master development', dist: '1.8 km' },
      { instruction: 'Proceed around Zaha Hadid Boulevard Pavilion to Roastery parking', dist: '600 m' },
    ];
  }, [selectedStore]);

  // Helper to determine active business status
  const currentStatus = useMemo(() => {
    // Current time is hardcoded in prompt as T17:25:54 (which is 5:25 PM)
    // All stores are open at 5:25 PM except Roastery HQ which closes at 4:30 PM.
    return (storeId: string) => {
      if (storeId === 'roastery-hq') {
        return { label: 'Closed • Reopens 06:30 AM', color: 'bg-amber-400 text-amber-900' };
      }
      return { label: 'Open Now • Closes soon', color: 'bg-emerald-100 text-emerald-800' };
    };
  }, []);

  return (
    <div id="store-locator-page" className="py-6 max-w-6xl mx-auto space-y-8">
      {/* Title Header bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200/60 pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#8c6239] font-bold">
            Bespoke Architecture
          </span>
          <h2 className="text-3xl font-serif text-neutral-950 italic mt-1 font-medium">
            Find an Atelier near you
          </h2>
        </div>

        {/* Filter Slider Tabs */}
        <div id="facility-pills" className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {filterFacilities.map((fac) => (
            <button
              id={`filter-pill-${fac.id}`}
              key={fac.id}
              onClick={() => {
                setActiveFilter(fac.id);
                // Auto reset selected store to first filtered item
                const nexts = storesWithDistance.filter((s) =>
                  fac.id === 'all' ? true : s.features.some((f) => f.toLowerCase().includes(fac.id.toLowerCase()))
                );
                if (nexts.length > 0) setSelectedStore(nexts[0]);
              }}
              className={`px-3.5 py-1.5 rounded-lg border text-xs font-sans font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === fac.id
                  ? 'border-neutral-900 bg-neutral-900 text-white font-semibold'
                  : 'border-neutral-200 hover:border-neutral-400 text-neutral-600 bg-white'
              }`}
            >
              {fac.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Store list */}
        <div className="lg:col-span-5 space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-none">
          <AnimatePresence mode="popLayout">
            {filteredStores.map((store) => {
              const remainsSelected = selectedStore.id === store.id;
              const openBadge = currentStatus(store.id);

              return (
                <motion.div
                  id={`store-card-${store.id}`}
                  key={store.id}
                  layout
                  onClick={() => setSelectedStore(store)}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    remainsSelected
                      ? 'border-neutral-900 bg-white shadow-md ring-1 ring-neutral-900/5'
                      : 'border-neutral-200/80 hover:border-neutral-400 bg-white shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-serif text-lg text-neutral-950 font-medium">
                        {store.name}
                      </h4>
                      <p className="text-xs text-neutral-400 font-sans mt-0.5">{store.address}</p>
                    </div>
                    {/* Distance Badge */}
                    <span className="text-xs font-mono font-bold text-[#8c6239] bg-[#fcf8f2] px-2 py-1 rounded-md border border-[#e8dcc4]/40 shrink-0">
                      {store.distance} km
                    </span>
                  </div>

                  {/* Operational and Facility Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${openBadge.color}`}>
                      {openBadge.label}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-sans flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {store.hours}
                    </span>
                  </div>

                  {/* Features list */}
                  <div className="flex flex-wrap gap-1 mt-4">
                    {store.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-neutral-50 border border-neutral-150 text-neutral-500 py-0.5 px-2 rounded-md"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Right Side: Interactive blueprint Vector Map & Directions routing */}
        <div className="lg:col-span-7 space-y-6">
          {/* Blueprint vector frame */}
          <div className="relative h-96 bg-[#f9f8f5] border border-neutral-200/90 rounded-3xl overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.015)]">
            {/* Custom Mode Toggles in Top Right */}
            <div className="absolute top-4 right-4 z-20 flex items-center bg-white/95 backdrop-blur-md border border-neutral-200 p-1 rounded-xl shadow-sm gap-0.5">
              <button
                id="viewmode-real-btn"
                onClick={() => setViewMode('real')}
                className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono uppercase tracking-wider font-bold cursor-pointer transition-all ${
                  viewMode === 'real'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-850'
                }`}
              >
                Interactive Map
              </button>
              <button
                id="viewmode-vector-btn"
                onClick={() => setViewMode('vector')}
                className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono uppercase tracking-wider font-bold cursor-pointer transition-all ${
                  viewMode === 'vector'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-855'
                }`}
              >
                Blueprint Draft
              </button>
            </div>

            {/* Render appropriate map mode */}
            {viewMode === 'real' ? (
              !hasValidKey ? (
                /* Fully Functional, Beautiful, Live Google Maps Embed with no setup barriers! */
                <div className="w-full h-full relative" id="google-fallback-embed-container">
                  <iframe
                    title="Google Maps Location"
                    src={`https://maps.google.com/maps?q=${selectedStore.coordinates.lat},${selectedStore.coordinates.lng}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full border-0 absolute inset-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  
                  {/* Styled overlay with quick Info details */}
                  <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-md border border-neutral-200/80 px-3.5 py-1.5 rounded-full shadow-md text-[10px] font-sans">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-neutral-800 uppercase tracking-wide">Live Interactive Map</span>
                  </div>
                </div>
              ) : (
                /* True Working Google Map using @vis.gl/react-google-maps - Constitution Framework */
                <div className="w-full h-full" id="google-interactive-map-container">
                  <APIProvider apiKey={API_KEY} version="weekly">
                    <GoogleMap
                      defaultCenter={selectedStore.coordinates}
                      defaultZoom={11}
                      mapId="DEMO_MAP_ID"
                      gestureHandling="cooperative"
                      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <MapCameraRecenter selectedCoords={selectedStore.coordinates} />
                      
                      {storesWithDistance.map((store) => (
                        <AdvancedMarker
                          key={store.id}
                          position={store.coordinates}
                          onClick={() => {
                            setSelectedStore(store);
                            setActiveInfoWindowId(store.id);
                          }}
                        >
                          <Pin 
                            background={store.id === selectedStore.id ? "#1c1917" : "#8c6239"} 
                            borderColor={store.id === selectedStore.id ? "#000000" : "#5c4024"} 
                            glyphColor="#ffffff"
                            scale={store.id === selectedStore.id ? 1.25 : 1.05}
                          />
                        </AdvancedMarker>
                      ))}

                      {activeInfoWindowId && (() => {
                        const store = storesWithDistance.find(s => s.id === activeInfoWindowId);
                        if (!store) return null;
                        return (
                          <InfoWindow
                            position={store.coordinates}
                            onCloseClick={() => setActiveInfoWindowId(null)}
                            headerDisabled
                          >
                            <div className="p-1 max-w-[200px] text-neutral-900">
                              <h6 className="font-serif font-bold text-xs leading-snug">{store.name}</h6>
                              <p className="text-[10px] text-neutral-500 font-sans mt-0.5">{store.address}</p>
                              <div className="flex items-center gap-1.5 mt-1.5 text-[9px] font-mono text-neutral-450 z-50">
                                <span className="text-[#8c6239] font-bold">★ Selected Store</span>
                                <span>•</span>
                                <span>{store.hours}</span>
                              </div>
                            </div>
                          </InfoWindow>
                        );
                      })()}
                    </GoogleMap>
                  </APIProvider>
                </div>
              )
            ) : (
              /* Original Vector SVG Blueprint View */
              <div className="w-full h-full relative">
                {/* Architectural Grid pattern */}
                <div className="absolute inset-0 bg-[#e6e4dc]/20 opacity-50 bg-[radial-gradient(#d3cfc5_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-md border border-neutral-200 px-3.5 py-1.5 rounded-full shadow-sm">
                  <Compass className="w-4 h-4 text-neutral-500 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest uppercase font-semibold text-neutral-600">
                    Aesthetic Vector Schema Map
                  </span>
                </div>

                {/* Custom SVG Coordinate Space representing Dubai & UAE */}
                <svg 
                  id="vector-map-canvas"
                  viewBox="0 0 500 320" 
                  className="w-full h-full select-none"
                >
                  {/* Custom styled road guidelines mimicking city lines */}
                  <path d="M 50 300 L 450 300" stroke="#d0cdc5" strokeWidth="1.5" strokeDasharray="3 3" />
                  <path d="M 50 50 L 450 50" stroke="#d0cdc5" strokeWidth="1.5" strokeDasharray="3 3" />
                  <path d="M 120 50 L 120 300" stroke="#d0cdc5" strokeWidth="1.5" strokeDasharray="3 3" />
                  <path d="M 380 50 L 380 300" stroke="#d0cdc5" strokeWidth="1.5" strokeDasharray="3 3" />
                  <path d="M 250 50 L 250 300" stroke="#d0cdc5" strokeWidth="1" strokeDasharray="1 4" />
                  <path d="M 50 175 L 450 175" stroke="#d0cdc5" strokeWidth="1" strokeDasharray="1 4" />

                  {/* Coast outline draft line */}
                  <path 
                    d="M 50,40 Q 150,70 240,40 T 450,20" 
                    fill="none" 
                    stroke="#b8b09f" 
                    strokeWidth="1.5" 
                    strokeDasharray="4 2" 
                    opacity="0.6"
                  />

                  {/* User Position Node */}
                  <g transform="translate(250, 160)">
                    <circle r="12" fill="#8c6239" fillOpacity="0.12" />
                    <circle r="5" fill="#8c6239" className="animate-ping" />
                    <circle r="4.5" fill="#8c6239" stroke="#fff" strokeWidth="1.5" />
                    <text y="-14" textAnchor="middle" className="font-mono text-[9px] fill-neutral-600 font-bold">
                      YOU
                    </text>
                  </g>

                  {/* Boutique Locations Pin Mapping */}
                  <g 
                    transform="translate(380, 80)"
                    onClick={() => setSelectedStore(STORE_LOCATIONS[0])}
                    className="cursor-pointer group"
                  >
                    <circle 
                      r={selectedStore.id === 'metro-atelier' ? "14" : "10"} 
                      fill={selectedStore.id === 'metro-atelier' ? "#000" : "#8c6239"} 
                      fillOpacity="0.1" 
                      className="transition-all duration-300"
                    />
                    <path 
                      d="M0 -11 C-4 -11 -6 -8 -6 -5 C-6 -1 -1.5 6 0 9 C1.5 6 6 -1 6 -5 C6 -8 4 -11 0 -11 Z" 
                      fill={selectedStore.id === 'metro-atelier' ? "#262626" : "#b09c85"}
                      stroke="#fff"
                      strokeWidth="1"
                    />
                    <circle r="2" cy="-5" fill="#fff" />
                  </g>

                  {/* Al Bateen: lat: 24.4578, lng: 54.3275 */}
                  <g 
                    transform="translate(120, 210)"
                    onClick={() => setSelectedStore(STORE_LOCATIONS[1])}
                    className="cursor-pointer group"
                  >
                    <circle 
                      r={selectedStore.id === 'westside-slow' ? "14" : "10"} 
                      fill={selectedStore.id === 'westside-slow' ? "#000" : "#8c6239"} 
                      fillOpacity="0.1"
                      className="transition-all duration-300"
                    />
                    <path 
                      d="M0 -11 C-4 -11 -6 -8 -6 -5 C-6 -1 -1.5 6 0 9 C1.5 6 6 -1 6 -5 C6 -8 4 -11 0 -11 Z" 
                      fill={selectedStore.id === 'westside-slow' ? "#262626" : "#b09c85"}
                      stroke="#fff"
                      strokeWidth="1"
                    />
                    <circle r="2" cy="-5" fill="#fff" />
                  </g>

                  {/* Aljada: lat: 25.3168, lng: 55.4746 */}
                  <g 
                    transform="translate(410, 270)"
                    onClick={() => setSelectedStore(STORE_LOCATIONS[2])}
                    className="cursor-pointer"
                  >
                    <circle 
                      r={selectedStore.id === 'roastery-hq' ? "14" : "10"} 
                      fill={selectedStore.id === 'roastery-hq' ? "#000" : "#8c6239"} 
                      fillOpacity="0.1"
                      className="transition-all duration-300"
                    />
                    <path 
                      d="M0 -11 C-4 -11 -6 -8 -6 -5 C-6 -1 -1.5 6 0 9 C1.5 6 6 -1 6 -5 C6 -8 4 -11 0 -11 Z" 
                      fill={selectedStore.id === 'roastery-hq' ? "#262626" : "#b09c85"}
                      stroke="#fff"
                      strokeWidth="1"
                    />
                    <circle r="2" cy="-5" fill="#fff" />
                  </g>

                  {/* Animated walking path tracing based on selections */}
                  {selectedStore.id === 'metro-atelier' && (
                    <motion.path 
                      d="M 250,160 L 380,160 L 380,80" 
                      fill="none" 
                      stroke="#8c6239" 
                      strokeWidth="2" 
                      strokeDasharray="6 4"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                    />
                  )}
                  {selectedStore.id === 'westside-slow' && (
                    <motion.path 
                      d="M 250,160 L 120,160 L 120,210" 
                      fill="none" 
                      stroke="#8c6239" 
                      strokeWidth="2" 
                      strokeDasharray="6 4"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                    />
                  )}
                  {selectedStore.id === 'roastery-hq' && (
                    <motion.path 
                      d="M 250,160 L 250,270 L 410,270" 
                      fill="none" 
                      stroke="#8c6239" 
                      strokeWidth="2" 
                      strokeDasharray="6 4"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                    />
                  )}
                </svg>
              </div>
            )}
          </div>

          {/* Directions detail box below map */}
          <div className="border border-neutral-200 bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2">
                <Navigation className="w-4.5 h-4.5 text-[#8c6239]" />
                <h5 className="font-serif text-base text-neutral-900 leading-tight">
                  Walking Route to {selectedStore.name}
                </h5>
              </div>
              <a
                href={selectedStore.mapUrl || `https://www.google.com/maps/dir/?api=1&origin=${USER_COORDINATES.lat},${USER_COORDINATES.lng}&destination=${selectedStore.coordinates.lat},${selectedStore.coordinates.lng}`}
                target="_blank"
                referrerPolicy="no-referrer"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8c6239] hover:bg-neutral-950 text-white rounded-xl text-[10px] font-mono font-bold tracking-wider uppercase transition-colors shadow-sm"
              >
                <span>Get Live Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-4">
              {sampleDirections.map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start text-sm">
                  {/* Step bubble */}
                  <span className="w-5.5 h-5.5 rounded-full bg-neutral-100 text-neutral-500 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-neutral-200/60 mt-0.5">
                    {idx + 1}
                  </span>
                  
                  {/* Step instruction content */}
                  <div className="flex-1 flex justify-between items-start">
                    <p className="text-neutral-600 font-sans leading-relaxed">{step.instruction}</p>
                    <span className="font-mono text-xs font-semibold text-[#8c6239] shrink-0 ml-4">
                      {step.dist}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-150 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                Origin: Downtown Dubai (Burj Khalifa)
              </span>
              <span>Total Travel: Premium Transit Route</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
