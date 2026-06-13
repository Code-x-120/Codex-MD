import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    if (!m.quoted) {
        return await client.sendMessage(m.chat, {
            text: `╭─ *RETRIEVE*\n│ Reply to a view-once message, genius. 🙄\n╰─ Codex-MD`
        }, { quoted: fq });
    }

    try {
        let dest = client.user?.id || '';
        if (dest.includes(':')) dest = dest.split(':')[0] + '@s.whatsapp.net';
        if (!dest) dest = client.decodeJid ? client.decodeJid(client.user.id) : client.user.id;
        const mediaType = m.quoted?.mtype || '';
        const isImage = mediaType === 'imageMessage' || !!(m.quoted?.imageMessage);
        const isVideo = mediaType === 'videoMessage' || !!(m.quoted?.videoMessage);

        if (isImage || isVideo) {
            const buffer = await m.quoted.download();
            if (!buffer || buffer.length === 0) {
                return await client.sendMessage(m.chat, {
                    text: `╭─ *RETRIEVE*\n│ Couldn't download it. WhatsApp already nuked it. 😤\n╰─ Codex-MD`
                }, { quoted: fq });
            }
            const senderNum = (m.quoted?.sender || '').split('@')[0].split(':')[0] || 'Unknown';
            const caption = `╭─ *VIEW ONCE RETRIEVED*\n│ 👁 Sender: @${senderNum}\n│ 📍 Chat: ${m.isGroup ? 'Group' : 'DM'}\n│ You sneaky little thing. 😈\n╰─ Codex-MD`;
            const mentions = m.quoted?.sender ? [m.quoted.sender] : [];
            if (isImage) {
                await client.sendMessage(dest, { image: buffer, caption, mentions });
            } else {
                await client.sendMessage(dest, { video: buffer, caption, mentions });
            }
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return;
        }

        const ctx = m.msg?.contextInfo || m.message?.extendedTextMessage?.contextInfo || {};
        const quotedMsg = ctx.quotedMessage || {};

        const unwrap = (msg) => {
            if (!msg) return null;
            const voKeys = ['viewOnceMessageV2Extension', 'viewOnceMessageV2', 'viewOnceMessage'];
            for (const k of voKeys) {
                if (msg[k]?.message) return msg[k].message;
            }
            return msg;
        };

        const inner = unwrap(quotedMsg);
        const imageMsg = inner?.imageMessage || null;
        const videoMsg = inner?.videoMessage || null;

        if (!imageMsg && !videoMsg) {
            return await client.sendMessage(m.chat, {
                text: `╭─ *RETRIEVE*\n│ That's not a view-once. Stop wasting my time. 😒\n╰─ Codex-MD`
            }, { quoted: fq });
        }

        const mediaMsg = imageMsg || videoMsg;
        const buffer = await client.downloadMediaMessage(mediaMsg);

        if (!buffer || buffer.length === 0) {
            return await client.sendMessage(m.chat, {
                text: `╭─ *RETRIEVE*\n│ Couldn't download it. WhatsApp already nuked it. 😤\n╰─ Codex-MD`
            }, { quoted: fq });
        }

        const senderNum = (m.quoted?.sender || ctx.participant || '').split('@')[0].split(':')[0] || 'Unknown';
        const caption = `╭─ *VIEW ONCE RETRIEVED*\n│ 👁 Sender: @${senderNum}\n│ 📍 Chat: ${m.isGroup ? 'Group' : 'DM'}\n│ You sneaky little thing. 😈\n╰─ Codex-MD`;
        const mentions = ctx.participant ? [ctx.participant] : [];

        if (imageMsg) {
            await client.sendMessage(dest, { image: buffer, caption, mentions });
        } else {
            await client.sendMessage(dest, { video: buffer, caption, mentions });
        }
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
    } catch (e) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        await client.sendMessage(m.chat, {
            text: `╭─ *RETRIEVE*\n│ Something broke. WhatsApp's fault, not mine. 😤\n╰─ Codex-MD`
        }, { quoted: fq });
    }
};
