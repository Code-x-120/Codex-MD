import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, store } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (!m?.chat) return;

        if (m.chat.endsWith('@broadcast') || m.chat.endsWith('@newsletter')) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`╭─ Codex-MD\n│ Cannot archive this type of chat.\n╰─ Codex-MD`);
        }

        let lastMessages;
        if (store?.chats?.[m.chat] && Array.isArray(store.chats[m.chat]) && store.chats[m.chat].length) {
            lastMessages = store.chats[m.chat].slice(-1);
        }

        try {
            await client.chatModify(
                {
                    archive: true,
                    lastMessages
                },
                m.chat
            );

            await m.reply(`╭─ *ARCHIVED*\n│ Chat archived.\n╰─ Codex-MD`);
        } catch (err) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            console.error('Archive chat failed:', err);
            await m.reply(`╭─ *ERROR*\n│ Failed to archive chat.\n╰─ Codex-MD`);
        }
    });
};
