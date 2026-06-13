import middleware from '../../utils/botUtil/middleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'pin',
    aliases: ['pinmsg', 'unpin'],
    description: 'Pin or unpin a message in a group',
    run: async (context) => {
        await middleware(context, async () => {
            const { client, m, args } = context;
            const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

            if (!m.quoted) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return m.reply('╭─ Codex-MD\n├───≥ PIN ≤───\n│ Quote a message to pin it,\n│ you absolute muppet.\n╰─ Codex-MD');
            }

            const isUnpin = (args[0] || '').toLowerCase() === 'unpin';

            const messageKey = {
                id: m.quoted.id,
                remoteJid: m.chat,
                participant: m.quoted.sender
            };

            try {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                await client.pinMessage(m.chat, messageKey, isUnpin ? 0 : 1);
                await m.reply(`╭─ Codex-MD\n├───≥ ${isUnpin ? 'UNPINNED' : 'PINNED'} ≤───\n│ Message ${isUnpin ? 'unpinned' : 'pinned'} successfully.\n╰─ Codex-MD`);
            } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                console.error('[PIN ERROR]', error?.message || error);
                const msg = error?.message || String(error);
                const isAuth = msg.includes('forbidden') || msg.includes('not-authorized') || msg.includes('403');
                if (isAuth) {
                    await m.reply('╭─ Codex-MD\n├───≥ ERROR ≤───\n│ Failed to pin. Make sure I\'m admin.\n╰─ Codex-MD');
                } else {
                    await m.reply('╭─ Codex-MD\n├───≥ ERROR ≤───\n│ Pin failed: ' + msg.slice(0, 80) + '\n╰─ Codex-MD');
                }
            }
        });
    }
};
