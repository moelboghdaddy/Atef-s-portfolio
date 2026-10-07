import os
import shutil
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(ROOT, 'assets')
THUMBS_DIR = os.path.join(ASSETS_DIR, 'thumbs')

def run():
    print(f"Starting image optimization in {ASSETS_DIR}...")
    os.makedirs(THUMBS_DIR, exist_ok=True)
    
    # 1. Clean zero-byte files
    for root, dirs, files in os.walk(ASSETS_DIR):
        if 'thumbs' in root:
            continue
        for f in files:
            fp = os.path.join(root, f)
            if os.path.getsize(fp) == 0:
                print(f"Removing 0-byte corrupt file: {fp}")
                os.remove(fp)

    # 2. Optimize images and generate thumbnails
    for entry in sorted(os.listdir(ASSETS_DIR)):
        proj_dir = os.path.join(ASSETS_DIR, entry)
        if not os.path.isdir(proj_dir) or entry.startswith(('_', '.')) or entry.lower() in ('logo', 'thumbs'):
            continue

        proj_thumb_dir = os.path.join(THUMBS_DIR, entry)
        os.makedirs(proj_thumb_dir, exist_ok=True)

        files = [f for f in os.listdir(proj_dir) if f.lower().endswith(('.webp', '.png', '.jpg', '.jpeg'))]
        print(f"\nProcessing project: {entry} ({len(files)} images)")

        for f in sorted(files):
            src_path = os.path.join(proj_dir, f)
            base_name = os.path.splitext(f)[0]
            thumb_path = os.path.join(proj_thumb_dir, base_name + '.webp')
            
            try:
                with Image.open(src_path) as im:
                    im_rgb = im.convert('RGB')
                    w, h = im_rgb.size
                    orig_sz = os.path.getsize(src_path)

                    if w == 0 or h == 0:
                        print(f"  Skipping {f}: invalid dimensions")
                        continue

                    needs_downscale = max(w, h) > 2000
                    needs_recompress = orig_sz > 500 * 1024 or f.lower().endswith('.png')

                    if needs_downscale or needs_recompress:
                        if needs_downscale:
                            scale = 2000 / max(w, h)
                            new_w = round(w * scale)
                            new_h = round(h * scale)
                            optimized = im_rgb.resize((new_w, new_h), Image.Resampling.LANCZOS)
                        else:
                            new_w, new_h = w, h
                            optimized = im_rgb

                        dest_webp = os.path.join(proj_dir, base_name + '.webp')
                        optimized.save(dest_webp, 'WEBP', quality=85, method=6)
                        new_sz = os.path.getsize(dest_webp)
                        print(f"  [FULL RESIZED] {f} -> {os.path.basename(dest_webp)}: {w}x{h} ({orig_sz//1024}KB) -> {new_w}x{new_h} ({new_sz//1024}KB)")
                        
                        if dest_webp != src_path and os.path.exists(src_path):
                            os.remove(src_path)
                        src_path = dest_webp
                        w, h = new_w, new_h
                        im_rgb = optimized

                    # Generate Thumbnail (target 760x520 bounding box)
                    if not os.path.exists(thumb_path) or os.path.getsize(thumb_path) == 0:
                        scale_th = min(760 / w, 520 / h)
                        if scale_th < 1.0:
                            th_w = round(w * scale_th)
                            th_h = round(h * scale_th)
                            thumb = im_rgb.resize((th_w, th_h), Image.Resampling.LANCZOS)
                        else:
                            th_w, th_h = w, h
                            thumb = im_rgb

                        thumb.save(thumb_path, 'WEBP', quality=80)
                        th_sz = os.path.getsize(thumb_path)
                        print(f"  [THUMB CREATED] {os.path.basename(thumb_path)}: {th_w}x{th_h} ({th_sz//1024}KB)")

            except Exception as e:
                print(f"  Error processing {f}: {e}")

    print("\nOptimization complete!")

if __name__ == '__main__':
    run()
