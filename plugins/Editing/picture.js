import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';
import { tmpdir } from 'os';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'toimg',
    aliases: ['toimage', 'stickertoimg', 'sticker'],
    description: 'Converts stickers to images',
    run: async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        let mediaPath = null;
        let outPath = null;
        
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            
            if (!m.quoted) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return m.reply('╭─ *TO IMAGE*\n│ Are you illiterate? QUOTE A STICKER.\n│ The command is not a suggestion.\n╰─ Codex-MD');
            }
            
            const quotedMime = m.quoted.mimetype || '';
            if (!/webp/.test(quotedMime)) return m.reply('╭─ *TO IMAGE*\n│ That is not a sticker. Do you need\n│ glasses? That is clearly not a .webp file.\n╰─ Codex-MD');
            
            mediaPath = await m.quoted.download();
            if (!mediaPath) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return m.reply('╭─ *FAILED*\n│ Failed to download the sticker.\n│ Your phone is probably as useless\n│ as you are.\n╰─ Codex-MD');
            }
            
            const tempFile = path.join(tmpdir(), `sticker_${Date.now()}.webp`);
            outPath = path.join(tmpdir(), `sticker_${Date.now()}.png`);
            
            fs.writeFileSync(tempFile, mediaPath);
            
            await new Promise((resolve, reject) => {
                exec(`ffmpeg -i ${tempFile} ${outPath}`, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            
            const imageBuffer = fs.readFileSync(outPath);
            
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            
            await client.sendMessage(m.chat, { 
                image: imageBuffer, 
                caption: '╭─ *TO IMAGE*\n│ Your sticker is now an image.\n│ A miraculous achievement.\n╰─ Codex-MD' 
            }, { quoted: fq });
            
            await client.sendMessage(m.chat, { 
                document: imageBuffer, 
                mimetype: 'image/png', 
                fileName: `sticker_${Date.now()}.png`, 
                caption: '╭─ *PNG FILE*\n│ PNG version. Slightly less terrible.\n╰─ Codex-MD' 
            }, { quoted: fq });
            
            try {
                fs.unlinkSync(tempFile);
                fs.unlinkSync(outPath);
            } catch (e) {}
            
        } catch (err) {
            console.error('ToImg error:', err);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            
            let userMessage = 'The conversion failed. Shocking.';
            if (err.message.includes('timeout')) userMessage = 'Took too long. Your sticker is probably as bloated as your ego.';
            if (err.message.includes('Network Error')) userMessage = 'Network error. Is your router powered by hopes and dreams?';
            
            await m.reply(`╭─ *FAILED*\n│ ${userMessage}\n│ Error: ${err.message}\n╰─ Codex-MD`);
            
            try {
                if (mediaPath) fs.unlinkSync(mediaPath);
                if (outPath) fs.unlinkSync(outPath);
            } catch (e) {}
        }
    }
};