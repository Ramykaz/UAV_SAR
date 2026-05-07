import { motion } from 'framer-motion'
import ModelTable from './ModelTable'
import Charts from './Charts'

export default function Results() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8" id="results">
      <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-label mb-6 text-sm text-[var(--text-secondary)]">
        Results
      </motion.h2>
      <ModelTable />
      <div className="mt-6">
        <Charts />
      </div>
    </section>
  )
}
