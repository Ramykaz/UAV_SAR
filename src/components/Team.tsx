import { motion } from 'framer-motion'

const members = [
  { name: 'Muhammed Besir Acar', dept: 'AI Engineering · Computer Engineering' },
  { name: 'Talha Kaba', dept: 'AI Engineering · Computer Engineering' },
  { name: 'Abdulkadir Parlak', dept: 'AI Engineering · Computer Engineering' },
  { name: 'Ramadan Shemsu Hussen', dept: 'Computer Engineering' },
  { name: 'Ahmet Emre Gokpinar', dept: 'Computer Engineering' },
]

const advisor = {
  name: 'Selma Dilek',
  role: 'Member, IEEE',
  dept: 'Department of Computer Engineering',
  email: 'selma@ieee.org',
}

export default function Team() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8" id="team">
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-label mb-8 text-sm text-[var(--text-secondary)]"
      >
        Research Team
      </motion.h2>

      <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member, idx) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: idx * 0.07 }}
            className="hud-panel glow-hover rounded-xl p-5"
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-cyan)]" />
              <span className="section-label text-xs text-[var(--text-data)]">{member.name}</span>
            </div>
            <p className="mono pl-3.5 text-[10px] text-[var(--text-secondary)]">
              Hacettepe University · {member.dept}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-3"
      >
        <h3 className="section-label mb-4 text-xs text-[var(--text-secondary)]">Advisor</h3>
        <div className="hud-panel hud-active inline-flex flex-col gap-1 rounded-xl p-5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--accent-cyan)]" />
            <span className="section-label text-sm text-[var(--accent-cyan)]">{advisor.name}</span>
          </div>
          <span className="mono pl-4 text-xs text-[var(--accent-green)]">{advisor.role}</span>
          <span className="mono pl-4 text-xs text-[var(--text-secondary)]">
            {advisor.dept} · Hacettepe University
          </span>
          <a
            href={`mailto:${advisor.email}`}
            className="mono pl-4 text-xs text-[var(--text-data)] hover:text-[var(--accent-cyan)] transition-colors"
          >
            {advisor.email}
          </a>
        </div>
      </motion.div>
    </section>
  )
}
