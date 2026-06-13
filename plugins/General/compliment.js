import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const COMPLIMENTS = [
  'You shine brighter than a diamond, no cap! ✨',
  'Your vibe is absolutely immaculate! 💫',
  'You are literally the whole package! 🎁',
  'Your energy is contagious in the best way! ⚡',
  'You are a walking green flag! 🚩',
  'Main character energy, all day every day! 🌟',
  'You are the definition of "that girl/boy/person"! 💅',
  'Your presence makes everything better! 🌈',
  'You are doing amazing, sweetie! 💖',
  'You are the moment! You are the vibe! 🔥',
  'Actually insane how cool you are! 🤯',
  'You have main character aura! 🎬',
  'Biggest W in the chat, fr fr! 🏆',
  'You are genuinely a beautiful human being! 🌺',
  'Your smile probably cures world hunger! 😊',
  'You are that B*tch! Period! 💅✨',
  'You got rizz for days! 🗿',
  'No one does it quite like you, legend! 👑',
  'You make the world a better place just by existing! 🌍',
  'Certified W person right here! ✅',
];

export default {
  name: 'compliment',
  aliases: ['praise', 'complimentme', 'wholesome'],
  description: 'Get a random compliment',
  run: async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);
    const line = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
    await client.sendMessage(m.chat, {
      text: `╭─ *Compliment*\n│ ${line}\n╰─ Codex-MD`
    }, { quoted: fq });
  }
};
