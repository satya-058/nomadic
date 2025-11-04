import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MOCK_TRAVELER_PROFILES, MOCK_DANGER_ZONES } from '../constants';
import type { DangerZone } from '../types';
import ReportDangerModal from './ReportDangerModal';
import { ExclamationTriangleIcon } from './icons';

// Use Leaflet's global object `L` provided by the CDN script in index.html
declare var L: any;

// Helper to calculate distance between two lat/lng points in meters
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Radius of the Earth in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; 
}


const Maps: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [dangerZones, setDangerZones] = useState<DangerZone[]>(MOCK_DANGER_ZONES);
    const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
    const [activeAlert, setActiveAlert] = useState<DangerZone | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null); // To hold the map instance
    const buddyLayerRef = useRef<any>(null);
    const dangerZoneLayerRef = useRef<any>(null);

    const filteredBuddies = useMemo(() => {
        if (!searchTerm) return MOCK_TRAVELER_PROFILES;
        const lowercasedSearch = searchTerm.toLowerCase();
        return MOCK_TRAVELER_PROFILES.filter(
            buddy =>
                buddy.name.toLowerCase().includes(lowercasedSearch) ||
                buddy.destination.toLowerCase().includes(lowercasedSearch)
        );
    }, [searchTerm]);

    // Initialize map
    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            const map = L.map(mapContainerRef.current).setView([20, 10], 2);
            mapRef.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18,
            }).addTo(map);

            buddyLayerRef.current = L.layerGroup().addTo(map);
            dangerZoneLayerRef.current = L.layerGroup().addTo(map);
        }
    }, []);

    // Get user's location and check for alerts
    useEffect(() => {
        if (navigator.geolocation && mapRef.current) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const userLatLng = { lat: latitude, lng: longitude };
                    setUserLocation(userLatLng);

                    // Check if inside a danger zone
                    const currentZone = dangerZones.find(zone => 
                        getDistance(userLatLng.lat, userLatLng.lng, zone.coordinates.lat, zone.coordinates.lng) < zone.radius
                    );
                    setActiveAlert(currentZone || null);
                },
                () => console.warn("Could not get user location."),
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );

            // Initial position fetch
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                const userLatLng = [latitude, longitude];
                 const userIcon = L.divIcon({
                    className: 'user-location-marker',
                    html: '<div></div>',
                    iconSize: [20, 20]
                });

                L.marker(userLatLng, { icon: userIcon }).addTo(mapRef.current)
                    .bindTooltip("Your Location")
                    .openTooltip();
                
                mapRef.current.setView(userLatLng, 13);
            });
            
            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, [dangerZones]);

    // Update buddy markers based on filter
    useEffect(() => {
        const layerGroup = buddyLayerRef.current;
        if (!layerGroup) return;
        layerGroup.clearLayers();

        filteredBuddies.forEach(buddy => {
            const buddyIcon = L.divIcon({
                className: 'buddy-map-icon',
                html: `<img src="${buddy.profilePicUrl}" alt="${buddy.name}" />`,
                iconSize: [40, 40]
            });
            L.marker([buddy.coordinates.lat, buddy.coordinates.lng], { icon: buddyIcon })
                .addTo(layerGroup).bindTooltip(buddy.name);
            L.marker([buddy.destinationCoordinates.lat, buddy.destinationCoordinates.lng])
                .addTo(layerGroup).bindTooltip(buddy.destination);
            L.polyline(
                [[buddy.coordinates.lat, buddy.coordinates.lng], [buddy.destinationCoordinates.lat, buddy.destinationCoordinates.lng]],
                { color: 'rgba(56, 189, 248, 0.7)', weight: 2, dashArray: '5, 10' }
            ).addTo(layerGroup);
        });
    }, [filteredBuddies]);

    // Update danger zone markers
    useEffect(() => {
        const layerGroup = dangerZoneLayerRef.current;
        if (!layerGroup) return;
        layerGroup.clearLayers();

        const zoneColors = {
            High: 'rgba(239, 68, 68, 0.5)',
            Medium: 'rgba(249, 115, 22, 0.5)',
            Low: 'rgba(234, 179, 8, 0.5)'
        };

        dangerZones.forEach(zone => {
            L.circle([zone.coordinates.lat, zone.coordinates.lng], {
                radius: zone.radius,
                color: zoneColors[zone.level],
                fillColor: zoneColors[zone.level],
                fillOpacity: 0.2,
                weight: 1,
            }).addTo(layerGroup)
              .bindPopup(`<b>Danger Zone: ${zone.type}</b><br>${zone.description}`);
        });
    }, [dangerZones]);
    
    const handleReportSubmit = (report: Omit<DangerZone, 'id' | 'coordinates'>) => {
        if(userLocation) {
            const newZone: DangerZone = {
                id: `user-${new Date().getTime()}`,
                coordinates: userLocation,
                radius: 100, // Default radius for user reports
                ...report
            };
            setDangerZones(prev => [...prev, newZone]);
        }
        setIsReportModalOpen(false);
    };

    return (
        <div className="h-full p-4 sm:p-8 flex flex-col">
             <div className="bg-slate-800/50 rounded-xl p-6 mb-8 text-center shadow-md">
                <h2 className="text-3xl font-bold text-white mb-2">Live Travel Map</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">See who's nearby, track destinations, and find your next adventure in real-time.</p>
            </div>
            
            <div className="relative flex-grow bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
                 {activeAlert && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-lg p-4 bg-red-800/90 border border-red-500 text-white rounded-lg shadow-lg text-center backdrop-blur-sm">
                        <p className="font-bold">Safety Alert</p>
                        <p>{`You are entering a ${activeAlert.level}-risk area: ${activeAlert.type}. Please be cautious.`}</p>
                    </div>
                )}
                
                <div className="absolute top-4 left-4 z-[1000] w-full max-w-xs">
                     <input 
                        type="text"
                        placeholder="Search locations or buddies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900/80 backdrop-blur-sm text-white border-slate-600 rounded-lg p-3 focus:ring-sky-500 focus:border-sky-500 transition placeholder-slate-400 shadow-lg"
                    />
                </div>

                 <div className="absolute bottom-4 right-4 z-[1000]">
                    <button 
                        onClick={() => setIsReportModalOpen(true)}
                        disabled={!userLocation}
                        className="bg-amber-600 hover:bg-amber-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-full shadow-lg flex items-center gap-2 transition-colors"
                        title="Report Unsafe Spot"
                    >
                        <ExclamationTriangleIcon className="w-6 h-6" />
                        <span className="hidden sm:inline">Report Unsafe Spot</span>
                    </button>
                </div>
                
                <div ref={mapContainerRef} className="w-full h-full" />

                <ReportDangerModal 
                    isOpen={isReportModalOpen}
                    onClose={() => setIsReportModalOpen(false)}
                    onSubmit={handleReportSubmit}
                />
            </div>
        </div>
    );
};

export default Maps;