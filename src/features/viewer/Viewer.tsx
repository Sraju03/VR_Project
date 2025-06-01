import { Typography } from "@mui/joy";
import Navbar from "../../components/Navbar";
import { VrSceneBox } from "../../components/VrSceneBox";

const Viewer = () => {
  return (
    <>
      <Navbar />
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
      <VrSceneBox />
    </>
  );
};

export default Viewer;
