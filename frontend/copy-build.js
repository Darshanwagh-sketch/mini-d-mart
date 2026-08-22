import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.resolve(__dirname, '../src/main/resources/static');
const distDir = path.resolve(__dirname, 'dist');
const mainDir = path.resolve(__dirname, 'main/resources/static');

try {
  if (fs.existsSync(source)) {
    fs.mkdirSync(distDir, { recursive: true });
    fs.cpSync(source, distDir, { recursive: true });

    fs.mkdirSync(mainDir, { recursive: true });
    fs.cpSync(source, mainDir, { recursive: true });
    console.log('Successfully copied build files to dist and main/resources/static');
  }
} catch (err) {
  console.error('Copy build files warning:', err.message);
}
