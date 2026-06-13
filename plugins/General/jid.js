import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
  name: 'jid',
  aliases: ['getjid', 'myjid', 'whatsmyid'],
  description: 'Get your JID or mentioned user JID',
  run: async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);

    const ctx = m.message?.extendedTextMessage?.contextInfo || {};
    const mentioned = ctx.mentionedJid || [];

    if (mentioned.length > 0) {
      const lines = mentioned.map(j => `├ @${j.split('@')[0]} : ${j}`).join('\n');
      return client.sendMessage(m.chat, {
        text: `╭─ *JID*\n${lines}\n╰─ Codex-MD`,
        mentions: mentioned
      }, { quoted: fq });
    }

    await client.sendMessage(m.chat, {
      text: `╭─ *Your JID*\n│ ${m.sender}\n╰─ Codex-MD`
    }, { quoted: fq });
  }
};
