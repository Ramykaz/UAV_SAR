import { useState } from 'react'
import { motion } from 'framer-motion'

interface ThermalImage {
  id: string
  src: string
  alt: string
  title: string
  scenario: string
  model: string
  mAP: string
  latMs: string
  colSpan?: boolean
}

const images: ThermalImage[] = [
  {
    id: 'g1',
    src: 'https://cdn.ncbi.nlm.nih.gov/pmc/blobs/9418/12733663/cee4bba79e52/jimaging-11-00436-g001.jpg',
    alt: 'Thermal UAV detection mosaic — mountain, coastal and wilderness SAR scenarios',
    title: 'Multi-Terrain Detection Survey',
    scenario: 'MOUNTAIN · COASTAL · WILDERNESS',
    model: 'YOLO11n-FP16',
    mAP: '0.928',
    latMs: '8.4',
    colSpan: true,
  },
  {
    id: 'g2',
    src: 'https://cdn.ncbi.nlm.nih.gov/pmc/blobs/df5f/10675173/eac6df93775c/sensors-23-09216-g015.jpg',
    alt: 'Real-time CNN person detection in wooded wilderness terrain with bounding boxes',
    title: 'Wooded Area Detection',
    scenario: 'JUNGLE RESCUE',
    model: 'YOLOv5n-FP16',
    mAP: '0.938',
    latMs: '7.46',
  },
  {
    id: 'g3',
    src: 'https://cdn.ncbi.nlm.nih.gov/pmc/blobs/9418/12733663/3351a1f7e0f7/jimaging-11-00436-g006.jpg',
    alt: 'Thermal detection across challenging mountainous wilderness terrain',
    title: 'Mountain Terrain SAR',
    scenario: 'EARTHQUAKE ZONE',
    model: 'RT-DETR-FP16',
    mAP: '0.975',
    latMs: '29.7',
  },
  {
    id: 'g4',
    src: 'https://cdn.ncbi.nlm.nih.gov/pmc/blobs/df5f/10675173/e4966720dee7/sensors-23-09216-g007.jpg',
    alt: 'Human heat signatures in wilderness, near water, and rocky terrain',
    title: 'Multi-Environment Thermal',
    scenario: 'WILDFIRE CORRIDOR',
    model: 'YOLO26s-FP16',
    mAP: '0.952',
    latMs: '11.85',
  },
  {
    id: 'g5',
    src: 'https://cdn.ncbi.nlm.nih.gov/pmc/blobs/df5f/10675173/166666134247/sensors-23-09216-g008.jpg',
    alt: 'Close-range thermal infrared signatures of survivors in various poses',
    title: 'Survivor Thermal Signatures',
    scenario: 'BODY HEAT SIG',
    model: 'YOLOv5n-FP16',
    mAP: '0.934',
    latMs: '7.46',
  },
]

function ImageCard({ img, index }: { img: ThermalImage; index: number }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.08 }}
      className={`hud-panel overflow-hidden rounded-xl border border-[var(--border-dim)] ${img.colSpan ? 'md:col-span-2' : ''}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#020a18]" style={{ aspectRatio: img.colSpan ? '21/9' : '4/3' }}>
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="mono text-[10px] text-[var(--text-secondary)] animate-pulse">LOADING...</div>
          </div>
        )}
        <img
          src={img.src}
          alt={img.alt}
          className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          style={{ filter: 'brightness(1.02) contrast(1.08)' }}
        />
        {/* Scanline overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent 0, transparent 2px, rgba(0,212,255,0.025) 2px, rgba(0,212,255,0.025) 3px)',
          }}
        />
        {/* Scenario badge */}
        <div className="mono absolute left-2 top-2 rounded bg-[rgba(2,4,8,0.82)] px-2 py-0.5 text-[9px] text-[var(--accent-orange)]">
          {img.scenario}
        </div>
      </div>

      {/* Caption bar */}
      <figcaption className="flex items-center justify-between gap-3 px-3 py-2.5">
        <div className="min-w-0">
          <div className="section-label truncate text-[10px] text-[var(--text-data)]">{img.title}</div>
          <div className="mono mt-0.5 text-[9px] text-[var(--text-secondary)]">{img.model}</div>
        </div>
        <div className="mono flex shrink-0 flex-col items-end gap-0.5 text-[9px]">
          <span className="text-[var(--accent-green)]">mAP50 {img.mAP}</span>
          <span className="text-[var(--text-secondary)]">{img.latMs}ms</span>
        </div>
      </figcaption>
    </motion.figure>
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
          Real thermal infrared UAV imagery · WiSARD-class field evaluation · NVIDIA Jetson Orin Nano
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {images.map((img, idx) => (
          <ImageCard key={img.id} img={img} index={idx} />
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
