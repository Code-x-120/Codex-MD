import axios from 'axios';
import * as cheerio from 'cheerio';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
export default async (context) => {

const { client, m, text, botname  } = context;
const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

async function MediaFire(url, options) {
  try {
    let mime;
    options = options ? options : {};
    const res = await axios.get(url, options);
    const $ = cheerio.load(res.data);
    const hasil = [];
    const link = $('a#downloadButton').attr('href');
    const size = $('a#downloadButton').text().replace('Download', '').replace('(', '').replace(')', '').replace('\n', '').replace('\n', '').replace('                         ', '');
    const seplit = link.split('/');
    const nama = seplit[5];
    mime = nama.split('.');
    mime = mime[1];
    hasil.push({ nama, mime, size, link });
    return hasil;
  } catch (err) {
    return err;
  }
}

if (!text) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return m.reply("╭─ Codex-MD\n│ Provide a MediaFire link, you lazy bum!\n╰─ Codex-MD");
}

if (!text.includes('mediafire.com')) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return m.reply("╭─ Codex-MD\n│ That doesn't look like a MediaFire link, genius.\n╰─ Codex-MD");
    }

await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

try {

        const fileInfo = await MediaFire(text);

if (!fileInfo || !fileInfo.length) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return m.reply("╭─ Codex-MD\n│ File no longer exists on MediaFire. Too slow!\n╰─ Codex-MD");
}

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

        await client.sendMessage(
            m.chat,
            {
                document: {
                    url: fileInfo[0].link,
                },
                fileName: fileInfo[0].nama,
                mimetype: fileInfo[0].mime,
                caption: `╭─ *MEDIAFIRE DL*\n│ File: ${fileInfo[0].nama}\n│ Downloaded by ${botname}\n╰─ Codex-MD`, 
            },
            { quoted: fq }

   );

} catch (error) {

        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        m.reply(`╭─ *MEDIAFIRE ERROR*\n│ Download failed, not my fault.\n│ ${error}\n╰─ Codex-MD`);
    }

}
