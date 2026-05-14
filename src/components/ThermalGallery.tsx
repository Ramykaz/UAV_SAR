import { motion } from 'framer-motion'

interface ThermalFrame {
  id: string
  label: string
  conf: number
  model: string
  latMs: number
  alt: number
  scenario: string
  hotX: number
  hotY: number
  secondaryX?: number
  secondaryY?: number
  bgTint: string
}

const frames: ThermalFrame[] = [
  {
    id: 'f1', label: 'SURVIVOR DETECTED', conf: 0.967, model: 'YOLOv5n-FP16', latMs: 7.46, alt: 42,
    scenario: 'JUNGLE RESCUE', hotX: 50, hotY: 54,
    bgTint: 'rgba(0, 40, 20, 0.6)',
  },
  {
    id: 'f2', label: 'BODY HEAT SIG', conf: 0.982, model: 'YOLO26s-FP16', latMs: 11.85, alt: 38,
    scenario: 'WILDFIRE CORRIDOR', hotX: 40, hotY: 46,
    bgTint: 'rgba(50, 10, 0, 0.6)',
  },
  {
    id: 'f3', label: 'PERSON LOCKED', conf: 0.975, model: 'RT-DETR-FP16', latMs: 29.7, alt: 55,
    scenario: 'EARTHQUAKE ZONE', hotX: 60, hotY: 58,
    bgTint: 'rgba(20, 20, 30, 0.6)',
  },
  {
    id: 'f4', label: 'MULTI-TARGET', conf: 0.944, model: 'YOLOv5n-FP16', latMs: 7.46, alt: 47,
    scenario: 'JUNGLE RESCUE', hotX: 38, hotY: 48, secondaryX: 66, secondaryY: 60,
    bgTint: 'rgba(0, 35, 15, 0.6)',
  },
  {
    id: 'f5', label: 'THERMAL POSITIVE', conf: 0.958, model: 'YOLO26s-FP16', latMs: 11.85, alt: 33,
    scenario: 'WILDFIRE CORRIDOR', hotX: 56, hotY: 50,
    bgTint: 'rgba(40, 8, 0, 0.6)',
  },
  {
    id: 'f6', label: 'SURVIVOR ACQUIRED', conf: 0.971, model: 'RT-DETR-FP16', latMs: 29.7, alt: 61,
    scenario: 'EARTHQUAKE ZONE', hotX: 48, hotY: 55,
    bgTint: 'rgba(15, 15, 28, 0.6)',
  },
]

function ThermalCard({ frame, index }: { frame: ThermalFrame; index: number }) {
  const boxLeft = `${frame.hotX - 11}%`
  const boxTop = `${frame.hotY - 17}%`

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.09 }}
      className="group relative overflow-hidden rounded-lg border border-[var(--border-dim)] cursor-default"
      style={{ aspectRatio: '4/3', background: '#020a18' }}
    >
      {/* Thermal background — gradient simulating heat map */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at ${frame.hotX}% ${frame.hotY}%,
              rgba(255,255,255,0.95) 0%,
              rgba(255,200,80,0.75) 5%,
              rgba(255,107,43,0.55) 14%,
              rgba(0,180,220,0.3) 30%,
              transparent 50%
            ),
            ${frame.secondaryX != null ? `radial-gradient(circle at ${frame.secondaryX}% ${frame.secondaryY}%, rgba(255,200,80,0.75) 0%, rgba(255,107,43,0.5) 10%, rgba(0,160,200,0.25) 25%, transparent 42%),` : ''}
            radial-gradient(circle at 20% 20%, rgba(0,30,80,0.5) 0%, transparent 55%),
            radial-gradient(circle at 85% 80%, rgba(0,20,60,0.4) 0%, transparent 45%),
            linear-gradient(135deg, #020a18 0%, #06101a 100%)
          `,
        }}
      />

      {/* Subtle noise/texture overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
          backgroundSize: '150px 150px',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 2px, rgba(0,212,255,0.04) 2px, rgba(0,212,255,0.04) 3px)',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px)',
          backgroundSize: '20% 20%',
        }}
      />

      {/* Detection bounding box */}
      <div
        className="absolute border border-[var(--accent-cyan)]"
        style={{ left: boxLeft, top: boxTop, width: '22%', height: '34%' }}
      >
        {/* Corner brackets */}
        <span className="absolute -top-px -left-px block h-2.5 w-2.5 border-t-2 border-l-2 border-[var(--accent-cyan)]" />
        <span className="absolute -top-px -right-px block h-2.5 w-2.5 border-t-2 border-r-2 border-[var(--accent-cyan)]" />
        <span className="absolute -bottom-px -left-px block h-2.5 w-2.5 border-b-2 border-l-2 border-[var(--accent-cyan)]" />
        <span className="absolute -bottom-px -right-px block h-2.5 w-2.5 border-b-2 border-r-2 border-[var(--accent-cyan)]" />
        <span
          className="mono absolute -top-4 left-0 whitespace-nowrap text-[8px] text-[var(--accent-cyan)]"
        >
          CONF: {frame.conf.toFixed(3)}
        </span>
      </div>

      {/* Second detection box */}
      {frame.secondaryX != null && frame.secondaryY != null && (
        <div
          className="absolute border border-[rgba(0,255,136,0.8)]"
          style={{
            left: `${frame.secondaryX - 10}%`,
            top: `${frame.secondaryY - 16}%`,
            width: '20%',
            height: '32%',
          }}
        >
          <span className="absolute -top-px -left-px block h-2.5 w-2.5 border-t-2 border-l-2 border-[rgba(0,255,136,0.8)]" />
          <span className="absolute -top-px -right-px block h-2.5 w-2.5 border-t-2 border-r-2 border-[rgba(0,255,136,0.8)]" />
          <span className="absolute -bottom-px -left-px block h-2.5 w-2.5 border-b-2 border-l-2 border-[rgba(0,255,136,0.8)]" />
          <span className="absolute -bottom-px -right-px block h-2.5 w-2.5 border-b-2 border-r-2 border-[rgba(0,255,136,0.8)]" />
        </div>
      )}

      {/* Top HUD */}
      <div className="absolute top-2 left-2 mono text-[8px] text-[var(--accent-orange)]">{frame.scenario}</div>
      <div className="absolute top-2 right-2 mono text-[8px] text-[var(--text-data)]">ALT: {frame.alt}m</div>

      {/* Thermal color bar */}
      <div
        className="absolute right-1.5 top-8 bottom-8 w-1.5 rounded-sm"
        style={{
          background: 'linear-gradient(to bottom, #ffffff, #ffb050, #ff6b2b, #00d4ff, #1a237e)',
        }}
      />

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-[rgba(2,4,8,0.82)] px-2 py-1.5">
        <div className="mono mb-0.5 text-[9px] font-bold text-[var(--accent-cyan)]">{frame.label}</div>
        <div className="mono flex justify-between text-[8px] text-[var(--text-secondary)]">
          <span>{frame.model}</span>
          <span className="text-[var(--accent-green)]">{frame.latMs}ms</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function ThermalGallery() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8" id="simulation">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <h2 className="section-label mb-2 text-sm text-[var(--text-secondary)]">Thermal Detection Samples</h2>
        <p className="mono text-xs text-[var(--text-secondary)]">
          Representative detections from WiSARD field evaluation · NVIDIA Jetson Orin Nano · FLIR thermal imaging
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {frames.map((frame, idx) => (
          <ThermalCard key={frame.id} frame={frame} index={idx} />
        ))}
      </div>

      <div className="hud-panel mono mt-6 overflow-hidden rounded-md border p-3 text-xs text-[var(--text-data)]">
        <div className="ticker-track whitespace-nowrap">
          DATASET: WiSARD · IMAGES: 3,658 · CLASSES: PERSON · SENSOR: FLIR THERMAL · PLATFORM: JETSON ORIN NANO · BEST mAP50: 0.975 · LATENCY RANGE: 7.46ms – 57.3ms · MODELS TESTED: 14 · CONFIGURATIONS: 278 ·&nbsp;
          DATASET: WiSARD · IMAGES: 3,658 · CLASSES: PERSON · SENSOR: FLIR THERMAL · PLATFORM: JETSON ORIN NANO · BEST mAP50: 0.975 · LATENCY RANGE: 7.46ms – 57.3ms · MODELS TESTED: 14 · CONFIGURATIONS: 278 ·
        </div>
      </div>
    </section>
  )
}
