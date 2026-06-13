import axios from 'axios';
import FormData from 'form-data';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs from 'fs';
import path from 'path';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

async function uploadImage(buffer) {
    const tempFilePath = path.join(__dirname, `temp_${Date.now()}.jpg`);
    fs.writeFileSync(tempFilePath, buffer);

    const form = new FormData();
    form.append('files[]', fs.createReadStream(tempFilePath));

    try {
        const response = await axios.post('https://qu.ax/upload.php', form, {
            headers: form.getHeaders(),
        });

        const link = response.data.files[0].url;
        if (!link) throw new Error('No URL returned');

        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        return { url: link };
    } catch (error) {
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        throw error;
    }
}

export default {
    name: 'toanime',
    aliases: ['anime', 'toon', 'cartoon'],
    description: 'Convert a replied image to anime style',
    run: async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const quoted = m.message?.imageMessage ? m : m.quoted ? m.quoted : null;

        if (!quoted) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply('╭─ *TO ANIME*\n│ Send or reply to an image!\n│ Example: Send image → .toanime\n╰─ Codex-MD');
        }

        let quotedMime = '';
        if (quoted.mtype === 'imageMessage' && quoted.msg?.mimetype) {
            quotedMime = quoted.msg.mimetype;
        } else if (quoted.mimetype) {
            quotedMime = quoted.mimetype;
        } else if (quoted.msg?.mimetype) {
            quotedMime = quoted.msg.mimetype;
        }

        if (!quotedMime || !quotedMime.startsWith('image/')) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply('╭─ *TO ANIME*\n│ The replied message is *not an image*!\n│ Please send or reply to a *photo*.\n╰─ Codex-MD');
        }

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            const media = await quoted.download();
            if (!media || media.length === 0) throw new Error('Failed to download');

            if (media.length > 10 * 1024 * 1024) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return m.reply('╭─ *TO ANIME*\n│ Image too large! Max 10MB.\n│ Compress it, you hoarder.\n╰─ Codex-MD');
            }

            const { url: imageUrl } = await uploadImage(media);

            const apiResponse = await axios.get('https://fgsi.koyeb.app/api/ai/image/toAnime', {
                params: {
                    apikey: 'fgsiapi-2dcdfa06-6d',
                    url: imageUrl
                },
                responseType: 'arraybuffer',
                timeout: 90000
            });

            const animeBuffer = Buffer.from(apiResponse.data);

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

            await client.sendMessage(m.chat, {
                image: animeBuffer,
                caption: `╭─ *ANIME TRANSFORMATION*\n│ ANIME TRANSFORMATION COMPLETE!\n│ Look at this weeb result.\n╰─ Codex-MD`,
                mentions: [m.sender]
            }, { quoted: fq });

        } catch (err) {
            console.error('ToAnime Error:', err.message);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });

            const errorMsg = err.response
                ? `API Error: ${err.response.status}`
                : err.message.includes('timeout') ? 'API timed out.' : 'Failed. Try again later.';

            await m.reply(`╭─ *ERROR*\n│ ${errorMsg}\n╰─ Codex-MD`);
        }
    }
};