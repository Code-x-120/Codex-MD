import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  name: 'viewonce',
  aliases: ['vv', 'readonce', 'seevv', 'viewoncemedia'],
  description: 'Save view-once media',
  category: 'General',
  run: async (context) => {
    const { client, m, command } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    try {
      if (!m.quoted) {
        return m.reply("╭─ *View Once*\n│ Reply to a view-once media message.\n╰─ Codex-MD");
      }

      const quotedMsg = m.quoted.message || m.quoted;
      const viewOnceKey = Object.keys(quotedMsg).find(k =>
        k.endsWith('WithContext') && quotedMsg[k]?.viewOnce
      );
      const directViewOnce = Object.values(quotedMsg).find(v => v?.viewOnce);

      if (!viewOnceKey && !directViewOnce) {
        return m.reply("╭─ *Error*\n│ That's not a view-once message.\n╰─ Codex-MD");
      }

      const mediaMsg = quotedMsg[viewOnceKey] || directViewOnce;
      const mediaType = mediaMsg?.mimetype?.startsWith('image') ? 'image'
        : mediaMsg?.mimetype?.startsWith('video') ? 'video'
        : mediaMsg?.mimetype?.startsWith('audio') ? 'audio' : null;

      if (!mediaType) {
        return m.reply("╭─ *Error*\n│ No media found in view-once message.\n╰─ Codex-MD");
      }

      const mediaBuffer = await m.quoted.download?.() || await client.downloadMediaMessage(m.quoted).catch(() => null);
      if (!mediaBuffer) {
        return m.reply("╭─ *Error*\n│ Could not download media.\n╰─ Codex-MD");
      }

      const sendOpts = { caption: '📸 View-Once Media Saved!' };
      if (mediaType === 'image') sendOpts.image = mediaBuffer;
      else if (mediaType === 'video') sendOpts.video = mediaBuffer;
      else if (mediaType === 'audio') sendOpts.audio = mediaBuffer;

      await client.sendMessage(m.chat, sendOpts, { quoted: fq });
      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } }).catch(() => {});

    } catch (e) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return m.reply(`╭─ *Error*\n│ ${e.message}\n╰─ Codex-MD`);
    }
  }
};
