const TOOL_GROUP_ID = "radassist-tools";

let toolsRegistered = false;

// Cache the imported modules
let _tools: typeof import("@cornerstonejs/tools") | null = null;

async function getTools() {
  if (!_tools) {
    _tools = await import("@cornerstonejs/tools");
  }
  return _tools;
}

export type ActiveToolName =
  | "WindowLevel"
  | "Zoom"
  | "Pan"
  | "Length"
  | "Angle"
  | "ArrowAnnotate";

export async function registerTools(): Promise<void> {
  if (toolsRegistered) return;

  const {
    addTool,
    WindowLevelTool,
    ZoomTool,
    PanTool,
    LengthTool,
    AngleTool,
    ArrowAnnotateTool,
    StackScrollTool,
  } = await getTools();

  addTool(WindowLevelTool);
  addTool(ZoomTool);
  addTool(PanTool);
  addTool(LengthTool);
  addTool(AngleTool);
  addTool(ArrowAnnotateTool);
  addTool(StackScrollTool);

  toolsRegistered = true;
}

export async function createToolGroup(viewportId: string): Promise<void> {
  const {
    ToolGroupManager,
    WindowLevelTool,
    ZoomTool,
    PanTool,
    LengthTool,
    AngleTool,
    ArrowAnnotateTool,
    StackScrollTool,
    Enums: csToolsEnums,
  } = await getTools();

  try {
    ToolGroupManager.destroyToolGroup(TOOL_GROUP_ID);
  } catch {
    // Tool group doesn't exist yet, that's fine
  }

  const toolGroup = ToolGroupManager.createToolGroup(TOOL_GROUP_ID);
  if (!toolGroup) return;

  toolGroup.addTool(WindowLevelTool.toolName);
  toolGroup.addTool(ZoomTool.toolName);
  toolGroup.addTool(PanTool.toolName);
  toolGroup.addTool(LengthTool.toolName);
  toolGroup.addTool(AngleTool.toolName);
  toolGroup.addTool(ArrowAnnotateTool.toolName);
  toolGroup.addTool(StackScrollTool.toolName);

  toolGroup.addViewport(viewportId);

  toolGroup.setToolActive(WindowLevelTool.toolName, {
    bindings: [{ mouseButton: csToolsEnums.MouseBindings.Primary }],
  });
  toolGroup.setToolActive(PanTool.toolName, {
    bindings: [{ mouseButton: csToolsEnums.MouseBindings.Auxiliary }],
  });
  toolGroup.setToolActive(ZoomTool.toolName, {
    bindings: [{ mouseButton: csToolsEnums.MouseBindings.Secondary }],
  });
}

export async function setActiveTool(toolName: ActiveToolName): Promise<void> {
  const {
    ToolGroupManager,
    WindowLevelTool,
    ZoomTool,
    PanTool,
    LengthTool,
    AngleTool,
    ArrowAnnotateTool,
    Enums: csToolsEnums,
  } = await getTools();

  const toolGroup = ToolGroupManager.getToolGroup(TOOL_GROUP_ID);
  if (!toolGroup) return;

  const measurementTools = [
    LengthTool.toolName,
    AngleTool.toolName,
    ArrowAnnotateTool.toolName,
  ];

  for (const name of measurementTools) {
    toolGroup.setToolPassive(name);
  }

  toolGroup.setToolPassive(WindowLevelTool.toolName);

  const toolMap: Record<ActiveToolName, string> = {
    WindowLevel: WindowLevelTool.toolName,
    Zoom: ZoomTool.toolName,
    Pan: PanTool.toolName,
    Length: LengthTool.toolName,
    Angle: AngleTool.toolName,
    ArrowAnnotate: ArrowAnnotateTool.toolName,
  };

  toolGroup.setToolActive(toolMap[toolName], {
    bindings: [{ mouseButton: csToolsEnums.MouseBindings.Primary }],
  });
}
