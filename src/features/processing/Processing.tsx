import { useLocation } from "react-router-dom";
import { Typography } from "@mui/joy";
import { Back } from "../../components/Back";
import Container from "@mui/material/Container";
import Navbar from "../../components/Navbar";
import TableVariant from "../../components/TableVariant";

type UploadedImage = {
  image: string;
  fileName: string;
  chipLabel: string;
};

const Processing = () => {
  const { state } = useLocation();
  const uploadedImages: UploadedImage[] = state?.uploadedImages || [];

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

      <Container maxWidth="md" sx={{ width: "fit-content" }}>
        <TableVariant uploadedImages={uploadedImages} />
      </Container>
    </>
  );
};

export default Processing;