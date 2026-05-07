import { useEffect, useMemo, useRef, useState } from 'react'
import { detectionEvents } from '../data/detectionEvents'
import { waypoints } from '../data/flightPath'
import type { ActiveDetection } from '../types'

type ScenarioType = 'jungle' | 'earthquake' | 'wildfire'

interface RescueSceneProps {
  dronePosition: [number, number]
  activeDetections: ActiveDetection[]
  trail: Array<{ pos: [number, number]; ts: number }>
  running: boolean
  scenario: ScenarioType
  onScenarioChange: (scenario: ScenarioType) => void
}

const scenarios: Array<{ id: ScenarioType; label: string }> = [
  { id: 'jungle', label: 'JUNGLE RESCUE' },
  { id: 'earthquake', label: 'EARTHQUAKE ZONE' },
  { id: 'wildfire', label: 'WILDFIRE CORRIDOR' },
]

const WORLD_SIZE = 1024
const VIEW_SPAN_X = 0.34
const VIEW_SPAN_Y = 0.26

const palette = {
  cold: { r: 18, g: 26, b: 94 },
  cyan: { r: 0, g: 212, b: 255 },
  warm: { r: 255, g: 107, b: 43 },
  hot: { r: 255, g: 255, b: 255 },
}

function normalizePoint([lat, lng]: [number, number], bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }) {
  const x = (lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)
  const y = 1 - (lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)
  return { x, y }
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function fract(value: number) {
  return value - Math.floor(value)
}

function hash2(x: number, y: number) {
  return fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453123)
}

function smooth(t: number) {
  return t * t * (3 - 2 * t)
}

function valueNoise(x: number, y: number) {
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const tx = smooth(x - x0)
  const ty = smooth(y - y0)

  const v00 = hash2(x0, y0)
  const v10 = hash2(x0 + 1, y0)
  const v01 = hash2(x0, y0 + 1)
  const v11 = hash2(x0 + 1, y0 + 1)

  const a = v00 + (v10 - v00) * tx
  const b = v01 + (v11 - v01) * tx
  return a + (b - a) * ty
}

function fbm(x: number, y: number, octaves: number) {
  let total = 0
  let amplitude = 0.5
  let freq = 1
  let norm = 0

  for (let i = 0; i < octaves; i++) {
    total += valueNoise(x * freq, y * freq) * amplitude
    norm += amplitude
    amplitude *= 0.5
    freq *= 2
  }
  return total / norm
}

function lerpColor(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }, t: number) {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  }
}

function thermalColor(v: number) {
  if (v < 0.33) return lerpColor(palette.cold, palette.cyan, v / 0.33)
  if (v < 0.72) return lerpColor(palette.cyan, palette.warm, (v - 0.33) / 0.39)
  return lerpColor(palette.warm, palette.hot, (v - 0.72) / 0.28)
}

function scenarioAmbient(scenario: ScenarioType) {
  if (scenario === 'jungle') return 0.14
  if (scenario === 'earthquake') return 0.2
  return 0.28
}

function getWorldValue(world: Float32Array, x: number, y: number) {
  const xx = Math.max(0, Math.min(WORLD_SIZE - 1, Math.floor(x * (WORLD_SIZE - 1))))
  const yy = Math.max(0, Math.min(WORLD_SIZE - 1, Math.floor(y * (WORLD_SIZE - 1))))
  return world[yy * WORLD_SIZE + xx]
}

export default function RescueScene({ dronePosition, activeDetections, running, scenario, onScenarioChange }: RescueSceneProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 700 })

  const worldRef = useRef<Float32Array>(new Float32Array(WORLD_SIZE * WORLD_SIZE))

  const bounds = useMemo(() => {
    const points = [...waypoints, ...detectionEvents.map((event) => [event.lat, event.lng] as [number, number])]
    const lats = points.map((point) => point[0])
    const lngs = points.map((point) => point[1])
    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    }
  }, [])

  const drone = normalizePoint(dronePosition, bounds)

  const survivors = useMemo(
    () => detectionEvents.map((entry) => ({ ...entry, point: normalizePoint([entry.lat, entry.lng], bounds) })),
    [bounds],
  )

  const screenForPoint = (point: { x: number; y: number }) => {
    const left = drone.x - VIEW_SPAN_X / 2
    const top = drone.y - VIEW_SPAN_Y / 2
    const sx = ((point.x - left) / VIEW_SPAN_X) * canvasSize.width
    const sy = ((point.y - top) / VIEW_SPAN_Y) * canvasSize.height
    return { x: sx, y: sy, visible: sx >= 0 && sx <= canvasSize.width && sy >= 0 && sy <= canvasSize.height }
  }

  const overlays = activeDetections
    .map((detection) => {
      const point = normalizePoint([detection.lat, detection.lng], bounds)
      const screen = screenForPoint(point)
      return { detection, screen }
    })
    .filter((item) => item.screen.visible)

  useEffect(() => {
    const node = wrapperRef.current
    if (!node) return

    const resize = () => {
      const rect = node.getBoundingClientRect()
      setCanvasSize({ width: Math.max(680, rect.width), height: Math.max(420, rect.height) })
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const world = new Float32Array(WORLD_SIZE * WORLD_SIZE)
    const ambient = scenarioAmbient(scenario)

    for (let y = 0; y < WORLD_SIZE; y++) {
      for (let x = 0; x < WORLD_SIZE; x++) {
        const nx = x / WORLD_SIZE
        const ny = y / WORLD_SIZE

        const terrain = fbm(nx * 5.4, ny * 5.4, 4)
        const ridge = Math.abs(0.5 - fbm(nx * 10.5 + 2.8, ny * 10.5 + 7.1, 3))
        const base = ambient + terrain * 0.12 + (0.5 - ridge) * 0.08

        world[y * WORLD_SIZE + x] = clamp01(base)
      }
    }

    const addHotspot = (cx: number, cy: number, radius: number, intensity: number) => {
      const minX = Math.max(0, Math.floor((cx - radius) * WORLD_SIZE))
      const maxX = Math.min(WORLD_SIZE - 1, Math.ceil((cx + radius) * WORLD_SIZE))
      const minY = Math.max(0, Math.floor((cy - radius) * WORLD_SIZE))
      const maxY = Math.min(WORLD_SIZE - 1, Math.ceil((cy + radius) * WORLD_SIZE))

      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          const nx = x / WORLD_SIZE
          const ny = y / WORLD_SIZE
          const dx = nx - cx
          const dy = ny - cy
          const d2 = dx * dx + dy * dy
          const gain = intensity * Math.exp(-d2 / (radius * radius * 0.28))
          const idx = y * WORLD_SIZE + x
          world[idx] = clamp01(world[idx] + gain)
        }
      }
    }

    const randomHotspots = scenario === 'wildfire' ? 35 : 20
    for (let i = 0; i < randomHotspots; i++) {
      const cx = 0.05 + hash2(i + 13, i + 97) * 0.9
      const cy = 0.07 + hash2(i + 41, i + 173) * 0.86
      const radius = scenario === 'wildfire' ? 0.035 + hash2(i + 71, i + 111) * 0.05 : 0.02 + hash2(i + 71, i + 111) * 0.03
      const intensity =
        scenario === 'wildfire'
          ? 0.22 + hash2(i + 123, i + 188) * 0.35
          : scenario === 'earthquake'
            ? 0.14 + hash2(i + 123, i + 188) * 0.18
            : 0.08 + hash2(i + 123, i + 188) * 0.12

      addHotspot(cx, cy, radius, intensity)
    }

    worldRef.current = world
  }, [scenario])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = canvasSize.width
    canvas.height = canvasSize.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const thermalW = Math.max(320, Math.floor(canvas.width * 0.45))
    const thermalH = Math.max(190, Math.floor(canvas.height * 0.45))
    const thermalCanvas = document.createElement('canvas')
    thermalCanvas.width = thermalW
    thermalCanvas.height = thermalH
    const thermalCtx = thermalCanvas.getContext('2d')
    if (!thermalCtx) return

    let raf = 0
    const start = performance.now()

    const draw = (now: number) => {
      const t = now - start
      const world = worldRef.current

      const camJitterX = (running ? Math.sin(t * 0.0043) : 0) * 0.004
      const camJitterY = (running ? Math.cos(t * 0.0039) : 0) * 0.004
      const centerX = clamp01(drone.x + camJitterX)
      const centerY = clamp01(drone.y + camJitterY)

      const left = centerX - VIEW_SPAN_X / 2
      const top = centerY - VIEW_SPAN_Y / 2

      const image = thermalCtx.createImageData(thermalW, thermalH)
      for (let y = 0; y < thermalH; y++) {
        for (let x = 0; x < thermalW; x++) {
          const wx = left + (x / thermalW) * VIEW_SPAN_X
          const wy = top + (y / thermalH) * VIEW_SPAN_Y

          const terrainValue = getWorldValue(world, wx, wy)
          const sensorNoise = (Math.sin((x + t * 0.03) * 0.11) + Math.cos((y - t * 0.025) * 0.13)) * 0.014
          let value = terrainValue + sensorNoise

          survivors.forEach((survivor, index) => {
            const dx = wx - survivor.point.x
            const dy = wy - survivor.point.y
            const d2 = dx * dx + dy * dy
            const locked = activeDetections.some((entry) => Math.abs(entry.lat - survivor.lat) < 0.0001 && Math.abs(entry.lng - survivor.lng) < 0.0001)
            const pulse = 1 + Math.sin(t * 0.007 + index) * 0.08
            const humanHeat = (locked ? 0.95 : 0.65) * Math.exp(-d2 / (0.00135 * pulse))
            value += humanHeat
          })

          const c = thermalColor(clamp01(value))
          const p = (y * thermalW + x) * 4
          image.data[p] = c.r
          image.data[p + 1] = c.g
          image.data[p + 2] = c.b
          image.data[p + 3] = 255
        }
      }

      thermalCtx.putImageData(image, 0, 0)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(thermalCanvas, 0, 0, canvas.width, canvas.height)

      const vignette = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.width * 0.18, canvas.width / 2, canvas.height / 2, canvas.width * 0.75)
      vignette.addColorStop(0, 'rgba(0,0,0,0)')
      vignette.addColorStop(1, 'rgba(0,0,0,0.45)')
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      for (let y = 0; y < canvas.height; y += 3) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      const droneX = canvas.width * 0.5
      const droneY = canvas.height * 0.4 + Math.sin(t * 0.01) * 3
      const scanRadius = Math.max(58, canvas.width * 0.08)

      ctx.strokeStyle = 'rgba(0,212,255,0.9)'
      ctx.lineWidth = 1.4
      ctx.setLineDash([6, 5])
      ctx.beginPath()
      ctx.arc(droneX, droneY, scanRadius, (t * 0.002) % (Math.PI * 2), (t * 0.002) % (Math.PI * 2) + Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.strokeStyle = 'rgba(0,212,255,0.28)'
      ctx.beginPath()
      ctx.moveTo(canvas.width / 2, 0)
      ctx.lineTo(canvas.width / 2, canvas.height)
      ctx.moveTo(0, canvas.height / 2)
      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()

      overlays.forEach((item) => {
        const p = item.screen
        const boxW = 68
        const boxH = 46

        ctx.strokeStyle = '#00d4ff'
        ctx.lineWidth = 1.5
        ctx.strokeRect(p.x - boxW / 2, p.y - boxH / 2, boxW, boxH)

        const c = 10
        ctx.beginPath()
        ctx.moveTo(p.x - boxW / 2, p.y - boxH / 2 + c)
        ctx.lineTo(p.x - boxW / 2, p.y - boxH / 2)
        ctx.lineTo(p.x - boxW / 2 + c, p.y - boxH / 2)

        ctx.moveTo(p.x + boxW / 2 - c, p.y - boxH / 2)
        ctx.lineTo(p.x + boxW / 2, p.y - boxH / 2)
        ctx.lineTo(p.x + boxW / 2, p.y - boxH / 2 + c)

        ctx.moveTo(p.x - boxW / 2, p.y + boxH / 2 - c)
        ctx.lineTo(p.x - boxW / 2, p.y + boxH / 2)
        ctx.lineTo(p.x - boxW / 2 + c, p.y + boxH / 2)

        ctx.moveTo(p.x + boxW / 2 - c, p.y + boxH / 2)
        ctx.lineTo(p.x + boxW / 2, p.y + boxH / 2)
        ctx.lineTo(p.x + boxW / 2, p.y + boxH / 2 - c)
        ctx.stroke()
      })

      const legendX = canvas.width - 34
      const legendY = 54
      const legendH = canvas.height * 0.38
      const grad = ctx.createLinearGradient(0, legendY, 0, legendY + legendH)
      grad.addColorStop(0, '#ffffff')
      grad.addColorStop(0.45, '#ff6b2b')
      grad.addColorStop(0.72, '#00d4ff')
      grad.addColorStop(1, '#1a237e')
      ctx.fillStyle = grad
      ctx.fillRect(legendX, legendY, 10, legendH)

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [activeDetections, canvasSize.height, canvasSize.width, drone.x, drone.y, overlays, running, scenario, survivors])

  return (
    <div ref={wrapperRef} className="hud-panel rescue-scene relative h-full overflow-hidden rounded-xl border border-[var(--border-dim)]">
      <div className="absolute left-3 top-3 z-20 flex flex-wrap gap-2">
        {scenarios.map((item) => (
          <button
            key={item.id}
            aria-label={`Switch to ${item.label} simulation`}
            className={`section-label rounded border px-2 py-1 text-[10px] ${scenario === item.id ? 'border-[var(--accent-cyan)] bg-[rgba(0,212,255,0.15)] text-[var(--text-data)]' : 'border-[var(--border-dim)] text-[var(--text-secondary)]'}`}
            onClick={() => onScenarioChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mono absolute right-3 top-3 z-20 rounded border border-[var(--border-dim)] bg-[rgba(2,4,8,0.84)] px-2 py-1 text-[10px] text-[var(--accent-orange)]">
        FLIR THERMAL FEED · {running ? 'LIVE' : 'PAUSED'}
      </div>

      <canvas aria-label="FLIR-style drone thermal simulation" className="absolute inset-0 h-full w-full" ref={canvasRef} />

      {overlays.map(({ detection, screen }) => (
        <div
          key={`${detection.id}-hud`}
          className="hud-panel absolute z-20 w-[250px] rounded border border-[var(--accent-cyan)] bg-[rgba(2,4,8,0.88)] p-2 mono text-[10px] text-[var(--text-data)] shadow-[0_0_15px_rgba(0,212,255,0.28)] animate-[detBounce_.35s_ease-out]"
          style={{ left: `${screen.x + 10}px`, top: `${screen.y - 92}px` }}
        >
          <div>┌─ PERSON DETECTED ──────────┐</div>
          <div>│ CONF: {detection.conf.toFixed(3)}                 │</div>
          <div>│ MODEL: {detection.model}        │</div>
          <div>│ LAT: {detection.latencyMs.toFixed(1)}ms                 │</div>
          <div>│ ALT: {detection.alt}m                    │</div>
          <div>└────────────────────────────┘</div>
        </div>
      ))}
    </div>
  )
}
