import { useMemo, useState } from 'react'
import { models } from '../data/models'

type SortKey = 'name' | 'sizeMB' | 'mAP50' | 'mAP50_95' | 'recall' | 'latencyMs'

export default function ModelTable() {
  const [sortKey, setSortKey] = useState<SortKey>('mAP50')
  const [sortAsc, setSortAsc] = useState(false)

  const columns: Array<{ key: SortKey; label: string }> = [
    { key: 'name', label: 'MODEL' },
    { key: 'sizeMB', label: 'SIZE' },
    { key: 'mAP50', label: 'mAP50' },
    { key: 'mAP50_95', label: 'mAP50:95' },
    { key: 'recall', label: 'RECALL' },
    { key: 'latencyMs', label: 'LATENCY' },
  ]

  const sorted = useMemo(() => {
    return [...models].sort((a, b) => {
      const left = a[sortKey]
      const right = b[sortKey]
      if (typeof left === 'string' && typeof right === 'string') {
        return sortAsc ? left.localeCompare(right) : right.localeCompare(left)
      }
      return sortAsc ? Number(left) - Number(right) : Number(right) - Number(left)
    })
  }, [sortAsc, sortKey])

  const bestWorst = useMemo(() => {
    const metrics: SortKey[] = ['sizeMB', 'mAP50', 'mAP50_95', 'recall', 'latencyMs']
    const result: Record<string, { best: number; worst: number }> = {}
    metrics.forEach((key) => {
      const values = models.map((row) => Number(row[key]))
      const asc = key === 'latencyMs' || key === 'sizeMB'
      result[key] = {
        best: asc ? Math.min(...values) : Math.max(...values),
        worst: asc ? Math.max(...values) : Math.min(...values),
      }
    })
    return result
  }, [])

  return (
    <div className="hud-panel overflow-x-auto rounded-xl p-3">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="section-label text-[10px] text-[var(--text-secondary)]">
            {columns.map((column) => (
              <th key={column.key} className="border-b border-[var(--border-dim)] px-3 py-2 text-left">
                <button
                  aria-label={`Sort by ${column.label}`}
                  className="section-label w-full cursor-pointer text-left text-[10px] text-[var(--text-secondary)] hover:text-[var(--accent-cyan)]"
                  onClick={() => {
                    if (sortKey === column.key) setSortAsc((prev) => !prev)
                    else {
                      setSortKey(column.key)
                      setSortAsc(false)
                    }
                  }}
                >
                  {column.label}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.id} className="group border-b border-[rgba(26,37,53,.4)] transition hover:bg-[rgba(0,212,255,0.08)]">
              <td className="px-3 py-3 font-display text-xs">{row.name}</td>
              {(['sizeMB', 'mAP50', 'mAP50_95', 'recall', 'latencyMs'] as const).map((key) => {
                const value = row[key]
                const isBest = Number(value) === bestWorst[key].best
                const isWorst = Number(value) === bestWorst[key].worst
                return (
                  <td
                    key={key}
                    className={`mono px-3 py-3 text-xs ${isBest ? 'text-[var(--accent-green)]' : isWorst ? 'text-[var(--accent-orange)]' : 'text-[var(--text-data)]'}`}
                  >
                    {key === 'sizeMB' ? `${value}MB` : key === 'latencyMs' ? `${value}ms` : Number(value).toFixed(3)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
