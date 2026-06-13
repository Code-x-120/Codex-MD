import middleware from '../../utils/botUtil/middleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    await middleware(context, async () => {
        const { client, m, groupMetadata } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            await client.groupRevokeInvite(m.chat);
            const newCode = await client.groupInviteCode(m.chat);
            const newLink = `https://chat.whatsapp.com/${newCode}`;
            const dmJid = typeof m.sender === 'string' && m.sender.endsWith('@s.whatsapp.net') ? m.sender : null;
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            if (dmJid) {
                await m.reply(`╭─ *REVOKED*\n│ Group link revoked!\n│ New link sent to your DM.\n╰─ Codex-MD`);
                await client.sendMessage(dmJid, {
                    text: `╭─ *NEW LINK*\n│ ${newLink}\n│ New group link for ${groupMetadata?.subject || m.chat}\n╰─ Codex-MD`
                });
            } else {
                await m.reply(`╭─ *REVOKED*\n│ Group link revoked!\n│ New link: ${newLink}\n╰─ Codex-MD`);
            }
        } catch (e) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            await m.reply(`╭─ Codex-MD\n│ Failed to revoke link: ${e.message?.slice(0, 60)}\n╰─ Codex-MD`);
        }
    });
};
