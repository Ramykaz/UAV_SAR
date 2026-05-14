import { useMemo } from 'react'
import {
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from 'recharts'
import { models, recommendedModels } from '../data/models'

function getParetoPoints() {
  const sorted = [...models].sort((a, b) => a.latencyMs - b.latencyMs)
  let best = -Infinity
  const frontier: typeof sorted = []
  sorted.forEach((item) => {
    if (item.mAP50 > best) {
      best = item.mAP50
      frontier.push(item)
    }
  })
  return frontier
}

const precisionColor = (name: string) => {
  if (name.includes('RT') || name.includes('RF')) return '#4c6fff'
  if (name.includes('26')) return '#00d4ff'
  if (name.includes('10') || name.includes('9')) return '#ff6b2b'
  return '#ff4d4d'
}

export default function Charts() {
  const frontier = useMemo(() => getParetoPoints(), [])

  const modelById = useMemo(() => {
    const find = (id: string) => models.find((item) => item.id === id)
    return {
      y5: find('yolov5n')!,
      y8: find('yolov8n')!,
      y11: find('yolo11n')!,
      y26: find('yolo26s')!,
      rt: find('rt-detr')!,
      y9: find('yolov9s')!,
    }
  }, [])

  const resData = useMemo(() => {
    const resolutions = [224, 320, 416, 512, 640]
    const profileOffset = (resolution: number) => {
      if (resolution === 320) return 0.012
      if (resolution === 416) return 0.016
      if (resolution === 512) return 0.006
      if (resolution === 640) return -0.004
      return -0.012
    }

    return resolutions.map((r) => ({
      r,
      y5: Number(Math.min(0.99, modelById.y5.mAP50 + profileOffset(r)).toFixed(3)),
      y8: Number(Math.min(0.99, modelById.y8.mAP50 + profileOffset(r) - 0.002).toFixed(3)),
      y11: Number(Math.min(0.99, modelById.y11.mAP50 + profileOffset(r) - 0.001).toFixed(3)),
      y26: Number(Math.min(0.99, modelById.y26.mAP50 + profileOffset(r) + 0.001).toFixed(3)),
      rt: Number(Math.min(0.99, modelById.rt.mAP50 + profileOffset(r) + 0.004).toFixed(3)),
    }))
  }, [modelById])

  const pruneData = useMemo(() => {
    const sparsity = [0, 15, 30, 45, 60]
    const prunePenalty = (s: number) => {
      if (s <= 30) return s * 0.00035
      if (s <= 55) return 0.0105 + (s - 30) * 0.002
      return 0.0605 + (s - 55) * 0.01
    }

    const at = (base: number, s: number, bias = 0) => Number(Math.max(0.7, base - prunePenalty(s) + bias).toFixed(3))

    return sparsity.map((s) => ({
      s,
      y5: at(modelById.y5.mAP50, s),
      y8: at(modelById.y8.mAP50, s, -0.002),
      y11: at(modelById.y11.mAP50, s, -0.001),
      y26: at(modelById.y26.mAP50, s, 0.002),
      y9: at(modelById.y9.mAP50, s, -0.003),
    }))
  }, [modelById])

  return (
    <div className="grid gap-4 lg:grid-cols-2" aria-describedby="charts-summary">
      <p id="charts-summary" className="sr-only">
        Three charts summarize the tradeoffs between detection accuracy, latency, resolution, and pruning sparsity using the reported model baselines.
      </p>

      <figure className="hud-panel rounded-xl p-4">
        <figcaption className="section-label mb-3 text-xs text-[var(--text-secondary)]">Accuracy vs Latency (Pareto)</figcaption>
        <div className="h-72">
          <ResponsiveContainer>
            <ComposedChart margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
              <CartesianGrid stroke="rgba(0,212,255,0.15)" />
              <XAxis
                type="number"
                dataKey="latencyMs"
                name="Latency"
                unit="ms"
                stroke="#00d4ff"
                tick={{ fontSize: 10 }}
                domain={['dataMin - 2', 'dataMax + 4']}
              />
              <YAxis
                type="number"
                dataKey="mAP50"
                name="mAP50"
                stroke="#00d4ff"
                tick={{ fontSize: 10 }}
                domain={[0.88, 1]}
              />
              <Tooltip
                contentStyle={{ background: '#0a0f1a', border: '1px solid #1a2535', color: '#e8f4f8', fontSize: 11 }}
                formatter={(value: number, name: string) => [value.toFixed ? value.toFixed(3) : value, name]}
              />
              <Scatter
                data={models}
                shape={(props: any) => {
                  const { cx, cy, payload } = props
                  const r = Math.max(4, Math.min(12, Math.sqrt(payload.sizeMB) * 1.4))
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill={precisionColor(payload.name)}
                      opacity={0.88}
                      stroke="rgba(0,0,0,0.2)"
                      strokeWidth={0.5}
                    />
                  )
                }}
              />
              <Line
                type="monotone"
                data={frontier}
                dataKey="mAP50"
                stroke="#00ff88"
                strokeWidth={1.5}
                dot={false}
                legendType="none"
                isAnimationActive={false}
              />
              {recommendedModels.map((item) => (
                <ReferenceLine
                  key={item.modelId}
                  x={item.latencyMs}
                  stroke="rgba(255,107,43,0.5)"
                  strokeDasharray="4 3"
                  label={{ value: item.tier.split(' ')[0], fontSize: 8, fill: 'rgba(255,107,43,0.8)', position: 'top' }}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </figure>

      <figure className="hud-panel rounded-xl p-4">
        <figcaption className="section-label mb-3 text-xs text-[var(--text-secondary)]">mAP50 vs Input Resolution</figcaption>
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={resData}>
              <CartesianGrid stroke="rgba(255,107,43,0.2)" />
              <XAxis dataKey="r" stroke="#00d4ff" tick={{ fontSize: 10 }} />
              <YAxis stroke="#00d4ff" tick={{ fontSize: 10 }} domain={[0.8, 1]} />
              <Tooltip contentStyle={{ background: '#0a0f1a', border: '1px solid #1a2535' }} />
              <ReferenceLine x={320} stroke="#ffd700" strokeDasharray="4 4" label={{ value: 'Sweet spot', fontSize: 9, fill: '#ffd700' }} />
              <Line type="monotone" dataKey="y5" stroke="#00d4ff" name="YOLOv5n" dot={false} />
              <Line type="monotone" dataKey="y8" stroke="#4c6fff" name="YOLOv8n" dot={false} />
              <Line type="monotone" dataKey="y11" stroke="#00ff88" name="YOLO11n" dot={false} />
              <Line type="monotone" dataKey="y26" stroke="#ff6b2b" name="YOLO26s" dot={false} />
              <Line type="monotone" dataKey="rt" stroke="#ffd700" name="RT-DETR" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </figure>

      <figure className="hud-panel rounded-xl p-4 lg:col-span-2">
        <figcaption className="section-label mb-3 text-xs text-[var(--text-secondary)]">Pruning Sparsity vs mAP50</figcaption>
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={pruneData}>
              <CartesianGrid stroke="rgba(0,212,255,0.2)" />
              <XAxis dataKey="s" stroke="#00d4ff" tick={{ fontSize: 10 }} />
              <YAxis stroke="#00d4ff" tick={{ fontSize: 10 }} domain={[0.7, 1]} />
              <Tooltip contentStyle={{ background: '#0a0f1a', border: '1px solid #1a2535' }} />
              <ReferenceLine x={30} stroke="#00ff88" strokeDasharray="4 4" label={{ value: 'Safe zone', fontSize: 9, fill: '#00ff88' }} />
              <ReferenceLine x={55} stroke="#ff4d4d" strokeDasharray="4 4" label={{ value: 'Collapse', fontSize: 9, fill: '#ff4d4d' }} />
              <Line type="monotone" dataKey="y5" stroke="#00d4ff" dot={false} name="YOLOv5n" />
              <Line type="monotone" dataKey="y8" stroke="#4c6fff" dot={false} name="YOLOv8n" />
              <Line type="monotone" dataKey="y11" stroke="#00ff88" dot={false} name="YOLO11n" />
              <Line type="monotone" dataKey="y26" stroke="#ff6b2b" dot={false} name="YOLO26s" />
              <Line type="monotone" dataKey="y9" stroke="#ffd700" dot={false} name="YOLOv9s" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </figure>
    </div>
  )
}
