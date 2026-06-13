import axios from 'axios';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'catfact',
    aliases: ['catfacts', 'meowfact'],
    description: 'Get a random cat fact',
    run: async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        try {
            const res = await axios.get('https://catfact.ninja/fact', { timeout: 8000 });
            const f = res.data?.fact || 'Cats are superior. That\'s the only fact.';
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭─ *Cᴀᴛ Fᴀᴄᴛ*\n├\n│ 🐱 ${f}\n╰─ Codex-MD`
            }, { quoted: fq });
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return client.sendMessage(m.chat, { text: '╭─ *Cᴀᴛ Fᴀᴄᴛ*\n├\n│ Even the cats won\'t talk to me right now.\n╰─ Codex-MD' }, { quoted: fq });
        }
    }
};
