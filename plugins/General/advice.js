import axios from 'axios';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'advice',
    aliases: ['tip', 'lifetip', 'suggest'],
    description: 'Get a random piece of life advice',
    run: async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        try {
            const res = await axios.get('https://api.adviceslip.com/advice', { timeout: 8000 });
            const advice = res.data?.slip?.advice || 'Stop asking for advice and figure it out.';
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭─ *Aᴅᴠɪᴄᴇ*\n├\n│ 💡 ${advice}\n╰─ Codex-MD`
            }, { quoted: fq });
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return client.sendMessage(m.chat, { text: '╭─ *Aᴅᴠɪᴄᴇ*\n├\n│ My advice? Try again later.\n╰─ Codex-MD' }, { quoted: fq });
        }
    }
};
