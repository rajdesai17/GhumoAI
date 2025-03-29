import { LatLng } from 'leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Add type declaration for leaflet-routing-machine
declare module 'leaflet' {
  namespace Routing {
    interface RoutingOptions {
      waypoints: LatLng[];
      routeWhileDragging?: boolean;
      showAlternatives?: boolean;
      fitSelectedRoutes?: boolean;
      lineOptions?: {
        styles: { color: string; weight: number }[];
      };
      createMarker?: () => null;
      addWaypoints?: boolean;
      draggableWaypoints?: boolean;
      show?: boolean;
    }

    interface Route {
      summary: {
        totalDistance: number;
        totalTime: number;
      };
    }

    interface RoutesFoundEvent {
      routes: Route[];
    }

    interface RoutingErrorEvent {
      error: any;
    }

    class Routing extends L.Control {
      constructor(options: RoutingOptions);
      on(type: 'routesfound', handler: (e: RoutesFoundEvent) => void): this;
      on(type: 'routingerror', handler: (e: RoutingErrorEvent) => void): this;
      addTo(map: L.Map): this;
    }
  }
}

export function getGoogleMapsDirectionsUrl(destination: [number, number], destinationName: string): string {
  try {
    const encodedDestination = encodeURIComponent(destinationName);
    return `https://www.google.com/maps/dir/?api=1&origin=current+location&destination=${destination[0]},${destination[1]}&destination_name=${encodedDestination}&travelmode=driving`;
  } catch (error) {
    console.error('Error generating Google Maps URL:', error);
    throw new Error('Failed to generate directions URL');
  }
}

export function openGoogleMapsDirections(destination: [number, number], destinationName: string) {
  try {
    const url = getGoogleMapsDirectionsUrl(destination, destinationName);
    window.open(url, '_blank');
  } catch (error) {
    console.error('Error opening Google Maps:', error);
    throw new Error('Failed to open Google Maps');
  }
}

export function createRouteLayer(
  map: L.Map,
  start: LatLng,
  end: LatLng,
  onRouteFound?: (distance: number, duration: number) => void
): L.Routing.Routing {
  try {
    const routingControl = new L.Routing.Routing({
      waypoints: [start, end],
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: '#3b82f6', weight: 4 }]
      },
      createMarker: () => null,
      addWaypoints: false,
      draggableWaypoints: false,
      show: false, // Hide the routing control panel
    });

    routingControl.on('routesfound', (e: L.Routing.RoutesFoundEvent) => {
      const route = e.routes[0];
      if (route && onRouteFound) {
        onRouteFound(route.summary.totalDistance, route.summary.totalTime);
      }
    });

    routingControl.on('routingerror', (e: L.Routing.RoutingErrorEvent) => {
      console.error('Routing error:', e);
      throw new Error('Failed to find route');
    });

    routingControl.addTo(map);
    return routingControl;
  } catch (error) {
    console.error('Error creating route layer:', error);
    throw new Error('Failed to create route');
  }
}

export function removeRouteLayer(map: L.Map, routingControl: L.Routing.Routing) {
  try {
    map.removeControl(routingControl);
  } catch (error) {
    console.error('Error removing route layer:', error);
  }
} 