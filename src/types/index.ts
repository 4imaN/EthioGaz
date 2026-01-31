export interface Location {
    lat: number;
    lng: number;
}

export type FuelStatus = 'Available' | 'Out of Stock';
export type FuelLevel = 'High' | 'Medium' | 'Low' | 'Empty';
export type StationStatus = 'Open' | 'Closed' | 'Busy';
export type QueueStatus = 'Waiting' | 'Serving' | 'Completed' | 'Cancelled';

export interface InventoryItem {
    status: FuelStatus;
    level: FuelLevel;
}

export interface Inventory {
    [key: string]: InventoryItem;
}

export interface PumpInfo {
    total: number;
    available: number;
}

export interface Station {
    id: string;
    name: string;
    location: Location;
    address: string;
    status: StationStatus;
    pumps: PumpInfo;
    inventory: Inventory;
    queueLength: number;
    estimatedWaitTime: number; // in minutes
    distance?: number; // Calculated field
}

export interface User {
    id: string;
    name: string;
    vehicle: string;
    fuelPreference: string;
}

export interface QueueItem {
    id: string;
    userId: string;
    user?: string; // Denormalized for display
    type?: string; // Denormalized for display
    stationId: string;
    joinedAt: string;
    status: QueueStatus;
    position?: number;
    estimatedWait?: number;
}

export const FUEL_TYPES = {
    BENZEN: 'Benzen',
    DIESEL: 'Diesel',
    KEROSENE: 'Kerosene',
} as const;
