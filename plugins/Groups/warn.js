import { getWarnCount, addWarn, resetWarn, getGroupSettings } from '../../database/config.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import { resolveTargetJid, resolvePhoneNumber } from '../../lib/lidResolver.js';

const DEV_NUMBER = '254114885159';

export default {
    name: 'warn',
    alias: ['warns', 'warnlist'],
    description: 'Warn a group member',
    run: async (context) => {
        const { client, m, isAdmin, isBotAdmin } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (!m.isGroup) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`╭─ Codex-MD\n│ Group only command.\n╰─ Codex-MD`);
        }
        if (!isAdmin) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`╭─ Codex-MD\n│ Admin only.\n╰─ Codex-MD`);
        }

        let rawJid = m.quoted?.sender || m.mentionedJid?.[0];
        if (!rawJid) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`╭─ Codex-MD\n│ Reply to or mention the rat you wanna warn.\n╰─ Codex-MD`);
        }

        const groupMetadata = await client.groupMetadata(m.chat);
        const participants = groupMetadata.participants;
        const target = resolveTargetJid(rawJid, participants);
        if (!target) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`╭─ Codex-MD\n│ Couldn't find that person in this group.\n╰─ Codex-MD`);
        }

        const _targetNum = target.split('@')[0].replace(/\D/g, '');
        const _botNum = (client.user.id.split(':')[0].split('@')[0].replace(/\D/g, ''));
        if (_targetNum === DEV_NUMBER || _targetNum === _botNum) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`╭─ Codex-MD\n│ That command cannot be used on the dev or the bot.\n╰─ Codex-MD`);
        }

        try {
            const gs = await getGroupSettings(m.chat);
            const warnLimit = gs.warn_limit || 3;
            const userNum = target.split('@')[0].split(':')[0];
            const count = await addWarn(m.chat, userNum);

            if (count >= warnLimit) {
                await resetWarn(m.chat, userNum);
                try { await client.groupParticipantsUpdate(m.chat, [target], 'remove'); } catch {}
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return client.sendMessage(m.chat, {
                    text: `╭─ *KICKED*\n│ @${userNum} hit \`${count}/${warnLimit}\` warns.\n│ Bye bye rat 👋\n╰─ Codex-MD`,
                    mentions: [target]
                }, { quoted: fq });
            }

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭─ *WARNED*\n│ @${userNum}\n│ Warns: \`${count}/${warnLimit}\`\n│ One more and it's the door.\n╰─ Codex-MD`,
                mentions: [target]
            }, { quoted: fq });
        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`╭─ Codex-MD\n│ Failed to warn: ${error.message?.slice(0, 60)}\n╰─ Codex-MD`);
        }
    }
};
