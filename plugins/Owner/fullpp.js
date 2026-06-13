import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { S_WHATSAPP_NET } from '@whiskeysockets/baileys';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

                import fs from 'fs';
export default {
    name: 'fullpp',
    aliases: ['setprofile'],
    run: async (context) => {
        await ownerMiddleware(context, async () => {
            const { client, m, msgCodex, generateProfilePicture } = context;
            const fq = getFakeQuoted(m);
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

            try {

                if (!msgCodex) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    return m.reply(`╭─ Codex-MD\n│ REPLY TO AN IMAGE!\n╰─ Codex-MD`);
                }

                if (!msgCodex.imageMessage) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    return m.reply(`╭─ Codex-MD\n│ THAT IS NOT AN IMAGE!\n│ REPLY TO AN IMAGE!\n╰─ Codex-MD`);
                }

                const medis = await client.downloadAndSaveMediaMessage(msgCodex.imageMessage);
                const { img } = await generateProfilePicture(medis);

                client.query({
                    tag: 'iq',
                    attrs: { target: undefined, to: S_WHATSAPP_NET, type: 'set', xmlns: 'w:profile:picture' },
                    content: [{ tag: 'picture', attrs: { type: 'image' }, content: img }]
                });

                fs.unlinkSync(medis);
                m.reply(`╭─ *UPDATED*\n│ Bot Profile Picture Updated.\n╰─ Codex-MD`);

            } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                m.reply(`╭─ *ERROR*\n│ Failed to update profile photo.\n│ ${error}\n╰─ Codex-MD`);
            }
        });
    }
};
