import { useRef } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface ImageUploadProps {
  onSelect: (file: File) => void;
}

export function ImageUpload({ onSelect }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload a JPG, PNG, or WEBP image.",
      });
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    onSelect(file);
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
        className="group relative flex flex-col items-center gap-4 rounded-2xl glass-card gradient-border p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/25 group-hover:scale-110">
          <Upload className="h-7 w-7" />
        </div>
        <div>
          <p className="font-semibold text-foreground">Upload Image</p>
          <p className="mt-1 text-sm text-muted-foreground">
            JPG, PNG, or WEBP
          </p>
        </div>
      </button>
    </>
  );
}
