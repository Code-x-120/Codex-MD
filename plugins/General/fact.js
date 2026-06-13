import axios from 'axios';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'fact',
    aliases: ['funfact', 'randomfact', 'trivia'],
    description: 'Get a random interesting fact',
    run: async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const res = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en', { timeout: 8000 });
            const factText = res.data?.text || 'No fact available.';
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭─ *Rᴀɴᴅᴏᴍ Fᴀᴄᴛ*\n├\n│ 🧠 ${factText}\n╰─ Codex-MD`
            }, { quoted: fq });
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return client.sendMessage(m.chat, { text: '╭─ *Eʀʀᴏʀ*\n├\n│ Facts took a vacation. Try again.\n╰─ Codex-MD' }, { quoted: fq });
        }
    }
};
