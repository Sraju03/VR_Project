import { Box, Paper, styled } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Button from "@mui/joy/Button";


const Upload = () => {
  const VisuallyHiddenInput = styled("input")`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
  `;

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
            {/* <Button
              variant="outlined"
              startIcon={<UploadFileOutlinedIcon />}
              sx={{
                color: "#ffb800",
                borderColor: "#ffb800",
                "&:hover": {
                  backgroundColor: "#fff3cd",
                  borderColor: "#ffa000",
                },
              }}
            >
              Upload Image
            </Button> */}
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
              <VisuallyHiddenInput type="file" />
            </Button>
          </div>
        </Box>
      </Paper>
    </div>
  );
};

export default Upload;
