import os
from pathlib import Path
import cv2
import numpy as np
from PIL import Image
import logging
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uuid
import subprocess
import tempfile

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='image_processing.log',
    filemode='a'
)

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Define base directory dynamically (relative to main.py)
BASE_DIR = Path(__file__).resolve().parent
static_dir = BASE_DIR / "static"
results_dir = BASE_DIR / "results"


# Create directories if they don't exist
static_dir.mkdir(parents=True, exist_ok=True)
results_dir.mkdir(parents=True, exist_ok=True)


# Mount static directories
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")
app.mount("/results", StaticFiles(directory=str(results_dir)), name="results")

# G'MIC executable path
gmic_exe =  "/usr/bin/gmic"
if not gmic_exe.exists():
    logging.error(f"G'MIC executable not found at {gmic_exe}")
    raise RuntimeError(f"Place gmic executable in {gmic_exe.parent}")

# Exiftool path
EXIFTOOL_PATH = "/usr/bin/exiftool"
if not Path(EXIFTOOL_PATH).exists():
    logging.error(f"Exiftool not found at {EXIFTOOL_PATH}")
    raise RuntimeError(f"Install exiftool on the server (e.g., sudo apt install exiftool)")

# Enhance image using G'MIC
def enhance_image(img):
    try:
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_input:
            temp_input_path = Path(temp_input.name)
            cv2.imwrite(str(temp_input_path), img)

        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_output:
            temp_output_path = Path(temp_output.name)

        command = [
            str(gmic_exe),
            str(temp_input_path),
            "-smooth", "10",
            "-sharpen", "0.5",
            "-output", str(temp_output_path)
        ]
        subprocess.run(command, capture_output=True, text=True, check=True)

        enhanced_img = cv2.imread(str(temp_output_path))
        temp_input_path.unlink(missing_ok=True)
        temp_output_path.unlink(missing_ok=True)
        return enhanced_img
    except Exception as e:
        logging.error(f"Enhancement failed: {e}")
        raise ValueError("Image enhancement failed")

# Normalize image to desired size and color space
def normalize_image(img, target_size=(4096, 2048), normalize_pixels=True):
    try:
        img_resized = cv2.resize(img, target_size, interpolation=cv2.INTER_LANCZOS4)
        img_srgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)

        if normalize_pixels:
            img_normalized = img_srgb.astype(np.float32) / 255.0
            img_normalized = cv2.convertScaleAbs(img_normalized * 255.0)
        else:
            img_normalized = img_srgb

        return img_normalized
    except Exception as e:
        raise ValueError("Normalization failed")

# Inject 360 metadata using exiftool
def write_xmp_360_metadata(jpeg_path: Path):
    try:
        result = subprocess.run([
            EXIFTOOL_PATH,
            "-overwrite_original",
            "-XMP-GPano:UsePanoramaViewer=True",
            "-XMP-GPano:ProjectionType=equirectangular",
            "-XMP-GPano:FullPanoWidthPixels=4096",
            "-XMP-GPano:FullPanoHeightPixels=2048",
            "-XMP-GPano:CroppedAreaImageWidthPixels=4096",
            "-XMP-GPano:CroppedAreaImageHeightPixels=2048",
            "-XMP-GPano:CroppedAreaLeftPixels=0",
            "-XMP-GPano:CroppedAreaTopPixels=0",
            str(jpeg_path)
        ], check=True, capture_output=True, text=True)
        logging.info(f"360 metadata written to {jpeg_path}")
        print("ExifTool stdout:", result.stdout)
    except subprocess.CalledProcessError as e:
        logging.error(f"Exiftool error: {e.stderr}")
        raise RuntimeError(f"Failed to write 360 metadata: {e.stderr}")

# Process a single image: enhance, normalize, save, and write metadata
def process_single_image(image_path: Path, output_path: Path, target_size=(4096, 2048)):
    try:
        img = cv2.imread(str(image_path))
        if img is None:
            pil_img = Image.open(image_path).convert('RGB')
            img = np.array(pil_img)
            img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

        img_enhanced = enhance_image(img)
        vr_image = normalize_image(img_enhanced, target_size=target_size)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        cv2.imwrite(str(output_path), cv2.cvtColor(vr_image, cv2.COLOR_RGB2BGR))
        write_xmp_360_metadata(output_path)
        return output_path
    except Exception as e:
        raise ValueError(f"Processing failed: {e}")

# Merge multiple images horizontally or stitch, then normalize, save, and write metadata
def merge_images(image_paths: List[Path], output_path: Path, target_size=(4096, 2048), use_stitching=False):
    try:
        images = []
        for path in image_paths:
            img = cv2.imread(str(path))
            if img is None:
                pil_img = Image.open(path).convert('RGB')
                img = np.array(pil_img)
                img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
            images.append(enhance_image(img))

        if use_stitching:
            stitcher = cv2.Stitcher_create(cv2.Stitcher_PANORAMA)
            status, merged = stitcher.stitch(images)
            if status != cv2.Stitcher_OK:
                raise ValueError("Stitching failed")
        else:
            max_height = max(img.shape[0] for img in images)
            resized_images = [cv2.resize(img, (int(img.shape[1] * max_height / img.shape[0]), max_height)) for img in images]
            merged = np.hstack(resized_images)

        merged_normalized = normalize_image(merged, target_size=target_size)
        cv2.imwrite(str(output_path), cv2.cvtColor(merged_normalized, cv2.COLOR_RGB2BGR))
        write_xmp_360_metadata(output_path)
        return output_path
    except Exception as e:
        raise ValueError(f"Merging failed: {e}")

@app.get("/")
async def serve_index():
    index_path = static_dir / "index.html"
    if not index_path.exists():
        raise HTTPException(status_code=404, detail="index.html not found")
    return FileResponse(str(index_path))

@app.post("/upload")
async def upload_images(images: List[UploadFile] = File(...)):
    try:
        allowed_formats = {'image/jpeg', 'image/png', 'image/webp'}
        for image in images:
            if image.content_type not in allowed_formats:
                raise HTTPException(status_code=400, detail=f"Invalid file type: {image.filename}")

        uploaded_paths = []
        for image in images:
            filename = f"temp_{uuid.uuid4().hex}_{image.filename}"
            file_path = results_dir / filename
            with file_path.open("wb") as f:
                content = await image.read()
                if not content:
                    raise HTTPException(status_code=400, detail=f"Empty file: {image.filename}")
                f.write(content)
            uploaded_paths.append(file_path)

        output_filename = f"vr_panorama_{uuid.uuid4().hex}.jpg"
        output_path = results_dir / output_filename

        if len(uploaded_paths) == 1:
            merged_path = process_single_image(uploaded_paths[0], output_path)
        else:
            merged_path = merge_images(uploaded_paths, output_path, use_stitching=False)

        # Clean up temp uploads
        for temp_file in uploaded_paths:
            temp_file.unlink(missing_ok=True)

        return {
            "success": True,
            "panorama_path": f"/results/{output_filename}"
        }
    except Exception as e:
        logging.error(f"Upload failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)