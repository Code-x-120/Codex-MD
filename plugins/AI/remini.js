import { uploadToUrl } from '../../lib/toUrl.js';
  import { enhanceImage } from '../../lib/codexApi.js';
  import { getFakeQuoted } from '../../lib/fakeQuoted.js';

  export default async (context) => {
      const { client, m } = context;
      const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

      const quoted = m.quoted ? m.quoted : m;
      const mime = quoted.mimetype || m.mimetype || '';

      if (!/image/.test(mime)) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
          return m.reply(`╭─ *Mɪssɪɴɢ Iᴍᴀɢᴇ*\n│ Give me an image you dumbass\n│ Reply to an image first\n╰─ Codex-MD`);
      }

      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

      try {
          const media = await quoted.download();
          const imgUrl = await uploadToUrl(media);
          const resultUrl = await enhanceImage(imgUrl);

          await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
          await client.sendMessage(m.chat, {
              image: { url: resultUrl },
              caption: `╭─ *Eɴʜᴀɴᴄᴇᴅ Iᴍᴀɢᴇ*\n│ Your shitty image is now HD.\n│ Still looks like garbage though.\n╰─ Codex-MD`
          }, { quoted: fq });
      } catch {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
          await m.reply(`╭─ *Fᴀɪʟᴇᴅ*\n│ Enhancement failed. Try again.\n╰─ Codex-MD`);
      }
  };
  