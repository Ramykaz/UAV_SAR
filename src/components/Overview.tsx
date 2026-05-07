import { Cpu, Flame, Target } from 'lucide-react'
import { motion } from 'framer-motion'

const cards = [
  {
    icon: Flame,
    title: 'THE CHALLENGE',
    text: 'Search and rescue missions in wilderness terrain are intensely time-critical. Thermal UAVs can extend coverage rapidly, but unreliable edge inference delays target confirmation. In real deployments, latency-accuracy tradeoffs directly affect how quickly responders can act on potential survivor detections.',
    stat: 'Survival rate drops sharply in the first hours.',
  },
  {
    icon: Cpu,
    title: 'OUR APPROACH',
    text: 'We performed a systematic hardware-aware benchmark on NVIDIA Jetson Orin Nano, covering model families, optimization paths, and runtime configurations. The study isolates practical deployment thresholds for field-ready thermal detection under tight power and compute constraints.',
    stat: '278 experimental configurations evaluated.',
  },
  {
    icon: Target,
    title: 'KEY FINDING',
    text: 'TensorRT post-training quantization provides substantial acceleration while preserving reliable detection quality for operational use. The best configurations achieve high mAP50 while meeting strict real-time latency targets for UAV-assisted SAR workflows.',
    stat: 'mAP50: 0.975 — Best accuracy achieved.',
  },
]

export default function Overview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8" id="overview">
      <h2 className="section-label mb-8 text-sm text-[var(--text-secondary)]">Overview / Abstract</h2>
      <div className="grid gap-5 md:grid-cols-3">
        {cards.map((card, index) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.12 }}
            className="hud-panel glow-hover rounded-xl p-6"
          >
            <card.icon className="mb-4 h-6 w-6 text-[var(--accent-cyan)]" />
            <h3 className="section-label mb-3 text-xs text-[var(--text-data)]">{card.title}</h3>
            <p className="text-sm leading-6 text-[var(--text-secondary)]">{card.text}</p>
            <p className="mono mt-5 text-xs text-[var(--accent-green)]">{card.stat}</p>
          </motion.article>
        ))}
      </div>

      <div className="hud-panel mono mt-8 overflow-hidden rounded-md border p-3 text-xs text-[var(--text-data)]">
        <div className="ticker-track whitespace-nowrap">
          PLATFORM: NVIDIA Jetson Orin Nano · GPU: 1024-core Ampere · DATASET: WiSARD · IMAGES: 3,658 · MODELS: YOLO v5–v11, v26, RT-DETR, RF-DETR · OPTIMIZATIONS: PTQ · PRUNING · RESOLUTION SCALING · POWER PROFILING ·
          PLATFORM: NVIDIA Jetson Orin Nano · GPU: 1024-core Ampere · DATASET: WiSARD · IMAGES: 3,658 · MODELS: YOLO v5–v11, v26, RT-DETR, RF-DETR · OPTIMIZATIONS: PTQ · PRUNING · RESOLUTION SCALING · POWER PROFILING ·
        </div>
      </div>
    </section>
  )
}
