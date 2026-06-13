import middleware from '../../utils/botUtil/middleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import { resolveTargetJid } from '../../lib/lidResolver.js';

export default async (context) => {
    await middleware(context, async () => {
        const { client, m, args, participants, mycode } = context;
        const fq = m;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const resolveParticipantJid = (p) => {
            if (p.pn) return String(p.pn).replace(/\D/g, '') + '@s.whatsapp.net';
            const base = p.jid || p.id || '';
            if (base && !base.endsWith('@lid')) return base.split(':')[0].split('@')[0].replace(/\D/g, '') + '@s.whatsapp.net';
            return resolveTargetJid(base, participants) || base;
        };

        const botJid = client.decodeJid(client.user.id);
        const foreignList = participants
            .filter(p => !p.admin)
            .map(p => resolveParticipantJid(p))
            .filter(jid => jid && !jid.startsWith(mycode) && jid !== botJid && jid !== client.decodeJid(client.user.id));

        if (!args || !args[0]) {
            if (foreignList.length === 0) {
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return m.reply(`╭─ Codex-MD\n│ No foreigners detected. Group is clean, for now.\n╰─ Codex-MD`);
            }
            let txt = `╭─ *FOREIGNERS*\n│ Country code not matching: ${mycode}\n│ Found ${foreignList.length} unwanted guests:\n`;
            for (const jid of foreignList) txt += `├ @${jid.split('@')[0]}\n`;
            txt += `├ \n│ Send .foreigners -x to yeet them all\n╰─ Codex-MD`;
            await client.sendMessage(m.chat, { text: txt, mentions: foreignList }, { quoted: m });
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        } else if (args[0] === '-x') {
            await client.sendMessage(m.chat, {
                text: `╭─ *PURGE MODE*\n│ Removing all ${foreignList.length} foreigners now.\n│ Goodbye losers, you won't be missed.\n╰─ Codex-MD`
            }, { quoted: m });
            setTimeout(async () => {
                await client.groupParticipantsUpdate(m.chat, foreignList, 'remove');
                setTimeout(() => {
                    m.reply(`╭─ Codex-MD\n│ All foreigners removed. Group cleansed.\n╰─ Codex-MD`);
                }, 1000);
            }, 1000);
        }
    });
};
