import wiki from 'wikipedia';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
export default async (context) => {

const { client, m, text } = context;
const fq = getFakeQuoted(m);
await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            if (!text) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return m.reply("╭─ Codex-MD\n│ Provide a term to search, you lazy fool.\n│ E.g: What is JavaScript!\n╰─ Codex-MD")
            }
            const con = await wiki.summary(text);
            const texa = `╭─ *WIKIPEDIA*\n│ Title: ${con.title}\n│ Desc: ${con.description}\n│ Summary: ${con.extract}\n│ URL: ${con.content_urls.mobile.page}\n╰─ Codex-MD`
            m.reply(texa)
        } catch (err) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            console.log(err)
            return m.reply("╭─ Codex-MD\n│ Got 404. Couldn't find anything, try harder.\n╰─ Codex-MD")
        }
    }
