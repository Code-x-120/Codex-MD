import afkFeature from '../../features/afk.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'afk',
    alias: ['away', 'brb'],
    description: 'Set yourself as AFK',
    run: async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const senderNum = m.sender.split('@')[0].split(':')[0];
        const reason = context.text || context.q || 'no reason';

        if (afkFeature.isAfk(senderNum)) {
            afkFeature.removeAfk(senderNum);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`╭─ Codex-MD\n│ AFK removed. Welcome back, ghost. 👁️\n╰─ Codex-MD`);
        }

        afkFeature.setAfk(senderNum, reason);
        return client.sendMessage(m.chat, {
            text: `╭─ *AFK SET*\n│ @${senderNum} went AFK.\n│ Reason: ${reason}\n│ Don't bother them. 🚫\n╰─ Codex-MD`,
            mentions: [m.sender]
        }, { quoted: fq });
    }
};
