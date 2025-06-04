"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


interface MapProps {
    center: [number, number] // [longitude, latitude]
    markers?: Array<{
        position: [number, number] // [longitude, latitude]
        title: string
        role?: string
    }>
    zoom?: number
    height?: string
}

declare global {
    interface Window {
        initMap: () => void
        google: any
    }
}

const GoogleMap = ({ center, markers = [], zoom = 12, height = "400px" }: MapProps) => {
    const mapRef = useRef<HTMLDivElement>(null)
    const [mapLoaded, setMapLoaded] = useState(false)
    const [map, setMap] = useState<google.maps.Map | null>(null)

    // Load Google Maps script
    useEffect(() => {
        // Skip if already loaded
        if (window.google?.maps || document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
            setMapLoaded(true)
            return
        }

        // Define the callback function
        window.initMap = () => {
            setMapLoaded(true)
        }

        // Create script element
        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`
        script.async = true
        script.defer = true
        document.head.appendChild(script)

        return () => {
            // Clean up
            window.initMap = () => { }
            if (script.parentNode) {
                script.parentNode.removeChild(script)
            }
        }
    }, [])

    // Initialize map when script is loaded
    useEffect(() => {
        if (!mapLoaded || !mapRef.current || map) return

        // Convert longitude, latitude to Google Maps LatLng
        const centerLatLng = new window.google.maps.LatLng(center[1], center[0])

        // Create map
        const newMap = new window.google.maps.Map(mapRef.current, {
            center: centerLatLng,
            zoom,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
        })

        setMap(newMap)
    }, [mapLoaded, center, zoom, map])

    // Add markers when map is created or markers change
    useEffect(() => {
        if (!map || !markers.length) return

        // Clear existing markers
        if (map.data) {
            map.data.forEach((feature: any) => {
                map.data.remove(feature)
            })
        }

        // Add new markers
        markers.forEach((marker) => {
            const position = new window.google.maps.LatLng(marker.position[1], marker.position[0])

            const newMarker = new window.google.maps.Marker({
                position,
                map,
                title: marker.title,
                animation: window.google.maps.Animation.DROP,
                icon:
                    marker.role === "Farmer"
                        ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                        : marker.role === "Admin"
                            ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                            : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            })

            // Add info window
            const infoWindow = new window.google.maps.InfoWindow({
                content: `<div><strong>${marker.title}</strong>${marker.role ? `<br>Role: ${marker.role}` : ""}</div>`,
            })

            newMarker.addListener("click", () => {
                infoWindow.open(map, newMarker)
            })
        })

        // Add a circle for the 10km radius
        new window.google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.1,
            map,
            center: new window.google.maps.LatLng(center[1], center[0]),
            radius: 10000, // 10km in meters
        })
    }, [map, markers, center])

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>Location Map</CardTitle>
            </CardHeader>
            <CardContent>
                {!mapLoaded ? (
                    <div className="flex items-center justify-center" style={{ height }}>
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="ml-2">Loading map...</span>
                    </div>
                ) : (
                    <div ref={mapRef} style={{ height, width: "100%", borderRadius: "0.5rem" }} />
                )}
            </CardContent>
        </Card>
    )
}

export default GoogleMap
