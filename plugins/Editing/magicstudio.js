import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import axios from 'axios';

export default {
  name: 'magicstudio',
  aliases: ['genimage', 'aiimage', 'midjourney', 'imagineai', 'dalle', 'magicai'],
  description: 'Generate AI art from text prompt',
  category: 'Editing',
  run: async (context) => {
    const { client, m, text, args } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    try {
      if (!text) {
        return m.reply("╭─ *Imagine AI* 🎨\n│ Usage: .imagine <prompt>\n│ Example: .imagine a cyberpunk cat\n╰─ Codex-MD");
      }

      const prompt = text.trim();
      const APIs = [
        `https://api.siputzx.my.id/api/ai/magicstudio?prompt=${encodeURIComponent(prompt)}`,
        `https://api.akuari.my.id/ai/magicstudio?prompt=${encodeURIComponent(prompt)}`,
        `https://api.erdwpe.com/api/ai/magicstudio?prompt=${encodeURIComponent(prompt)}`
      ];

      let imageBuffer = null;
      for (const api of APIs) {
        try {
          const res = await axios.get(api, {
            responseType: 'arraybuffer',
            timeout: 120000,
            headers: { 'User-Agent': 'Mozilla/5.0' }
          });
          if (res.data && res.data.length > 1000) {
            imageBuffer = Buffer.from(res.data);
            break;
          }
        } catch {}
      }

      if (!imageBuffer) {
        return m.reply("╭─ *Error*\n│ AI image generation failed. Try again.\n╰─ Codex-MD");
      }

      await client.sendMessage(m.chat, {
        image: imageBuffer,
        caption: `╭─ *Imagine AI* 🎨\n│ Prompt: ${prompt}\n╰─ Codex-MD`
      }, { quoted: fq });

      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } }).catch(() => {});

    } catch (e) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return m.reply(`╭─ *Error*\n│ ${e.message || 'AI generation failed'}\n╰─ Codex-MD`);
    }
  }
};
