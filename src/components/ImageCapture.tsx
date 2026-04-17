import { useRef, useState, useCallback } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ImageCaptureProps {
  onCapture: (file: File) => void;
}

export function ImageCapture({ onCapture }: ImageCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 640, height: 480 },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      toast.error("Camera access denied", {
        description: "Could not access your camera. Please check browser permissions and try again.",
      });
      setIsOpen(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
  }, [stream]);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(startCamera, 100);
  };

  const handleClose = () => {
    stopCamera();
    setIsOpen(false);
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCapture(new File([blob], "capture.jpg", { type: "image/jpeg" }));
          handleClose();
        }
      },
      "image/jpeg",
      0.9
    );
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="group relative flex flex-col items-center gap-4 rounded-2xl glass-card gradient-border p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/25 group-hover:scale-110">
          <Camera className="h-7 w-7" />
        </div>
        <div>
          <p className="font-semibold text-foreground">Capture Image</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Use your camera
          </p>
        </div>
      </button>

      <Dialog open={isOpen} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-t-lg bg-muted"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex items-center justify-between p-4">
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="h-5 w-5" />
              </Button>
              <Button
                onClick={capture}
                className="rounded-full px-8 shadow-lg shadow-primary/25"
              >
                Capture
              </Button>
              <div className="w-10" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
