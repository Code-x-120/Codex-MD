import fetch from 'node-fetch';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
  const NEXRAY = 'https://api.nexray.web.id/downloader/snackvideo?url=';

  export default async (context) => {
      const { client, m, text, prefix } = context;
      const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
      if (!text) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
          return m.reply(`╭─ Codex-MD\n│ Example: ${prefix}snackvideo https://sck.io/xxxxx\n╰─ Codex-MD`);
      }
      if (!text.includes('sck.io') && !text.includes('snackvideo.com')) return m.reply('╭─ Codex-MD\n│ That\'s not a SnackVideo link.\n╰─ Codex-MD');
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
      try {
          const r = await fetch(NEXRAY + encodeURIComponent(text.trim()), { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 });
          const d = await r.json();
          if (!d.status || !d.result) throw new Error('SnackVideo API failed');
          const res = d.result;
          const videoUrl = res.url || res.video || res.download;
          if (!videoUrl) throw new Error('No download URL found');
          const dlRes = await fetch(videoUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 35000 });
          const buf = Buffer.from(await dlRes.arrayBuffer());
          await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
          await client.sendMessage(m.chat, {
              video: buf, mimetype: 'video/mp4',
              caption: `╭─ *SnackVideo DL*\n│ 🎬 ${res.title || 'SnackVideo'}\n│ 👤 ${res.author || res.username || 'N/A'}\n╰─ Codex-MD`
          }, { quoted: fq });
      } catch (e) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
          m.reply(`╭─ Codex-MD\n│ Failed: ${e.message}\n╰─ Codex-MD`);
      }
  };
  