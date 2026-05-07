import type { ModelBaseline, RecommendedModel } from '../types'

export const models: ModelBaseline[] = [
  { id: 'rt-detr', name: 'RT-DETR', type: 'transformer', sizeMB: 63.1, mAP50: 0.966, mAP50_95: 0.629, recall: 0.95, latencyMs: 57.3 },
  { id: 'rf-detr', name: 'RF-DETR', type: 'transformer', sizeMB: 127.5, mAP50: 0.937, mAP50_95: 0.549, recall: 0.947, latencyMs: 81.9 },
  { id: 'yolo26s', name: 'YOLO26s', type: 'cnn', sizeMB: 19.4, mAP50: 0.952, mAP50_95: 0.548, recall: 0.921, latencyMs: 15.8 },
  { id: 'yolov5n', name: 'YOLOv5n', type: 'cnn', sizeMB: 5.0, mAP50: 0.938, mAP50_95: 0.536, recall: 0.898, latencyMs: 8.2 },
  { id: 'yolov9t', name: 'YOLOv9t', type: 'cnn', sizeMB: 4.4, mAP50: 0.926, mAP50_95: 0.536, recall: 0.885, latencyMs: 11.4 },
  { id: 'yolov5s', name: 'YOLOv5s', type: 'cnn', sizeMB: 17.6, mAP50: 0.925, mAP50_95: 0.531, recall: 0.889, latencyMs: 13.9 },
  { id: 'yolov9s', name: 'YOLOv9s', type: 'cnn', sizeMB: 14.5, mAP50: 0.923, mAP50_95: 0.529, recall: 0.881, latencyMs: 18.9 },
  { id: 'yolo11n', name: 'YOLO11n', type: 'cnn', sizeMB: 5.2, mAP50: 0.928, mAP50_95: 0.525, recall: 0.886, latencyMs: 8.4 },
  { id: 'yolo11s', name: 'YOLO11s', type: 'cnn', sizeMB: 18.3, mAP50: 0.928, mAP50_95: 0.524, recall: 0.872, latencyMs: 15.0 },
  { id: 'yolo26n', name: 'YOLO26n', type: 'cnn', sizeMB: 5.1, mAP50: 0.925, mAP50_95: 0.523, recall: 0.885, latencyMs: 8.6 },
  { id: 'yolov10s', name: 'YOLOv10s', type: 'cnn', sizeMB: 15.7, mAP50: 0.912, mAP50_95: 0.507, recall: 0.86, latencyMs: 17.5 },
  { id: 'yolov8s', name: 'YOLOv8s', type: 'cnn', sizeMB: 21.5, mAP50: 0.912, mAP50_95: 0.501, recall: 0.872, latencyMs: 14.1 },
  { id: 'yolov8n', name: 'YOLOv8n', type: 'cnn', sizeMB: 6.0, mAP50: 0.926, mAP50_95: 0.5, recall: 0.868, latencyMs: 7.6 },
  { id: 'yolov10n', name: 'YOLOv10n', type: 'cnn', sizeMB: 5.5, mAP50: 0.893, mAP50_95: 0.488, recall: 0.83, latencyMs: 8.6 },
]

export const recommendedModels: RecommendedModel[] = [
  { modelId: 'rt-detr', precision: 'FP16', resolution: 416, mAP50: 0.975, latencyMs: 29.7, fps: 34, engineMB: 66.1, tier: 'Maximum Accuracy' },
  { modelId: 'yolo26s', precision: 'FP16', resolution: 416, mAP50: 0.955, latencyMs: 11.85, fps: 84, engineMB: 21.4, tier: 'Balanced' },
  { modelId: 'yolov5n', precision: 'FP16', resolution: 512, mAP50: 0.934, latencyMs: 7.46, fps: 134, engineMB: 7.3, tier: 'Ultra-Low Latency' },
]
