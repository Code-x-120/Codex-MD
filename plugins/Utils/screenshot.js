import { getFakeQuoted } from '../../lib/fakeQuoted.js';
export default async (context) => {

const { client, m, text, botname } = context;
const fq = getFakeQuoted(m);
await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

try {
let cap = `╭─ *SCREENSHOT*\n│ Screenshot by ${botname}\n╰─ Codex-MD`

if (!text) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return m.reply("╭─ Codex-MD\n│ Provide a website link to screenshot, moron.\n╰─ Codex-MD")
}

const image = `https://image.thum.io/get/fullpage/${text}`

await client.sendMessage(m.chat, { image: { url: image }, caption: cap}, { quoted: fq });

} catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});

m.reply("╭─ Codex-MD\n│ Screenshot failed. Probably your garbage link.\n╰─ Codex-MD")

}

}
