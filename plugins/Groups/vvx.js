import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    if (!m.quoted) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return m.reply(`╭─ Codex-MD\n│ Reply to a view-once image or video.\n╰─ Codex-MD`);
    }

    try {
        const quoted = m.msg?.contextInfo?.quotedMessage || null;
        const viewOnce = quoted?.viewOnceMessageV2?.message || quoted?.viewOnceMessageV2Extension?.message || quoted?.viewOnceMessage || quoted;
        const imageMsg = viewOnce?.imageMessage || viewOnce?.imageMessageV2 || viewOnce?.imageMessageV1;
        const videoMsg = viewOnce?.videoMessage || viewOnce?.videoMessageV2 || viewOnce?.videoMessageV1;
        const mediaMessage = imageMsg || videoMsg;

        if (!mediaMessage) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`╭─ Codex-MD\n│ This message does not contain\n│ view-once media.\n╰─ Codex-MD`);
        }

        const buffer = await client.downloadMediaMessage(mediaMessage);
        if (!buffer || buffer.length === 0) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`╭─ Codex-MD\n│ Failed to download media.\n╰─ Codex-MD`);
        }

        const dest = m.chat;
        const caption = `╭─ *VIEW ONCE*\n│ Here's your media, perv.\n╰─ Codex-MD`;

        if (imageMsg) {
            await client.sendMessage(dest, { image: buffer, caption });
        } else {
            await client.sendMessage(dest, { video: buffer, caption });
        }
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        console.error('VVX Error:', error);
        m.reply(`╭─ *ERROR*\n│ Failed to retrieve view-once media.\n╰─ Codex-MD`);
    }
};
