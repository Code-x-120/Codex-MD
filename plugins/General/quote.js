import axios from 'axios';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'quote',
    aliases: ['inspire', 'motivation', 'qotd'],
    description: 'Get a random motivational quote',
    run: async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        try {
            const res = await axios.get('https://zenquotes.io/api/random', { timeout: 8000 });
            const q = res.data?.[0];
            if (!q) throw new Error('empty');
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭─ *Qᴜᴏᴛᴇ*\n├\n│ ❝ ${q.q} ❞\n├\n│ — ${q.a}\n╰─ Codex-MD`
            }, { quoted: fq });
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return client.sendMessage(m.chat, { text: '╭─ *Qᴜᴏᴛᴇ*\n├\n│ No quotes today. Universe is offline.\n╰─ Codex-MD' }, { quoted: fq });
        }
    }
};
