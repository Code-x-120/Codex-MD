import fs from 'fs';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    const { client, m, participants } = context;
    const fq = getFakeQuoted(m);

    if (!m.isGroup) {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return m.reply(`╭─ *Eʀʀᴏʀ*\n│ Command meant for groups.\n╰─ Codex-MD`);
    }

    try {
        const gcdata = await client.groupMetadata(m.chat);
        const vcard = gcdata.participants
            .map((a, i) => {
                const number = a.id.split('@')[0];
                return `BEGIN:VCARD\nVERSION:3.0\nFN:[${i}] +${number}\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD`;
            })
            .join('\n');

        const cont = './contacts.vcf';

        await m.reply(`╭─ *VCF*\n│ A moment, Codex-MD is compiling\n│ ${gcdata.participants.length} contacts into a VCF...\n╰─ Codex-MD`);

        await fs.promises.writeFile(cont, vcard);
        await m.reply(`╭─ *VCF*\n│ Import this VCF in a separate\n│ email account to avoid messing\n│ with your contacts...\n╰─ Codex-MD`);

        await client.sendMessage(
            m.chat,
            {
                document: fs.readFileSync(cont),
                mimetype: 'text/vcard',
                fileName: 'Group contacts.vcf',
                caption: `╭─ *VCF*\n│ VCF for ${gcdata.subject}\n│ ${gcdata.participants.length} contacts\n╰─ Codex-MD`
            },
            { ephemeralExpiration: 86400, quoted: fq }
        );

        await fs.promises.unlink(cont);
    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        console.error(`VCF error: ${error.message}`);
        await m.reply(`╭─ *Eʀʀᴏʀ*\n│ Failed to generate VCF.\n│ Try again later.\n╰─ Codex-MD`);
    }
};
