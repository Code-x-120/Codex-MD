import middleware from '../../utils/botUtil/middleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import { getBinaryNodeChild, getBinaryNodeChildren } from '@whiskeysockets/baileys';

export default async (context) => {
    await middleware(context, async () => {
        const { client, m, participants, botname, groupMetadata, text, pushname } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (!text) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`╭─ *ERROR*\n│ Provide number to be added.\n│ Format: add 254114885159\n╰─ Codex-MD`);
        }

        const _participants = participants.map((user) => user.id.split(':')[0] + '@s.whatsapp.net');

        const numberList = text.split(',')
            .map((v) => v.replace(/[^0-9]/g, ''))
            .filter((v) => v.length > 4 && v.length < 20 && !_participants.includes(v + '@s.whatsapp.net'));

        const checkedUsers = await Promise.all(
            numberList.map(async (v) => {
                const exists = await client.onWhatsApp(v + '@s.whatsapp.net');
                return { num: v, exists: exists?.[0]?.exists };
            })
        );

        const users = checkedUsers.filter(v => v.exists).map(v => v.num + '@c.us');

        if (!users.length) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return m.reply(`╭─ *ADD*\n│ None of those numbers exist on WhatsApp\n│ or they're already in the group. 🙄\n╰─ Codex-MD`);
        }

        const response = await client.query({
            tag: 'iq',
            attrs: {
                type: 'set',
                xmlns: 'w:g2',
                to: m.chat,
            },
            content: users.map((jid) => ({
                tag: 'add',
                attrs: {},
                content: [{ tag: 'participant', attrs: { jid } }],
            })),
        });

        const add = getBinaryNodeChild(response, 'add');
        const participant = getBinaryNodeChildren(add, 'participant');

        let respon = await client.groupInviteCode(m.chat);

        for (const user of participant.filter((item) => item.attrs.error === 401 || item.attrs.error === 403 || item.attrs.error === 408)) {
            const jid = user.attrs.jid;
            const content = getBinaryNodeChild(user, 'add_request');
            const invite_code = content.attrs.code;
            const invite_code_exp = content.attrs.expiration;

            let teza;
            if (user.attrs.error === 401) {
                teza = `╭─ Codex-MD\n│ @${jid.split('@')[0].split(':')[0]} has blocked the bot.\n╰─ Codex-MD`;
            } else if (user.attrs.error === 403) {
                teza = `╭─ Codex-MD\n│ @${jid.split('@')[0].split(':')[0]} has set privacy settings for group adding.\n╰─ Codex-MD`;
            } else if (user.attrs.error === 408) {
                teza = `╭─ Codex-MD\n│ @${jid.split('@')[0].split(':')[0]} recently left the group.\n╰─ Codex-MD`;
            }

            await m.reply(teza);

            let links = `╭─ *GROUP INVITE*\n│ ${pushname} is trying to add you to\n│ ${groupMetadata.subject}\n│ https://chat.whatsapp.com/${respon}\n╰─ Codex-MD`;

            await client.sendMessage(jid, { text: links }, { quoted: fq });
        }

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
    });
};
