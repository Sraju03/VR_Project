import React, { useEffect, useState, useRef } from "react";
import Container from "@mui/material/Container";
import Chip from "@mui/joy/Chip";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import { Box, Button, Grid, ListItem } from "@mui/joy";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import RoofingIcon from "@mui/icons-material/Roofing";

// Define the props type
type VrSceneBoxProps = {
  panoramaPath?: string; // Optional string prop
};

const VrSceneBox = ({ panoramaPath: initialPanoramaPath }: VrSceneBoxProps) => {
  const [panoramaPath, setPanoramaPath] = useState<string | undefined>(
    initialPanoramaPath
  );
  const [panoramaList, setPanoramaList] = useState<string[]>([]); // List of panorama paths
  const [aframeLoaded, setAframeLoaded] = useState(false); // Track if A-Frame script is loaded
  const sceneRef = useRef<HTMLDivElement>(null); // Ref for the A-Frame scene container

  // Load A-Frame script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://aframe.io/releases/1.4.2/aframe.min.js";
    script.async = true;
    script.onload = () => setAframeLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch panorama list on mount
  useEffect(() => {
    const fetchPanoramas = async () => {
      try {
        const response = await fetch("http://localhost:8000/list-panoramas");
        if (!response.ok) {
          throw new Error(`Failed to fetch panoramas: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && data.panoramas.length > 0) {
          setPanoramaList(data.panoramas);
          // Set the first panorama as the default if no initialPanoramaPath is provided
          if (!initialPanoramaPath) {
            setPanoramaPath(data.panoramas[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching panoramas:", error);
      }
    };

    fetchPanoramas();
  }, [initialPanoramaPath]);

  // Initialize the A-Frame scene and auto-rotation
  useEffect(() => {
    if (!aframeLoaded || !sceneRef.current) return;

    // Create the A-Frame scene
    const scene = document.createElement("a-scene");
    scene.setAttribute("id", "panorama");
    scene.setAttribute("embedded", "");
    scene.setAttribute("vr-mode-ui", "enabled: true");

    // Create the camera rig
    const cameraRig = document.createElement("a-entity");
    cameraRig.setAttribute("id", "cameraRig");
    cameraRig.setAttribute("rotation", "0 0 0");

    // Create the camera
    const camera = document.createElement("a-camera");
    camera.setAttribute("wasd-controls-enabled", "false");
    camera.setAttribute("look-controls", "enabled: true");
    cameraRig.appendChild(camera);

    // Create the sky
    const sky = document.createElement("a-sky");
    sky.setAttribute("id", "sky");
    sky.setAttribute("rotation", "0 -90 0");
    if (panoramaPath) {
      sky.setAttribute("src", `http://localhost:8000${panoramaPath}`);
    }

    // Append elements to the scene
    scene.appendChild(cameraRig);
    scene.appendChild(sky);
    sceneRef.current.appendChild(scene);

    // Auto-rotate the camera rig
    let angle = 0;
    const rotate = () => {
      angle += 0.1; // Adjust speed here (smaller is slower)
      cameraRig.setAttribute("rotation", `0 ${angle} 0`);
      requestAnimationFrame(rotate);
    };
    rotate();

    // Update the sky when panoramaPath changes
    const updateSky = () => {
      sky.setAttribute("src", `http://localhost:8000${panoramaPath}`);
    };
    if (panoramaPath) updateSky();

    // Cleanup on unmount
    return () => {
      sceneRef.current?.removeChild(scene);
    };
  }, [aframeLoaded, panoramaPath]);

  // Handle image uploads
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const files = (form.querySelector("#image-upload") as HTMLInputElement)
      .files;

    if (!files || files.length < 1) {
      alert("Please select at least one image.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.json().catch(() => response.text());
        throw new Error(
          `Server responded with ${response.status}: ${errorText}`
        );
      }

      const result = await response.json();
      if (result.success) {
        setPanoramaPath(result.panorama_path);
        setPanoramaList((prev) => [...prev, result.panorama_path]);
      } else {
        alert("Error: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Upload error:", error);
      if (error instanceof Error) {
        alert(`Upload failed: ${error.message}`);
      } else {
        alert("Upload failed: An unknown error occurred");
      }
    }
  };

  // Handle copying the shareable link
  const handleCopyLink = () => {
    if (panoramaPath) {
      const link = `http://localhost:8000${panoramaPath}`;
      navigator.clipboard.writeText(link).then(() => {
        alert("Link copied to clipboard!");
      });
    }
  };

  return (
    <>
      <Container
        maxWidth="sm"
        sx={{
          mt: 2,
          mx: "auto",
        }}
      >
        <Box>
          <Chip
            sx={{ m: 2 }}
            color="success"
            variant="soft"
            startDecorator={<ViewInArIcon />}
          >
            VR Image
          </Chip>
          <div>
            <h2>Processed VR Image</h2>
            {aframeLoaded ? (
              <div
                ref={sceneRef}
                style={{
                  width: "100%",
                  height: "70vh",
                  maxWidth: "1200px",
                  marginBottom: "20px",
                }}
              />
            ) : (
              <p>Loading VR scene...</p>
            )}
          </div>
        </Box>

        {/* Upload section */}
        <Box sx={{ textAlign: "center", my: 2 }}>
          <h2>Upload Images to Create VR Panorama</h2>
          <form id="upload-form" onSubmit={handleUpload}>
            <input
              type="file"
              id="image-upload"
              name="images"
              accept="image/jpeg,image/png,image/webp"
              multiple
              style={{ margin: "10px" }}
            />
            <br />
            <Button type="submit">Create and Display VR Panorama</Button>
          </form>
        </Box>

        {/* Image selector */}
        <Box sx={{ textAlign: "center", my: 2 }}>
          <h2>Previously Created Panoramas</h2>
          {panoramaList.length > 0 ? (
            panoramaList.map((path, index) => (
              <Button
                key={path}
                onClick={() => setPanoramaPath(path)}
                sx={{ m: 1 }}
              >
                Panorama {index + 1}
              </Button>
            ))
          ) : (
            <p>No panoramas available.</p>
          )}
        </Box>

        <Grid container spacing={2} sx={{ mt: 2, mx: "auto" }}>
          <Grid xs={4}>
            <ListItem>
              <Button startDecorator={<HeadsetMicIcon />}>
                Open in HeadSet
              </Button>
            </ListItem>
          </Grid>
          <Grid xs={4}>
            <ListItem>
              <Button
                startDecorator={<FileCopyIcon />}
                onClick={handleCopyLink}
              >
                Copy Shareable Link
              </Button>
            </ListItem>
          </Grid>
          <Grid xs={4}>
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

export default VrSceneBox;
