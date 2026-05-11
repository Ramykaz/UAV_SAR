import { useState } from 'react'

const bib = `@inproceedings{anonymous2026thermal,
  title={Optimizing Survivor Detection Models on Thermal Imagery for UAV-Assisted Search and Rescue},
  author={Anonymized},
  booktitle={ICHORA 2026},
  year={2026}
}`

export default function PaperSection() {
  const [copied, setCopied] = useState(false)

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8" id="paper">
      <h2 className="section-label mb-6 text-sm text-[var(--text-secondary)]">Paper / Citation</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="hud-panel rounded-xl p-6">
          <h3 className="font-display text-2xl">Optimizing Survivor Detection Models on Thermal Imagery for UAV-Assisted Search and Rescue</h3>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">Anonymized — ICHORA 2026</p>
          <p className="mt-5 text-sm leading-6 text-[var(--text-secondary)]">
            We benchmarked contemporary detector families on thermal SAR imagery under real edge constraints, then evaluated quantization, pruning, resolution scaling, and power-mode effects on Jetson Orin Nano. Results identify actionable deployment tiers balancing accuracy and response latency for field search operations.
          </p>
        </article>

        <article className="hud-panel rounded-xl p-6">
          <div className="mono rounded border border-[var(--border-dim)] bg-[var(--bg-surface)] p-4 text-xs text-[var(--text-data)]">
            <pre className="m-0 whitespace-pre-wrap">{bib}</pre>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              aria-label="Copy BibTeX"
              className="glow-hover section-label rounded border border-[var(--accent-cyan)] px-4 py-2 text-[10px]"
              onClick={async () => {
                await navigator.clipboard.writeText(bib)
                setCopied(true)
                setTimeout(() => setCopied(false), 1200)
              }}
            >
              {copied ? 'COPIED ✓' : 'COPY'}
            </button>
            <button
              aria-label="View paper"
              className="glow-hover section-label rounded border border-[var(--accent-cyan)] px-4 py-2 text-[10px]"
              onClick={() => window.open(atob('aHR0cHM6Ly9kcml2ZS5nb29nbGUuY29tL2ZpbGUvZC8xcmEtR3RBY2xrTG5lUDlDV3RkOWc1aXIzNGUyUXVEaFMvdmlldz91c3A9ZHJpdmVfbGluaw=='), '_blank', 'noopener,noreferrer')}
            >
              ↗ VIEW PAPER
            </button>
          </div>
        </article>
      </div>
    </section>
  )
}
