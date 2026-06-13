import { Sticker, createSticker, StickerTypes } from 'wa-sticker-formatter';let canvacord = null; try { canvacord = (await import("canvacord")).default ?? (await import("canvacord")); } catch {}
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
        const { client, m, Tag, botname } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

let cap = `╭─ *TRIGGER*\n│ Converted By ${botname}\n╰─ Codex-MD`;

try {

        if (m.quoted) {
            try {
                img = await client.profilePictureUrl(m.quoted.sender, 'image')
            } catch {
                img = "https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg"
            }
                        result = await canvacord.Canvacord.trigger(img);
        } else if (Tag) {
            try {
                ppuser = await client.profilePictureUrl(Tag[0] || m.sender, 'image')
            } catch {
                ppuser = 'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg'
            }
                        result = await canvacord.Canvacord.trigger(ppuser);
        } 

        let sticker = new Sticker(result, {
            pack: `dreaded`,
            author:"" ,
            categories: ['🤩', '🎉'],
            id: '12345',
            quality: 75,
            background: 'transparent'
        })
        const stikk = await sticker.toBuffer()
       await client.sendMessage(m.chat, {sticker: stikk}, { quoted: fq })

        

} catch (e) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});

m.reply('╭─ *ERROR*\n│ Something wrong occured.\n│ Try again, loser.\n╰─ Codex-MD')

}
    }