import { uploadToUrl } from '../../lib/toUrl.js';
  import { makeRC } from '../../lib/codexApi.js';
  import { getFakeQuoted } from '../../lib/fakeQuoted.js';
  import { getSettings } from '../../database/config.js';

  export default {
      name: 'rc',
      aliases: ['airc', 'rcedit'],
      description: 'AI image edit using RC model',
      category: 'Editing',
      run: async (context) => {
          const { client, m } = context;
          const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
          const settings = await getSettings();
          const prefix = settings.prefix || '.';

          const quoted = m.quoted ? m.quoted : null;
          const mime = quoted?.mimetype || '';
          const prompt = (m.text || '').replace(/^\S+\s*/, '').trim();

          if (!quoted || !/image/.test(mime)) {
              return client.sendMessage(m.chat, {
                  text: `╭─ *Eʀʀᴏʀ*\n│ Reply to an image with a prompt.\n│ Example: ${prefix}rc make it look like night\n╰─ Codex-MD`
              }, { quoted: fq });
          }

          if (!prompt) {
              return client.sendMessage(m.chat, {
                  text: `╭─ *Eʀʀᴏʀ*\n│ Tell me what to do with the image.\n│ Example: ${prefix}rc make it look like night\n╰─ Codex-MD`
              }, { quoted: fq });
          }

          await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

          try {
              const media = await quoted.download();
              const imgUrl = await uploadToUrl(media);
              const resultUrl = await makeRC(imgUrl, prompt);

              await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
              await client.sendMessage(m.chat, {
                  image: { url: resultUrl },
                  caption: `╭─ *RC Eᴅɪᴛ*\n│ Prompt: ${prompt}\n╰─ Codex-MD`
              }, { quoted: fq });
          } catch {
              await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
              await client.sendMessage(m.chat, {
                  text: `╭─ *Eʀʀᴏʀ*\n│ RC edit failed. Try again.\n╰─ Codex-MD`
              }, { quoted: fq });
          }
      }
  };
  