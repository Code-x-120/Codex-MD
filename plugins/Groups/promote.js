import middleware from '../../utils/botUtil/middleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import { resolveTargetJid } from '../../lib/lidResolver.js';

const DEV_NUMBER = '254114885159';

export default {
    name: 'promote',
    aliases: ['makeadmin', 'addadmin', 'promoteuser'],
    description: 'Promotes a user to admin in a group',
    run: async (context) => {
        await middleware(context, async () => {
            const { client, m, prefix } = context;
            const fq = getFakeQuoted(m);
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

            const groupMetadata = await client.groupMetadata(m.chat);
            const participants = groupMetadata.participants;

            let rawJid = null;
            if (m.quoted?.sender) {
                rawJid = m.quoted.sender;
            } else if (m.mentionedJid && m.mentionedJid.length > 0) {
                rawJid = m.mentionedJid[0];
            }

            if (!rawJid) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return m.reply(`╭─ *USAGE*\n│ Mention or quote a user.\n│ Example: ${prefix}promote @user\n╰─ Codex-MD`);
            }

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
                await client.groupParticipantsUpdate(m.chat, [target], 'promote');
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                await client.sendMessage(m.chat, {
                    text: `╭─ *PROMOTED*\n│ @${target.split('@')[0]} is now an admin.\n│ Don't let the power go to\n│ your empty head.\n╰─ Codex-MD`,
                    mentions: [target]
                }, { quoted: fq });
            } catch (error) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                await m.reply(`╭─ *ERROR*\n│ Failed to promote: ${error.message?.slice(0, 60)}\n╰─ Codex-MD`);
            }
        });
    }
};
