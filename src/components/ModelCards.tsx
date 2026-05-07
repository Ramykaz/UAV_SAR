import { models, recommendedModels } from '../data/models'

export default function ModelCards() {
  const recommendedIds = new Set(recommendedModels.map((item) => item.modelId))

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8" id="models">
      <h2 className="section-label mb-6 text-sm text-[var(--text-secondary)]">Models</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {models.map((model, idx) => {
          const recommended = recommendedIds.has(model.id)
          const speedScore = Math.max(0, 100 - model.latencyMs)
          const accScore = model.mAP50 * 100

          return (
            <div
              key={model.id}
              className={`hud-panel glow-hover rounded-xl p-4 ${recommended ? 'hud-active' : ''}`}
              style={{ transitionDelay: `${idx * 30}ms` }}
            >
              {recommended && <div className="section-label mb-2 text-[10px] text-[var(--accent-yellow)]">★ Recommended</div>}
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl">{model.name}</h3>
                <span className={`rounded px-2 py-1 text-[10px] ${model.type === 'cnn' ? 'bg-[rgba(76,111,255,0.2)] text-[#7fa0ff]' : 'bg-[rgba(168,85,247,0.2)] text-purple-300'}`}>
                  {model.type === 'cnn' ? 'CNN' : 'TRANSFORMER'}
                </span>
              </div>

              <div className="mono mt-4 space-y-1 text-xs text-[var(--text-data)]">
                <div>mAP50: {model.mAP50.toFixed(3)}</div>
                <div>Latency: {model.latencyMs.toFixed(1)}ms</div>
                <div>Size: {model.sizeMB.toFixed(1)}MB</div>
              </div>

              <div className="mt-4 space-y-2">
                <div>
                  <div className="mb-1 text-[10px] text-[var(--text-secondary)]">Accuracy</div>
                  <div className="h-2 rounded bg-[var(--bg-surface)]"><div className="h-2 rounded bg-[var(--accent-cyan)]" style={{ width: `${accScore}%` }} /></div>
                </div>
                <div>
                  <div className="mb-1 text-[10px] text-[var(--text-secondary)]">Speed</div>
                  <div className="h-2 rounded bg-[var(--bg-surface)]"><div className="h-2 rounded bg-[var(--accent-orange)]" style={{ width: `${Math.min(100, speedScore)}%` }} /></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
