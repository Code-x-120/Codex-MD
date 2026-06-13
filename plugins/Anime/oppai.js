import { getAnime } from '../../lib/codexApi.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'oppai',
    aliases: ['animedance', 'animefan'],
    description: 'Get a random oppai anime image',
    run: async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        try {
            await client.sendMessage(m.chat, { react: { text: '\u231B', key: m.reactKey } });
            const url = await getAnime('oppai');
            await client.sendMessage(m.chat, { react: { text: '\u2705', key: m.reactKey } });
            await client.sendMessage(m.chat, {
                image: { url },
                caption: '\u256D\u2500 *Anime*\n\u2570\u2500 Codex-MD'
            }, { quoted: fq });
        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '\u274C', key: m.reactKey } });
            await m.reply('\u256D\u2500 *Error*\n\u2502 Try again later!\n\u2570\u2500 Codex-MD');
        }
    }
};
