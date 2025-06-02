import subprocess
from pathlib import Path

EXIFTOOL_PATH = r"C:\Users\Prasannakumar\Desktop\exiftool-13.30_64\exiftool-13.30_64\exiftool.exe"

def check_360_metadata(image_path: Path):
    result = subprocess.run(
        [EXIFTOOL_PATH, "-XMP-GPano:All", str(image_path)],
        capture_output=True,
        text=True,
        check=True
    )
    print("XMP-GPano metadata:\n", result.stdout)

# Example usage
check_360_metadata(Path(r"C:\Users\Prasannakumar\Desktop\smaple\results\vr_panorama_b180a0e960da4a478d36bb0e01b76c6e.jpg"))
