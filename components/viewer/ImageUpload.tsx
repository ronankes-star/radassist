"use client";

import { useCallback, useState } from "react";
import { detectFileType } from "@/lib/utils";
import { UploadedImage } from "@/lib/types";
import toast from "react-hot-toast";

interface ImageUploadProps {
  onImageLoaded: (image: UploadedImage) => void;
}

export function ImageUpload({ onImageLoaded }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      const fileType = await detectFileType(file);

      if (fileType === "unknown") {
        toast.error("Unsupported file type. Please upload JPEG, PNG, or DICOM.");
        return;
      }

      try {
        // For DICOM files, try to extract metadata
        let dicomMetadata: Record<string, string> | null = null;
        if (fileType === "dicom") {
          try {
            const dicomParser = (await import("dicom-parser")).default;
            const arrayBuffer = await file.arrayBuffer();
            const dataSet = dicomParser.parseDicom(new Uint8Array(arrayBuffer));

            const tags: Record<string, string> = {
              x00080060: "Modality",
              x00080070: "Manufacturer",
              x00180060: "KVP",
              x00181152: "Exposure (mAs)",
              x00180050: "Slice Thickness",
              x00280010: "Rows",
              x00280011: "Columns",
              x00180015: "Body Part Examined",
              x00185101: "View Position",
            };

            dicomMetadata = {};
            for (const [tag, label] of Object.entries(tags)) {
              const value = dataSet.string(tag);
              if (value) {
                dicomMetadata[label] = value;
              }
            }
          } catch {
            console.warn("Could not parse DICOM metadata");
          }
        }

        const previewUrl = URL.createObjectURL(file);

        onImageLoaded({
          file,
          fileType,
          previewUrl,
          dicomMetadata,
        });
      } catch (err) {
        console.error("Failed to load image:", err);
        toast.error("Failed to load image. Please try a different file.");
      }
    },
    [onImageLoaded]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`absolute inset-0 flex items-center justify-center transition-colors ${
        isDragging ? "bg-blue-500/10" : ""
      }`}
    >
      <label
        className={`cursor-pointer border-2 border-dashed rounded-xl px-8 py-6 text-center transition ${
          isDragging
            ? "border-blue-500 text-blue-400"
            : "border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-400"
        }`}
      >
        <div className="text-3xl mb-2">🏥</div>
        <div className="text-sm font-medium">
          Drop image or DICOM file here
        </div>
        <div className="text-xs mt-1">or click to browse</div>
        <div className="text-xs mt-2 text-gray-600">
          Supports: JPEG, PNG, DICOM (.dcm)
        </div>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.dcm,.dicom"
          onChange={handleInputChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
