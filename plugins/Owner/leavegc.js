import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js'; 
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, Owner, participants, botname } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (!botname) {
            console.error(`Botname not set, you incompetent fuck.`);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`╭─ Codex-MD\n│ Bot's fucked. No botname in context.\n│ Yell at your dev, dumbass.\n╰─ Codex-MD`);
        }

        if (!Owner) {
            console.error(`Owner not set, you brain-dead moron.`);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`╭─ Codex-MD\n│ Bot's broken. No owner in context.\n│ Go cry to the dev.\n╰─ Codex-MD`);
        }

        if (!m.isGroup) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`╭─ Codex-MD\n│ You think I'm bailing on your\n│ pathetic DMs? This is for groups,\n│ you idiot.\n╰─ Codex-MD`);
        }

        try {
            const maxMentions = 50;
            const mentions = participants.slice(0, maxMentions).map(a => a.id);
            await client.sendMessage(m.chat, { 
                text: `╭─ *LEAVING*\n│ Fuck this shithole ${botname} is OUT!\n│ Good luck rotting without me,\n│ you nobodies. ${mentions.length < participants.length ? 'Too many losers to tag, pathetic.' : ''}\n╰─ Codex-MD`, 
                mentions 
            }, { quoted: fq });
            console.log(`[LEAVE-DEBUG] Leaving group ${m.chat}, mentioned ${mentions.length} participants`);
            await client.groupLeave(m.chat);
        } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            console.error(`[LEAVE-ERROR] Couldn't ditch the group: ${error.stack}`);
            await m.reply(`╭─ *ERROR*\n│ Shit broke, @${m.sender.split('@')[0].split(':')[0]}!\n│ Can't escape this dumpster fire:\n│ ${error.message}. Try again, loser.\n╰─ Codex-MD`);
        }
    });
};
