// import AspectRatio from "@mui/joy/AspectRatio";
// import Card from "@mui/joy/Card";
// import CardContent from "@mui/joy/CardContent";
// import CardOverflow from "@mui/joy/CardOverflow";
// import Divider from "@mui/joy/Divider";
// import Typography from "@mui/joy/Typography";
// import Checkbox from "@mui/joy/Checkbox";

// import DeleteIcon from "@mui/icons-material/Delete";
// import Button from "@mui/joy/Button";
// import Chip from "@mui/joy/Chip";

// export default function VrCard() {
//   return (
//     <Card variant="outlined" sx={{ width: 320 }}>
//       <div className="flex justify-between">
//         <Checkbox />
//         <Button
//           variant="outlined"
//           color="danger"
//           startDecorator={<DeleteIcon />}
//         >
//           Delete
//         </Button>
//       </div>
//       <CardOverflow>
//         <AspectRatio ratio="2">
//           <img
//             src="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318"
//             srcSet="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318&dpr=2 2x"
//             loading="lazy"
//             alt=""
//           />
//           <Chip sx={{ backgroundColor: "#b3d8ff" }}>LandScape</Chip>
//         </AspectRatio>
//       </CardOverflow>
//       {/* <CardContent></CardContent> */}
//       <CardOverflow variant="soft" sx={{ bgcolor: "background.level1" }}>
//         <Divider inset="context" />
//         <CardContent orientation="horizontal">
//           <Checkbox defaultChecked />
//           <Typography
//             level="body-xs"
//             textColor="text.secondary"
//             sx={{ fontWeight: "md" }}
//           >
//             Include in VR
//           </Typography>
//           <Divider orientation="vertical" />
//           <Typography
//             level="body-xs"
//             textColor="text.secondary"
//             sx={{ fontWeight: "md" }}
//           >
//             Filename.jpg
//           </Typography>
//         </CardContent>
//       </CardOverflow>
//     </Card>
//   );
// }

// src/components/VrCard.tsx

import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Checkbox from "@mui/joy/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";

interface VrCardProps {
  imageUrl: string;
  chipLabel: string;
  filename: string;
}

export default function VrCard({ imageUrl, chipLabel, filename }: VrCardProps) {
  return (
    <Card variant="outlined" sx={{ width: 320 }}>
      <div className="flex justify-between">
        <Checkbox />
        <Button
          variant="outlined"
          color="danger"
          startDecorator={<DeleteIcon />}
        >
          Delete
        </Button>
      </div>

      <CardOverflow>
        <AspectRatio ratio="2">
          <img
            src={imageUrl}
            
            loading="lazy"
            alt={filename}
          />
          <Chip sx={{ backgroundColor: "#b3d8ff" }}>{chipLabel}</Chip>
        </AspectRatio>
      </CardOverflow>

      <CardOverflow variant="soft" sx={{ bgcolor: "background.level1" }}>
        <Divider inset="context" />
        <CardContent orientation="horizontal">
          <Checkbox defaultChecked />
          <Typography
            level="body-xs"
            textColor="text.secondary"
            sx={{ fontWeight: "md" }}
          >
            Include in VR
          </Typography>
          <Divider orientation="vertical" />
          <Typography
            level="body-xs"
            textColor="text.secondary"
            sx={{ fontWeight: "md" }}
          >
            {filename}
          </Typography>
        </CardContent>
      </CardOverflow>
    </Card>
  );
}
