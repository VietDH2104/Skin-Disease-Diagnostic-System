import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface ImageUploadProps {
  onSelect: (file: File) => void;
}

export function ImageUpload({ onSelect }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndSelect = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload a JPG, PNG, or WEBP image.",
      });
      return;
    }
    onSelect(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    validateAndSelect(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSelect(file);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
      <button
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group relative flex flex-col items-center gap-4 rounded-2xl glass-card gradient-border p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
          isDragging
            ? "ring-2 ring-primary border-primary/50 shadow-xl shadow-primary/10 scale-[1.02]"
            : ""
        }`}
      >
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
            isDragging
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-110"
              : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/25 group-hover:scale-110"
          }`}
        >
          <Upload className="h-7 w-7" />
        </div>
        <div>
          <p className="font-semibold text-foreground">
            {isDragging ? "Drop here!" : "Upload Image"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {isDragging ? "Release to upload" : "Drag & drop or click · JPG, PNG, WEBP"}
          </p>
        </div>
      </button>
    </>
  );
}
