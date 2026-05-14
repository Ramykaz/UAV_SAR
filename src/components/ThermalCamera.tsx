import { useState } from 'react'

const THERMAL_SRC =
  'https://cdn.ncbi.nlm.nih.gov/pmc/blobs/df5f/10675173/7d6645294344/sensors-23-09216-g001.jpg'

export default function ThermalCamera() {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="hud-panel hud-active relative overflow-hidden rounded-lg" style={{ aspectRatio: '4/3' }}>
      {/* Real thermal image */}
      <img
        src={THERMAL_SRC}
        alt="Thermal infrared UAV image showing survivors detected in wooded wilderness terrain"
        className={`h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        style={{ filter: 'brightness(1.05) contrast(1.1)' }}
      />

      {/* Placeholder while loading */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#020a18]">
          <div className="mono text-xs text-[var(--text-secondary)] animate-pulse">LOADING THERMAL FEED...</div>
        </div>
      )}

      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 2px, rgba(0,212,255,0.03) 2px, rgba(0,212,255,0.03) 3px)',
        }}
      />

      {/* Grid crosshair overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,212,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.4) 1px, transparent 1px)',
          backgroundSize: '50% 50%',
        }}
      />

      {/* Detection box — person 1 (left-center of image) */}
      <div
        className="pointer-events-none absolute border border-[var(--accent-cyan)]"
        style={{ left: '16%', top: '28%', width: '14%', height: '38%' }}
      >
        <span className="absolute -top-px -left-px block h-3 w-3 border-t-2 border-l-2 border-[var(--accent-cyan)]" />
        <span className="absolute -top-px -right-px block h-3 w-3 border-t-2 border-r-2 border-[var(--accent-cyan)]" />
        <span className="absolute -bottom-px -left-px block h-3 w-3 border-b-2 border-l-2 border-[var(--accent-cyan)]" />
        <span className="absolute -bottom-px -right-px block h-3 w-3 border-b-2 border-r-2 border-[var(--accent-cyan)]" />
        <span className="mono absolute -top-4 left-0 whitespace-nowrap text-[8px] text-[var(--accent-cyan)]">
          CONF: 0.967
        </span>
      </div>

      {/* Detection box — person 2 (center) */}
      <div
        className="pointer-events-none absolute border border-[var(--accent-cyan)]"
        style={{ left: '38%', top: '22%', width: '14%', height: '38%' }}
      >
        <span className="absolute -top-px -left-px block h-3 w-3 border-t-2 border-l-2 border-[var(--accent-cyan)]" />
        <span className="absolute -top-px -right-px block h-3 w-3 border-t-2 border-r-2 border-[var(--accent-cyan)]" />
        <span className="absolute -bottom-px -left-px block h-3 w-3 border-b-2 border-l-2 border-[var(--accent-cyan)]" />
        <span className="absolute -bottom-px -right-px block h-3 w-3 border-b-2 border-r-2 border-[var(--accent-cyan)]" />
        <span className="mono absolute -top-4 left-0 whitespace-nowrap text-[8px] text-[var(--accent-cyan)]">
          CONF: 0.981
        </span>
      </div>

      {/* Detection box — person 3 (right) */}
      <div
        className="pointer-events-none absolute border border-[rgba(0,255,136,0.9)]"
        style={{ left: '76%', top: '34%', width: '13%', height: '42%' }}
      >
        <span className="absolute -top-px -left-px block h-3 w-3 border-t-2 border-l-2 border-[rgba(0,255,136,0.9)]" />
        <span className="absolute -top-px -right-px block h-3 w-3 border-t-2 border-r-2 border-[rgba(0,255,136,0.9)]" />
        <span className="absolute -bottom-px -left-px block h-3 w-3 border-b-2 border-l-2 border-[rgba(0,255,136,0.9)]" />
        <span className="absolute -bottom-px -right-px block h-3 w-3 border-b-2 border-r-2 border-[rgba(0,255,136,0.9)]" />
        <span className="mono absolute -top-4 left-0 whitespace-nowrap text-[8px] text-[rgba(0,255,136,0.9)]">
          CONF: 0.943
        </span>
      </div>

      {/* Top HUD labels */}
      <div className="mono absolute left-3 top-3 rounded bg-[rgba(2,4,8,0.75)] px-1.5 py-0.5 text-[9px] text-[var(--accent-orange)]">
        FLIR THERMAL · LIVE
      </div>
      <div className="mono absolute right-3 top-3 rounded bg-[rgba(2,4,8,0.75)] px-1.5 py-0.5 text-[9px] text-[var(--text-data)]">
        ALT: 47m
      </div>

      {/* Bottom HUD */}
      <div className="mono absolute bottom-3 left-3 rounded bg-[rgba(2,4,8,0.75)] px-1.5 py-0.5 text-[9px] text-[var(--accent-green)]">
        3 SURVIVORS DETECTED
      </div>
      <div className="mono absolute bottom-3 right-3 rounded bg-[rgba(2,4,8,0.75)] px-1.5 py-0.5 text-[9px] text-[var(--text-data)]">
        YOLOv5n-FP16
      </div>

      {/* Thermal colour scale bar */}
      <div
        className="pointer-events-none absolute right-1.5 top-10 bottom-10 w-2 rounded-sm"
        style={{ background: 'linear-gradient(to bottom, #ffffff, #ffb050, #ff6b2b, #00d4ff, #1a237e)' }}
      />
    </div>
  )
}
