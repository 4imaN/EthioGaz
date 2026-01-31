'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

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

// Leaflet CSS is handled globally or via dynamic import if needed, but imports here might cause issues if they access window.
// import 'leaflet/dist/leaflet.css'; // Sometimes this is safe, but let's check. 
// Ideally import css in globals or layout if possible, or keep it if it doesn't throw.
import 'leaflet/dist/leaflet.css';

// Remove top-level L import
// import L from 'leaflet'; 

// Remove top-level DefaultIcon definition

// We need to apply this fix only on client side
interface MapComponentProps {
    center: [number, number];
    markers: any[]; // Changed to any[] temporarily to fix circular dependency or can import Station
    onMarkerClick?: (marker: any) => void;
}

import { Station } from '@/types';

const MapComponent = ({ center, markers, onMarkerClick }: { center: [number, number], markers: Station[], onMarkerClick?: (marker: Station) => void }) => {
    const [isMounted, setIsMounted] = useState(false);

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

    if (!isMounted) {
        return <div className="h-full w-full bg-slate-800 animate-pulse rounded-xl" />;
    }

    return (
        <MapContainer
            center={center as any} // react-leaflet types can be finicky
            zoom={13}
            style={{ height: '100%', width: '100%', borderRadius: '1rem', zIndex: 0 }}
            zoomControl={false}
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
        </MapContainer>
    );
};

export default MapComponent;
