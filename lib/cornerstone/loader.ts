import { RenderingEngine, Enums, type Types } from "@cornerstonejs/core";
import dicomParser from "dicom-parser";

const RENDERING_ENGINE_ID = "radassist-engine";
const VIEWPORT_ID = "radassist-viewport";

let renderingEngine: RenderingEngine | null = null;

export function getRenderingEngine(): RenderingEngine {
  if (!renderingEngine) {
    renderingEngine = new RenderingEngine(RENDERING_ENGINE_ID);
  }
  return renderingEngine;
}

export function getViewportId(): string {
  return VIEWPORT_ID;
}

export function setupViewport(element: HTMLDivElement): void {
  const engine = getRenderingEngine();

  const viewportInput = {
    viewportId: VIEWPORT_ID,
    element,
    type: Enums.ViewportType.STACK,
  };

  engine.enableElement(viewportInput);
}

export async function loadImageFile(file: File): Promise<void> {
  const engine = getRenderingEngine();
  const viewport = engine.getViewport(VIEWPORT_ID) as Types.IStackViewport;
  if (!viewport) throw new Error("Viewport not initialized");

  const imageId = `wadouri:${URL.createObjectURL(file)}`;
  await viewport.setStack([imageId]);
  viewport.render();
}

export async function loadDicomFile(
  file: File
): Promise<Record<string, string>> {
  const engine = getRenderingEngine();
  const viewport = engine.getViewport(VIEWPORT_ID) as Types.IStackViewport;
  if (!viewport) throw new Error("Viewport not initialized");

  const imageId = `wadouri:${URL.createObjectURL(file)}`;
  await viewport.setStack([imageId]);
  viewport.render();

  const arrayBuffer = await file.arrayBuffer();
  const dataSet = dicomParser.parseDicom(new Uint8Array(arrayBuffer));

  const metadata: Record<string, string> = {};
  const tags: Record<string, string> = {
    x00080060: "Modality",
    x00080070: "Manufacturer",
    x00180060: "KVP",
    x00181152: "Exposure (mAs)",
    x00180050: "Slice Thickness",
    x00280010: "Rows",
    x00280011: "Columns",
    x00080018: "SOP Instance UID",
    x00200013: "Instance Number",
    x00180015: "Body Part Examined",
    x00185101: "View Position",
  };

  for (const [tag, label] of Object.entries(tags)) {
    const value = dataSet.string(tag);
    if (value) {
      metadata[label] = value;
    }
  }

  return metadata;
}

export function exportViewportAsBase64(): string | null {
  const engine = getRenderingEngine();
  const viewport = engine.getViewport(VIEWPORT_ID);
  if (!viewport) return null;

  const canvas = viewport.getCanvas();
  return canvas.toDataURL("image/png");
}

export function resetViewport(): void {
  const engine = getRenderingEngine();
  const viewport = engine.getViewport(VIEWPORT_ID);
  if (!viewport) return;

  viewport.resetCamera();
  viewport.render();
}

export function invertImage(): void {
  const engine = getRenderingEngine();
  const viewport = engine.getViewport(VIEWPORT_ID) as Types.IStackViewport;
  if (!viewport) return;

  const { invert } = viewport.getProperties();
  viewport.setProperties({ invert: !invert });
  viewport.render();
}

export function destroyEngine(): void {
  if (renderingEngine) {
    renderingEngine.destroy();
    renderingEngine = null;
  }
}
