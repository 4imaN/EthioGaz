'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MOCK_STATIONS, FUEL_TYPES } from '@/services/mockData';
import { Station, QueueItem } from '@/types';
import { Fuel, AlertTriangle, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export default function StationPage() {
    // Mock: Assume we are logged in as Station 1
    const stationId = 'st-1';
    const [station, setStation] = useState<Station | undefined>(MOCK_STATIONS.find(s => s.id === stationId));
    const [queue, setQueue] = useState<QueueItem[]>([
        { id: 'q-101', user: 'Abebe (Toyota Yaris)', type: FUEL_TYPES.BENZEN, status: 'Waiting', userId: 'u-101', stationId: 'st-1', joinedAt: new Date().toISOString() },
        { id: 'q-102', user: 'Chala (FSR)', type: FUEL_TYPES.DIESEL, status: 'Waiting', userId: 'u-102', stationId: 'st-1', joinedAt: new Date().toISOString() },
        { id: 'q-103', user: 'Desta (Suzuki)', type: FUEL_TYPES.BENZEN, status: 'Waiting', userId: 'u-103', stationId: 'st-1', joinedAt: new Date().toISOString() },
        { id: 'q-104', user: 'Sara (Vitz)', type: FUEL_TYPES.BENZEN, status: 'Waiting', userId: 'u-104', stationId: 'st-1', joinedAt: new Date().toISOString() },
        { id: 'q-105', user: 'Mulugeta (Bus)', type: FUEL_TYPES.DIESEL, status: 'Waiting', userId: 'u-105', stationId: 'st-1', joinedAt: new Date().toISOString() },
    ]);

    if (!station) return <div className="p-8 text-center">Station not found. Login required.</div>;

    const toggleFuelStatus = (fuelType: string) => {
        setStation(prev => {
            if (!prev) return prev;
            const currentStatus = prev.inventory[fuelType].status;
            const newStatus = currentStatus === 'Available' ? 'Out of Stock' : 'Available';

            // Simulation: If turning off, notify users
            if (newStatus === 'Out of Stock') {
                // Ideally use a toast here
                console.warn(`WARNING: Marking ${fuelType} as Empty! System will notify queued users.`);
            }

            return {
                ...prev,
                inventory: {
                    ...prev.inventory,
                    [fuelType]: { ...prev.inventory[fuelType], status: newStatus }
                }
            };
        });
    };

    const processNextCar = () => {
        if (queue.length === 0) return;
        const [, ...rest] = queue;
        setQueue(rest);
        // In a real app, this would update the backend and notify the next user
    };

    return (
        <div className="min-h-screen p-4 md:p-8 bg-background text-foreground">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" passHref>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{station.name}</h1>
                            <p className="text-muted-foreground">Dashboard & Queue Manager</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium border border-green-500/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        System Online
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Queue Management (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        <Card className="h-full border-t-4 border-t-primary shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle className="text-xl">Current Queue</CardTitle>
                                    <CardDescription>Live waiting list sorted by arrival time</CardDescription>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-bold text-primary">{queue.length}</div>
                                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Vehicles</div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3">
                                    {queue.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed rounded-xl">
                                            <CheckCircle2 className="h-12 w-12 mb-2 opacity-20" />
                                            <p>Queue is cleared!</p>
                                        </div>
                                    ) : (
                                        queue.map((item, index) => (
                                            <div key={item.id} className={cn(
                                                "flex items-center justify-between p-4 rounded-xl border transition-all hover:bg-muted/50",
                                                index === 0 ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-card"
                                            )}>
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm",
                                                        index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                                    )}>
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{item.user}</div>
                                                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                                            <span className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px] uppercase">{item.type}</span>
                                                            <span>• {item.status}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {index === 0 && (
                                                    <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold animate-pulse border border-green-500/20">
                                                        NEXT
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/20 p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t">
                                <div>
                                    <h3 className="text-sm font-semibold">Action Required</h3>
                                    <p className="text-xs text-muted-foreground">Process the next vehicle in line</p>
                                </div>
                                <Button
                                    size="lg"
                                    onClick={processNextCar}
                                    disabled={queue.length === 0}
                                    className="w-full md:w-auto shadow-lg shadow-primary/20"
                                >
                                    Call Next Vehicle <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Right Column: Inventory & Status (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Fuel className="h-5 w-5 text-primary" /> Inventory Control
                                </CardTitle>
                                <CardDescription>Manage fuel availability</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {Object.entries(station.inventory).map(([type, info]) => (
                                    <div key={type} className="p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="font-semibold flex items-center gap-2">
                                                <div className={cn("w-2 h-2 rounded-full", info.status === 'Available' ? "bg-green-500" : "bg-red-500")} />
                                                {type}
                                            </span>
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                                info.status === 'Available' ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
                                            )}>
                                                {info.status}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Availability</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={info.status === 'Available'}
                                                    onChange={() => toggleFuelStatus(type)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-destructive/30 bg-destructive/5 overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <AlertTriangle className="h-24 w-24" />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-destructive flex items-center gap-2 text-lg">
                                    <AlertTriangle className="h-5 w-5" /> Emergency
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    If multiple pumps fail or station must close unexpectedly, trigger emergency mode to reroute users.
                                </p>
                                <Button variant="destructive" className="w-full">
                                    Trigger Emergency Reroute
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
