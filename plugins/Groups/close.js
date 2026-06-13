import middleware from '../../utils/botUtil/middleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    await middleware(context, async () => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            await client.groupSettingUpdate(m.chat, 'announcement');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            m.reply(`╭─ *CLOSED*\n│ Group closed. Shut up now.\n╰─ Codex-MD`);
        } catch (e) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            m.reply(`╭─ Codex-MD\n│ Failed to close group: ${e.message?.slice(0, 60)}\n╰─ Codex-MD`);
        }
    });
};
