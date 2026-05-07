import { useEffect, useMemo, useRef, useState } from 'react'
import { detectionEvents } from '../data/detectionEvents'
import { waypoints } from '../data/flightPath'
import type { ActiveDetection, LogEntry } from '../types'

export interface SimulationModelProfile {
  id: string
  label: string
  latencyMs: number
  confBase: number
}

const DETECTION_RADIUS = 0.003
const DETECTION_COOLDOWN_MS = 8000
const DETECTION_VISIBLE_MS = 4000

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function distance(aLat: number, aLng: number, bLat: number, bLng: number) {
  const dLat = aLat - bLat
  const dLng = aLng - bLng
  return Math.sqrt(dLat * dLat + dLng * dLng)
}

export function useDroneSimulation(selectedModel: SimulationModelProfile) {
  const [running, setRunning] = useState(false)
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 2 | 4>(1)
  const [dronePosition, setDronePosition] = useState<[number, number]>(waypoints[0])
  const [segmentIndex, setSegmentIndex] = useState(0)
  const [activeDetections, setActiveDetections] = useState<ActiveDetection[]>([])
  const [detectionCount, setDetectionCount] = useState(0)
  const [sessionSeconds, setSessionSeconds] = useState(0)
  const [logEntries, setLogEntries] = useState<LogEntry[]>([])
  const [trail, setTrail] = useState<Array<{ pos: [number, number]; ts: number }>>([])
  const [battery, setBattery] = useState(87)

  const tRef = useRef(0)
  const frameRef = useRef<number>()
  const prevFrameTimeRef = useRef<number>()
  const lastDetectionRef = useRef<Record<number, number>>({})
  const trailTickRef = useRef(0)

  const avgConfidence = useMemo(() => {
    if (detectionCount === 0) return 0.94
    const total = activeDetections.reduce((acc, entry) => acc + entry.conf, 0)
    return Number((total / activeDetections.length || 0.94).toFixed(3))
  }, [activeDetections, detectionCount])

  useEffect(() => {
    if (!running) return
    const interval = window.setInterval(() => {
      setSessionSeconds((prev) => prev + 1)
      setBattery((prev) => Math.max(10, prev - 0.03 * speedMultiplier))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [running, speedMultiplier])

  useEffect(() => {
    setActiveDetections((prev) => prev.map((item) => ({ ...item, model: selectedModel.label, latencyMs: selectedModel.latencyMs })))
  }, [selectedModel])

  useEffect(() => {
    if (!running) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      return
    }

    const step = (time: number) => {
      if (!prevFrameTimeRef.current) {
        prevFrameTimeRef.current = time
      }
      const dt = Math.min((time - prevFrameTimeRef.current) / 1000, 0.1)
      prevFrameTimeRef.current = time

      const from = waypoints[segmentIndex]
      const to = waypoints[(segmentIndex + 1) % waypoints.length]
      const segmentSpeed = 0.06 * speedMultiplier
      tRef.current += dt * segmentSpeed

      if (tRef.current >= 1) {
        tRef.current = 0
        setSegmentIndex((prev) => (prev + 1) % (waypoints.length - 1))
      }

      const lat = lerp(from[0], to[0], tRef.current)
      const lng = lerp(from[1], to[1], tRef.current)
      const now = Date.now()
      setDronePosition([lat, lng])

      trailTickRef.current += dt
      if (trailTickRef.current >= 0.5) {
        trailTickRef.current = 0
        const pos: [number, number] = [lat, lng]
        setTrail((prev) => [...prev, { pos, ts: now }].filter((item) => now - item.ts < 45000))
      }

      detectionEvents.forEach((event, idx) => {
        const dist = distance(lat, lng, event.lat, event.lng)
        const last = lastDetectionRef.current[idx] || 0
        if (dist <= DETECTION_RADIUS && now - last > DETECTION_COOLDOWN_MS) {
          lastDetectionRef.current[idx] = now
          const conf = Number((event.conf + (selectedModel.confBase - 0.94)).toFixed(3))
          const detection: ActiveDetection = {
            ...event,
            id: `${idx}-${now}`,
            createdAt: now,
            conf,
            model: selectedModel.label,
            latencyMs: selectedModel.latencyMs,
          }

          setActiveDetections((prev) => [...prev, detection])
          setDetectionCount((prev) => prev + 1)
          setLogEntries((prev) => [
            {
              id: `${now}`,
              timestamp: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
              text: `TARGET ACQUIRED — CONF ${detection.conf.toFixed(3)}`,
            },
            ...prev,
          ].slice(0, 6))

          window.setTimeout(() => {
            setActiveDetections((prev) => prev.filter((item) => item.id !== detection.id))
          }, DETECTION_VISIBLE_MS)
        }
      })

      frameRef.current = requestAnimationFrame(step)
    }

    frameRef.current = requestAnimationFrame(step)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      prevFrameTimeRef.current = undefined
    }
  }, [running, segmentIndex, selectedModel, speedMultiplier])

  useEffect(() => {
    if (!running) return
    const sweep = window.setInterval(() => {
      setLogEntries((prev) => {
        if (prev.length > 0 && prev[0].text.includes('SCANNING')) return prev
        return [
          {
            id: `scan-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
            text: Math.random() > 0.5 ? 'SCANNING SECTOR B-7' : 'NO HEAT SIGNATURE DETECTED',
          },
          ...prev,
        ].slice(0, 6)
      })
    }, 7000)

    return () => window.clearInterval(sweep)
  }, [running])

  const start = () => setRunning(true)
  const stop = () => setRunning(false)
  const reset = () => {
    setRunning(false)
    setSegmentIndex(0)
    tRef.current = 0
    setDronePosition(waypoints[0])
    setTrail([])
    setSessionSeconds(0)
    setDetectionCount(0)
    setActiveDetections([])
    setLogEntries([])
    setBattery(87)
    lastDetectionRef.current = {}
  }

  return {
    running,
    speedMultiplier,
    setSpeedMultiplier,
    dronePosition,
    activeDetections,
    detectionCount,
    sessionSeconds,
    avgConfidence,
    logEntries,
    trail,
    battery,
    start,
    stop,
    reset,
  }
}
