// Mock datasets for the ML pipeline visualization modules (4-7) and AI extensions.

export type DetectorModel = "YOLOv11" | "RetinaFace";

export interface PreprocStage {
  key: string;
  label: string;
  detail: string;
  shape: string;
}

export const PREPROCESSING_STAGES: PreprocStage[] = [
  { key: "raw", label: "Raw Capture", detail: "Original RGB frame from camera sensor", shape: "1920 × 1080 × 3" },
  { key: "resize", label: "Resize", detail: "Bilinear downscale to network input size", shape: "160 × 160 × 3" },
  { key: "normalize", label: "Min-Max Normalization", detail: "Pixel intensities scaled to [0, 1]", shape: "160 × 160 × 3" },
  { key: "equalize", label: "Histogram Equalization", detail: "Adaptive contrast (CLAHE) on luminance", shape: "160 × 160 × 3" },
  { key: "denoise", label: "Noise Removal", detail: "Non-local means denoising filter", shape: "160 × 160 × 3" },
];

// Deterministic pseudo-random 512-D embedding for display.
export function buildEmbedding(seed = 42, size = 512): number[] {
  const out: number[] = [];
  let s = seed;
  for (let i = 0; i < size; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    // Center around 0 in the range roughly [-0.18, 0.18]
    out.push(Number((((s / 0x7fffffff) - 0.5) * 0.36).toFixed(4)));
  }
  return out;
}

export interface MatchCandidate {
  registerNo: string;
  name: string;
  similarity: number;
}

export const MATCH_CANDIDATES: MatchCandidate[] = [
  { registerNo: "21CS001", name: "Ravi Teja", similarity: 0.91 },
  { registerNo: "21CS002", name: "Sneha Reddy", similarity: 0.74 },
  { registerNo: "21CS004", name: "Priya Menon", similarity: 0.68 },
  { registerNo: "21CS005", name: "Karthik Iyer", similarity: 0.63 },
  { registerNo: "21IT012", name: "Mohan Das", similarity: 0.57 },
  { registerNo: "21EC021", name: "Vikram Singh", similarity: 0.49 },
];

export interface LivenessComponent {
  key: string;
  label: string;
  weight: number;
  description: string;
}

export const LIVENESS_COMPONENTS: LivenessComponent[] = [
  { key: "blink", label: "Blink Detection", weight: 0.3, description: "Eye-aspect-ratio temporal pattern" },
  { key: "texture", label: "Texture Analysis", weight: 0.3, description: "LBP micro-texture vs print/screen" },
  { key: "depth", label: "Depth Sensing", weight: 0.25, description: "Monocular depth surface estimate" },
  { key: "motion", label: "Micro-Motion", weight: 0.15, description: "Involuntary head/face motion flow" },
];

export interface RiskStudent {
  registerNo: string;
  name: string;
  current: number;
  predicted: number;
  risk: "high" | "medium" | "low";
}

export const ABSENCE_RISK: RiskStudent[] = [
  { registerNo: "21IT012", name: "Mohan Das", current: 58, predicted: 52, risk: "high" },
  { registerNo: "21CS003", name: "Arjun Nair", current: 64, predicted: 61, risk: "high" },
  { registerNo: "21CS005", name: "Karthik Iyer", current: 71, predicted: 69, risk: "medium" },
  { registerNo: "21EC021", name: "Vikram Singh", current: 73, predicted: 76, risk: "medium" },
  { registerNo: "21IT013", name: "Lakshmi Rao", current: 81, predicted: 84, risk: "low" },
];

export const ATTENDANCE_FORECAST = [
  { week: "W-3", actual: 82, predicted: null as number | null },
  { week: "W-2", actual: 79, predicted: null },
  { week: "W-1", actual: 84, predicted: null },
  { week: "Now", actual: 80, predicted: 80 },
  { week: "W+1", actual: null, predicted: 78 },
  { week: "W+2", actual: null, predicted: 75 },
  { week: "W+3", actual: null, predicted: 73 },
];
