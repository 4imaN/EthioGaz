'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_STATIONS } from '@/services/mockData';
import { Station, QueueItem } from '@/types';
import { getDistance } from 'geolib';
import MapComponent from '@/components/MapComponent';
import { Fuel, MapPin, Clock, Users, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function DriverPage() {
    const [userLocation, setUserLocation] = useState({ lat: 9.02, lng: 38.74 }); // Mock user location
    const [stations, setStations] = useState<Station[]>([]);
    const [activeQueue, setActiveQueue] = useState<QueueItem | null>(null);

    useEffect(() => {
        // Simulate fetching and sorting stations
        const sortedStations = MOCK_STATIONS.map(station => {
            const distance = getDistance(userLocation, station.location);
            return { ...station, distance }; // distance in meters
        }).sort((a, b) => (a.distance || 0) - (b.distance || 0));

        setStations(sortedStations);
    }, [userLocation]);

    const handleJoinQueue = (stationId: string) => {
        setActiveQueue({
            id: `q-${Date.now()}`,
            stationId,
            userId: 'u-1', // active user
            position: 3, // Mock position
            estimatedWait: 15,
            joinedAt: new Date().toISOString(),
            status: 'Waiting'
        });
    };

    const handleLeaveQueue = () => {
        setActiveQueue(null);
    };

    return (
        <div className="flex flex-col h-screen md:flex-row overflow-hidden bg-background text-foreground">
            {/* Sidebar / List View */}
            <div className="w-full h-1/2 md:h-full md:w-1/3 min-w-[350px] flex flex-col border-r bg-card/50 backdrop-blur-sm z-10 shadow-lg md:rounded-r-xl overflow-hidden">
                <div className="p-4 border-b bg-card/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-2 mb-4">
                        <Link href="/" passHref>
                            <Button variant="ghost" size="sm" className="gap-1 pl-2">
                                <ArrowLeft className="h-4 w-4" /> Back
                            </Button>
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground">
                        Nearby Stations
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Found {stations.length} stations near you
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {activeQueue && (
                        <Card className="border-primary/50 bg-primary/10 animate-in slide-in-from-left-2">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-primary text-base flex justify-between items-center">
                                    <span>Active Queue</span>
                                    <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 rounded-full bg-background/50">
                                        Waiting
                                    </span>
                                </CardTitle>
                                <CardDescription>
                                    At <span className="font-semibold text-foreground">{stations.find(s => s.id === activeQueue.stationId)?.name}</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">#{activeQueue.position} in line</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>~{activeQueue.estimatedWait} min</span>
                                    </div>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="w-full"
                                    onClick={handleLeaveQueue}
                                >
                                    Leave Queue
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <div className="space-y-3">
                        {stations.map(station => (
                            <Card key={station.id} className="group hover:border-primary/50 transition-colors">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg leading-none">{station.name}</h3>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            station.status === 'Open' ? 'bg-green-500/10 text-green-500' :
                                                station.status === 'Busy' ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'
                                        )}>
                                            {station.status}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                                        <div className="flex items-center gap-1">
                                            <MapPin size={12} /> {((station.distance || 0) / 1000).toFixed(1)} km
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users size={12} /> {station.queueLength} cars
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {Object.entries(station.inventory).map(([type, info]) => (
                                            <div key={type} className={cn(
                                                "flex items-center gap-1 px-2 py-1 rounded text-xs border font-medium",
                                                info.status === 'Available'
                                                    ? 'border-green-500/20 text-green-600 dark:text-green-400 bg-green-500/5'
                                                    : 'border-red-500/20 text-red-600 dark:text-red-400 bg-red-500/5'
                                            )}>
                                                <Fuel size={10} /> {type}
                                            </div>
                                        ))}
                                    </div>

                                    {!activeQueue ? (
                                        <Button
                                            className="w-full"
                                            disabled={station.status === 'Closed'}
                                            onClick={() => handleJoinQueue(station.id)}
                                        >
                                            Join Queue
                                        </Button>
                                    ) : (
                                        <Button disabled variant="outline" className="w-full opacity-50">
                                            Already in Queue
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Map View */}
            <div className="relative flex-1 bg-muted/20 h-1/2 md:h-full">
                {/* Map Container */}
                <div className="w-full h-full">
                    <MapComponent
                        center={[userLocation.lat, userLocation.lng]}
                        markers={stations}
                    />
                </div>

                {/* User Location Overlay (Simulated) */}
                <Card className="absolute top-4 right-4 z-[400] bg-background/90 backdrop-blur-sm border-0 shadow-md">
                    <CardContent className="p-2">
                        <span className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                            </span>
                            Simulated GPS
                        </span>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
