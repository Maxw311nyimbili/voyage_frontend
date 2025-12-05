'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';

// Fix for default marker icon
const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface Activity {
    name: string;
    description: string;
    time: string;
    lat: number;
    lon: number;
}

interface MapProps {
    activities: Activity[];
    center: [number, number];
    onMarkerClick?: (activity: Activity) => void;
}

export default function MapComponent({ activities, center, onMarkerClick }: MapProps) {
    const [isMounted, setIsMounted] = useState(false);
    const mapRef = useRef<any>(null);

    useEffect(() => {
        setIsMounted(true);

        return () => {
            // Cleanup on unmount
            if (mapRef.current) {
                mapRef.current = null;
            }
        };
    }, []);

    // Don't render until client-side
    if (!isMounted) {
        return (
            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                <div className="text-gray-400">Loading Map...</div>
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            <MapContainer
                ref={mapRef}
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
                scrollWheelZoom={true}
                whenReady={(map) => {
                    // Ensure map is properly initialized
                    setTimeout(() => {
                        map.target.invalidateSize();
                    }, 100);
                }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {activities.map((activity, idx) => (
                    <Marker
                        key={`marker-${activity.lat}-${activity.lon}-${idx}`}
                        position={[activity.lat, activity.lon]}
                        icon={icon}
                        eventHandlers={{
                            click: () => {
                                if (onMarkerClick) {
                                    onMarkerClick(activity);
                                }
                            },
                        }}
                    >
                        <Popup>
                            <div className="p-2">
                                <h3 className="font-bold text-sm">{activity.name}</h3>
                                <p className="text-xs text-gray-600">{activity.description}</p>
                                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
