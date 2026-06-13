import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const MEMES = [
  'https://i.imgflip.com/1bij.jpg',
  'https://i.imgflip.com/1bh8.jpg',
  'https://i.imgflip.com/1bgw.jpg',
  'https://i.imgflip.com/1bh3.jpg',
  'https://i.imgflip.com/1bgy.jpg',
  'https://i.imgflip.com/1bh1.jpg',
  'https://i.imgflip.com/1bgg.jpg',
  'https://i.imgflip.com/1bh2.jpg',
  'https://i.imgflip.com/1bgt.jpg',
  'https://i.imgflip.com/1bgu.jpg',
  'https://i.imgflip.com/26am.jpg',
  'https://i.imgflip.com/26at.jpg',
  'https://i.imgflip.com/26av.jpg',
  'https://i.imgflip.com/26ax.jpg',
  'https://i.imgflip.com/26az.jpg',
  'https://i.imgflip.com/2gn7k.jpg',
  'https://i.imgflip.com/2hgfw.jpg',
  'https://i.imgflip.com/2k7g.jpg',
  'https://i.imgflip.com/2ngr.jpg',
  'https://i.imgflip.com/2ugr.jpg',
];

export default {
  name: 'meme',
  aliases: ['memes', 'memeimg'],
  description: 'Get a random meme image',
  run: async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);

    const url = MEMES[Math.floor(Math.random() * MEMES.length)];
    try {
      await client.sendMessage(m.chat, {
        image: { url },
        caption: `╭─ *Meme*\n╰─ Codex-MD`
      }, { quoted: fq });
    } catch {
      await client.sendMessage(m.chat, {
        text: `╭─ *Meme*\n│ Failed to fetch meme.\n╰─ Codex-MD`
      }, { quoted: fq });
    }
  }
};
