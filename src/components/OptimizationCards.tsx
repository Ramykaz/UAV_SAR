import { Battery, Bolt, Scissors, Scaling } from 'lucide-react'

const cards = [
  { icon: Bolt, title: 'TensorRT PTQ', result: '2× latency reduction, <2.1pp accuracy loss' },
  { icon: Scaling, title: 'Input Resolution', result: '320px sweet spot preserves >87% mAP50' },
  { icon: Scissors, title: 'Unstructured Pruning', result: 'Effective to 30% sparsity — no latency gain without sparse HW' },
  { icon: Battery, title: 'Power Mode Scaling', result: '7W = 2.4× more energy efficient than MAXN' },
]

export default function OptimizationCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <h2 className="section-label mb-6 text-sm text-[var(--text-secondary)]">Optimization Breakdown</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {cards.map((card) => (
          <article key={card.title} className="hud-panel min-w-[260px] flex-1 rounded-xl p-4">
            <card.icon className="mb-3 h-6 w-6 text-[var(--accent-cyan)]" />
            <h3 className="font-display text-lg">{card.title}</h3>
            <p className="mono mt-3 text-xs text-[var(--text-data)]">{card.result}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
