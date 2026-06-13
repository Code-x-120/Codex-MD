import fetch from 'node-fetch';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
  const NEXRAY = 'https://api.nexray.web.id/downloader/bilibili?url=';

  export default async (context) => {
      const { client, m, text, prefix } = context;
      const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
      if (!text) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
          return m.reply(`╭─ Codex-MD\n│ Example: ${prefix}bilibili https://www.bilibili.com/video/BVxxxxxx\n╰─ Codex-MD`);
      }
      if (!text.includes('bilibili.com') && !text.includes('b23.tv')) return m.reply('╭─ Codex-MD\n│ That\'s not a Bilibili link.\n╰─ Codex-MD');
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
      try {
          const r = await fetch(NEXRAY + encodeURIComponent(text.trim()), { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 25000 });
          const d = await r.json();
          if (!d.status || !d.result) throw new Error('Bilibili API failed');
          const res = d.result;
          const videoUrl = res.url || res.video || res.download;
          if (!videoUrl) throw new Error('No download URL found');
          await client.sendMessage(m.chat, {
              video: { url: videoUrl },
              mimetype: 'video/mp4',
              caption: `╭─ *Bilibili DL*\n│ 🎬 ${res.title || 'Bilibili Video'}\n│ 👤 ${res.author || res.owner || 'N/A'}\n╰─ Codex-MD`
          }, { quoted: fq });
          await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      } catch (e) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
          m.reply(`╭─ Codex-MD\n│ Failed: ${e.message}\n╰─ Codex-MD`);
      }
  };
  