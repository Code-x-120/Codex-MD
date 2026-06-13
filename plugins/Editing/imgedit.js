import { getSettings } from '../../database/config.js';
  import { uploadToUrl } from '../../lib/toUrl.js';
  import { makePhotoEdit } from '../../lib/codexApi.js';
  import { getFakeQuoted } from '../../lib/fakeQuoted.js';

  export default {
      name: 'imgedit',
      aliases: ['photoedit', 'aiedit'],
      description: 'AI photo editor',
      category: 'Editing',
      run: async (context) => {
          const { client, m } = context;
          const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '\u2757', key: m.reactKey } });
          const settings = await getSettings();
          const prefix = settings.prefix || '.';

          const quoted = m.quoted ? m.quoted : null;
          const mime = quoted?.mimetype || '';
          const prompt = (m.text || '').replace(/^\S+\s*/, '').trim();

          if (!quoted || !/image/.test(mime)) {
              await client.sendMessage(m.chat, { react: { text: '\u274c', key: m.reactKey } });
              return client.sendMessage(m.chat, {
                  text: '\u256d\u2500 *Error*\n\u2502 Reply to an image with a prompt.\n\u2502 Example: ' + prefix + 'imgedit make it look like night\n\u2570\u2500 Codex-MD'
              }, { quoted: fq });
          }

          if (!prompt) {
              await client.sendMessage(m.chat, { react: { text: '\u274c', key: m.reactKey } });
              return client.sendMessage(m.chat, {
                  text: '\u256d\u2500 *Error*\n\u2502 Add a prompt you idiot.\n\u2502 Example: ' + prefix + 'imgedit make it look like night\n\u2570\u2500 Codex-MD'
              }, { quoted: fq });
          }

          await client.sendMessage(m.chat, { react: { text: '\u23f3', key: m.reactKey } });

          try {
              const media = await quoted.download();
              const imgUrl = await uploadToUrl(media);
              const resultUrl = await makePhotoEdit(imgUrl, prompt);

              await client.sendMessage(m.chat, { react: { text: '\u2705', key: m.reactKey } });
              await client.sendMessage(m.chat, {
                  image: { url: resultUrl },
                  caption: '\u256d\u2500 *AI Edit*\n\u2502 Prompt: ' + prompt + '\n\u2570\u2500 Codex-MD'
              }, { quoted: fq });
          } catch {
              await client.sendMessage(m.chat, { react: { text: '\u274c', key: m.reactKey } });
              await client.sendMessage(m.chat, {
                  text: '\u256d\u2500 *Failed*\n\u2502 AI edit failed. Try again.\n\u2570\u2500 Codex-MD'
              }, { quoted: fq });
          }
      }
  };
