import { useMemo, useState } from 'react'
import ControlPanel, { type SelectorOption } from './ControlPanel'
import RescueScene from './RescueScene'
import { useDroneSimulation } from '../hooks/useDroneSimulation'

const modelOptions: SelectorOption[] = [
  { id: 'yolov5n', label: 'YOLOv5n-FP16', fps: 134, latencyMs: 7.3, sizeMB: 7.3, confBase: 0.934 },
  { id: 'yolo26s', label: 'YOLO26s-FP16', fps: 84, latencyMs: 11.85, sizeMB: 21.8, confBase: 0.955 },
  { id: 'rt-detr', label: 'RT-DETR-FP16', fps: 34, latencyMs: 29.7, sizeMB: 66.1, confBase: 0.975 },
]

export default function Simulation() {
  const [selectedModelId, setSelectedModelId] = useState(modelOptions[0].id)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [glitchKey, setGlitchKey] = useState(0)
  const [scenario, setScenario] = useState<'jungle' | 'earthquake' | 'wildfire'>('jungle')

  const selectedModel = useMemo(() => modelOptions.find((item) => item.id === selectedModelId) ?? modelOptions[0], [selectedModelId])

  const {
    running,
    speedMultiplier,
    setSpeedMultiplier,
    dronePosition,
    activeDetections,
    detectionCount,
    sessionSeconds,
    avgConfidence,
    logEntries,
    trail,
    battery,
    start,
    stop,
    reset,
  } = useDroneSimulation(selectedModel)

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8" id="simulation">
      <h2 className="section-label mb-5 text-sm text-[var(--text-secondary)]">Live Simulation</h2>
      <div className="grid h-[90vh] gap-4 md:grid-cols-[360px_1fr]">
        <ControlPanel
          className="hidden md:block"
          running={running}
          battery={battery}
          selectedModelId={selectedModelId}
          options={modelOptions}
          onModelChange={(id) => {
            setSelectedModelId(id)
            setGlitchKey((prev) => prev + 1)
          }}
          onStart={start}
          onStop={stop}
          onReset={reset}
          speed={speedMultiplier}
          onSpeed={setSpeedMultiplier}
          detections={detectionCount}
          sessionSeconds={sessionSeconds}
          avgConfidence={avgConfidence}
          logs={logEntries}
          glitchKey={glitchKey}
        />

        <RescueScene
          dronePosition={dronePosition}
          activeDetections={activeDetections}
          trail={trail}
          running={running}
          scenario={scenario}
          onScenarioChange={setScenario}
        />
      </div>

      <div className="md:hidden">
        <button
          aria-label="Toggle control panel drawer"
          className="section-label fixed bottom-4 left-4 right-4 z-[1000] rounded border border-[var(--border-dim)] bg-[rgba(10,15,26,0.95)] px-4 py-3 text-xs"
          onClick={() => setDrawerOpen((prev) => !prev)}
        >
          {drawerOpen ? 'HIDE CONTROLS' : 'SHOW CONTROLS'}
        </button>
        <div className={`fixed bottom-20 left-0 right-0 z-[999] max-h-[75vh] overflow-auto px-3 transition-transform duration-300 ${drawerOpen ? 'translate-y-0' : 'translate-y-[110%]'}`}>
          <ControlPanel
            className="shadow-2xl"
            running={running}
            battery={battery}
            selectedModelId={selectedModelId}
            options={modelOptions}
            onModelChange={(id) => {
              setSelectedModelId(id)
              setGlitchKey((prev) => prev + 1)
            }}
            onStart={start}
            onStop={stop}
            onReset={reset}
            speed={speedMultiplier}
            onSpeed={setSpeedMultiplier}
            detections={detectionCount}
            sessionSeconds={sessionSeconds}
            avgConfidence={avgConfidence}
            logs={logEntries}
            glitchKey={glitchKey}
          />
        </div>
      </div>
    </section>
  )
}
