import { SupportedFileType } from "./types";

/**
 * Detect file type from a File object.
 * DICOM files typically start with the DICM preamble at byte 128,
 * or have a .dcm extension.
 */
export async function detectFileType(file: File): Promise<SupportedFileType> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".dcm") || name.endsWith(".dicom")) {
    return "dicom";
  }

  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) {
    return "jpeg";
  }

  if (name.endsWith(".png")) {
    return "png";
  }

  // Check DICOM magic bytes: "DICM" at offset 128
  const buffer = await file.slice(128, 132).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const magic = String.fromCharCode(...bytes);
  if (magic === "DICM") {
    return "dicom";
  }

  return "unknown";
}

/**
 * Convert a File to a base64 data URL string.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Strip PHI-related DICOM tags from metadata.
 * Returns a clean metadata object safe for server-side processing.
 */
const PHI_TAGS = [
  "x00100010", // Patient Name
  "x00100020", // Patient ID
  "x00100030", // Patient Birth Date
  "x00100040", // Patient Sex
  "x00080050", // Accession Number
  "x00080090", // Referring Physician
  "x00080080", // Institution Name
  "x00081070", // Operators' Name
];

export function stripPhiFromMetadata(
  metadata: Record<string, string>
): Record<string, string> {
  const clean: Record<string, string> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (!PHI_TAGS.includes(key.toLowerCase())) {
      clean[key] = value;
    }
  }
  return clean;
}

/**
 * Format a confidence level for display.
 */
export function confidenceColor(level: string): string {
  switch (level) {
    case "high":
      return "text-green-400";
    case "moderate":
      return "text-yellow-400";
    case "low":
      return "text-gray-400";
    default:
      return "text-gray-400";
  }
}
