import { getBuffer } from '../../lib/botFunctions.js';
import links from './links.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const getTarget = (m) => {
    const jid = (m.mentionedJid && m.mentionedJid[0]) || (m.quoted && m.quoted.sender) || null;
    if (!jid) return null;
    if (!jid.includes('@s.whatsapp.net') && !jid.includes('@lid')) return null;
    return jid;
};

function resolveDisplayJid(jid) {
    if (!jid) return jid;
    if (!jid.endsWith('@lid')) return jid;
    if (globalThis.resolvePhoneFromLid) {
        const phone = globalThis.resolvePhoneFromLid(jid);
        if (phone) return phone + '@s.whatsapp.net';
    }
    if (globalThis.lidPhoneCache) {
        const lid = jid.split('@')[0].split(':')[0];
        const phone = globalThis.lidPhoneCache.get(lid);
        if (phone) return phone + '@s.whatsapp.net';
    }
    return jid;
}

export default {
    name: 'slap',
    aliases: ['smack', 'hit'],
    description: 'Slap a tagged or quoted user',
    run: async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        await client.sendMessage(m.chat, { react: { text: '👋', key: m.reactKey } });
        try {
            const target = getTarget(m);
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            if (!target) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return m.reply(`╭─ Codex-MD\n│ Tag or quote someone to slap.\n╰─ Codex-MD`);
            }
            const resolvedTarget = resolveDisplayJid(target);
            const tNum = resolvedTarget.split('@')[0];
            const sNum = resolveDisplayJid(m.sender).split('@')[0];
            if (links.slap) {
                try {
                    const buf = await getBuffer(links.slap);
                    await client.sendMessage(m.chat, { sticker: buf }, { quoted: fq });
                    await client.sendMessage(m.chat, { text: `@${sNum} slapped @${tNum} 💥`, mentions: [m.sender, resolvedTarget] }, { quoted: fq });
                    return;
                } catch {}
            }
            const lines = [
                `@${sNum} slapped @${tNum} so hard their Wi-Fi disconnected. 💥`,
                `@${sNum} slapped @${tNum} into next week. 👋`,
                `@${sNum} gave @${tNum} a slap that echoed through the whole chat. 😤`,
            ];
            await client.sendMessage(m.chat, {
                text: `╭─ Codex-MD\n│ ${lines[Math.floor(Math.random() * lines.length)]}\n╰─ Codex-MD`,
                mentions: [m.sender, resolvedTarget]
            }, { quoted: fq });
        } catch {
            await m.reply(`╭─ Codex-MD\n│ Slap failed. Try again.\n╰─ Codex-MD`);
        }
    }
};
