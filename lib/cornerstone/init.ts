let initialized = false;

export async function initCornerstone(): Promise<void> {
  if (initialized) return;
  if (typeof window === "undefined") return;

  const { init: coreInit } = await import("@cornerstonejs/core");
  const dicomImageLoader = await import("@cornerstonejs/dicom-image-loader");
  const { init: cornerstoneToolsInit } = await import("@cornerstonejs/tools");

  await coreInit();
  dicomImageLoader.init();
  await cornerstoneToolsInit();

  initialized = true;
}
