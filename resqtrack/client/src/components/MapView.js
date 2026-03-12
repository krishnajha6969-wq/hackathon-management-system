'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Leaflet Map component with vehicle markers, incident markers, and congestion overlay
 * Dynamically imports Leaflet to avoid SSR issues
 */
export default function MapView({
    teams = [],
    incidents = [],
    congestion = [],
    center = [28.6139, 77.2090],
    zoom = 13,
    onMapClick = null,
    className = '',
    height = '100%',
}) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef({});
    const [loaded, setLoaded] = useState(false);
    const leafletRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Dynamically import Leaflet
        const loadLeaflet = async () => {
            const L = (await import('leaflet')).default;
            await import('leaflet/dist/leaflet.css');
            leafletRef.current = L;

            if (mapInstanceRef.current) return;

            // Fix default marker icons
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            });

            // Create map
            const map = L.map(mapRef.current, {
                center,
                zoom,
                zoomControl: false,
            });

            // Add dark tile layer
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap &copy; CARTO',
                maxZoom: 19,
            }).addTo(map);

            // Add zoom control to bottom right
            L.control.zoom({ position: 'bottomright' }).addTo(map);

            if (onMapClick) {
                map.on('click', (e) => onMapClick(e.latlng));
            }

            mapInstanceRef.current = map;
            setLoaded(true);
        };

        loadLeaflet();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Update team markers
    useEffect(() => {
        if (!loaded || !mapInstanceRef.current || !leafletRef.current) return;
        const L = leafletRef.current;
        const map = mapInstanceRef.current;

        // Clear existing team markers
        Object.keys(markersRef.current).forEach(key => {
            if (key.startsWith('team_')) {
                markersRef.current[key].remove();
                delete markersRef.current[key];
            }
        });

        const statusColors = {
            available: '#10b981',
            responding: '#f59e0b',
            busy: '#ef4444',
            offline: '#6b7280',
        };

        teams.forEach(team => {
            if (!team.latitude || !team.longitude) return;

            const color = statusColors[team.status] || '#6b7280';
            const icon = L.divIcon({
                html: `
          <div style="position:relative;">
            <div style="width:32px;height:32px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="0">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <div style="position:absolute;top:-8px;right:-8px;width:12px;height:12px;border-radius:50%;background:${color};border:2px solid white;${team.status === 'responding' ? 'animation:pulse 1.5s infinite;' : ''}"></div>
          </div>
        `,
                className: '',
                iconSize: [32, 32],
                iconAnchor: [16, 16],
            });

            const marker = L.marker([team.latitude, team.longitude], { icon }).addTo(map);
            marker.bindPopup(`
        <div style="font-family:system-ui;min-width:160px;">
          <h3 style="font-weight:700;font-size:14px;margin:0 0 4px;">${team.team_name}</h3>
          <p style="color:#666;font-size:12px;margin:2px 0;">Vehicle: ${team.vehicle_id}</p>
          <p style="font-size:12px;margin:2px 0;">
            Status: <span style="color:${color};font-weight:600;text-transform:capitalize;">${team.status}</span>
          </p>
          ${team.incident_title ? `<p style="font-size:12px;margin:2px 0;">Mission: ${team.incident_title}</p>` : ''}
        </div>
      `);

            markersRef.current[`team_${team.id}`] = marker;
        });
    }, [teams, loaded]);

    // Update incident markers
    useEffect(() => {
        if (!loaded || !mapInstanceRef.current || !leafletRef.current) return;
        const L = leafletRef.current;
        const map = mapInstanceRef.current;

        Object.keys(markersRef.current).forEach(key => {
            if (key.startsWith('incident_')) {
                markersRef.current[key].remove();
                delete markersRef.current[key];
            }
        });

        const severityColors = {
            critical: '#dc2626',
            high: '#f97316',
            medium: '#eab308',
            low: '#22c55e',
        };

        incidents.forEach(incident => {
            const color = severityColors[incident.severity] || '#6b7280';
            const icon = L.divIcon({
                html: `
          <div style="width:28px;height:28px;border-radius:4px;background:${color};border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;transform:rotate(45deg);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white" style="transform:rotate(-45deg);">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        `,
                className: '',
                iconSize: [28, 28],
                iconAnchor: [14, 14],
            });

            const marker = L.marker([incident.latitude, incident.longitude], { icon }).addTo(map);
            marker.bindPopup(`
        <div style="font-family:system-ui;min-width:180px;">
          <h3 style="font-weight:700;font-size:14px;margin:0 0 4px;">${incident.title}</h3>
          <p style="font-size:12px;margin:2px 0;">
            Severity: <span style="color:${color};font-weight:600;text-transform:uppercase;">${incident.severity}</span>
          </p>
          <p style="color:#666;font-size:12px;margin:2px 0;">${incident.description || 'No description'}</p>
          <p style="font-size:12px;margin:2px 0;">Status: <span style="text-transform:capitalize;">${incident.status}</span></p>
        </div>
      `);

            markersRef.current[`incident_${incident.id}`] = marker;
        });
    }, [incidents, loaded]);

    // Congestion circles
    useEffect(() => {
        if (!loaded || !mapInstanceRef.current || !leafletRef.current) return;
        const L = leafletRef.current;
        const map = mapInstanceRef.current;

        Object.keys(markersRef.current).forEach(key => {
            if (key.startsWith('congestion_')) {
                markersRef.current[key].remove();
                delete markersRef.current[key];
            }
        });

        congestion.forEach((zone, i) => {
            const color = zone.status === 'congested' ? '#ef4444' : '#f59e0b';
            const circle = L.circle([zone.latitude || zone.lat, zone.longitude || zone.lng], {
                radius: 300,
                color: color,
                fillColor: color,
                fillOpacity: 0.2,
                weight: 2,
                dashArray: '5, 5',
            }).addTo(map);

            circle.bindPopup(`
        <div style="font-family:system-ui;">
          <h3 style="font-weight:700;font-size:13px;margin:0 0 4px;">${zone.road_segment || 'Zone'}</h3>
          <p style="font-size:12px;margin:2px 0;">Vehicles: ${zone.vehicle_density || zone.density}</p>
          <p style="font-size:12px;margin:2px 0;">Avg Speed: ${zone.average_speed || zone.speed} km/h</p>
          <p style="font-size:12px;margin:2px 0;color:${color};font-weight:600;text-transform:uppercase;">${zone.status}</p>
        </div>
      `);

            markersRef.current[`congestion_${i}`] = circle;
        });
    }, [congestion, loaded]);

    return (
        <div className={`relative ${className}`} style={{ height }}>
            <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden" />
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-xl">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-slate-400">Loading map...</span>
                    </div>
                </div>
            )}
        </div>
    );
}
