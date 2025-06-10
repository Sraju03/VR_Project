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
  image: string;
  chipLabel: string;
  fileName: string;
  onDelete: () => void;
}

export default function VrCard({
  image,
  fileName,
  chipLabel,
  onDelete,
}: VrCardProps) {
  return (
    <Card variant="outlined" sx={{ width: 320 }}>
      <div className="flex justify-between">
        <Checkbox />
        <Button
          variant="outlined"
          color="danger"
          startDecorator={<DeleteIcon />}
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>

      <CardOverflow>
        <AspectRatio ratio="2">
          <img src={image} alt={fileName} loading="lazy" />
        </AspectRatio>
        <Chip sx={{ backgroundColor: "#b3d8ff" }}>{chipLabel}</Chip>
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
            {fileName}
          </Typography>
        </CardContent>
      </CardOverflow>
    </Card>
  );
}
