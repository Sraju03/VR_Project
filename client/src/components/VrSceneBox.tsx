import { useEffect, useState, useRef } from "react";
import Container from "@mui/material/Container";
import Chip from "@mui/joy/Chip";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import { Box, Button } from "@mui/joy";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";

interface AFrameScene extends HTMLElement {
  is: (state: string) => boolean;
  enterVR: () => void;
  exitVR: () => void;
}

declare global {
  interface Window {
    AFRAME: any;
  }
}

type VrSceneBoxProps = {
  panoramaPath?: string;
};

const VrSceneBox = ({ panoramaPath }: VrSceneBoxProps) => {
  const [aframeLoaded, setAframeLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [fov, setFov] = useState(80);
  const sceneRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLElement | null>(null);
  const sceneInstanceRef = useRef<AFrameScene | null>(null);

  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://aframe.io/releases/1.5.0/aframe.min.js"]'
    );

    if (existingScript && window.AFRAME) {
      setAframeLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://aframe.io/releases/1.5.0/aframe.min.js";
    script.async = true;
    script.onload = () => {
      console.log("A-Frame loaded successfully");
      setAframeLoaded(true);
    };
    script.onerror = () => console.error("Failed to load A-Frame script");
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (panoramaPath) {
      const imageUrl = `http://localhost:8000${panoramaPath}`;
      console.log("Validating image URL:", imageUrl);
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        console.log("Image loaded successfully:", imageUrl);
        setImageError(false);
      };
      img.onerror = (error) => {
        console.error("Failed to load image:", imageUrl, error);
        setImageError(true);
      };
    } else {
      console.warn("No panoramaPath provided");
    }
  }, [panoramaPath]);

  useEffect(() => {
    if (!aframeLoaded || !sceneRef.current || !panoramaPath || imageError) {
      if (!panoramaPath) console.warn("Panorama path is undefined");
      if (!window.AFRAME) console.warn("A-Frame not available");
      if (imageError) console.warn("Image failed to load");
      return;
    }

    console.log("Rendering A-Frame scene with panorama:", panoramaPath);
    const scene = document.createElement("a-scene") as AFrameScene;
    scene.setAttribute("embedded", "");
    scene.setAttribute("vr-mode-ui", "enabled: true");
    sceneInstanceRef.current = scene;

    const cameraRig = document.createElement("a-entity");
    cameraRig.setAttribute("id", "cameraRig");
    cameraRig.setAttribute("rotation", "0 0 0");

    const camera = document.createElement("a-camera");
    camera.setAttribute("wasd-controls-enabled", "false");
    camera.setAttribute("look-controls", "enabled: true");
    camera.setAttribute("fov", fov.toString());
    cameraRig.appendChild(camera);
    cameraRef.current = camera;

    const sky = document.createElement("a-sky");
    sky.setAttribute("id", "sky");
    sky.setAttribute("rotation", "0 -90 0");
    sky.setAttribute("src", `http://localhost:8000${panoramaPath}`);
    scene.appendChild(cameraRig);
    scene.appendChild(sky);

    sceneRef.current.appendChild(scene);

    const stopRotationOnClick = () => {
      setIsRotating(false);
    };
    scene.addEventListener("click", stopRotationOnClick);

    let angle = 0;
    let animationFrameId: number;

    const rotate = () => {
      if (isRotating) {
        angle += 0.05;
        cameraRig.setAttribute("rotation", `0 ${angle} 0`);
      }
      animationFrameId = requestAnimationFrame(rotate);
    };
    rotate();

    return () => {
      scene.removeEventListener("click", stopRotationOnClick);
      cancelAnimationFrame(animationFrameId);
      if (sceneRef.current?.contains(scene)) {
        sceneRef.current.removeChild(scene);
      }
    };
  }, [aframeLoaded, panoramaPath, imageError, isRotating]);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.setAttribute("fov", fov.toString());
    }
  }, [fov]);

  const handleCopyLink = () => {
    if (!panoramaPath) return alert("No panorama path available");
    const fullLink = `http://localhost:8000${panoramaPath}`;
    navigator.clipboard.writeText(fullLink).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  const toggleRotation = () => {
    setIsRotating((prev) => !prev);
  };

  const zoomIn = () => {
    setFov((prev) => Math.max(20, prev - 5));
  };

  const zoomOut = () => {
    setFov((prev) => Math.min(120, prev + 5));
  };

  const resetView = () => {
    if (cameraRef.current) {
      setFov(80);
      const cameraRig = cameraRef.current.parentElement;
      if (cameraRig) {
        cameraRig.setAttribute("rotation", "0 0 0");
      }
      setIsRotating(true);
    }
  };

  const toggleVRMode = () => {
    if (sceneInstanceRef.current) {
      if (sceneInstanceRef.current.is("vr-mode")) {
        sceneInstanceRef.current.exitVR();
      } else {
        sceneInstanceRef.current.enterVR();
      }
    }
  };

  return (
    <Container sx={{ mt: 2, mx: "auto", maxWidth: "1300px" }}>
      <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
        <Chip sx={{ m: 2 }} color="success" variant="soft" startDecorator={<ViewInArIcon />}>
          VR Scene
        </Chip>
        <h2>Processed VR Scene</h2>
        {!aframeLoaded ? (
          <p>Loading VR scene...</p>
        ) : !panoramaPath ? (
          <p>No panorama image available. Please upload an image from the home page.</p>
        ) : imageError ? (
          <p>
            Failed to load panorama image: {`http://localhost:8000${panoramaPath}`}. Check the backend server and image path.
          </p>
        ) : (
          <>
            <div
              ref={sceneRef}
              style={{
                width: "100%",
                height: "80vh",
                maxWidth: "1300px",
                margin: "0 auto",
                marginBottom: "20px",
              }}
            />
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center", mb: 2 }}>
              <Button
                startDecorator={isRotating ? <PauseIcon /> : <PlayArrowIcon />}
                onClick={toggleRotation}
              >
                {isRotating ? "Pause Rotation" : "Resume Rotation"}
              </Button>
              <Button startDecorator={<ZoomInIcon />} onClick={zoomIn}>
                Zoom In
              </Button>
              <Button startDecorator={<ZoomOutIcon />} onClick={zoomOut}>
                Zoom Out
              </Button>
              <Button startDecorator={<RestartAltIcon />} onClick={resetView}>
                Reset View
              </Button>
              <Button startDecorator={<ThreeDRotationIcon />} onClick={toggleVRMode}>
                Toggle VR Mode
              </Button>
            </Box>
          </>
        )}
        {panoramaPath && !imageError && (
          <Box sx={{ textAlign: "center", my: 2 }}>
            <Button startDecorator={<FileCopyIcon />} onClick={handleCopyLink}>
              Copy Shareable Link
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default VrSceneBox;