"""Regenerate curated assets: python scripts/prepare-salon-media.py --source-root PATH.

Uses the existing Pillow and ffmpeg tools; no website dependencies are needed.
Original Instagram downloads are never modified. Crops remain in CSS.
"""
import argparse
import json
from pathlib import Path
import subprocess

from PIL import Image, ImageOps

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source-root', type=Path, required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
media = json.loads((root / 'src/content/salon-media.json').read_text())
destination = root / 'public/images/salon'
destination.mkdir(parents=True, exist_ok=True)
for name, photo in media['photos'].items():
    with Image.open(args.source_root / photo['source']) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        for width in photo['widths']:
            height = round(image.height * width / image.width)
            image.resize((width, height), Image.Resampling.LANCZOS).save(
                destination / f'{name}-{width}.webp', quality=84, method=6,
            )

destination = root / 'public/videos/salon'
destination.mkdir(parents=True, exist_ok=True)
for name, video in media['videos'].items():
    subprocess.run([
        'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y',
        '-i', str(args.source_root / video['source']), '-an',
        '-c:v', 'libx264', '-crf', '25', '-preset', 'medium',
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
        str(destination / f'{name}.mp4'),
    ], check=True)
