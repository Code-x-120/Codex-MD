import { getAnime } from '../../lib/codexApi.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'blush',
    aliases: ['animeblush', 'embarrass'],
    description: 'Send a blushing anime image',
    run: async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const url = await getAnime('blush');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await client.sendMessage(m.chat, {
                image: { url },
                caption: '╭─ *Bʟᴜsʜ*\n╰─ Codex-MD'
            }, { quoted: fq });
        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await m.reply('╭─ *Eʀʀᴏʀ*\n│ Too embarrassed to show up!\n╰─ Codex-MD');
        }
    }
};
