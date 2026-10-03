import os
import subprocess
import shutil
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(ROOT, 'assets')
THUMBS_DIR = os.path.join(ASSETS_DIR, '_thumbs')

def get_dimensions(path):
    try:
        out = subprocess.check_output(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', path], text=True)
        w, h = 0, 0
        for line in out.splitlines():
            if 'pixelWidth' in line: w = int(line.split()[-1])
            if 'pixelHeight' in line: h = int(line.split()[-1])
        return w, h
    except Exception as e:
        print(f"Error getting dimensions for {path}: {e}")
        return 0, 0

def run():
    print(f"Starting image optimization in {ASSETS_DIR}...")
    os.makedirs(THUMBS_DIR, exist_ok=True)
    
    # 1. Clean zero-byte files
    for root, dirs, files in os.walk(ASSETS_DIR):
        if '_thumbs' in root:
            continue
        for f in files:
            fp = os.path.join(root, f)
            if os.path.getsize(fp) == 0:
                print(f"Removing 0-byte corrupt file: {fp}")
                os.remove(fp)

    # 2. Optimize images and generate thumbnails
    for entry in sorted(os.listdir(ASSETS_DIR)):
        proj_dir = os.path.join(ASSETS_DIR, entry)
        if not os.path.isdir(proj_dir) or entry.startswith(('_', '.')) or entry.lower() in ('logo', '_thumbs'):
            continue

        proj_thumb_dir = os.path.join(THUMBS_DIR, entry)
        os.makedirs(proj_thumb_dir, exist_ok=True)

        files = [f for f in os.listdir(proj_dir) if f.lower().endswith(('.webp', '.png', '.jpg', '.jpeg'))]
        print(f"\nProcessing project: {entry} ({len(files)} images)")

        for f in sorted(files):
            src_path = os.path.join(proj_dir, f)
            thumb_path = os.path.join(proj_thumb_dir, os.path.splitext(f)[0] + '.webp')
            
            w, h = get_dimensions(src_path)
            orig_sz = os.path.getsize(src_path)
            if w == 0 or h == 0:
                print(f"  Skipping {f}: invalid dimensions")
                continue

            # Full image optimization if > 2000px in either dimension or large file size
            needs_downscale = max(w, h) > 2000
            needs_recompress = orig_sz > 500 * 1024

            if needs_downscale or needs_recompress:
                new_w, new_h = w, h
                if needs_downscale:
                    if w >= h:
                        new_w = 2000
                        new_h = round(h * 2000 / w)
                    else:
                        new_h = 2000
                        new_w = round(w * 2000 / h)

                fd, tmp_out = tempfile.mkstemp(suffix='.webp')
                os.close(fd)

                cmd = ['cwebp', src_path, '-resize', str(new_w), str(new_h), '-q', '82', '-o', tmp_out]
                subprocess.check_call(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

                new_sz = os.path.getsize(tmp_out)
                if new_sz < orig_sz or needs_downscale:
                    shutil.move(tmp_out, src_path)
                    print(f"  [FULL RESIZED] {f}: {w}x{h} ({orig_sz//1024}KB) -> {new_w}x{new_h} ({new_sz//1024}KB)")
                    w, h = new_w, new_h
                else:
                    if os.path.exists(tmp_out):
                        os.remove(tmp_out)

            # Generate Thumbnail (target 760x520 bounding cover)
            target_w = 760
            target_h = 520
            aspect = w / h
            target_aspect = target_w / target_h

            if aspect >= target_aspect:
                th_h = target_h
                th_w = round(w * target_h / h)
            else:
                th_w = target_w
                th_h = round(h * target_w / w)

            # If the original is already smaller than the thumbnail size, don't upscale
            if w <= th_w and h <= th_h:
                th_w, th_h = w, h

            cmd = ['cwebp', src_path, '-resize', str(th_w), str(th_h), '-q', '80', '-o', thumb_path]
            subprocess.check_call(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            th_sz = os.path.getsize(thumb_path)
            print(f"  [THUMB CREATED] {os.path.basename(thumb_path)}: {th_w}x{th_h} ({th_sz//1024}KB)")

    print("\nOptimization complete!")

if __name__ == '__main__':
    run()
