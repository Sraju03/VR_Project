import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- Step 1

import Table from "@mui/joy/Table";
import UploadStatus from "./UploadStatus";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import ViewInArIcon from "@mui/icons-material/ViewInAr";

const files = ["Living Room.jpg", "Bedroom.jpg", "Kitchen.jpg", "Bathroom.jpg"];

export default function UploadTable() {
  const [completedStatuses, setCompletedStatuses] = useState<boolean[]>(
    Array(files.length).fill(false)
  );
  const [finalLoading, setFinalLoading] = useState(false);
  const [finalDone, setFinalDone] = useState(false);

  const navigate = useNavigate(); // <-- Step 2

  const handleComplete = (index: number) => {
    setCompletedStatuses((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  useEffect(() => {
    const allCompleted = completedStatuses.every((status) => status);
    if (allCompleted && completedStatuses.length > 0) {
      setFinalLoading(true);
      const timer = setTimeout(() => {
        setFinalDone(true);
        setFinalLoading(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [completedStatuses]);

  // <-- Step 3
  const handleVrClick = () => {
    navigate("/viewer");
  };

  return (
    <div className="mt-7">
      <Table aria-label="Upload Status Table" variant="soft" color="neutral">
        <thead>
          <tr>
            <th>Processing Files</th>
          </tr>
        </thead>
        <tbody>
          {files.map((filename, index) => (
            <tr key={index}>
              <td>
                <InsertDriveFileIcon />
                <UploadStatus
                  filename={filename}
                  index={index}
                  delay={3000}
                  onComplete={() => handleComplete(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              {finalLoading && (
                <div className="flex justify-center items-center gap-2">
                  <CircularProgress size="sm" />
                  <span className="text-sm text-gray-700">
                    Finalizing VR...
                  </span>
                </div>
              )}
              {finalDone && (
                <Button
                  sx={{ m: 1 }}
                  onClick={handleVrClick}
                  endDecorator={<ViewInArIcon />}
                  color="success"
                  variant="solid"
                >
                  View your VR
                </Button>
              )}
            </td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}
