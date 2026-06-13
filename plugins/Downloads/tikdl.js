import fetch from 'node-fetch';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
  const NEXRAY = 'https://api.nexray.web.id/downloader/tiktok?url=';

  export default async (context) => {
      const { client, m, text, prefix } = context;
      const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
      if (!text) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
          return m.reply(`╭─ Codex-MD\n│ Example: ${prefix}tiktok https://vt.tiktok.com/xxx\n╰─ Codex-MD`);
      }
      if (!text.includes('tiktok.com')) return m.reply('╭─ Codex-MD\n│ That\'s not a TikTok link.\n╰─ Codex-MD');
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
      try {
          const r = await fetch(NEXRAY + encodeURIComponent(text.trim()), { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 });
          const d = await r.json();
          if (!d.status || !d.result) throw new Error('API failed');
          const { title, duration, data: videoUrl, cover, stats, author } = d.result;
          if (!videoUrl) throw new Error('No video URL returned');
          const dlRes = await fetch(videoUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 40000 });
          if (!dlRes.ok) throw new Error('Download failed: ' + dlRes.status);
          const buf = Buffer.from(await dlRes.arrayBuffer());
          await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
          const views = stats?.views || 'N/A';
          const likes = stats?.likes || 'N/A';
          const cap = `╭─ *TikTok DL*\n│ ${title || 'TikTok Video'}\n│ 👤 ${author?.nickname || 'Unknown'}\n│ ⏱ ${duration || 'N/A'}\n│ 👁 ${views} views | ❤️ ${likes} likes\n╰─ Codex-MD`;
          await client.sendMessage(m.chat, { video: buf, caption: cap, mimetype: 'video/mp4', gifPlayback: false }, { quoted: fq });
      } catch (e) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
          m.reply(`╭─ Codex-MD\n│ TikTok download failed.\n│ The video might be private or the\n│ service is down. Try again later.\n╰─ Codex-MD`);
      }
  };
  