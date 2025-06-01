// import Typography from "@mui/material/Typography";
import { Typography } from "@mui/joy";
import { Back } from "../../components/Back";
import Container from "@mui/material/Container";
import Navbar from "../../components/Navbar";
import UploadTable from "../../components/TableVariant";
import { Paper } from "@mui/material";

// import UploadStatus from "../../components/UploadStatus";

// import { VrSceneBox } from "../../components/VrSceneBox";

const Processing = () => {
  return (
    <>
      <Navbar />
      <Back />
      <div className="mt-16 mx-auto max-w-fit">
        <Typography level="h1">Sample Villa – Walkthrough VR Scene</Typography>
        <Typography
          level="body-xs"
          textColor="text.secondary"
          sx={{ fontSize: "md", mt: 0.5, mx: "auto", width: "fit-content" }}
        >
          Your immersive property walkthrough is ready to view and share
        </Typography>
      </div>

      {/* <UploadStatus filename="Living Room.jpg" delay={3000} /> */}

      <Container
        maxWidth="md"
        sx={{
          width: "fit-content",
        }}
      >
        <Paper elevation={16} className="w-2xl mx-auto ">
          <UploadTable />
        </Paper>
      </Container>
    </>
  );
};

export default Processing;
