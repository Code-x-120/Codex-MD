import { makePDF } from '../../lib/codexApi.js';
  import { getFakeQuoted } from '../../lib/fakeQuoted.js';
  import { getSettings } from '../../database/config.js';

  export default {
      name: 'pdf',
      aliases: ['topdf', 'createpdf', 'makepdf'],
      description: 'Create a PDF from text',
      category: 'General',
      run: async (context) => {
          const { client, m } = context;
          const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
          const settings = await getSettings();
          const prefix = settings.prefix || '.';

          const query = (m.text || '').replace(/^\S+\s*/, '').trim();

          if (!query) {
              return client.sendMessage(m.chat, {
                  text: `╭─ *Eʀʀᴏʀ*\n│ Give me some text to convert.\n│ Example: ${prefix}pdf Hello world this is my document\n╰─ Codex-MD`
              }, { quoted: fq });
          }

          await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

          try {
              const pdfBuf = await makePDF(query);

              await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
              await client.sendMessage(m.chat, {
                  document: pdfBuf,
                  mimetype: 'application/pdf',
                  fileName: `document_${Date.now()}.pdf`,
                  caption: `╭─ *PDF Cʀᴇᴀᴛᴇᴅ*\n│ Here's your document.\n╰─ Codex-MD`
              }, { quoted: fq });
          } catch {
              await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
              await client.sendMessage(m.chat, {
                  text: `╭─ *Eʀʀᴏʀ*\n│ PDF creation failed. Try again.\n╰─ Codex-MD`
              }, { quoted: fq });
          }
      }
  };
  