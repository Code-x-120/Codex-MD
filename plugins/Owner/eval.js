import util from 'util';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const BLOCKED_PATTERNS = [
    /process\.env/,
    /config\/settings/,
    /require\s*\(\s*['"].*settings['"]/
];

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, isAdmin, isBotAdmin, Owner, isDev, isSudo, itsMe, store, settings, botNumber, args, pushname, mode, pict, botname, totalCommands } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        try {
            const trimmedText = text.trim();
            if (!trimmedText) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                return m.reply(`╭─ Codex-MD\n│ No command provided for eval!\n╰─ Codex-MD`);
            }
            for (const pattern of BLOCKED_PATTERNS) {
                if (pattern.test(trimmedText)) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                    return m.reply(`╭─ *BLOCKED*\n│ That eval is blocked for security.\n╰─ Codex-MD`);
                }
            }
            let evaled = await eval(trimmedText);
            if (typeof evaled !== 'string') evaled = util.inspect(evaled);
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            if (evaled && evaled !== 'undefined' && evaled !== 'null') await m.reply(evaled);
        } catch (err) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await m.reply(`╭─ *EVAL ERROR*\n│ ${String(err)}\n╰─ Codex-MD`);
        }
    });
};
