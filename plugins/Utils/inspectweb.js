import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    const { m, text } = context;
    const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    if (!text) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return m.reply("╭─ Codex-MD\n│ Provide a valid web link to inspect, dimwit.\n│ Bot will crawl HTML, CSS, JS, and media.\n╰─ Codex-MD");
    }

    if (!/^https?:\/\//i.test(text)) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return m.reply("╭─ Codex-MD\n│ URL must start with http:// or https://, genius.\n╰─ Codex-MD");
    }

    try {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const response = await fetch(text);
        const html = await response.text();
        const $ = cheerio.load(html);

        const mediaFiles = [];
        $('img[src], video[src], audio[src]').each((i, element) => {
            let src = $(element).attr('src');
            if (src) {
                mediaFiles.push(src);
            }
        });

        const cssFiles = [];
        $('link[rel="stylesheet"]').each((i, element) => {
            let href = $(element).attr('href');
            if (href) {
                cssFiles.push(href);
            }
        });

        const jsFiles = [];
        $('script[src]').each((i, element) => {
            let src = $(element).attr('src');
            if (src) {
                jsFiles.push(src);
            }
        });

        await m.reply(`╭─ *HTML CONTENT*\n${html}\n╰─ Codex-MD`);

        if (cssFiles.length > 0) {
            for (const cssFile of cssFiles) {
                const cssResponse = await fetch(new URL(cssFile, text));
                const cssContent = await cssResponse.text();
                await m.reply(`╭─ *CSS FILE*\n${cssContent}\n╰─ Codex-MD`);
            }
        } else {
            await m.reply("╭─ Codex-MD\n│ No external CSS files found.\n╰─ Codex-MD");
        }

        if (jsFiles.length > 0) {
            for (const jsFile of jsFiles) {
                const jsResponse = await fetch(new URL(jsFile, text));
                const jsContent = await jsResponse.text();
                await m.reply(`╭─ *JS FILE*\n${jsContent}\n╰─ Codex-MD`);
            }
        } else {
            await m.reply("╭─ Codex-MD\n│ No external JavaScript files found.\n╰─ Codex-MD");
        }

        if (mediaFiles.length > 0) {
            await m.reply(`╭─ *MEDIA FILES*\n${mediaFiles.map(f => `├ ${f}`).join('\n')}\n╰─ Codex-MD`);
        } else {
            await m.reply("╭─ Codex-MD\n│ No media files found. Empty site, empty soul.\n╰─ Codex-MD");
        }

    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        console.error(error);
        return m.reply("╭─ Codex-MD\n│ Error fetching website content. Site's probably trash.\n╰─ Codex-MD");
    }
};
