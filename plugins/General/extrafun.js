import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import axios from 'axios';

export default {
  name: 'extrafun',
  aliases: ['memesearch', 'findmeme', 'complimentry', 'compliments', 'pies', 'personality', 'gayrate', 'gaytest', 'howgay'],
  description: 'Extra fun commands',
  category: 'General',
  run: async (context) => {
    const { client, m, command, text, args, pushname } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    try {
      const name = args.join(' ') || pushname || 'You';

      switch (command) {
        case 'memesearch':
        case 'findmeme': {
          if (!text) return m.reply("╭─ *Meme Search*\n│ Usage: .memesearch <keyword>\n╰─ Codex-MD");
          const { data } = await axios.get(`https://api.akuari.my.id/search/meme?query=${encodeURIComponent(text)}`, { timeout: 10000 });
          const results = data?.result || data?.data || [];
          if (!results.length) return m.reply("╭─ *Meme Search*\n│ No memes found.\n╰─ Codex-MD");
          const meme = results[Math.floor(Math.random() * results.length)];
          const url = meme.url || meme.image || meme.link;
          if (url) {
            await client.sendMessage(m.chat, { image: { url }, caption: `╭─ *Meme* 😂\n│ ${meme.title || ''}\n╰─ Codex-MD` }, { quoted: fq });
          } else {
            let txt = '╭─ *Meme Search* 😂\n';
            results.slice(0, 10).forEach((r, i) => { txt += `│ ${i + 1}. ${r.title || r.name}\n`; });
            txt += '╰─ Codex-MD';
            return m.reply(txt);
          }
          break;
        }

        case 'complimentry':
        case 'compliments': {
          const compliments = [
            "You're amazing!", "You light up the room!", "You have a great sense of humor!",
            "You're stronger than you think!", "Your smile is contagious!", "You're one of a kind!",
            "You make the world a better place!", "You're incredibly smart!", "You have a heart of gold!",
            "You're doing great!", "You're a masterpiece!", "You're worthy of all good things!",
            "You have beautiful energy!", "You're unstoppable!", "You're capable of amazing things!"
          ];
          const c = compliments[Math.floor(Math.random() * compliments.length)];
          return m.reply(`╭─ *Compliment* 💫\n│ ${name}, ${c}\n╰─ Codex-MD`);
        }

        case 'pies':
        case 'personality': {
          const types = ['🍰 Cheesecake', '🍫 Chocolate Cake', '🍓 Strawberry Shortcake',
            '🥧 Apple Pie', '🧁 Cupcake', '🍩 Donut', '🍪 Cookie', '🎂 Birthday Cake',
            '🍮 Pudding', '🍦 Ice Cream', '🧇 Waffle', '🥞 Pancake'];
          const type = types[Math.floor(Math.random() * types.length)];
          const descs = [
            "You're sweet and creamy, everyone loves you!",
            "Rich and intense, you're a classic!",
            "Fresh and fruity, you bring joy!",
            "Simple but timeless, you're reliable!",
            "Small but delightful, you're a treat!",
            "Fun and full of surprises!",
            "Crunchy on the outside, soft inside!",
            "Celebratory and bright, you light up every occasion!",
            "Smooth and comforting, you're a hug in food form!",
            "Cool and refreshing, you're chill!",
            "Warm and layered, you're complex!",
            "Sweet stack, always rising to the top!"
          ];
          const desc = descs[types.indexOf(type)] || 'Delicious!';
          return m.reply(`╭─ *Personality Pies* 🥧\n│ ${name}, you are:\n│ ${type}\n│ ${desc}\n╰─ Codex-MD`);
        }

        case 'gayrate':
        case 'gaytest':
        case 'howgay': {
          const rate = Math.floor(Math.random() * 101);
          const bar = '█'.repeat(Math.floor(rate / 10)) + '░'.repeat(10 - Math.floor(rate / 10));
          const comments = rate < 10 ? "Straight as an arrow! 🏹"
            : rate < 30 ? "Mostly straight 🌈"
            : rate < 50 ? "A little curious 🤔"
            : rate < 70 ? "Bi-energy! 💗💜💙"
            : rate < 90 ? "Very rainbow! 🌈🌈"
            : "Maximum gay! 🏳️‍🌈✨";
          return m.reply(
            `╭─ *Gay Rate* 🏳️‍🌈\n│ ${name}: ${rate}%\n│ ${bar}\n│ ${comments}\n╰─ Codex-MD`
          );
        }

        default:
          return m.reply("╭─ *Extra Fun*\n│ .memesearch <keyword>\n│ .compliments\n│ .pies\n│ .gayrate\n╰─ Codex-MD");
      }

      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } }).catch(() => {});
    } catch (e) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return m.reply(`╭─ *Error*\n│ ${e.message}\n╰─ Codex-MD`);
    }
  }
};
