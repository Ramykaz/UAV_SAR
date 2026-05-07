import { useMemo } from 'react'
import { Circle, Marker, Polyline, Polygon } from 'react-leaflet'
import L from 'leaflet'
import type { ActiveDetection } from '../types'

interface DroneOverlayProps {
  dronePosition: [number, number]
  activeDetections: ActiveDetection[]
  trail: Array<{ pos: [number, number]; ts: number }>
}

export default function DroneOverlay({ dronePosition, activeDetections, trail }: DroneOverlayProps) {
  const droneIcon = useMemo(
    () =>
      L.divIcon({
        className: 'drone-icon',
        html: `<div style="width:28px;height:28px;border:2px solid #00d4ff;border-radius:999px;box-shadow:0 0 12px rgba(0,212,255,.45);display:flex;align-items:center;justify-content:center;background:rgba(2,4,8,.8)">✥</div>`,
        iconSize: [28, 28],
      }),
    [],
  )

  const getDetectionIcon = (detection: ActiveDetection) =>
    L.divIcon({
      className: 'detection-icon',
      html: `<div style="border:1px solid #00d4ff;background:rgba(2,4,8,.9);color:#00d4ff;font:11px 'JetBrains Mono',monospace;padding:8px;min-width:250px;box-shadow:0 0 15px rgba(0,212,255,.25);animation:detBounce .35s ease-out"><div>┌─ PERSON DETECTED ──────────┐</div><div>│ CONF: ${detection.conf.toFixed(3)}                │</div><div>│ MODEL: ${detection.model.padEnd(16, ' ')}│</div><div>│ LAT: ${detection.latencyMs.toFixed(1)}ms                │</div><div>│ ALT: ${detection.alt}m                   │</div><div>└────────────────────────────┘</div></div>`,
      iconSize: [260, 110],
      iconAnchor: [130, 120],
    })

  const fov: [number, number][] = [
    [dronePosition[0], dronePosition[1]],
    [dronePosition[0] - 0.002, dronePosition[1] - 0.0013],
    [dronePosition[0] - 0.002, dronePosition[1] + 0.0013],
  ]

  return (
    <>
      <Polyline positions={trail.map((item) => item.pos)} pathOptions={{ color: '#00d4ff', dashArray: '6 8', weight: 2, opacity: 0.7 }} />
      <Circle center={dronePosition} radius={300} pathOptions={{ color: '#00d4ff', dashArray: '8 8', fillOpacity: 0.02 }} />
      <Polygon positions={fov} pathOptions={{ color: '#ff6b2b', fillOpacity: 0.2, weight: 1 }} />
      <Marker position={dronePosition} icon={droneIcon} />

      {activeDetections.map((detection) => (
        <Marker key={detection.id} position={[detection.lat, detection.lng]} icon={getDetectionIcon(detection)} />
      ))}
    </>
  )
}
