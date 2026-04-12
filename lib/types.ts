// === User ===
export type UserRole = "student" | "practitioner";

export interface Profile {
  id: string;
  display_name: string;
  role: UserRole;
  created_at: string;
}

// === Analysis ===
export type ConfidenceLevel = "high" | "moderate" | "low";

export interface Differential {
  diagnosis: string;
  confidence: ConfidenceLevel;
}

export interface AnalysisResult {
  modality: string;
  body_region: string;
  findings: string[];
  impression: string;
  differentials: Differential[];
  next_steps: string[];
}

// === Cases ===
export type CaseMode = "quick_read" | "learning";

export interface Case {
  id: string;
  user_id: string;
  image_url: string;
  modality: string;
  body_region: string;
  dicom_metadata: Record<string, string> | null;
  analysis: AnalysisResult | null;
  mode: CaseMode;
  created_at: string;
}

// === Learning Sessions ===
export interface TutorMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface SessionScore {
  findings_caught: string[];
  findings_missed: string[];
  accuracy_percent: number;
  teaching_points: string[];
}

export interface LearningSession {
  id: string;
  case_id: string;
  user_id: string;
  messages: TutorMessage[];
  score: SessionScore | null;
  created_at: string;
}

// === User Progress ===
export interface UserProgress {
  id: string;
  user_id: string;
  total_cases: number;
  modality_stats: Record<string, number>;
  accuracy_trend: number[];
  weak_areas: string[];
  updated_at: string;
}

// === Image Upload ===
export type SupportedFileType = "jpeg" | "png" | "dicom" | "unknown";

export interface UploadedImage {
  file: File;
  fileType: SupportedFileType;
  previewUrl: string | null;
  dicomMetadata: Record<string, string> | null;
}
