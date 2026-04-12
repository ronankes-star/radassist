export function ModalityBadge({
  modality,
  bodyRegion,
}: {
  modality: string;
  bodyRegion: string;
}) {
  return (
    <span className="inline-block bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
      {bodyRegion} {modality ? `— ${modality}` : ""}
    </span>
  );
}
