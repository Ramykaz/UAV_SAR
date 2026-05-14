import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Overview from './components/Overview'
import ThermalGallery from './components/ThermalGallery'
import Results from './components/Results'
import ModelCards from './components/ModelCards'
import OptimizationCards from './components/OptimizationCards'
import Team from './components/Team'
import PaperSection from './components/PaperSection'
import Footer from './components/Footer'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="relative bg-[var(--bg-void)] text-[var(--text-primary)]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
        <Hero />
        <Overview />
        <ThermalGallery />
        <Results />
        <ModelCards />
        <OptimizationCards />
        <Team />
        <PaperSection />
        <Footer />
      </motion.div>
    </div>
  )
}
