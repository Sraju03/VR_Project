import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/joy/Table";
import UploadStatus from "./UploadStatus";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import ViewInArIcon from "@mui/icons-material/ViewInAr";

type UploadedImage = {
  image: string;
  fileName: string;
  chipLabel: string;
};

interface UploadTableProps {
  uploadedImages: UploadedImage[];
}

export default function TableVariant({ uploadedImages }: UploadTableProps) {
  const [completedStatuses, setCompletedStatuses] = useState<boolean[]>(
    Array(uploadedImages.length).fill(false)
  );
  const [vrProcessing, setVrProcessing] = useState(false); // Track VR image processing
  const [vrProcessed, setVrProcessed] = useState(false); // Track VR image completion
  const [panoramaPath, setPanoramaPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const hasUploadedRef = useRef(false);

  // Calculate overall progress
  const calculateProgress = () => {
    const imageCount = uploadedImages.length;
    const completedImages = completedStatuses.filter((status) => status).length;
    const imageProgress = imageCount > 0 ? (completedImages / imageCount) * 80 : 0; // 80% for images
    const vrProgress = vrProcessed ? 20 : vrProcessing ? 10 : 0; // 10% during VR processing, 20% when done
    return Math.min(imageProgress + vrProgress, 100); // Cap at 100%
  };

  // Upload images to backend
  useEffect(() => {
    const uploadImages = async () => {
      if (uploadedImages.length === 0 || hasUploadedRef.current) return;

      hasUploadedRef.current = true;
      const formData = new FormData();
      uploadedImages.forEach((img) => {
        const contentType = "image/jpeg";
        const byteCharacters = atob(img.image.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: contentType });
        formData.append("images", blob, img.fileName);
      });

      try {
        const controller = new AbortController();
        setVrProcessing(true); // Start VR processing
        const response = await fetch("http://144.126.253.174:8000/upload", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to upload images: ${errorText}`);
        }

        const result = await response.json();
        console.log("Backend response:", result);
        if (result.success && result.panorama_path) {
          console.log("Setting panoramaPath:", result.panorama_path);
          setPanoramaPath(result.panorama_path);
          setVrProcessed(true); // VR image is ready
          setVrProcessing(false);
        } else {
          throw new Error("Backend processing failed: No panorama path returned");
        }

        return () => controller.abort();
      } catch (err) {
        console.error("Error uploading images:", err);
        setError("Failed to process images. Please try again.");
        setVrProcessing(false);
        hasUploadedRef.current = false;
      }
    };

    uploadImages();
  }, [uploadedImages]);

  const handleComplete = (index: number) => {
    setCompletedStatuses((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  const handleVrClick = () => {
    if (panoramaPath) {
      console.log("Navigating to viewer with panoramaPath:", panoramaPath);
      navigate("/viewer", { state: { panoramaPath } });
    } else {
      alert("No panorama available to view.");
    }
  };

  return (
    <div className="mt-7">
      <Table aria-label="Upload Status Table" variant="soft" color="neutral">
        <thead>
          <tr>
            <th>Processing Files</th>
          </tr>
        </thead>
        <tbody>
          {uploadedImages.length === 0 ? (
            <tr>
              <td>No files uploaded</td>
            </tr>
          ) : error ? (
            <tr>
              <td>{error}</td>
            </tr>
          ) : (
            uploadedImages.map((img, index) => (
              <tr key={index}>
                <td>
                  <InsertDriveFileIcon />
                  <UploadStatus
                    filename={img.fileName}
                    index={index}
                    delay={3000}
                    onComplete={() => handleComplete(index)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <td>
              {(vrProcessing || completedStatuses.some((status) => !status)) && (
                <div className="flex justify-center items-center gap-2">
                  <CircularProgress
                    determinate
                    value={calculateProgress()}
                    size="sm"
                  />
                  <span className="text-sm text-gray-700">
                    Processing: {calculateProgress().toFixed(0)}%
                  </span>
                </div>
              )}
              {vrProcessed && completedStatuses.every((status) => status) && panoramaPath && (
                <Button
                  sx={{ m: 1 }}
                  onClick={handleVrClick}
                  endDecorator={<ViewInArIcon />}
                  color="success"
                  variant="solid"
                >
                  View your VR
                </Button>
              )}
            </td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}