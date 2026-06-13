import fetch from 'node-fetch';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
  const NEXRAY = 'https://api.nexray.web.id/downloader/twitter?url=';

  export default async (context) => {
      const { client, m, text, prefix } = context;
      const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
      if (!text) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
          return m.reply(`╭─ Codex-MD\n│ Example: ${prefix}twitter https://x.com/user/status/xxxx\n╰─ Codex-MD`);
      }
      if (!text.includes('twitter.com') && !text.includes('x.com') && !text.includes('t.co')) return m.reply('╭─ Codex-MD\n│ That\'s not a Twitter/X link.\n╰─ Codex-MD');
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
      try {
          const r = await fetch(NEXRAY + encodeURIComponent(text.trim()), { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 });
          const d = await r.json();
          if (!d.status || !d.result) throw new Error('API failed');
          const { title, duration, download_url } = d.result;
          const best = (download_url || []).find(u => u.type === 'mp4') || (download_url || [])[0];
          if (!best?.url) throw new Error('No video found in this tweet');
          const dlRes = await fetch(best.url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 40000 });
          if (!dlRes.ok) throw new Error('Download failed: ' + dlRes.status);
          const buf = Buffer.from(await dlRes.arrayBuffer());
          await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
          await client.sendMessage(m.chat, {
              video: buf, mimetype: 'video/mp4',
              caption: `╭─ *Twitter/X Video*\n│ ${(title || '').slice(0, 80)}\n│ Duration: ${duration || 'N/A'}\n│ Quality: ${best.resolusi || 'HD'}\n╰─ Codex-MD`
          }, { quoted: fq });
      } catch (e) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
          m.reply(`╭─ Codex-MD\n│ Twitter/X download failed.\n│ The tweet might be private or deleted.\n│ Try again later.\n╰─ Codex-MD`);
      }
  };
  