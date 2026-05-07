import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Overview from './components/Overview'
import Results from './components/Results'
import ModelCards from './components/ModelCards'
import OptimizationCards from './components/OptimizationCards'
import PaperSection from './components/PaperSection'
import Footer from './components/Footer'

const Simulation = lazy(() => import('./components/Simulation'))

function SimulationSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8" id="simulation">
      <div className="hud-panel animate-pulse rounded-xl p-8">
        <div className="section-label mb-4 text-xs text-[var(--text-secondary)]">Loading Live Simulation...</div>
        <div className="h-[70vh] rounded-lg bg-[rgba(15,24,36,0.8)]" />
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="relative bg-[var(--bg-void)] text-[var(--text-primary)]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <Navbar />
        <Hero />
        <Overview />
        <Suspense fallback={<SimulationSkeleton />}>
          <Simulation />
        </Suspense>
        <Results />
        <ModelCards />
        <OptimizationCards />
        <PaperSection />
        <Footer />
      </motion.div>
    </div>
  )
}
