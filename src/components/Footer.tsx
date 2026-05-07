import { Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-dim)] px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs md:flex-row">
        <div className="section-label text-[var(--text-secondary)]">Thermal SAR UAV</div>
        <div className="mono text-[var(--text-secondary)]">© 2026 · ICHORA · Hacettepe University · NVIDIA Jetson Orin Nano</div>
        <a aria-label="Source code" href="#" className="mono flex items-center gap-2 text-[var(--text-data)] hover:text-[var(--accent-cyan)]">
          <Github className="h-4 w-4" /> SOURCE CODE
        </a>
      </div>
    </footer>
  )
}
