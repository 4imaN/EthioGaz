export interface RouteStep {
    coordinates: [number, number];
}

export interface RouteResponse {
    routes: {
        geometry: {
            coordinates: [number, number][];
        };
    }[];
}

/**
 * Fetches a driving route between two points using OSRM.
 * @param start - The starting coordinates { lat, lng }
 * @param end - The destination coordinates { lat, lng }
 * @returns A promise resolving to an array of [lat, lng] coordinates representing the route.
 */
export async function getRoute(
    start: { lat: number; lng: number },
    end: { lat: number; lng: number }
): Promise<[number, number][]> {
    try {
        // OSRM expects coordinates in "lng,lat" format
        const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`OSRM API error: ${response.statusText}`);
        }

        const data: RouteResponse = await response.json();

        if (data.routes && data.routes.length > 0) {
            // OSRM returns [lng, lat], but Leaflet needs [lat, lng]
            return data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        }

        return [];
    } catch (error) {
        console.error("Failed to fetch route:", error);
        // Fallback to straight line if API fails
        return [
            [start.lat, start.lng],
            [end.lat, end.lng]
        ];
    }
}
