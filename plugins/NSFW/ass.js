import fetch from 'node-fetch';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);

    try {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const res = await fetch('https://nekobot.xyz/api/image?type=ass');
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        const data = await res.json();

        if (!data.success || !data.message) throw new Error('No image URL returned');

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

        await client.sendMessage(m.chat, {
            image: { url: data.message },
            caption: `╭─ *NSFW*\n│ Type: ass\n│ Here you go, you degenerate.\n╰─ Codex-MD`
        }, { quoted: fq });

    } catch (error) {
        console.error('NSFW error:', error);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        await m.reply(`╭─ *ERROR*\n│ Failed to fetch NSFW content.\n╰─ Codex-MD`);
    }
};
