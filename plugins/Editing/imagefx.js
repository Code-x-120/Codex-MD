import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import { uploadToUrl } from '../../lib/toUrl.js';
import axios from 'axios';

async function downloadBuffer(url) {
  const r = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
  return Buffer.from(r.data);
}

export default [
  {
    name: 'hd',
    aliases: ['tohd', 'upscale', 'hdimage', 'enhance'],
    description: 'Upscale/enhance image using AI',
    run: async (context) => {
      const { client, m } = context;
      const fq = getFakeQuoted(m);
      const quoted = m.quoted || m;
      const mime = quoted?.mimetype || '';
      if (!/image/.test(mime)) return client.sendMessage(m.chat, { text: '╭─ *Eʀʀᴏʀ*\n│ Reply to an image to upscale.\n╰─ Codex-MD' }, { quoted: fq });
      await client.sendMessage(m.chat, { react: { text: '⏳', key: m.reactKey } });
      try {
        const media = await client.downloadMediaMessage(quoted);
        const url = await uploadToUrl(media);
        const apis = [
          `https://api.siputzx.my.id/api/tools/upscale?url=${encodeURIComponent(url)}`,
          `https://api.yanzbotz.live/api/tools/upscale?url=${encodeURIComponent(url)}`,
        ];
        let result = null;
        for (const api of apis) {
          try { const r = await axios.get(api, { timeout: 30000, responseType: 'arraybuffer' }); result = Buffer.from(r.data); break; } catch {}
        }
        if (!result) throw new Error('All upscale APIs failed');
        await client.sendMessage(m.chat, { image: result, caption: '╭─ *HD*\n│ Image upscaled successfully\n╰─ Codex-MD' }, { quoted: fq });
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      } catch (e) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        await client.sendMessage(m.chat, { text: '╭─ *Fᴀɪʟᴇᴅ*\n│ ' + (e.message || 'Upscale failed') + '\n╰─ Codex-MD' }, { quoted: fq });
      }
    }
  },
  {
    name: 'emojimix',
    aliases: ['emix', 'mixemoji', 'emojimix'],
    description: 'Mix two emojis together',
    run: async (context) => {
      const { client, m, text } = context;
      const fq = getFakeQuoted(m);
      if (!text) return client.sendMessage(m.chat, { text: '╭─ *EᴍᴏᴊɪMɪx*\n│ Usage: .emojimix 😎😭\n│ Give me two emojis.\n╰─ Codex-MD' }, { quoted: fq });
      const emojis = text.match(/([\u{1F000}-\u{1FFFF}]|[\u2600-\u27BF]|[\u{2700}-\u{27BF}])/gu) || [];
      if (emojis.length < 2) return client.sendMessage(m.chat, { text: '╭─ *Eʀʀᴏʀ*\n│ Give me at least 2 emojis.\n╰─ Codex-MD' }, { quoted: fq });
      await client.sendMessage(m.chat, { react: { text: '⏳', key: m.reactKey } });
      try {
        const res = await axios.get(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emojis[0] + '_' + emojis[1])}`, { timeout: 10000 });
        const url = res.data?.results?.[0]?.url;
        if (!url) throw new Error('No mix found');
        const buf = await downloadBuffer(url);
        await client.sendMessage(m.chat, { image: buf, caption: '╭─ *EᴍᴏᴊɪMɪx*\n│ ' + emojis[0] + ' + ' + emojis[1] + '\n╰─ Codex-MD' }, { quoted: fq });
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      } catch (e) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        await client.sendMessage(m.chat, { text: '╭─ *Fᴀɪʟᴇᴅ*\n│ ' + (e.message || 'Could not mix emojis') + '\n╰─ Codex-MD' }, { quoted: fq });
      }
    }
  },
  {
    name: 'attp',
    aliases: ['animatedtext', 'attp'],
    description: 'Create animated text to image',
    run: async (context) => {
      const { client, m, text } = context;
      const fq = getFakeQuoted(m);
      if (!text) return client.sendMessage(m.chat, { text: '╭─ *ATTP*\n│ Usage: .attp <text>\n│ Creates an animated text image.\n╰─ Codex-MD' }, { quoted: fq });
      await client.sendMessage(m.chat, { react: { text: '⏳', key: m.reactKey } });
      try {
        const res = await axios.get(`https://api.siputzx.my.id/api/maker/attp?text=${encodeURIComponent(text)}`, { timeout: 15000, responseType: 'arraybuffer' });
        const buf = Buffer.from(res.data);
        await client.sendMessage(m.chat, { image: buf, caption: '╭─ *ATTP*\n│ ' + text + '\n╰─ Codex-MD' }, { quoted: fq });
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      } catch (e) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        await client.sendMessage(m.chat, { text: '╭─ *Fᴀɪʟᴇᴅ*\n│ ' + (e.message || 'ATTP failed') + '\n╰─ Codex-MD' }, { quoted: fq });
      }
    }
  },
  {
    name: 'qc',
    aliases: ['quotesticker', 'qrsticker'],
    description: 'Create a quote sticker from text',
    run: async (context) => {
      const { client, m, text } = context;
      const fq = getFakeQuoted(m);
      if (!text) return client.sendMessage(m.chat, { text: '╭─ *QC*\n│ Usage: .qc <text>\n│ Creates a quote sticker.\n╰─ Codex-MD' }, { quoted: fq });
      await client.sendMessage(m.chat, { react: { text: '⏳', key: m.reactKey } });
      try {
        const apis = [
          `https://api.siputzx.my.id/api/maker/quote?text=${encodeURIComponent(text)}`,
          `https://restapi.frteam.xyz/quotemaker?text=${encodeURIComponent(text)}&background=random`,
        ];
        let buf = null;
        for (const api of apis) {
          try { const r = await axios.get(api, { timeout: 15000, responseType: 'arraybuffer' }); buf = Buffer.from(r.data); break; } catch {}
        }
        if (!buf) throw new Error('All QC APIs failed');
        await client.sendMessage(m.chat, { sticker: buf }, { quoted: fq });
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      } catch (e) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        await client.sendMessage(m.chat, { text: '╭─ *Fᴀɪʟᴇᴅ*\n│ ' + (e.message || 'QC failed') + '\n╰─ Codex-MD' }, { quoted: fq });
      }
    }
  },
  {
    name: 'ocr',
    aliases: ['readimg', 'imagetotext'],
    description: 'Extract text from image',
    run: async (context) => {
      const { client, m } = context;
      const fq = getFakeQuoted(m);
      const quoted = m.quoted || m;
      const mime = quoted?.mimetype || '';
      if (!/image/.test(mime)) return client.sendMessage(m.chat, { text: '╭─ *Oᴄʀ*\n│ Reply to an image with text.\n╰─ Codex-MD' }, { quoted: fq });
      await client.sendMessage(m.chat, { react: { text: '⏳', key: m.reactKey } });
      try {
        const media = await client.downloadMediaMessage(quoted);
        const url = await uploadToUrl(media);
        const res = await axios.get(`https://api.ocr.space/parse/imageurl?apikey=helloworld&url=${encodeURIComponent(url)}&language=eng`, { timeout: 15000 });
        const text = res.data?.ParsedResults?.[0]?.ParsedText;
        if (!text) throw new Error('No text detected');
        await client.sendMessage(m.chat, { text: '╭─ *Oᴄʀ* Rᴇsᴜʟᴛ\n│ ' + text.trim().split('\n').join('\n│ ') + '\n╰─ Codex-MD' }, { quoted: fq });
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      } catch (e) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        await client.sendMessage(m.chat, { text: '╭─ *Fᴀɪʟᴇᴅ*\n│ ' + (e.message || 'OCR failed') + '\n╰─ Codex-MD' }, { quoted: fq });
      }
    }
  },
  {
    name: 'tourl',
    aliases: ['upload', 'tourl'],
    description: 'Upload media to URL',
    run: async (context) => {
      const { client, m } = context;
      const fq = getFakeQuoted(m);
      const quoted = m.quoted || m;
      const mime = quoted?.mimetype || '';
      if (!mime) return client.sendMessage(m.chat, { text: '╭─ *TᴏURL*\n│ Reply to an image/video/audio.\n╰─ Codex-MD' }, { quoted: fq });
      await client.sendMessage(m.chat, { react: { text: '⏳', key: m.reactKey } });
      try {
        const media = await client.downloadMediaMessage(quoted);
        const url = await uploadToUrl(media);
        await client.sendMessage(m.chat, { text: '╭─ *TᴏURL*\n│ ' + url + '\n╰─ Codex-MD' }, { quoted: fq });
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      } catch (e) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        await client.sendMessage(m.chat, { text: '╭─ *Fᴀɪʟᴇᴅ*\n│ ' + (e.message || 'Upload failed') + '\n╰─ Codex-MD' }, { quoted: fq });
      }
    }
  },
  {
    name: 'ssweb',
    aliases: ['screenshot', 'ss', 'webshot'],
    description: 'Take screenshot of a website',
    run: async (context) => {
      const { client, m, text } = context;
      const fq = getFakeQuoted(m);
      if (!text) return client.sendMessage(m.chat, { text: '╭─ *SSWᴇʙ*\n│ Usage: .ssweb <url>\n╰─ Codex-MD' }, { quoted: fq });
      let url = text.trim();
      if (!url.startsWith('http')) url = 'https://' + url;
      await client.sendMessage(m.chat, { react: { text: '⏳', key: m.reactKey } });
      try {
        const apis = [
          `https://api.siputzx.my.id/api/tools/ssweb?url=${encodeURIComponent(url)}`,
          `https://image.thum.io/get/width/1200/crop/800/fullpage/${encodeURIComponent(url)}`,
        ];
        let buf = null;
        for (const api of apis) {
          try { const r = await axios.get(api, { timeout: 20000, responseType: 'arraybuffer' }); buf = Buffer.from(r.data); break; } catch {}
        }
        if (!buf) throw new Error('All screenshot APIs failed');
        await client.sendMessage(m.chat, { image: buf, caption: '╭─ *SSWᴇʙ*\n│ ' + url + '\n╰─ Codex-MD' }, { quoted: fq });
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      } catch (e) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        await client.sendMessage(m.chat, { text: '╭─ *Fᴀɪʟᴇᴅ*\n│ ' + (e.message || 'Screenshot failed') + '\n╰─ Codex-MD' }, { quoted: fq });
      }
    }
  },
  {
    name: 'smeme',
    aliases: ['stikmeme', 'smeme'],
    description: 'Create a sticker meme',
    run: async (context) => {
      const { client, m, text } = context;
      const fq = getFakeQuoted(m);
      const quoted = m.quoted || m;
      const mime = quoted?.mimetype || '';
      if (!text || !/image/.test(mime)) return client.sendMessage(m.chat, { text: '╭─ *Sᴍᴇᴍᴇ*\n│ Reply to image with text.\n│ Usage: .smeme top|bottom\n╰─ Codex-MD' }, { quoted: fq });
      await client.sendMessage(m.chat, { react: { text: '⏳', key: m.reactKey } });
      try {
        const media = await client.downloadMediaMessage(quoted);
        const url = await uploadToUrl(media);
        const res = await axios.get(`https://api.memegen.link/images/custom/${encodeURIComponent(text.split('|')[0] || '')}/${encodeURIComponent(text.split('|')[1] || '')}.png?background=${encodeURIComponent(url)}`, { timeout: 15000, responseType: 'arraybuffer' });
        await client.sendMessage(m.chat, { image: Buffer.from(res.data), caption: '╰─ Codex-MD' }, { quoted: fq });
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      } catch (e) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        await client.sendMessage(m.chat, { text: '╭─ *Fᴀɪʟᴇᴅ*\n│ ' + (e.message || 'Meme failed') + '\n╰─ Codex-MD' }, { quoted: fq });
      }
    }
  },
  {
    name: 'enc',
    aliases: ['encrypt', 'encode'],
    description: 'Text encryption/encoding tools',
    run: async (context) => {
      const { client, m, text, command } = context;
      const fq = getFakeQuoted(m);
      if (!text) return client.sendMessage(m.chat, { text: '╭─ *Eɴᴄʀʏᴘᴛ*\n│ Usage: .enc <text>\n│ Encodes to base64.\n│ .decrypt <base64> to decode.\n╰─ Codex-MD' }, { quoted: fq });
      const encoded = Buffer.from(text).toString('base64');
      await client.sendMessage(m.chat, { text: '╭─ *Eɴᴄʀʏᴘᴛᴇᴅ*\n│ Original: ' + text + '\n│ Base64: ' + encoded + '\n╰─ Codex-MD' }, { quoted: fq });
    }
  },
  {
    name: 'decrypt',
    aliases: ['decode', 'decrypt'],
    description: 'Decrypt/decode base64 text',
    run: async (context) => {
      const { client, m, text } = context;
      const fq = getFakeQuoted(m);
      if (!text) return client.sendMessage(m.chat, { text: '╭─ *Dᴇᴄʀʏᴘᴛ*\n│ Usage: .decrypt <base64>\n╰─ Codex-MD' }, { quoted: fq });
      try {
        const decoded = Buffer.from(text.trim(), 'base64').toString('utf8');
        await client.sendMessage(m.chat, { text: '╭─ *Dᴇᴄʀʏᴘᴛᴇᴅ*\n│ Input: ' + text + '\n│ Result: ' + decoded + '\n╰─ Codex-MD' }, { quoted: fq });
      } catch {
        await client.sendMessage(m.chat, { text: '╭─ *Fᴀɪʟᴇᴅ*\n│ Invalid base64 input.\n╰─ Codex-MD' }, { quoted: fq });
      }
    }
  },
  {
    name: 'toreal',
    aliases: ['realistic', 'toreal'],
    description: 'Convert anime/stylized image to realistic',
    run: async (context) => {
      const { client, m } = context;
      const fq = getFakeQuoted(m);
      const quoted = m.quoted || m;
      const mime = quoted?.mimetype || '';
      if (!/image/.test(mime)) return client.sendMessage(m.chat, { text: '╭─ *TᴏRᴇᴀʟ*\n│ Reply to an anime image.\n╰─ Codex-MD' }, { quoted: fq });
      await client.sendMessage(m.chat, { react: { text: '⏳', key: m.reactKey } });
      try {
        const media = await client.downloadMediaMessage(quoted);
        const url = await uploadToUrl(media);
        const res = await axios.get(`https://api.siputzx.my.id/api/ai/toanime?url=${encodeURIComponent(url)}&style=realistic`, { timeout: 30000, responseType: 'arraybuffer' });
        await client.sendMessage(m.chat, { image: Buffer.from(res.data), caption: '╭─ *TᴏRᴇᴀʟ*\n╰─ Codex-MD' }, { quoted: fq });
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      } catch (e) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        await client.sendMessage(m.chat, { text: '╭─ *Fᴀɪʟᴇᴅ*\n│ ' + (e.message || 'Conversion failed') + '\n╰─ Codex-MD' }, { quoted: fq });
      }
    }
  }
];
