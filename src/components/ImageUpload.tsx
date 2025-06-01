import { useState } from "react";
import VrCard from "./VrCard";

function ImageUpload() {
  const [base64Image, setBase64Image] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setBase64Image(reader.result); // Base64 string
        }
      };

      reader.readAsDataURL(file); // Convert to Base64
    }
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />
      {base64Image && (
        <VrCard image={base64Image} fileName={fileName} chipLabel="Uploaded" />
      )}
    </div>
  );
}

export default ImageUpload;
