import Box from "@mui/material/Box";
import Button from "@mui/joy/Button";
import { styled } from "@mui/joy";
import PlayForWorkIcon from "@mui/icons-material/PlayForWork";
import Typography from "@mui/joy/Typography";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import UploadFileIcon from "@mui/icons-material/UploadFile";

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

export default function BottomNav() {
  //   const [auth, setAuth] = React.useState(true);
  //   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  //   const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
  //     setAnchorEl(event.currentTarget);
  //   };

  //   const handleClose = () => {
  //     setAnchorEl(null);
  //   };

  return (
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
          <PlayForWorkIcon />4 File Uploaded
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
          <VisuallyHiddenInput type="file" />
        </Button>

        <Button
          component="label"
          role={undefined}
          tabIndex={-1}
          variant="outlined"
          color="neutral"
          sx={{ backgroundColor: "#ffb800" }}
        >
          <AutoAwesomeIcon className="mr-1.5" />
          Generate
          <VisuallyHiddenInput type="file" />
        </Button>
      </div>
    </Box>
  );
}
