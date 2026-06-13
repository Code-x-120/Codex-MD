import { getAnime } from '../../lib/codexApi.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'waifu',
    aliases: ['animegirl', 'waifupic'],
    description: 'Get a random waifu image',
    run: async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const url = await getAnime('waifu');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await client.sendMessage(m.chat, {
                image: { url },
                caption: '╭─ *Wᴀɪꜰᴜ*\n╰─ Codex-MD'
            }, { quoted: fq });
        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await m.reply('╭─ *Eʀʀᴏʀ*\n│ Waifu ran away!\n╰─ Codex-MD');
        }
    }
};
