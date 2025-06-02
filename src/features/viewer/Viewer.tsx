import { useLocation } from "react-router-dom";
import { Typography, Box } from "@mui/joy";
import Navbar from "../../components/Navbar";
import VrSceneBox from "../../components/VrSceneBox";
import { Back } from "../../components/Back";

const Viewer = () => {
  const { state } = useLocation();
  const panoramaPath = state?.panoramaPath || "";

  console.log("Viewer received panoramaPath:", panoramaPath); // Debug log

  return (
    <>
      <Navbar />
      <Back />
      <Box
        sx={{
          maxWidth: "1300px",
          mx: "auto",
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 2,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography level="h1" sx={{ fontSize: { xs: "2rem", sm: "2.5rem" } }}>
            Sample Villa – Walkthrough VR Scene
          </Typography>
          <Typography
            level="body-md"
            textColor="text.secondary"
            sx={{ mt: 1, fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            Your immersive property walkthrough is ready to view and share
          </Typography>
        </Box>
        {!panoramaPath ? (
          <Typography color="danger" sx={{ mt: 2 }}>
            Error: No panorama path provided. Please return to the home page and upload images.
          </Typography>
        ) : (
          <VrSceneBox panoramaPath={panoramaPath} />
        )}
      </Box>
    </>
  );
};

export default Viewer;