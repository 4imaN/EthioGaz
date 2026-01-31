"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fuel, MapPin, Gauge } from "lucide-react";

export function RoleSelector() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
            <Link href="/driver" className="block group">
                <Card className="h-full border-2 border-transparent bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader>
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Driver</CardTitle>
                        <CardDescription className="text-base">
                            Find gas stations, check queue status, and refuel.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            I need gas
                        </Button>
                    </CardContent>
                </Card>
            </Link>

            <Link href="/station" className="block group">
                <Card className="h-full border-2 border-transparent bg-card/50 hover:bg-card hover:border-accent/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader>
                        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4 text-accent-foreground group-hover:scale-110 transition-transform">
                            <Gauge className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Station Manager</CardTitle>
                        <CardDescription className="text-base">
                            Manage inventory, update queues, and serve customers.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="secondary" className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                            Manage Station
                        </Button>
                    </CardContent>
                </Card>
            </Link>
        </div>
    );
}
