import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { m } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '💀', key: m.reactKey } });
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        await m.reply(`╭─ *SHUTDOWN*\n│ 💀 Codex-MD going offline...\n│ Don't cry.\n╰─ Codex-MD`);
        setTimeout(() => process.exit(0), 2000);
    });
};
