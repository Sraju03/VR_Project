import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SceneConfigure from "../components/SceneConfigure";
import Upload from "../components/Upload";
import VrCard from "../components/VrCard";
import Box from "@mui/material/Box";
import Button from "@mui/joy/Button";
import PlayForWorkIcon from "@mui/icons-material/PlayForWork";
import Typography from "@mui/joy/Typography";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import UploadFileIcon from "@mui/icons-material/UploadFile";

type UploadedImage = {
  image: string; // base64 string
  fileName: string;
  chipLabel: string;
};

const Home = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const navigate = useNavigate();

  // Convert base64 to Blob
  const base64ToBlob = (base64: string, contentType: string) => {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  };

  const handleUpload = (newImage: UploadedImage) => {
    setUploadedImages((prev) => [...prev, newImage]);
  };

  const handleGenerateClick = async () => {
    if (uploadedImages.length === 0) {
      alert("Please upload at least one image before generating.");
      return;
    }

    // Prepare FormData to send images
    const formData = new FormData();
    uploadedImages.forEach((img, index) => {
      const contentType =
        img.chipLabel === "Image" ? "image/jpeg" : "video/mp4"; // Adjust based on chipLabel
      const blob = base64ToBlob(img.image, contentType);
      formData.append("images", blob, img.fileName);
    });

    try {
      // Send images to the backend /upload endpoint
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }

      const result = await response.json();
      if (result.success) {
        // Navigate to /processing with the panorama path
        navigate("/processing", {
          state: { panoramaPath: result.panorama_path },
        });
      } else {
        throw new Error("Backend processing failed");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to process images. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <SceneConfigure />
      <Upload onUpload={handleUpload} />

      {/* Display uploaded VrCards */}
      <div className="flex flex-wrap gap-6 justify-center p-8">
        {uploadedImages.map((img, idx) => (
          <VrCard
            key={idx}
            image={img.image}
            fileName={img.fileName}
            chipLabel={img.chipLabel}
            onDelete={() => {
              setUploadedImages((prev) => prev.filter((_, i) => i !== idx));
            }}
          />
        ))}
      </div>

      {/* Bottom Bar */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          backgroundColor: "#fff",
          borderTop: "1px solid #ccc",
          display: "flex",
          justifyContent: "space-between",
          padding: "1.5% 5%",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <div>
          <Typography
            level="body-sm"
            textColor="text.secondary"
            sx={{ fontWeight: "md" }}
          >
            <PlayForWorkIcon />
            {uploadedImages.length} File{uploadedImages.length !== 1 && "s"}{" "}
            Uploaded
          </Typography>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            component="label"
            role={undefined}
            tabIndex={-1}
            variant="outlined"
            color="neutral"
            sx={{ backgroundColor: "#004b93", color: "#fff" }}
          >
            <UploadFileIcon className="mr-1.5" />
            Upload a file
            <input
              type="file"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => {
                  handleUpload({
                    image: reader.result as string,
                    fileName: file.name,
                    chipLabel: file.type.includes("image") ? "Image" : "Video",
                  });
                };
                reader.readAsDataURL(file);
              }}
            />
          </Button>

          <Button
            onClick={handleGenerateClick}
            variant="outlined"
            color="neutral"
            sx={{ backgroundColor: "#ffb800" }}
            disabled={uploadedImages.length === 0} // Disable if no images
          >
            <AutoAwesomeIcon className="mr-1.5" />
            Generate
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default Home;
