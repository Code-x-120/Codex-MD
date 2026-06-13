import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SESSION_PATH = path.join(ROOT_DIR, 'Session');
const SESSION_FILE = path.join(ROOT_DIR, 'session.json');

async function loadSession() {
  if (!fs.existsSync(SESSION_FILE)) {
    console.log('No session.json found');
    return;
  }

  const raw = fs.readFileSync(SESSION_FILE, 'utf8');
  const { SESSION_ID } = JSON.parse(raw);
  if (!SESSION_ID) {
    console.log('No SESSION_ID in session.json');
    return;
  }

  const sessionData = SESSION_ID.replace(/^CODEX-MD:~/, '').replace(/^CYPHER-X:~/, '');
  const buf = Buffer.from(sessionData, 'base64');

  if (!fs.existsSync(SESSION_PATH)) {
    fs.mkdirSync(SESSION_PATH, { recursive: true });
  }

  // Check if it's a ZIP (PK\x03\x04 signature)
  if (buf[0] === 0x50 && buf[1] === 0x4b && buf[2] === 0x03 && buf[3] === 0x04) {
    const zipPath = SESSION_PATH + '.zip';
    fs.writeFileSync(zipPath, buf);
    execSync(`unzip -o "${zipPath}" -d "${SESSION_PATH}"`, { timeout: 10000 });
    fs.unlinkSync(zipPath);
    console.log('Session loaded from ZIP');
  } else {
    // Legacy: plain JSON
    const creds = JSON.parse(buf.toString());
    fs.writeFileSync(path.join(SESSION_PATH, 'creds.json'), JSON.stringify(creds, null, 2));
    console.log('Session loaded (legacy format)');
  }
}

export default loadSession;
