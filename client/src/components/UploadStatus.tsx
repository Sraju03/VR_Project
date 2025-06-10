import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/joy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LinearProgress from "@mui/joy/LinearProgress";

interface UploadStatusProps {
  filename: string;
  index: number; // NEW: used to calculate delay
  delay?: number; // base delay between uploads (e.g., 3000ms)
  onComplete?: () => void;
}

export default function UploadStatus({
  filename,
  index,
  delay = 3000,
  onComplete,
}: UploadStatusProps) {
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startDelay = delay * index; // stagger based on index

    const startTimer = setTimeout(() => {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 2;
          return next >= 100 ? 100 : next;
        });
      }, delay / 50);

      const completeTimeout = setTimeout(() => {
        setIsComplete(true);
        onComplete?.(); // ✅ Call the parent function to notify upload completion
        clearInterval(progressInterval);
      }, delay);

      // Cleanup nested timers
      return () => {
        clearTimeout(completeTimeout);
        clearInterval(progressInterval);
      };
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [index, delay]);

  return (
    <div className="flex items-center w-full justify-between gap-4 px-2 py-2">
      {/* Icon + File Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center">
          {!isComplete ? (
            <CircularProgress size="sm" />
          ) : (
            <CheckCircleIcon className="text-green-600" fontSize="medium" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{filename}</p>
          <p
            className={`text-xs ${
              isComplete ? "text-green-600" : "text-blue-600"
            }`}
          >
            {isComplete ? "Complete" : "Uploading..."}
          </p>
        </div>
      </div>

      {/* Right side: Progress and percentage */}
      <div className="flex flex-col items-end w-[200px]">
        <p className="text-xs text-gray-800 mb-1">{progress}%</p>
        <LinearProgress
          determinate
          value={progress}
          thickness={6}
          sx={{ width: "100%", borderRadius: 6 }}
          color={isComplete ? "success" : "primary"}
        />
      </div>
    </div>
  );
}
