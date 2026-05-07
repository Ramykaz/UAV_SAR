import { motion } from 'framer-motion'
import ThermalCamera from './ThermalCamera'

const statusItems = ['SYSTEM ONLINE', 'JETSON ORIN NANO CONNECTED', 'WISARD DATASET LOADED']

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center pt-20" id="top">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-5 md:px-8">
        <div className="col-span-3 flex flex-col justify-center">
          <motion.h1
            initial={{ opacity: 0, x: -24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7 }}
            className="font-display text-[clamp(3rem,8vw,7rem)] font-black leading-[0.95]"
          >
            SURVIVOR DETECTION
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="section-label mt-4 text-sm text-[var(--text-secondary)]"
          >
            Thermal UAV · Edge AI · Real-Time SAR
          </motion.p>

          <div className="mt-6 space-y-2">
            {statusItems.map((item, idx) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.3 }}
                className="mono flex items-center gap-2 text-xs text-[var(--accent-green)]"
              >
                <span className="dot-pulse text-base">●</span>
                {item}
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <a aria-label="View simulation" className="glow-hover section-label rounded-md border border-[var(--accent-cyan)] bg-[rgba(0,212,255,0.1)] px-5 py-3 text-xs" href="#simulation">
              VIEW SIMULATION →
            </a>
            <a aria-label="Read paper" className="glow-hover section-label rounded-md border border-[var(--border-dim)] px-5 py-3 text-xs" href="#paper">
              READ PAPER ↗
            </a>
          </div>

          <div className="hud-panel mono mt-8 overflow-hidden rounded-md border p-3 text-xs text-[var(--text-data)]">
            <div className="ticker-track whitespace-nowrap">
              mAP50: 0.975 · LATENCY: 11.85ms · FPS: 84 · MODELS TESTED: 14 · CONFIGURATIONS: 278 · DATASET: WiSARD · PLATFORM: NVIDIA JETSON ORIN NANO ·
              mAP50: 0.975 · LATENCY: 11.85ms · FPS: 84 · MODELS TESTED: 14 · CONFIGURATIONS: 278 · DATASET: WiSARD · PLATFORM: NVIDIA JETSON ORIN NANO ·
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="col-span-2"
        >
          <ThermalCamera />
        </motion.div>
      </div>
    </section>
  )
}
