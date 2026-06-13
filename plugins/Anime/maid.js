import { getAnime } from '../../lib/codexApi.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'maid',
    aliases: ['animemaid', 'maidpic'],
    description: 'Get a random anime maid image',
    run: async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const url = await getAnime('maid');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await client.sendMessage(m.chat, {
                image: { url },
                caption: '╭─ *Mᴀɪᴅ*\n╰─ Codex-MD'
            }, { quoted: fq });
        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await m.reply('╭─ *Eʀʀᴏʀ*\n│ Maid is busy!\n╰─ Codex-MD');
        }
    }
};
