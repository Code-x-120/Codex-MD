import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, args, Owner, botname } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (!botname) {
            console.error(`Join-Error: botname missing in context.`);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(
                `╭─ Codex-MD\n│ Bot's fucked. No botname in context.\n│ Yell at your dev, dumbass.\n╰─ Codex-MD`
            );
        }

        if (!Owner) {
            console.error(`Join-Error: Owner missing in context.`);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(
                `╭─ Codex-MD\n│ Bot's broken. No owner in context.\n│ Go cry to the dev.\n╰─ Codex-MD`
            );
        }

        let raw = (text && text.trim()) || (m.quoted && ((m.quoted.text) || (m.quoted && m.quoted.caption))) || "";
        raw = String(raw || "").trim();

        if (!raw) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(
                `╭─ *USAGE*\n│ Provide a real group invite link\n│ or reply to one.\n│ Example: *${args && args[0] ? args[0] : '.join https://chat.whatsapp.com/abcdef...'}*\n╰─ Codex-MD`
            );
        }

        const groupRegex = /(?:https?:\/\/)?chat\.whatsapp\.com\/([A-Za-z0-9_-]+)/i;
        const channelRegex = /(?:https?:\/\/)?whatsapp\.com\/channel\/([a-zA-Z0-9]+)/i;
        const groupMatch = raw.match(groupRegex);
        const channelMatch = raw.match(channelRegex);

        if (channelMatch) {
            const channelId = channelMatch[1] + '@newsletter';
            try {
                try {
                    await client.newsletterSubscribe(channelId);
                } catch (subscribeErr) {
                    if (subscribeErr.message?.includes('already') || subscribeErr.message?.includes('subscribed')) {
                        try {
                            await client.newsletterUnmute(channelId);
                        } catch {}
                    } else {
                        throw subscribeErr;
                    }
                }
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return m.reply(
                    `╭─ *FOLLOWED*\n│ Channel followed successfully!\n│ ID: ${channelId}\n╰─ Codex-MD`
                );
            } catch (error) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return m.reply(
                    `╭─ *FAILED*\n│ Could not follow channel.\n│ ${error.message || 'Unknown error'}\n╰─ Codex-MD`
                );
            }
        }

        let inviteCode = groupMatch ? groupMatch[1] : null;

        if (!inviteCode) {
            const token = raw.split(/\s+/)[0];
            if (/^[A-Za-z0-9_-]{8,}$/.test(token)) {
                inviteCode = token;
            }
        }

        if (!inviteCode) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(
                `╭─ Codex-MD\n│ That ain't a valid link or invite\n│ code. Don't waste my time.\n╰─ Codex-MD`
            );
        }

        inviteCode = inviteCode.replace(/\?.*$/, '').trim();

        try {
            const info = await client.groupGetInviteInfo(inviteCode);
            const subject = info?.subject || info?.groupMetadata?.subject || "Unknown Group";

            await client.groupAcceptInvite(inviteCode);
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return m.reply(
                `╭─ *JOINED*\n│ Joined: *${subject}*\n│ Don't spam, or I'll ghost you.\n│ — ${botname}\n╰─ Codex-MD`
            );
        } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            console.error(`[JOIN-ERROR] invite=${inviteCode}`, error && (error.stack || error));

            const status =
                (error && error.output && error.output.statusCode) ||
                error?.statusCode ||
                error?.status ||
                (error?.data && (error.data.status || error.data)) ||
                (error?.response && error.response.status) ||
                null;

            if (status === 400 || status === 404) {
                return m.reply(`╭─ Codex-MD\n│ Group does not exist or the link\n│ is invalid. Stop sending trash links.\n╰─ Codex-MD`);
            }
            if (status === 401) {
                return m.reply(`╭─ Codex-MD\n│ I was previously removed from that\n│ group. I can't rejoin using this link.\n╰─ Codex-MD`);
            }
            if (status === 409) {
                return m.reply(`╭─ Codex-MD\n│ I'm already in that group, genius.\n│ You trying to confuse me?\n╰─ Codex-MD`);
            }
            if (status === 410) {
                return m.reply(`╭─ Codex-MD\n│ That invite link was reset. Get a\n│ fresh one and try again.\n╰─ Codex-MD`);
            }
            if (status === 403) {
                return m.reply(`╭─ Codex-MD\n│ I don't have permission to join\n│ that group. Maybe it's private.\n╰─ Codex-MD`);
            }
            if (status === 500) {
                return m.reply(`╭─ Codex-MD\n│ That group is full or server error.\n│ Try later or check the link.\n╰─ Codex-MD`);
            }

            const shortMsg = (error && (error.message || (typeof error === 'string' ? error : 'Unknown error'))) || 'Unknown error';
            return m.reply(`╭─ *FAILED*\n│ Failed to join: ${shortMsg}\n│ Check the link or try again.\n╰─ Codex-MD`);
        }
    });
};
