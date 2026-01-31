import { Station, User, QueueItem, FUEL_TYPES as SHARED_FUEL_TYPES } from '@/types';

// Simulated Database State

// Re-export for compatibility if needed, but prefer importing from types
export const FUEL_TYPES = SHARED_FUEL_TYPES;

export const STATION_STATUS = {
    OPEN: 'Open',
    CLOSED: 'Closed',
    BUSY: 'Busy',
} as const;

export const MOCK_STATIONS: Station[] = [
    {
        id: 'st-1',
        name: 'TotalEnergies Bole',
        location: { lat: 9.005401, lng: 38.763611 }, // Addis Ababa coordinates approx
        address: 'Bole Road, Addis Ababa',
        status: 'Open',
        pumps: {
            total: 8,
            available: 2
        },
        inventory: {
            [FUEL_TYPES.BENZEN]: { status: 'Available', level: 'High' },
            [FUEL_TYPES.DIESEL]: { status: 'Available', level: 'Medium' },
        },
        queueLength: 5,
        estimatedWaitTime: 15, // minutes
    },
    {
        id: 'st-2',
        name: 'NOC Kazanchis',
        location: { lat: 9.018000, lng: 38.765000 },
        address: 'Kazanchis, Addis Ababa',
        status: 'Busy',
        pumps: {
            total: 6,
            available: 0
        },
        inventory: {
            [FUEL_TYPES.BENZEN]: { status: 'Out of Stock', level: 'Empty' },
            [FUEL_TYPES.DIESEL]: { status: 'Available', level: 'Low' },
        },
        queueLength: 12,
        estimatedWaitTime: 45,
    },
    {
        id: 'st-3',
        name: 'Ola Energy Sar Bet',
        location: { lat: 8.995000, lng: 38.740000 },
        address: 'Sar Bet, Addis Ababa',
        status: 'Open',
        pumps: {
            total: 10,
            available: 6
        },
        inventory: {
            [FUEL_TYPES.BENZEN]: { status: 'Available', level: 'High' },
            [FUEL_TYPES.DIESEL]: { status: 'Available', level: 'High' },
        },
        queueLength: 1,
        estimatedWaitTime: 5,
    },
    {
        id: 'st-4',
        name: 'Yetebaberut Beherawi',
        location: { lat: 9.010000, lng: 38.750000 },
        address: 'Beherawi, Addis Ababa',
        status: 'Open',
        pumps: {
            total: 4,
            available: 1
        },
        inventory: {
            [FUEL_TYPES.BENZEN]: { status: 'Available', level: 'Low' },
            [FUEL_TYPES.DIESEL]: { status: 'Out of Stock', level: 'Empty' },
        },
        queueLength: 8,
        estimatedWaitTime: 25,
    }
];

export const MOCK_USERS: User[] = [
    { id: 'u-1', name: 'Aiman', vehicle: 'Toyota Vitz', fuelPreference: FUEL_TYPES.BENZEN },
    { id: 'u-2', name: 'Kebede', vehicle: 'Isuzu Truck', fuelPreference: FUEL_TYPES.DIESEL },
];

export const MOCK_QUEUES: QueueItem[] = [
    { id: 'q-1', userId: 'u-2', stationId: 'st-2', joinedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), status: 'Waiting' },
];
