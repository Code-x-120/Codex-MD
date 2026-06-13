import { getFakeQuoted } from '../../lib/fakeQuoted.js';
let canvacord = null; try { canvacord = (await import("canvacord")).default ?? (await import("canvacord")); } catch {}

export default async (context) => {
        const { client, m, Tag, botname } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

let cap = `╭─ *TRASH*\n│ Converted By ${botname}\n╰─ Codex-MD`;

try {

        if (m.quoted) {
            try {
                img = await client.profilePictureUrl(m.quoted.sender, 'image')
            } catch {
                img = "https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg"
            }
                        result = await canvacord.Canvacord.trash(img);
        } else if (Tag) {
            try {
                ppuser = await client.profilePictureUrl(Tag[0] || m.sender, 'image')
            } catch {
                ppuser = 'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg'
            }
                        result = await canvacord.Canvacord.trash(ppuser);
        } 

        await client.sendMessage(m.chat, { image: result, caption: cap }, { quoted: fq });

} catch (e) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});

m.reply('╭─ *ERROR*\n│ Something wrong occured.\n│ Try again, loser.\n╰─ Codex-MD')

}
    }