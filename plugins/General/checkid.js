import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'checkid',
    aliases: ['cekid', 'getid', 'id', 'idch'],
    description: 'Get JID from group or channel invite link',
    run: async (context) => {
        const { client, m, prefix } = context;

        try {
            const text = m.body.trim();
            const linkMatch = text.match(/https?:\/\/(chat\.whatsapp\.com|whatsapp\.com\/channel)\/[^\s]+/i);
            const link = linkMatch ? linkMatch[0] : null;

            if (!link) {
                await client.sendMessage(m.chat, { react: { text: '', key: m.reactKey } }).catch(() => {});
                return m.reply("╭─ *Eʀʀᴏʀ*\n│ Where's the link?\n│ Example: " + prefix + "checkid https://chat.whatsapp.com/xxxxx\n╰─ Codex-MD");
            }

            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

            let url;
            try {
                url = new URL(link);
            } catch {
                await client.sendMessage(m.chat, { react: { text: '', key: m.reactKey } });
                return m.reply("╭─ *Eʀʀᴏʀ*\n│ That's not a valid URL.\n╰─ Codex-MD");
            }

            let id = '';
            let type = '';

            if (url.hostname === 'chat.whatsapp.com') {
                const code = url.pathname.replace(/^\/+/, '');
                const res = await client.groupGetInviteInfo(code);
                id = res.id;
                type = 'Group';
            } else if (url.hostname === 'whatsapp.com' && url.pathname.startsWith('/channel/')) {
                const code = url.pathname.split('/channel/')[1]?.split('/')[0];
                const res = await client.newsletterMetadata('invite', code, 'GUEST');
                id = res.id;
                type = 'Channel';
            } else {
                await client.sendMessage(m.chat, { react: { text: '', key: m.reactKey } });
                return m.reply("╭─ *Eʀʀᴏʀ*\n│ That's not a WhatsApp group or channel link.\n╰─ Codex-MD\n│ *Link:* " + link + "\n│ *" + type + " ID:* `" + id + "`\n╰─ Codex-MD");
            }

            const bodyText = "╭─ *" + type + " Iᴅ*\n│ *Link:* " + link + "\n│ *" + type + " ID:* `" + id + "`\n╰─ Codex-MD";

            const fq = getFakeQuoted(m);
            try {
                const msg = generateWAMessageFromContent(
                    m.chat,
                    {
                        interactiveMessage: {
                            body: { text: bodyText },
                            footer: { text: '' },
                            nativeFlowMessage: {
                                messageVersion: 1,
                                buttons: [
                                    {
                                        name: 'cta_copy',
                                        buttonParamsJson: JSON.stringify({
                                            display_text: "Copy " + type + " ID",
                                            copy_code: id
                                        })
                                    }
                                ]
                            }
                        }
                    },
                    { quoted: fq }
                );
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

                await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
            } catch {
                await m.reply(bodyText + "\n\nCopy this ID: `" + id + "`");
            }

        } catch (error) {
            console.error('CheckID error:', error);
            await client.sendMessage(m.chat, { react: { text: '', key: m.reactKey } });
            await m.reply("╭─ *Cʀᴀsʜᴇᴅ*\n│ Error: " + error.message + "\n╰─ Codex-MD");
        }
    }
};
