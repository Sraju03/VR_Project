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
  image: string;
  fileName: string;
  chipLabel: string;
};

const Home = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const navigate = useNavigate();

  const handleUpload = (newImage: UploadedImage) => {
    if (!newImage.image.startsWith("data:image/")) {
      alert("Only images (JPEG, PNG, WebP) are supported.");
      return;
    }
    setUploadedImages((prev) => [...prev, newImage]);
  };

  const handleGenerateClick = () => {
    if (uploadedImages.length === 0) {
      alert("Please upload at least one image before generating.");
      return;
    }
    navigate("/processing", { state: { uploadedImages } });
  };

  return (
    <div>
      <Navbar />
      <SceneConfigure />
      <Upload onUpload={handleUpload} />

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
            {uploadedImages.length} File{uploadedImages.length !== 1 && "s"} Uploaded
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
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => {
                  handleUpload({
                    image: reader.result as string,
                    fileName: file.name,
                    chipLabel: "Image",
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
            disabled={uploadedImages.length === 0}
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