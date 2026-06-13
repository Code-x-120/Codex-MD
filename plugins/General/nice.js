const NICE_FILE = './data/nice.json';
import fs from 'fs';
import path from 'path';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

function loadNice() {
  try {
    if (fs.existsSync(NICE_FILE)) {
      return JSON.parse(fs.readFileSync(NICE_FILE, 'utf-8'));
    }
  } catch {}
  return { count: 0 };
}

function saveNice(data) {
  const dir = path.dirname(NICE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(NICE_FILE, JSON.stringify(data, null, 2));
}

export default {
  name: 'nice',
  aliases: ['69', 'nicemoment'],
  description: 'Nice counter',
  run: async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);
    const data = loadNice();
    data.count++;
    saveNice(data);
    await client.sendMessage(m.chat, {
      text: `╭─ *Nice*\n│ ${data.count}\n╰─ Codex-MD`
    }, { quoted: fq });
  }
};
