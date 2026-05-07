import { useEffect, useRef } from 'react'

export default function ThermalCamera() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0
    let raf = 0
    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      frame += 1
      const t = frame / 60

      ctx.fillStyle = '#020a18'
      ctx.fillRect(0, 0, w, h)

      for (let i = 0; i < 100; i++) {
        const x = Math.random() * w
        const y = Math.random() * h
        const alpha = Math.random() * 0.08
        ctx.fillStyle = `rgba(255,120,50,${alpha})`
        ctx.fillRect(x, y, 1, 1)
      }

      const cx = w * 0.5 + Math.sin(t * 2) * 5
      const cy = h * 0.52 + Math.cos(t * 2.1) * 5
      const grad = ctx.createRadialGradient(cx, cy, 8, cx, cy, 45)
      grad.addColorStop(0, '#ffffff')
      grad.addColorStop(0.35, '#ffb26b')
      grad.addColorStop(0.7, '#ff6b2b')
      grad.addColorStop(1, 'rgba(255,107,43,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(cx, cy, 45, 0, Math.PI * 2)
      ctx.fill()

      const lockX = cx - 38
      const lockY = cy - 52
      const lockW = 76
      const lockH = 102
      ctx.strokeStyle = '#00d4ff'
      ctx.lineWidth = 2
      ctx.strokeRect(lockX, lockY, lockW, lockH)

      const acquire = Math.min(1, t / 1.2)
      ctx.beginPath()
      ;[
        [lockX, lockY, lockX + 18 * acquire, lockY],
        [lockX, lockY, lockX, lockY + 18 * acquire],
        [lockX + lockW, lockY, lockX + lockW - 18 * acquire, lockY],
        [lockX + lockW, lockY, lockX + lockW, lockY + 18 * acquire],
        [lockX, lockY + lockH, lockX + 18 * acquire, lockY + lockH],
        [lockX, lockY + lockH, lockX, lockY + lockH - 18 * acquire],
        [lockX + lockW, lockY + lockH, lockX + lockW - 18 * acquire, lockY + lockH],
        [lockX + lockW, lockY + lockH, lockX + lockW, lockY + lockH - 18 * acquire],
      ].forEach(([x1, y1, x2, y2]) => {
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
      })
      ctx.stroke()

      ctx.fillStyle = '#00d4ff'
      ctx.font = '12px JetBrains Mono'
      ctx.fillText('CONF: 0.967', lockX, lockY - 12)
      ctx.fillText('YOLOv5n-FP16', lockX, lockY - 28)

      ctx.strokeStyle = 'rgba(0,212,255,0.2)'
      ctx.beginPath()
      ctx.moveTo(w / 2, 0)
      ctx.lineTo(w / 2, h)
      ctx.moveTo(0, h / 2)
      ctx.lineTo(w, h / 2)
      ctx.stroke()

      const barX = w - 20
      const barY = 20
      const barH = h - 40
      const barGrad = ctx.createLinearGradient(0, barY, 0, barY + barH)
      barGrad.addColorStop(0, '#ffffff')
      barGrad.addColorStop(0.5, '#ff6b2b')
      barGrad.addColorStop(1, '#1a237e')
      ctx.fillStyle = barGrad
      ctx.fillRect(barX, barY, 8, barH)

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="hud-panel hud-active relative h-[420px] overflow-hidden rounded-lg p-2">
      <canvas aria-label="Thermal camera feed" className="h-full w-full rounded" ref={canvasRef} width={420} height={400} />
      <div className="mono absolute left-4 top-3 text-xs text-[var(--text-data)]">ALT: 47m</div>
      <div className="mono absolute right-8 top-3 text-xs text-[var(--text-data)]">SPD: 0.0 m/s</div>
    </div>
  )
}
