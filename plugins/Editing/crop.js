import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import crypto from 'crypto';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TMP_DIR = path.join(__dirname, '../../tmp');
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

export default {
  name: 'crop',
  aliases: ['square', 'cropper', 'cropimage'],
  description: 'Crop sticker/image/video to perfect square',
  category: 'Editing',
  run: async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    try {
      const quoted = m.quoted;
      if (!quoted) {
        return m.reply("╭─ *Crop*\n│ Reply to an image/sticker/video to crop it.\n╰─ Codex-MD");
      }

      const quotedMsg = quoted.message || quoted;
      const msgType = Object.keys(quotedMsg).find(k =>
        ['imageMessage', 'stickerMessage', 'videoMessage'].includes(k)
      );
      if (!msgType) {
        return m.reply("╭─ *Error*\n│ Reply to an image, sticker, or video.\n╰─ Codex-MD");
      }

      const mediaBuffer = await client.downloadMediaMessage(quoted).catch(() => null);
      if (!mediaBuffer) {
        return m.reply("╭─ *Error*\n│ Could not download media.\n╰─ Codex-MD");
      }

      const ext = msgType === 'stickerMessage' ? '.webp' : msgType === 'videoMessage' ? '.mp4' : '.png';
      const inputFile = path.join(TMP_DIR, `crop_in_${crypto.randomBytes(4).toString('hex')}${ext}`);
      const outputFile = path.join(TMP_DIR, `crop_out_${crypto.randomBytes(4).toString('hex')}.webp`);

      fs.writeFileSync(inputFile, mediaBuffer);

      let cmd;
      if (msgType === 'videoMessage') {
        cmd = `ffmpeg -i "${inputFile}" -vf "crop='min(ih,iw)':min(ih,iw)" -vcodec libwebp -lossless 1 -q:v 70 "${outputFile}" -y`;
      } else {
        cmd = `ffmpeg -i "${inputFile}" -vf "crop='min(ih,iw)':min(ih,iw)" -vcodec libwebp -lossless 1 -q:v 90 "${outputFile}" -y`;
      }

      await execAsync(cmd);
      const outputBuffer = fs.readFileSync(outputFile);

      await client.sendMessage(m.chat, { sticker: outputBuffer }, { quoted: fq });

      fs.unlink(inputFile, () => {});
      fs.unlink(outputFile, () => {});
      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } }).catch(() => {});

    } catch (e) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return m.reply(`╭─ *Error*\n│ ${e.message}\n╰─ Codex-MD`);
    }
  }
};
