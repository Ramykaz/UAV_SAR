export type ModelType = 'cnn' | 'transformer'

export interface ModelBaseline {
  id: string
  name: string
  type: ModelType
  sizeMB: number
  mAP50: number
  mAP50_95: number
  recall: number
  latencyMs: number
}

export interface RecommendedModel {
  modelId: string
  precision: 'FP16' | 'FP32' | 'INT8' | 'Pruned'
  resolution: number
  mAP50: number
  latencyMs: number
  fps: number
  engineMB: number
  tier: string
}

export interface DetectionEvent {
  lat: number
  lng: number
  conf: number
  model: string
  latencyMs: number
  alt: number
}

export interface ActiveDetection extends DetectionEvent {
  id: string
  createdAt: number
}

export interface LogEntry {
  id: string
  timestamp: string
  text: string
}
