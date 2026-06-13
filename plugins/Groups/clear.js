import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'clear',
    aliases: ['clearchat', 'wipe'],
    description: 'Clears all messages in a chat from the bot view',
    run: async (context) => {
        await ownerMiddleware(context, async () => {
            const { client, m } = context;
            const fq = getFakeQuoted(m);

            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            try {
                await client.clearChatMessages(m.chat, m);
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                await m.reply('╭─ Codex-MD\n├───≥ CLEARED ≤───\n│ Chat cleared from my view.\n│ Gone. All of it. 🧹\n╰─ Codex-MD');
            } catch (error) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                await m.reply('╭─ Codex-MD\n├───≥ ERROR ≤───\n│ Couldn\'t clear this chat.\n│ Try again, genius.\n╰─ Codex-MD');
            }
        });
    }
};
