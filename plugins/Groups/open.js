import middleware from '../../utils/botUtil/middleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    await middleware(context, async () => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            await client.groupSettingUpdate(m.chat, 'not_announcement');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            m.reply(`╭─ *OPENED*\n│ Group opened. Talk your trash.\n╰─ Codex-MD`);
        } catch (e) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            m.reply(`╭─ Codex-MD\n│ Failed to open group: ${e.message?.slice(0, 60)}\n╰─ Codex-MD`);
        }
    });
};
