
import Button from "@mui/joy/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Back = () => {
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleBackClick = () => {
    navigate("/home");
  };

  return (
    <Button
      sx={{ position: "absolute", right: 1, margin: 1 }}
      variant="solid"
      startDecorator={<ArrowBackIcon />}
      onClick={handleBackClick}
    >
      Back to Home
    </Button>
  );
};
