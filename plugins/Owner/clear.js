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
            return m.reply('╭─ Codex-MD\n│ Cannot clear this type of chat.\n╰─ Codex-MD');
        }

        try {
            let lastMessages;
            if (store?.chats?.[m.chat] && Array.isArray(store.chats[m.chat]) && store.chats[m.chat].length) {
                lastMessages = store.chats[m.chat].slice(-1);
            }

            await client.chatModify({ delete: true, lastMessages }, m.chat);
            await m.reply('╭─ Codex-MD\n├───≥ CLEARED ≤───\n│ Chat cleared.\n╰─ Codex-MD');
        } catch (err) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            if (err?.message?.includes('myAppStateKey') || err?.output?.statusCode === 404) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return m.reply('╭─ Codex-MD\n├───≥ NOT READY ≤───\n│ App state not fully synced yet.\n│ Wait a minute then try again.\n╰─ Codex-MD');
            }
            await m.reply('╭─ Codex-MD\n├───≥ ERROR ≤───\n│ Failed to clear chat.\n╰─ Codex-MD');
        }
    });
};
