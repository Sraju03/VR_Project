import Container from "@mui/material/Container";
import image1 from "../Assets/Image1.jpg";
import Chip from "@mui/joy/Chip";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import Grid from "@mui/material/Grid";
import { Box, Button, ListItem } from "@mui/joy";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import RoofingIcon from "@mui/icons-material/Roofing";

export const VrSceneBox = () => {
  return (
    <>
      <Container
        maxWidth="sm"
        sx={{
          // backgroundColor: "#004b93",
          // width: "fit-content",
          // height: "50%",
          mt: 2,
          mx: "auto",
        }}
      >
        <Box>
          {" "}
          <Chip
            sx={{ m: 2 }}
            color="success"
            variant="soft"
            startDecorator={<ViewInArIcon />}
          >
            VR Image
          </Chip>
          <img src={image1} alt="My Asset" />
        </Box>

        <Grid container spacing={2} sx={{ mt: 2, mx: "auto" }}>
          <Grid size={4}>
            <ListItem>
              <Button startDecorator={<HeadsetMicIcon />}>
                Open in HeadSet
              </Button>
            </ListItem>
          </Grid>
          <Grid size={4}>
            <ListItem>
              <Button startDecorator={<FileCopyIcon />}>
                Copy Shareable Link
              </Button>
            </ListItem>
          </Grid>
          <Grid size={4}>
            <ListItem>
              <Button startDecorator={<RoofingIcon />}>
                Back to My Scenes
              </Button>
            </ListItem>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
