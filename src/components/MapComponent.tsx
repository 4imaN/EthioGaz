'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Station } from '@/types';

const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);
const Polyline = dynamic(
    () => import('react-leaflet').then((mod) => mod.Polyline),
    { ssr: false }
);

// Leaflet CSS is handled globally or via dynamic import if needed, but imports here might cause issues if they access window.
// import 'leaflet/dist/leaflet.css'; // Sometimes this is safe, but let's check. 
// Ideally import css in globals or layout if possible, or keep it if it doesn't throw.
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
    center: [number, number];
    markers: Station[];
    onMarkerClick?: (marker: Station) => void;
    userLocation?: { lat: number, lng: number };
    route?: [number, number][];
}

const MapComponent = ({ center, markers, onMarkerClick, userLocation, route }: MapComponentProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const mapRef = useRef<any>(null);

    useEffect(() => {
        setIsMounted(true);
        (async () => {
            const L = (await import('leaflet')).default;

            // Fix for default Leaflet markers
            // @ts-ignore
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });
        })();
    }, []);

    // Auto-center on user location if available
    useEffect(() => {
        if (mapRef.current && userLocation) {
            mapRef.current.flyTo([userLocation.lat, userLocation.lng], 15, { animate: true });
        }
    }, [userLocation]);

    if (!isMounted) {
        return <div className="h-full w-full bg-slate-800 animate-pulse rounded-xl" />;
    }

    // Custom icon for user
    const userIcon = typeof window !== 'undefined' ? new (require('leaflet').Icon)({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3253/3253166.png', // Placeholder car/user icon
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
        className: 'user-marker-icon'
    }) : null;

    return (
        <MapContainer
            center={center as any}
            zoom={13}
            style={{ height: '100%', width: '100%', borderRadius: '1rem', zIndex: 0 }}
            zoomControl={false}
            ref={mapRef}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {markers && markers.map((marker) => (
                <Marker
                    key={marker.id}
                    position={[marker.location.lat, marker.location.lng]}
                    eventHandlers={{
                        click: () => onMarkerClick && onMarkerClick(marker),
                    }}
                >
                    <Popup className="glass-popup">
                        <div className="text-slate-900">
                            <h3 className="font-bold">{marker.name}</h3>
                            <p>{marker.status}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {userLocation && userIcon && (
                <Marker
                    position={[userLocation.lat, userLocation.lng]}
                    icon={userIcon}
                    zIndexOffset={100}
                >
                    <Popup className="glass-popup">
                        <div className="text-slate-900 font-bold">You are here</div>
                    </Popup>
                </Marker>
            )}

            {route && route.length > 0 && (
                <Polyline
                    positions={route}
                    pathOptions={{ color: '#3b82f6', weight: 6, opacity: 0.8, lineCap: 'round', lineJoin: 'round' }}
                />
            )}
        </MapContainer>
    );
};

export default MapComponent;
