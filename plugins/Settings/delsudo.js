import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getSettings, getSudoUsers, removeSudoUser } from '../../database/config.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import { resolvePhoneNumber } from '../../lib/lidResolver.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args, participants } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        let numberToRemove;

        if (m.quoted) {
            numberToRemove = resolvePhoneNumber(m.quoted.sender, participants);
        } else if (m.mentionedJid && m.mentionedJid.length > 0) {
            numberToRemove = resolvePhoneNumber(m.mentionedJid[0], participants);
        } else {
            numberToRemove = args[0];
        }

        if (!numberToRemove || !/^\d+$/.test(numberToRemove)) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await m.reply(`╭─ Codex-MD\n│ Provide a valid number or quote a user, genius.\n╰─ Codex-MD`);
        }

        const settings = await getSettings();
        if (!settings) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await m.reply(`╭─ Codex-MD\n│ Settings not found. Something's seriously broken.\n╰─ Codex-MD`);
        }

        const sudoUsers = await getSudoUsers();

        if (!sudoUsers.includes(numberToRemove)) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await m.reply(`╭─ Codex-MD\n│ This number isn't even a sudo user, idiot.\n╰─ Codex-MD`);
        }

        await removeSudoUser(numberToRemove);
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

        await m.reply(`╭─ *DELSUDO*\n│ ${numberToRemove} removed from Sudo Users.\n│ Power revoked. Sucks to be them.\n╰─ Codex-MD`);
    });
};
