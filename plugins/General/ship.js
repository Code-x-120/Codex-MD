import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const SHIP_LINES = [
  { emoji: '💔', label: 'Worst Match', range: [0, 15] },
  { emoji: '💕', label: 'Cute Match', range: [16, 30] },
  { emoji: '💖', label: 'Good Match', range: [31, 50] },
  { emoji: '🔥', label: 'Perfect Match', range: [51, 70] },
  { emoji: '💞', label: 'Soulmates!', range: [71, 85] },
  { emoji: '👰🏻‍♀️🤵🏻‍♂️', label: 'Get Married Already!', range: [86, 100] },
];

function getShipLine(percent) {
  return SHIP_LINES.find(l => percent >= l.range[0] && percent <= l.range[1]) || SHIP_LINES[0];
}

export default {
  name: 'ship',
  aliases: ['shipit', 'match', 'love'],
  description: 'Ship two people together',
  run: async (context) => {
    const { client, m, args, text } = context;
    const fq = getFakeQuoted(m);

    let name1 = m.pushName || 'User';
    let name2 = '';

    const ctx = m.message?.extendedTextMessage?.contextInfo || {};
    const mentioned = ctx.mentionedJid || [];

    if (mentioned.length >= 2) {
      name2 = mentioned[1].split('@')[0];
      name1 = mentioned[0].split('@')[0];
    } else if (mentioned.length === 1) {
      name2 = mentioned[0].split('@')[0];
      if (text) {
        const parts = text.replace(/@\S+/g, '').trim().split(/\s+/);
        if (parts.length >= 2) {
          name1 = parts[0];
          name2 = parts[1];
        } else if (parts.length === 1) {
          name1 = parts[0];
        }
      }
    } else if (text) {
      const parts = text.split(/\s*\|\s*|\s+\+{2}\s+|\s{2,}/);
      if (parts.length >= 2) {
        name1 = parts[0].trim();
        name2 = parts[1].trim();
      } else {
        name2 = text.trim();
      }
    }

    if (!name2) {
      return client.sendMessage(m.chat, {
        text: `╭─ *Usage*\n│ .ship <name1> <name2>\n│ Or tag two people\n╰─ Codex-MD`
      }, { quoted: fq });
    }

    const percent = Math.floor(Math.random() * 101);
    const { emoji, label } = getShipLine(percent);

    const bar = '█'.repeat(Math.floor(percent / 10)) + '░'.repeat(10 - Math.floor(percent / 10));
    const msg =
      `╭─ *Ship*\n│ ${name1} x ${name2}\n├\n│ ${bar} ${percent}%\n│ ${emoji} ${label}\n╰─ Codex-MD`;

    await client.sendMessage(m.chat, { text: msg }, { quoted: fq });
  }
};
