import { useEffect, useState } from 'react'

const links = ['OVERVIEW', 'SIMULATION', 'RESULTS', 'MODELS', 'PAPER']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 z-50 w-full border-b transition-all ${scrolled ? 'border-[var(--border-dim)] bg-[rgba(2,4,8,0.92)] backdrop-blur-xl' : 'border-transparent bg-[rgba(2,4,8,0.35)] backdrop-blur-md'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <div className="section-label text-xs text-[var(--text-secondary)]">UAV SAR HUD</div>
        <ul className="hidden items-center gap-6 text-xs font-bold text-[var(--text-secondary)] md:flex">
          {links.map((item) => (
            <li key={item}>
              <a aria-label={`Go to ${item} section`} className="transition hover:text-[var(--accent-cyan)]" href={`#${item.toLowerCase()}`}>
                {item}
              </a>
            </li>
          ))}
        </ul>
        <div className="mono flex items-center gap-2 text-xs text-[var(--accent-orange)]">
          <span className="dot-pulse h-2 w-2 rounded-full bg-red-500" />
          LIVE DEMO
        </div>
      </div>
    </nav>
  )
}
