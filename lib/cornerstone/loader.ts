const RENDERING_ENGINE_ID = "radassist-engine";
const VIEWPORT_ID = "radassist-viewport";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let renderingEngine: any = null;

async function getCore() {
  return await import("@cornerstonejs/core");
}

export async function getRenderingEngine() {
  if (!renderingEngine) {
    const { RenderingEngine } = await getCore();
    renderingEngine = new RenderingEngine(RENDERING_ENGINE_ID);
  }
  return renderingEngine;
}

export function getViewportId(): string {
  return VIEWPORT_ID;
}

export async function setupViewport(element: HTMLDivElement): Promise<void> {
  const { Enums } = await getCore();
  const engine = await getRenderingEngine();

  // Cornerstone needs the element to have non-zero dimensions
  // Wait for the element to have a size (may need a frame for layout)
  await new Promise<void>((resolve) => {
    function check() {
      if (element.offsetWidth > 0 && element.offsetHeight > 0) {
        resolve();
      } else {
        requestAnimationFrame(check);
      }
    }
    check();
  });

  const viewportInput = {
    viewportId: VIEWPORT_ID,
    element,
    type: Enums.ViewportType.STACK,
  };

  engine.enableElement(viewportInput);
}

export async function loadImageFile(file: File): Promise<void> {
  const engine = await getRenderingEngine();
  const viewport = engine.getViewport(VIEWPORT_ID);
  if (!viewport) throw new Error("Viewport not initialized");

  const imageId = `wadouri:${URL.createObjectURL(file)}`;
  await viewport.setStack([imageId]);
  viewport.render();
}

export async function loadDicomFile(
  file: File
): Promise<Record<string, string>> {
  const engine = await getRenderingEngine();
  const viewport = engine.getViewport(VIEWPORT_ID);
  if (!viewport) throw new Error("Viewport not initialized");

  const imageId = `wadouri:${URL.createObjectURL(file)}`;
  await viewport.setStack([imageId]);
  viewport.render();

  const dicomParser = (await import("dicom-parser")).default;
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
  if (!renderingEngine) return null;
  const viewport = renderingEngine.getViewport(VIEWPORT_ID);
  if (!viewport) return null;

  const canvas = viewport.getCanvas();
  return canvas.toDataURL("image/png");
}

export async function resetViewport(): Promise<void> {
  if (!renderingEngine) return;
  const viewport = renderingEngine.getViewport(VIEWPORT_ID);
  if (!viewport) return;

  viewport.resetCamera();
  viewport.render();
}

export async function invertImage(): Promise<void> {
  if (!renderingEngine) return;
  const viewport = renderingEngine.getViewport(VIEWPORT_ID);
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
