import { Box, Paper } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Button from "@mui/joy/Button";
import type { ChangeEvent } from "react";
// import ChangeEvent from "react";

interface UploadProps {
  onUpload: (file: {
    image: string;
    fileName: string;
    chipLabel: string;
  }) => void;
}

const Upload = ({ onUpload }: UploadProps) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    debugger
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onUpload({
        image: reader.result as string,
        fileName: file.name,
        chipLabel: file.type.includes("image") ? "Image" : "Video",
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="m-3">
      <Paper elevation={16}>
        <Box
          component="section"
          sx={{ p: 2, display: "flex", justifyContent: "space-between" }}
        >
          <div>
            <p className="text-sm font-medium text-gray-600">
              Upload images or walkthrough videos
            </p>
            <p className="text-xs text-gray-400">
              JPG, PNG, MP4 (max 100MB per file)
            </p>
          </div>
          <div>
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
              <input type="file"  multiple hidden onChange={handleFileChange} />
            </Button>
          </div>
        </Box>
      </Paper>
    </div>
  );
};

export default Upload;
