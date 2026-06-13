import axios from 'axios';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    const { client, mime, m, text, botname } = context;
    const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    if (m.quoted && /image/.test(mime)) {
        const buffer = await m.quoted.download();
        const base64Image = buffer.toString('base64');

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            const response = await axios.post("https://negro.consulting/api/process-image", {
                filter: "hitam",
                imageData: "data:image/png;base64," + base64Image
            });

            const resultBuffer = Buffer.from(
                response.data.processedImageUrl.replace("data:image/png;base64,", ""),
                "base64"
            );

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

            await client.sendMessage(m.chat, {
                image: resultBuffer,
                caption: `╭─ *NEGRO FILTER*\n│ Done! Your image now has the\n│ *black* filter applied.\n╰─ Codex-MD`
            }, { quoted: fq });
        } catch (error) {
            console.error('Error while processing image:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await m.reply('╭─ *ERROR*\n│ Image processing failed. Try again.\n╰─ Codex-MD');
        }
    } else {
        await m.reply('╭─ *NEGRO*\n│ Quote an image and type *negro*\n│ to apply the black filter, genius.\n╰─ Codex-MD');
    }
};
