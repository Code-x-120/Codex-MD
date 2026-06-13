import axios from 'axios';
  import { getFakeQuoted } from '../../lib/fakeQuoted.js';

  const GCSE_KEY = 'AIzaSyDMbI3nvmQUrfjoCJYLS69Lej1hSXQjnWI';
  const GCSE_CX  = 'baf9bdb0c631236e5';

  export default {
      name: 'image',
      aliases: ['img', 'pic', 'searchimage'],
      description: 'Search and send images',
      run: async (context) => {
          const { client, m, prefix } = context;
          const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

          const query = m.body.replace(new RegExp(`^${prefix}(image|img|pic|searchimage)\\s*`, 'i'), '').trim();
          if (!query) {
              await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
              return client.sendMessage(m.chat, {
                  text: `╭─ Codex-MD\n│ Give me something to search, genius.\n│ Example: ${prefix}img cats\n╰─ Codex-MD`
              }, { quoted: fq });
          }

          try {
              const { data } = await axios.get('https://www.googleapis.com/customsearch/v1', {
                  params: { q: query, key: GCSE_KEY, cx: GCSE_CX, searchType: 'image', num: 5, safe: 'off' },
                  timeout: 15000
              });

              if (!data.items || data.items.length === 0) {
                  await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                  return client.sendMessage(m.chat, {
                      text: `╭─ Codex-MD\n│ No images found for "${query}".\n│ Your search is terrible.\n╰─ Codex-MD`
                  }, { quoted: fq });
              }

              await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

              for (let i = 0; i < data.items.length; i++) {
                  const item = data.items[i];
                  try {
                      await client.sendMessage(m.chat, {
                          image: { url: item.link },
                          caption: `╭─ *IMAGE ${i + 1}/${data.items.length}*\n│ ${(item.title || query).slice(0, 80)}\n╰─ Codex-MD`
                      }, { quoted: fq });
                      if (i < data.items.length - 1) await new Promise(r => setTimeout(r, 1200));
                  } catch (imgErr) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                      console.warn(`Image ${i + 1} skipped: ${imgErr.message}`);
                  }
              }

          } catch (error) {
              console.error('Image search error:', error.message);
              await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
              await client.sendMessage(m.chat, {
                  text: `╭─ Codex-MD\n│ Image search failed. Try again later.\n╰─ Codex-MD`
              }, { quoted: fq });
          }
      }
  };
  