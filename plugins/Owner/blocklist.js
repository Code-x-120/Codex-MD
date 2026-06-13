import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            const blocked = await client.fetchBlocklist();
            if (!blocked || blocked.length === 0) {
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return m.reply(`╭─ *BLOCK LIST*\n│ No blocked contacts. Clean slate!\n╰─ Codex-MD`);
            }
            const list = blocked.map((jid, i) => `├ ${i + 1}. +${jid.split('@')[0]}`).join('\n');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return m.reply(`╭─ *BLOCK LIST*\n│ Blocked (${blocked.length}):\n${list}\n╰─ Codex-MD`);
        } catch (e) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`╭─ Codex-MD\n│ Failed to fetch blocklist: ${e.message?.slice(0, 60)}\n╰─ Codex-MD`);
        }
    });
};
