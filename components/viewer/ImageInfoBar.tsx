interface ImageInfoBarProps {
  filename: string;
  fileSize: number;
  fileType: string;
  dimensions?: { width: number; height: number };
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ImageInfoBar({ filename, fileSize, fileType, dimensions }: ImageInfoBarProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-1.5 bg-gray-900/80 backdrop-blur-sm text-xs text-gray-400 border-t border-gray-800 z-50">
      <span className="truncate max-w-[200px]">{filename}</span>
      <div className="flex items-center gap-3">
        {dimensions && (
          <span>{dimensions.width} × {dimensions.height}</span>
        )}
        <span>{formatFileSize(fileSize)}</span>
        <span className="px-1.5 py-0.5 bg-gray-800 rounded text-[10px] uppercase font-medium">
          {fileType}
        </span>
      </div>
    </div>
  );
}
