import { AnimatePresence, motion } from 'framer-motion'
import type { LogEntry } from '../types'

interface DetectionLogProps {
  entries: LogEntry[]
}

export default function DetectionLog({ entries }: DetectionLogProps) {
  return (
    <div className="hud-panel mt-4 h-36 overflow-hidden rounded-md p-3">
      <div className="section-label mb-2 text-[10px] text-[var(--text-secondary)]">Activity Log</div>
      <div className="space-y-1 overflow-y-auto text-xs">
        <AnimatePresence>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mono text-[var(--text-data)]"
            >
              [{entry.timestamp}] {entry.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
