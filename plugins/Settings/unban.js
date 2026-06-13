import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getBannedUsers, unbanUser } from '../../database/config.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import { resolvePhoneNumber } from '../../lib/lidResolver.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args, participants } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        let numberToUnban;

        if (m.quoted) {
            numberToUnban = resolvePhoneNumber(m.quoted.sender, participants);
        } else if (m.mentionedJid && m.mentionedJid.length > 0) {
            numberToUnban = resolvePhoneNumber(m.mentionedJid[0], participants);
        } else {
            numberToUnban = (args[0] || '').replace(/[^0-9]/g, '');
        }

        if (!numberToUnban) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await m.reply(`╭─ Codex-MD\n│ Provide a valid number or quote a user, genius.\n╰─ Codex-MD`);
        }

        const bannedUsers = await getBannedUsers();

        if (!bannedUsers.includes(numberToUnban)) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await m.reply(`╭─ Codex-MD\n│ This user wasn't even banned. What are you doing?\n╰─ Codex-MD`);
        }

        await unbanUser(numberToUnban);
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        await m.reply(`╭─ *UNBAN*\n│ ${numberToUnban} has been unbanned.\n│ They better not mess up again.\n╰─ Codex-MD`);
    });
};
