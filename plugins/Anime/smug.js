import { getAnime } from '../../lib/codexApi.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'smug',
    aliases: ['animesmug', 'smugface'],
    description: 'Send a smug anime face',
    run: async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const url = await getAnime('smug');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await client.sendMessage(m.chat, {
                image: { url },
                caption: '╭─ *Sᴍᴜɢ*\n╰─ Codex-MD'
            }, { quoted: fq });
        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await m.reply('╭─ *Eʀʀᴏʀ*\n│ Smug unavailable!\n╰─ Codex-MD');
        }
    }
};
