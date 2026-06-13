import axios from 'axios';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
export default async (context) => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

  const link = "https://api.jikan.moe/v4/random/anime";

  try {
    const response = await axios.get(link);
    const data = response.data.data;

    const title = data.title;
    const synopsis = data.synopsis;
    const imageUrl = data.images.jpg.image_url;
    const episodes = data.episodes;
    const status = data.status;

    const message = `╭─ *Rᴀɴᴅᴏᴍ Aɴɪᴍᴇ*

│ Title: ${title}
│ Episodes: ${episodes}
│ Status: ${status}
│ Synopsis: ${synopsis}
│ URL: ${data.url}
╰─ Codex-MD`

    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
    await client.sendMessage(m.chat, { image: { url: imageUrl }, caption: message }, { quoted: fq });
  } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
   m.reply(`╭─ *Eʀʀᴏʀ*\n│ An error occurred fetching anime.\n│ Try again, weeb.\n╰─ Codex-MD`);
  }

}
