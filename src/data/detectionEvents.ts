import type { DetectionEvent } from '../types'

export const detectionEvents: DetectionEvent[] = [
  { lat: 37.723, lng: -119.572, conf: 0.967, model: 'YOLOv5n-FP16', latencyMs: 7.5, alt: 47 },
  { lat: 37.714, lng: -119.553, conf: 0.941, model: 'YOLO26s-FP16', latencyMs: 11.2, alt: 52 },
  { lat: 37.707, lng: -119.564, conf: 0.923, model: 'YOLOv5n-FP16', latencyMs: 7.8, alt: 61 },
  { lat: 37.718, lng: -119.587, conf: 0.958, model: 'RT-DETR-FP16', latencyMs: 29.3, alt: 38 },
  { lat: 37.711, lng: -119.576, conf: 0.934, model: 'YOLO26s-FP16', latencyMs: 11.8, alt: 55 },
]
