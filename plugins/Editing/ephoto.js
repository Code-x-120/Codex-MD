import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import axios from 'axios';

async function downloadBuffer(url) {
  const r = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
  return Buffer.from(r.data);
}

const EFFECTS = {
  'glitchtext': { url: 'glitchtext', params: ['text'] },
  'glowingtext': { url: 'glowingtext', params: ['text'] },
  'writetext': { url: 'writetext', params: ['text'] },
  'advancedglow': { url: 'advancedglow', params: ['text'] },
  'typography': { url: 'typography', params: ['text'] },
  'blackpinklogo': { url: 'blackpinklogo', params: ['text'] },
  'blackpinkstyle': { url: 'blackpinkstyle', params: ['text'] },
  'neonglitch': { url: 'neonglitch', params: ['text'] },
  'luxurygold': { url: 'luxurygold', params: ['text'] },
  'gradienttext': { url: 'gradienttext', params: ['text'] },
  'watercolortext': { url: 'watercolortext', params: ['text'] },
  'papercutstyle': { url: 'papercutstyle', params: ['text'] },
  'cartoonstyle': { url: 'cartoonstyle', params: ['text'] },
  'dragonball': { url: 'dragonball', params: ['text'] },
  'graffiti': { url: 'graffiti', params: ['text'] },
  'pixelglitch': { url: 'pixelglitch', params: ['text'] },
  'sand': { url: 'sand', params: ['text'] },
  'summerbeach': { url: 'summerbeach', params: ['text'] },
  'galaxystyle': { url: 'galaxystyle', params: ['text'] },
  'galaxywallpaper': { url: 'galaxywallpaper', params: ['text'] },
  'makingneon': { url: 'makingneon', params: ['text'] },
  'lighteffects': { url: 'lighteffects', params: ['text'] },
  'incandescent': { url: 'incandescent', params: ['text'] },
  'effectclouds': { url: 'effectclouds', params: ['text'] },
  'flagtext': { url: 'flagtext', params: ['text', 'text2'] },
  'flag3dtext': { url: 'flag3dtext', params: ['text', 'text2'] },
  'multicoloredneon': { url: 'multicoloredneon', params: ['text'] },
  'deletingtext': { url: 'deletingtext', params: ['text'] },
  'royaltext': { url: 'royaltext', params: ['text'] },
  'topography': { url: 'topography', params: ['text'] },
  '1917style': { url: '1917style', params: ['text'] },
  'freecreate': { url: 'freecreate', params: ['text'] },
  'logomaker': { url: 'logomaker', params: ['text'] },
  'matrix': { url: 'matrix', params: ['text'] },
  'underwater': { url: 'underwater', params: ['text'], type: 'photooxy' },
  'coffeetext': { url: 'coffeetext', params: ['text'], type: 'photooxy' },
  'firetext': { url: 'firetext', params: ['text'], type: 'photooxy' },
  'harrypotter': { url: 'harrypotter', params: ['text'], type: 'photooxy' },
  'smoke': { url: 'smoke', params: ['text'], type: 'photooxy' },
  'wolf': { url: 'wolf', params: ['text'], type: 'photooxy' },
  'batman': { url: 'batman', params: ['text'], type: 'photooxy' },
  'naruto': { url: 'naruto', params: ['text'], type: 'photooxy' },
  'butterfly': { url: 'butterfly', params: ['text'], type: 'photooxy' },
  'sunset': { url: 'sunset', params: ['text'], type: 'photooxy' },
  'shadow': { url: 'shadow', params: ['text'], type: 'photooxy' },
  'cup': { url: 'cup', params: ['text'], type: 'photooxy' }
};

export default {
  name: 'textpro',
  aliases: Object.keys(EFFECTS),
  description: 'Create text effects using ephoto360 & photooxy',
  run: async (context) => {
    const { client, m, text, command } = context;
    const fq = getFakeQuoted(m);
    const effectName = command.toLowerCase();
    const effect = EFFECTS[effectName];

    if (!effect) {
      return client.sendMessage(m.chat, {
        text: '╭─ *ERROR*\n│ Unknown effect.\n╰─ Codex-MD'
      }, { quoted: fq });
    }

    if (!text) {
      const params = effect.params || ['text'];
      return client.sendMessage(m.chat, {
        text: '╭─ *TEXTPRO*\n│ Usage: .' + effectName + ' <' + params.join('> <') + '>\n│ Give me some text.\n╰─ Codex-MD'
      }, { quoted: fq });
    }

    await client.sendMessage(m.chat, { react: { text: '⏳', key: m.reactKey } });

    try {
      let text1 = text;
      let text2 = '';
      if (effect.params && effect.params.length > 1) {
        const parts = text.split('|');
        text1 = (parts[0] || '').trim();
        text2 = (parts[1] || '').trim();
        if (!text1 || !text2) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
          return client.sendMessage(m.chat, {
            text: '╭─ *TEXTPRO*\n│ Usage: .' + effectName + ' <text>|<text2>\n│ Example: .' + effectName + ' Hello|World\n╰─ Codex-MD'
          }, { quoted: fq });
        }
      }

      const isPhotooxy = effect.type === 'photooxy';
      const baseApi = isPhotooxy ? 'photooxy' : 'ephoto360';
      const primaryUrl = 'https://api.akuari.my.id/' + baseApi + '/' + effect.url + '?text=' + encodeURIComponent(text1) + (text2 ? '&text2=' + encodeURIComponent(text2) : '');
      const backupUrl = 'https://api.erdwpe.com/api/' + baseApi + '/' + effect.url + '?text=' + encodeURIComponent(text1) + (text2 ? '&text2=' + encodeURIComponent(text2) : '');

      let imageUrl = null;

      try {
        const res = await axios.get(primaryUrl, { timeout: 15000 });
        if (res.data) {
          if (res.data.result?.url) {
            imageUrl = res.data.result.url;
          } else if (typeof res.data.result === 'string') {
            imageUrl = res.data.result;
          }
        }
      } catch {}

      if (!imageUrl) {
        try {
          const res = await axios.get(backupUrl, { timeout: 15000 });
          if (res.data) {
            if (res.data.result?.url) {
              imageUrl = res.data.result.url;
            } else if (typeof res.data.result === 'string') {
              imageUrl = res.data.result;
            }
          }
        } catch {}
      }

      if (!imageUrl) throw new Error('All APIs failed');

      const buf = await downloadBuffer(imageUrl);

      await client.sendMessage(m.chat, {
        image: buf,
        caption: '╭─ *' + effectName.toUpperCase() + '*\n│ Generated by Codex-MD\n╰─ Codex-MD'
      }, { quoted: fq });

      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

    } catch (e) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
      await client.sendMessage(m.chat, {
        text: '╭─ *ERROR*\n│ ' + (e.message || 'Failed to generate effect') + '\n╰─ Codex-MD'
      }, { quoted: fq });
    }
  }
};
