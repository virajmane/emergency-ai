"use client"

import { useEffect, useRef } from "react"

interface EmergencyMapProps {
  userLocation: { latitude: number; longitude: number }
  services: Array<{
    id: string
    name: string
    address: string
    latitude?: number
    longitude?: number
  }>
}

export default function EmergencyMap({ userLocation, services }: EmergencyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This would integrate with a mapping service like Google Maps or Mapbox
    // For demo purposes, showing a placeholder
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div class="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
          <div class="text-center">
            <p class="text-gray-600">Interactive Map</p>
            <p class="text-sm text-gray-500">User: ${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}</p>
            <p class="text-sm text-gray-500">${services.length} emergency services nearby</p>
          </div>
        </div>
      `
    }
  }, [userLocation, services])

  return <div ref={mapRef} className="w-full" />
}
