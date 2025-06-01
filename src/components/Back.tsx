import Button from "@mui/joy/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const Back = () => {
  return (
    <>
     
        <Button
          sx={{ position: "absolute", right: 1, margin: 1 }}
          disabled
          variant="solid"
          startDecorator={<ArrowBackIcon />}
        >
          Back to Previous Screen
        </Button>
      
    </>
  );
};
