import Button from "@mui/joy/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export const Back = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <Button
      sx={{ position: "absolute", right: 1, margin: 1 }}
      variant="solid"
      startDecorator={<ArrowBackIcon />}
      onClick={handleBackClick}
    >
      Back to Previous Screen
    </Button>
  );
};