// Minimal Google Maps types used by the app.
// This file provides a lightweight declaration for the `google` namespace
// so TypeScript doesn't error with "cannot find namespace 'google'".
// It intentionally keeps types as `any`/minimal shapes to avoid needing
// the full `@types/google.maps` package. If you want full typings,
// install `npm i -D @types/google.maps` and remove this file.

declare namespace google {
  namespace maps {
    const SymbolPath: any;
    const Animation: any;

    interface MapOptions {
      center?: { lat: number; lng: number };
      zoom?: number;
      styles?: any;
    }

    class Map {
      constructor(element: Element, opts?: MapOptions);
      panTo(latLng: { lat: number; lng: number }): void;
      setZoom(zoom: number): void;
    }

    class Marker {
      constructor(opts?: any);
      addListener(event: string, handler: (...args: any[]) => void): void;
      setMap(map: any | null): void;
    }
  }
}

declare global {
  interface Window {
    google?: typeof google;
  }
}

