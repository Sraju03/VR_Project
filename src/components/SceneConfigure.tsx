// import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import LandscapeIcon from "@mui/icons-material/Landscape";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import Grid from "@mui/material/Grid";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ListItem,
  TextField,
} from "@mui/material";

import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const sceneType = [
  { label: "", value: "" },
  { label: "Apartment", value: "apartment" },
  { label: "Villa", value: "villa" },
  { label: "House", value: "house" },
  { label: "Condo", value: "condo" },
  { label: "Townhouse", value: "townhouse" },
  { label: "Commercial", value: "commercial" },
  { label: "Land", value: "land" },
  { label: "Others", value: "others" },
];

export default function SceneConfigure() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "100%",
      }}
    >
      <Accordion sx={{padding:"0.3%"}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Scene Configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1} sx={{ width: "80%", mx: "auto" }}>
            <Grid size={4}>
              <ListItem>
                {/* <label className="text-sm font-medium mb-1">Scene Name</label> */}
                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <LandscapeIcon
                    sx={{ color: "action.active", mr: 1, my: 0.5 }}
                  />
                  <TextField
                    id="input-with-sx"
                    label="Scene Name"
                    variant="standard"
                  />
                </Box>
              </ListItem>
            </Grid>
            <Grid size={4}>
              <ListItem>
                <TextField
                  id="standard-select-currency-native"
                  select
                  label="Select Type"
                  defaultValue="EUR"
                  slotProps={{
                    select: {
                      native: true,
                    },
                  }}
                  helperText="Please select your Property Type"
                  variant="standard"
                >
                  {sceneType.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </ListItem>
            </Grid>
            <Grid size={4}>
              <ListItem>
                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <SpeakerNotesIcon
                    sx={{ color: "action.active", mr: 1, my: 0.5 }}
                  />
                  <TextField
                    id="standard-multiline-flexible"
                    label="Notes(Additional info)"
                    multiline
                    maxRows={5}
                    variant="standard"
                    className="w-60"
                  />
                </Box>
              </ListItem>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
