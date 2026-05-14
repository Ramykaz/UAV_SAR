import { motion } from 'framer-motion'
import ThermalCamera from './ThermalCamera'

const statusItems = ['SYSTEM ONLINE', 'JETSON ORIN NANO CONNECTED', 'WISARD DATASET LOADED']

function HacettepeLogo() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-[var(--border-dim)] bg-[var(--bg-panel)] px-3 py-2">
      {/* Simplified Hacettepe shield mark */}
      <svg width="28" height="32" viewBox="0 0 28 32" fill="none" aria-hidden="true">
        <path d="M14 1 L27 6 L27 18 C27 25 21 29.5 14 31 C7 29.5 1 25 1 18 L1 6 Z" fill="#003087" stroke="#003087" strokeWidth="0.5" />
        <path d="M14 4 L25 8.5 L25 18 C25 23.8 19.8 27.8 14 29.2 C8.2 27.8 3 23.8 3 18 L3 8.5 Z" fill="#003087" />
        <text x="14" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="serif">HÜ</text>
        <path d="M8 11 L20 11 M14 8 L14 14" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
      </svg>
      <div>
        <div className="section-label text-[9px] text-[var(--text-data)] leading-tight">HACETTEPE</div>
        <div className="mono text-[8px] text-[var(--text-secondary)] leading-tight">ÜNİVERSİTESİ</div>
      </div>
    </div>
  )
}

function BBMLogo() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-[var(--border-dim)] bg-[var(--bg-panel)] px-3 py-2">
      {/* BBM / Computer Engineering icon */}
      <svg width="28" height="32" viewBox="0 0 28 32" fill="none" aria-hidden="true">
        <rect x="3" y="6" width="22" height="20" rx="2" fill="#003087" />
        <rect x="5" y="8" width="18" height="14" rx="1" fill="#0044aa" />
        {/* Circuit traces */}
        <path d="M8 12 L12 12 M16 12 L20 12 M8 15 L10 15 L10 18 M14 15 L14 18 M18 15 L20 15" stroke="rgba(0,212,255,0.8)" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="12" cy="15" r="1.2" fill="#00d4ff" />
        <circle cx="16" cy="18" r="1.2" fill="#00ff88" />
        {/* Legs */}
        <rect x="11" y="26" width="6" height="2" rx="1" fill="#003087" />
        <rect x="9" y="27" width="10" height="1.5" rx="0.75" fill="#003087" />
      </svg>
      <div>
        <div className="section-label text-[9px] text-[var(--text-data)] leading-tight">BBM · CS</div>
        <div className="mono text-[8px] text-[var(--text-secondary)] leading-tight">COMPUTER ENG.</div>
      </div>
    </div>
  )
}

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

          {/* Institutional logos */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <HacettepeLogo />
            <BBMLogo />
          </motion.div>

          <div className="mt-6 flex flex-wrap gap-4">
            <a aria-label="View simulation" className="glow-hover section-label rounded-md border border-[var(--accent-cyan)] bg-[rgba(0,212,255,0.1)] px-5 py-3 text-xs" href="#simulation">
              VIEW DETECTION SAMPLES →
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
