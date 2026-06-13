import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const ALLOWED = /^[0-9+\-*/.()%^ ]+$/;

export default {
    name: 'calc',
    aliases: ['calculate', 'math', 'solve'],
    description: 'Evaluate a mathematical expression',
    run: async (context) => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);
        const expr = (text || '').trim();
        if (!expr) {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: '╭─ *Cᴀʟᴄᴜʟᴀᴛᴏʀ*\n├\n│ Give me an expression. Usage: .calc 2+2\n╰─ Codex-MD'
            }, { quoted: fq });
        }
        if (!ALLOWED.test(expr)) {
            return client.sendMessage(m.chat, {
                text: '╭─ *Cᴀʟᴄᴜʟᴀᴛᴏʀ*\n├\n│ Only numbers and operators please. No tricks.\n╰─ Codex-MD'
            }, { quoted: fq });
        }
        try {
            const result = Function('"use strict"; return (' + expr + ')')();
            if (result === undefined || result === null || !isFinite(result)) throw new Error('invalid result');
            return client.sendMessage(m.chat, {
                text: `╭─ *Cᴀʟᴄᴜʟᴀᴛᴏʀ*\n├\n│ 🔢 ${expr}\n│ = ${result}\n╰─ Codex-MD`
            }, { quoted: fq });
        } catch (e) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return client.sendMessage(m.chat, {
                text: `╭─ *Cᴀʟᴄᴜʟᴀᴛᴏʀ*\n├\n│ That expression is broken. Fix your math.\n╰─ Codex-MD`
            }, { quoted: fq });
        }
    }
};
