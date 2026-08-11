import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Ensure public/data exists
const publicDataDir = path.join(rootDir, 'public', 'data');
fs.mkdirSync(publicDataDir, { recursive: true });

// Copy data files to public/data
['categories.json', 'links.json', 'site-settings.json'].forEach((file) => {
  const src = path.join(rootDir, 'data', file);
  const dest = path.join(publicDataDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
});

// Ensure public/_redirects exists for Cloudflare Pages
const redirectsContent = `/api/categories /data/categories.json 200
/api/links /data/links.json 200
/api/site-settings /data/site-settings.json 200
/tool/:slug /tool/:slug.html 200
`;
fs.writeFileSync(path.join(rootDir, 'public', '_redirects'), redirectsContent);

console.log('✅ Prepared static data and Cloudflare Pages _redirects file successfully!');
