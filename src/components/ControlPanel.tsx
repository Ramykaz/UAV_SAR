import { useMemo } from 'react'
import DetectionLog from './DetectionLog'
import type { LogEntry } from '../types'

export interface SelectorOption {
  id: string
  label: string
  fps: number
  latencyMs: number
  sizeMB: number
  confBase: number
}

interface ControlPanelProps {
  running: boolean
  battery: number
  selectedModelId: string
  options: SelectorOption[]
  onModelChange: (id: string) => void
  onStart: () => void
  onStop: () => void
  onReset: () => void
  speed: 1 | 2 | 4
  onSpeed: (speed: 1 | 2 | 4) => void
  detections: number
  sessionSeconds: number
  avgConfidence: number
  logs: LogEntry[]
  className?: string
  glitchKey: number
}

function fmtTime(seconds: number) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export default function ControlPanel({
  running,
  battery,
  selectedModelId,
  options,
  onModelChange,
  onStart,
  onStop,
  onReset,
  speed,
  onSpeed,
  detections,
  sessionSeconds,
  avgConfidence,
  logs,
  className,
  glitchKey,
}: ControlPanelProps) {
  const selected = useMemo(() => options.find((item) => item.id === selectedModelId) ?? options[0], [options, selectedModelId])

  return (
    <div className={`hud-panel h-full rounded-xl p-4 ${className ?? ''}`}>
      <div className="section-label mb-3 text-xs text-[var(--text-secondary)]">Drone Status</div>
      <div className="mono grid grid-cols-2 gap-y-2 text-xs text-[var(--text-data)]">
        <span>DRONE ID</span><span>UAV-01</span>
        <span>STATUS</span><span className="text-[var(--accent-green)]">● {running ? 'PATROLLING' : 'IDLE'}</span>
        <span>ALTITUDE</span><span>52m</span>
        <span>SPEED</span><span>4.2 m/s</span>
        <span>BATTERY</span><span>{battery.toFixed(0)}%</span>
        <span>SIGNAL</span><span>████████░░</span>
      </div>

      <div className={`mt-5 ${glitchKey % 2 === 1 ? 'animate-glitch' : ''}`}>
        <label className="section-label mb-2 block text-[10px] text-[var(--text-secondary)]" htmlFor="model-select">
          Model Selector
        </label>
        <select
          aria-label="Model selector"
          className="mono w-full rounded border border-[var(--border-dim)] bg-[var(--bg-surface)] p-2 text-xs text-[var(--text-data)]"
          id="model-select"
          value={selectedModelId}
          onChange={(event) => onModelChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>{option.label} · {option.sizeMB}MB · {option.fps} FPS</option>
          ))}
        </select>
      </div>

      <div className="hud-panel mt-4 rounded-md p-3">
        <div className="mono grid grid-cols-2 gap-y-2 text-xs text-[var(--text-data)]">
          <span>TOTAL DETECTIONS</span><span>{detections}</span>
          <span>SESSION TIME</span><span>{fmtTime(sessionSeconds)}</span>
          <span>AVG CONFIDENCE</span><span>{avgConfidence.toFixed(3)}</span>
          <span>MODEL</span><span>{selected.label}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {!running ? (
          <button aria-label="Start patrol" className="glow-hover section-label rounded border border-[var(--accent-cyan)] bg-[rgba(0,212,255,0.12)] px-3 py-2 text-[10px]" onClick={onStart}>▶ START PATROL</button>
        ) : (
          <button aria-label="Stop patrol" className="glow-hover section-label rounded border border-[var(--accent-orange)] bg-[rgba(255,107,43,0.1)] px-3 py-2 text-[10px]" onClick={onStop}>■ STOP</button>
        )}
        <button aria-label="Reset flight path" className="glow-hover section-label rounded border border-[var(--border-dim)] px-3 py-2 text-[10px]" onClick={onReset}>◉ RESET FLIGHT PATH</button>
      </div>

      <div className="mt-4">
        <div className="section-label mb-2 text-[10px] text-[var(--text-secondary)]">Drone Speed: {speed}x</div>
        <input
          aria-label="Drone speed slider"
          type="range"
          min={1}
          max={3}
          step={1}
          value={speed === 1 ? 1 : speed === 2 ? 2 : 3}
          onChange={(event) => onSpeed(event.target.value === '1' ? 1 : event.target.value === '2' ? 2 : 4)}
          className="w-full"
        />
      </div>

      <button
        aria-label="Upload thermal image disabled"
        disabled
        title="Live inference coming soon — ONNX model export in progress"
        className="section-label mt-4 w-full cursor-not-allowed rounded border border-[var(--border-dim)] px-3 py-2 text-[10px] text-[var(--text-secondary)] opacity-70"
      >
        ↑ UPLOAD THERMAL IMAGE
      </button>

      <DetectionLog entries={logs} />
    </div>
  )
}
