#!/usr/bin/env node
/**
 * build.js
 * Scans the /assets folder and writes js/data.js, which the site reads.
 *
 * Run this any time you add, remove, or rename images:
 *   node build.js
 *
 * Folder shape expected:
 *   assets/
 *     logo.png                (or: assets/logo/anything.png)
 *     Project Name/
 *       1L.jpg                <- full-width image, row 1
 *       2s L.jpg              <- left half of row 2
 *       2s R.jpg              <- right half of row 2
 *       3L.jpg                <- full-width image, row 3
 *       info.json             <- optional: { "title", "description", "order" }
 *     Another Project/
 *       ...
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const ASSETS_DIR = path.join(ROOT, 'assets');
const OUT_FILE = path.join(ROOT, 'js', 'data.js');
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|svg)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov)$/i;
const MEDIA_EXT = /\.(jpe?g|png|webp|gif|svg|mp4|webm|mov)$/i;
function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function findLogo() {
  if (!fs.existsSync(ASSETS_DIR)) return null;
  const entries = fs.readdirSync(ASSETS_DIR);

  const direct = entries.find(
    (e) => MEDIA_EXT.test(e) && path.parse(e).name.toLowerCase() === 'logo'
  );
  if (direct) return `assets/${direct}`;

  const logoDir = path.join(ASSETS_DIR, 'logo');
  if (fs.existsSync(logoDir) && fs.statSync(logoDir).isDirectory()) {
    const files = fs.readdirSync(logoDir).filter((f) => MEDIA_EXT.test(f));
    if (files.length) return `assets/logo/${files[0]}`;
  }
  return null;
}

// Turns a flat file list into an ordered list of rows: {type:'large', src}
// or {type:'pair', left, right}, sorted by the leading row number.
function parseRows(files) {
  const large = new Map();
  const pair = new Map();

  files.forEach((file) => {
    const name = path.parse(file).name.trim();

    let m = name.match(/^(\d+)\s*s\s*([LR])$/i);
    if (m) {
      const n = parseInt(m[1], 10);
      const side = m[2].toUpperCase();
      const entry = pair.get(n) || {};
      entry[side] = file;
      pair.set(n, entry);
      return;
    }

    m = name.match(/^(\d+)\s*L$/i);
    if (m) {
      large.set(parseInt(m[1], 10), file);
    }
  });

  const rows = [];
  const numbers = new Set([...large.keys(), ...pair.keys()]);
  [...numbers]
    .sort((a, b) => a - b)
    .forEach((n) => {
      if (large.has(n)) {
        rows.push({ type: 'large', src: large.get(n) });
      } else if (pair.has(n)) {
        const { L, R } = pair.get(n);
        rows.push({ type: 'pair', left: L || null, right: R || null });
      }
    });
  return rows;
}

function readInfo(dir) {
  const infoPath = path.join(dir, 'info.json');
  if (!fs.existsSync(infoPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(infoPath, 'utf8'));
  } catch (e) {
    console.warn(`  ! Could not parse info.json in ${dir}: ${e.message}`);
    return {};
  }
}

function buildProjects() {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.warn('No assets/ folder found next to build.js.');
    return [];
  }

  const scriptPath = path.join(ROOT, 'scripts', 'optimize_images.py');
  if (process.argv.includes('--optimize') && fs.existsSync(scriptPath)) {
    try {
      const { execSync } = require('child_process');
      console.log('Optimizing images and generating thumbnails...');
      execSync(`python3 "${scriptPath}"`, { stdio: 'inherit' });
    } catch (e) {
      console.warn(`  ! Image optimization failed: ${e.message}`);
    }
  }

  const entries = fs
    .readdirSync(ASSETS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('_') && !e.name.startsWith('.') && e.name.toLowerCase() !== 'logo');

  const projects = entries.map((entry, index) => {
    const dir = path.join(ASSETS_DIR, entry.name);
    const files = fs.readdirSync(dir).filter((f) => {
      const fullPath = path.join(dir, f);
      return MEDIA_EXT.test(f) && fs.statSync(fullPath).size > 0;
    });
    const rows = parseRows(files);
    const info = readInfo(dir);
    const unmatched = files.filter((f) => {
      const name = path.parse(f).name.trim();
      return !/^(\d+)\s*s\s*([LR])$/i.test(name) && !/^(\d+)\s*L$/i.test(name);
    });

    if (unmatched.length) {
      console.warn(
        `  ! "${entry.name}" has file(s) that don't match the naming pattern (ignored): ${unmatched.join(', ')}`
      );
    }

    const withPath = (f) => (f ? `assets/${entry.name}/${f}` : null);
    const withThumb = (f) => {
      if (!f) return null;
      const thumbRelative = `assets/_thumbs/${entry.name}/${f}`;
      const thumbFull = path.join(ROOT, thumbRelative);
      if (fs.existsSync(thumbFull)) {
        return thumbRelative;
      }
      return withPath(f);
    };
    const isVideo = (f) => (f ? VIDEO_EXT.test(f) : false);
    const toMedia = (f) => (f ? { src: withPath(f), thumb: withThumb(f), video: isVideo(f) } : null);

    const coverRow = rows[0];
    const cover = coverRow
      ? toMedia(coverRow.type === 'large' ? coverRow.src : coverRow.left || coverRow.right)
      : toMedia(files[0]);

    const gallery = rows.flatMap((r) =>
      r.type === 'large' ? [toMedia(r.src)] : [toMedia(r.left), toMedia(r.right)].filter(Boolean)
    );

    return {
      slug: info.slug || slugify(entry.name, index),
      title: info.title || entry.name,
      description: info.description || '',
      direction: info.direction || '',
      order: typeof info.order === 'number' ? info.order : index,
      cover,
      gallery,
      rows: rows.map((r) =>
        r.type === 'large'
          ? { type: 'large', src: withPath(r.src), thumb: withThumb(r.src), video: isVideo(r.src) }
          : {
              type: 'pair',
              left: withPath(r.left),
              leftThumb: withThumb(r.left),
              leftVideo: isVideo(r.left),
              right: withPath(r.right),
              rightThumb: withThumb(r.right),
              rightVideo: isVideo(r.right),
            }
      ),
    };
  });

  return projects.sort((a, b) => a.order - b.order);
}
const data = {
  generatedAt: new Date().toISOString(),
  logo: findLogo(),
  projects: buildProjects(),
};

const banner =
  '// Auto-generated by build.js — do not edit by hand.\n' +
  '// Re-run "node build.js" any time you add, remove, or rename images in /assets.\n';

fs.writeFileSync(OUT_FILE, `${banner}window.SITE_DATA = ${JSON.stringify(data, null, 2)};\n`);

console.log(`✓ Wrote ${data.projects.length} project(s) to js/data.js`);
if (!data.logo) {
  console.log('  (No logo found — add assets/logo.png, or a file inside assets/logo/)');
}
