import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import axios from 'axios';

const EFFECTS = {
  '1917': { url: '1917', type: 'photooxy' },
  'arena': { url: 'arena', type: 'photooxy' },
  'devil': { url: 'devil', type: 'photooxy' },
  'firetext': { url: 'firetext', type: 'photooxy' },
  'hackertext': { url: 'hackertext', type: 'photooxy' },
  'icetext': { url: 'icetext', type: 'photooxy' },
  'impressive': { url: 'impressive', type: 'photooxy' },
  'leaves': { url: 'leaves', type: 'photooxy' },
  'lighttext': { url: 'lighttext', type: 'photooxy' },
  'metallic': { url: 'metallic', type: 'photooxy' },
  'neontext': { url: 'neontext', type: 'photooxy' },
  'purpletext': { url: 'purpletext', type: 'photooxy' },
  'sandtext': { url: 'sandtext', type: 'photooxy' },
  'snowtext': { url: 'snowtext', type: 'photooxy' },
  'thunder': { url: 'thunder', type: 'photooxy' },
  'blackpink': { url: 'blackpink', type: 'photooxy' },
  'glitch': { url: 'glitch', type: 'photooxy' }
};

export default {
  name: 'textmaker17',
  aliases: Object.keys(EFFECTS),
  description: '17 additional text effects',
  category: 'Editing',
  run: async (context) => {
    const { client, m, command, text, args } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    try {
      const effect = EFFECTS[command];
      if (!effect) {
        return m.reply(
          `╭─ *Text Effects*\n│ ${Object.keys(EFFECTS).map(e => '.${e} <text>').join('\n│ ')}\n╰─ Codex-MD`
        );
      }

      if (!text) {
        return m.reply(`╭─ *Usage*\n│ .${command} <text>\n│ Example: .${command} Hello World\n╰─ Codex-MD`);
      }

      const baseUrl = effect.type === 'photooxy'
        ? 'https://api.akuari.my.id/photooxy'
        : 'https://api.akuari.my.id/ephoto360';

      const APIs = [
        `${baseUrl}/${effect.url}?text=${encodeURIComponent(text)}`,
        `https://api.erdwpe.com/api/photooxy/${effect.url}?text=${encodeURIComponent(text)}`,
        `https://api.lolhuman.xyz/api/photooxy/${effect.url}?apikey=rey2k22&text=${encodeURIComponent(text)}`
      ];

      let imageUrl = null;
      for (const api of APIs) {
        try {
          const { data } = await axios.get(api, { timeout: 15000 });
          if (data?.result?.url) { imageUrl = data.result.url; break; }
          if (data?.result?.image) { imageUrl = data.result.image; break; }
          if (data?.url) { imageUrl = data.url; break; }
          if (data?.image) { imageUrl = data.image; break; }
          if (typeof data?.result === 'string' && data.result.startsWith('http')) { imageUrl = data.result; break; }
          if (data?.status && Buffer.isBuffer(data)) { imageUrl = data; break; }
        } catch {}
      }

      if (!imageUrl) {
        return m.reply("╭─ *Error*\n│ Image generation failed. Try again.\n╰─ Codex-MD");
      }

      await client.sendMessage(m.chat, {
        image: { url: imageUrl },
        caption: `╭─ *${command.toUpperCase()}*\n│ ${text}\n╰─ Codex-MD`
      }, { quoted: fq });

      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } }).catch(() => {});

    } catch (e) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return m.reply(`╭─ *Error*\n│ ${e.message}\n╰─ Codex-MD`);
    }
  }
};
