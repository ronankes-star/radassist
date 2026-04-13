import jsPDF from "jspdf";
import { AnalysisResult } from "@/lib/types";

export function exportAnalysisPDF(
  analysis: AnalysisResult,
  imageBase64: string | null
): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Colors
  const blue = [96, 165, 250]; // blue-400
  const gray = [148, 163, 184]; // gray-400
  const darkGray = [30, 41, 59]; // gray-800
  const white = [226, 232, 240]; // gray-200

  // Background
  doc.setFillColor(3, 7, 18); // gray-950
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), "F");

  // Header
  doc.setFontSize(20);
  doc.setTextColor(...blue);
  doc.text("⚡ RadAssist Report", margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setTextColor(...gray);
  doc.text(
    `Generated: ${new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`,
    margin,
    y
  );
  y += 6;

  // Divider
  doc.setDrawColor(...darkGray);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Image thumbnail
  if (imageBase64) {
    try {
      const imgWidth = 60;
      const imgHeight = 60;
      const imgX = (pageWidth - imgWidth) / 2;
      doc.addImage(imageBase64, "PNG", imgX, y, imgWidth, imgHeight);
      y += imgHeight + 8;
    } catch {
      // Skip image if it fails to embed
      y += 4;
    }
  }

  // Modality badge
  doc.setFontSize(11);
  doc.setTextColor(...blue);
  doc.text(
    `${analysis.body_region} — ${analysis.modality}`,
    margin,
    y
  );
  y += 10;

  // Helper: section with auto page break
  function addSection(title: string, items: string[], isBulleted = true) {
    // Check if we need a new page
    if (y > 260) {
      doc.addPage();
      doc.setFillColor(3, 7, 18);
      doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), "F");
      y = margin;
    }

    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.text(title.toUpperCase(), margin, y);
    y += 5;

    doc.setFontSize(10);
    doc.setTextColor(...white);

    for (const item of items) {
      if (y > 275) {
        doc.addPage();
        doc.setFillColor(3, 7, 18);
        doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), "F");
        y = margin;
      }

      const prefix = isBulleted ? "• " : "";
      const lines = doc.splitTextToSize(prefix + item, contentWidth);
      doc.text(lines, margin, y);
      y += lines.length * 5;
    }

    y += 6;
  }

  // Findings
  addSection("Findings", analysis.findings);

  // Impression
  addSection("Impression", [analysis.impression], false);

  // Differentials
  const ddxItems = analysis.differentials.map(
    (dx, i) =>
      `${i + 1}. ${dx.diagnosis} (${dx.confidence.charAt(0).toUpperCase() + dx.confidence.slice(1)})`
  );
  addSection("Differential Diagnosis", ddxItems, false);

  // Next Steps
  addSection("Suggested Next Steps", analysis.next_steps);

  // Disclaimer
  if (y > 265) {
    doc.addPage();
    doc.setFillColor(3, 7, 18);
    doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), "F");
    y = margin;
  }
  doc.setDrawColor(...darkGray);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // gray-500
  const disclaimer =
    "For educational and assistive purposes only. Not a clinical diagnostic tool. All findings must be verified by a qualified radiologist.";
  const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth);
  doc.text(disclaimerLines, margin, y);

  // Download
  const dateStr = new Date().toISOString().split("T")[0];
  doc.save(`RadAssist-Report-${dateStr}.pdf`);
}
