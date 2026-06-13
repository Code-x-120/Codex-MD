import { Sticker, createSticker, StickerTypes } from 'wa-sticker-formatter';
import axios from 'axios';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
export default async (context) => {
        const { client, m, botname, text } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

if (!text) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return m.reply('╭─ *EMIX*\n│ No emojis provided?\n│ Are you braindead?\n╰─ Codex-MD')
}

  const emojis = text.split('+');

  if (emojis.length !== 2) {
    m.reply('╭─ *EMIX*\n│ Specify the emojis and separate\n│ with \'+\', you dense fool.\n╰─ Codex-MD');
    return;
  }

  const emoji1 = emojis[0].trim();
  const emoji2 = emojis[1].trim();

  await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
  try {
    const response = await axios.get(`https://levanter.onrender.com/emix?q=${emoji1}${emoji2}`);

    if (response.data.status === true) {
    

      let stickerMess = new Sticker(response.data.result, {
        pack: botname,
        type: StickerTypes.CROPPED,
        categories: ["🤩", "🎉"],
        id: "12345",
        quality: 70,
        background: "transparent",
      });
      const stickerBuffer2 = await stickerMess.toBuffer();
      await client.sendMessage(m.chat, { sticker: stickerBuffer2 }, { quoted: fq });
      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

    } else {
      m.reply('╭─ *FAILED*\n│ Unable to create emoji mix.\n│ Your emoji combo is trash.\n╰─ Codex-MD');
    }
  } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
    m.reply(`╭─ *ERROR*\n│ An error occurred while creating\n│ the emoji mix.\n│ ${error}\n╰─ Codex-MD`);
  }

}