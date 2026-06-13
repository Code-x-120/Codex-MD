import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const menfessPairs = new Map();
const menfessPool = new Set();
const menfessUserChats = new Map();
const confessionChains = new Map();

setInterval(() => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    for (const [msgId, entry] of confessionChains.entries()) {
        if (entry.timestamp < cutoff) confessionChains.delete(msgId);
    }
}, 30 * 60 * 1000);

function tryPairUsers(client) {
    const poolArray = [...menfessPool];
    if (poolArray.length >= 2) {
        const user1 = poolArray[0];
        const user2 = poolArray[1];
        menfessPool.delete(user1);
        menfessPool.delete(user2);
        const chat1 = menfessUserChats.get(user1);
        const chat2 = menfessUserChats.get(user2);
        menfessPairs.set(user1, { partnerId: user2, chatId: chat1 });
        menfessPairs.set(user2, { partnerId: user1, chatId: chat2 });
        return { user1, user2, chat1, chat2 };
    }
    return null;
}

export default {
    name: 'menfess',
    aliases: ['confess', 'anonymous', 'menfess_start', 'menfess_stop', 'menfess_next', 'balas'],
    description: 'Anonymous confessions & menfess pair system',
    run: async (context) => {
        const { client, m, command, text, args, prefix } = context;
        const fq = getFakeQuoted(m);

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (command === 'confess') {
            let targetUser = null;
            let message = text || '';

            if (m.quoted && m.quoted.sender) {
                targetUser = m.quoted.sender;
            } else if (m.mentionedJid && m.mentionedJid.length > 0) {
                targetUser = m.mentionedJid[0];
                message = text.replace(/@\S+\s*/g, '').trim();
            }

            if (!targetUser || !message) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                return client.sendMessage(m.chat, {
                    text: `╭─ *MᴇɴFᴇss*\n│ Usage: ${prefix}confess @user <message>\n│ Or reply to someone with ${prefix}confess <message>\n╰─ Codex-MD`
                }, { quoted: fq });
            }

            if (targetUser === m.sender) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                return client.sendMessage(m.chat, {
                    text: `╭─ *MᴇɴFᴇss*\n│ You can't send a confession to yourself!\n╰─ Codex-MD`
                }, { quoted: fq });
            }

            const sentMsg = await client.sendMessage(targetUser, {
                text: `╭─ *MᴇɴFᴇss*\n│ 💌 You have an anonymous confession:\n│\n│ "${message}"\n│\n│ Reply with ${prefix}balas <reply> to respond\n╰─ Codex-MD`
            });

            if (sentMsg?.key?.id) {
                confessionChains.set(sentMsg.key.id, {
                    from: m.sender,
                    to: targetUser,
                    message,
                    type: 'confession',
                    timestamp: Date.now()
                });
            }

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭─ *MᴇɴFᴇss*\n│ ✅ Your confession has been delivered anonymously!\n╰─ Codex-MD`
            }, { quoted: fq });
        }

        if (command === 'balas') {
            let chainEntry = null;
            const replyMessage = text || '';

            if (!replyMessage) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                return client.sendMessage(m.chat, {
                    text: `╭─ *MᴇɴFᴇss*\n│ Usage: Reply to a confession with ${prefix}balas <reply>\n╰─ Codex-MD`
                }, { quoted: fq });
            }

            if (m.quoted && m.quoted.id && confessionChains.has(m.quoted.id)) {
                chainEntry = confessionChains.get(m.quoted.id);
            }

            if (!chainEntry) {
                let mostRecent = null;
                let mostRecentTime = 0;
                for (const [, entry] of confessionChains.entries()) {
                    if ((entry.to === m.sender || entry.from === m.sender) && entry.timestamp > mostRecentTime) {
                        mostRecent = entry;
                        mostRecentTime = entry.timestamp;
                    }
                }
                chainEntry = mostRecent;
            }

            if (!chainEntry) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                return client.sendMessage(m.chat, {
                    text: `╭─ *MᴇɴFᴇss*\n│ No confession chain found for you.\n╰─ Codex-MD`
                }, { quoted: fq });
            }

            const recipientId = chainEntry.to === m.sender ? chainEntry.from :
                              chainEntry.from === m.sender ? chainEntry.to : null;

            if (!recipientId) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                return client.sendMessage(m.chat, {
                    text: `╭─ *MᴇɴFᴇss*\n│ Error resolving chain direction.\n╰─ Codex-MD`
                }, { quoted: fq });
            }

            const sentReply = await client.sendMessage(recipientId, {
                text: `╭─ *MᴇɴFᴇss*\n│ 💬 Anonymous reply:\n│\n│ "${replyMessage}"\n│\n│ Reply with ${prefix}balas <reply> to respond\n╰─ Codex-MD`
            });

            if (sentReply?.key?.id) {
                confessionChains.set(sentReply.key.id, {
                    from: m.sender,
                    to: recipientId,
                    message: replyMessage,
                    type: 'confession_reply',
                    timestamp: Date.now()
                });
            }

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭─ *MᴇɴFᴇss*\n│ ✅ Your reply has been sent anonymously!\n╰─ Codex-MD`
            }, { quoted: fq });
        }

        if (command === 'menfess_start') {
            if (menfessPairs.has(m.sender)) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                return client.sendMessage(m.chat, {
                    text: `╭─ *MᴇɴFᴇss*\n│ You're already in a menfess pair!\n│ Use ${prefix}menfess_stop to leave.\n╰─ Codex-MD`
                }, { quoted: fq });
            }

            menfessPool.add(m.sender);
            menfessUserChats.set(m.sender, m.chat);

            const paired = tryPairUsers(client);

            if (paired) {
                const pairMsg = `╭─ *MᴇɴFᴇss*\n│ ✅ Paired with an anonymous partner!\n│ Use ${prefix}menfess <message> to chat.\n│ ${prefix}menfess_stop to leave.\n│ ${prefix}menfess_next to skip.\n╰─ Codex-MD`;

                await client.sendMessage(paired.chat1, { text: pairMsg });
                if (paired.chat2 !== paired.chat1) {
                    await client.sendMessage(paired.chat2, { text: pairMsg });
                }
            } else {
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return client.sendMessage(m.chat, {
                    text: `╭─ *MᴇɴFᴇss*\n│ Looking for a partner... 🕐\n│ You'll be notified when someone joins.\n│ Use ${prefix}menfess_stop to cancel.\n╰─ Codex-MD`
                }, { quoted: fq });
            }

            return;
        }

        if (command === 'menfess_stop') {
            menfessPool.delete(m.sender);
            const pair = menfessPairs.get(m.sender);

            if (pair) {
                const partnerId = pair.partnerId;
                const partnerPair = menfessPairs.get(partnerId);

                menfessPairs.delete(m.sender);
                menfessPairs.delete(partnerId);

                if (partnerPair?.chatId) {
                    await client.sendMessage(partnerPair.chatId, {
                        text: `╭─ *MᴇɴFᴇss*\n│ Your partner has left the chat.\n│ Use ${prefix}menfess_start to find a new partner.\n╰─ Codex-MD`
                    });
                }
            }

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: pair
                    ? `╭─ *MᴇɴFᴇss*\n│ You've left the menfess chat.\n╰─ Codex-MD`
                    : `╭─ *MᴇɴFᴇss*\n│ You're not in any menfess session.\n╰─ Codex-MD`
            }, { quoted: fq });
        }

        if (command === 'menfess_next') {
            const pair = menfessPairs.get(m.sender);

            if (pair) {
                const partnerId = pair.partnerId;
                const partnerPair = menfessPairs.get(partnerId);

                menfessPairs.delete(m.sender);
                menfessPairs.delete(partnerId);

                if (partnerPair?.chatId) {
                    await client.sendMessage(partnerPair.chatId, {
                        text: `╭─ *MᴇɴFᴇss*\n│ Your partner has skipped to a new chat.\n│ Use ${prefix}menfess_start to find a new partner.\n╰─ Codex-MD`
                    });
                }
            }

            menfessPool.add(m.sender);
            menfessUserChats.set(m.sender, m.chat);

            const paired = tryPairUsers(client);

            if (paired) {
                const pairMsg = `╭─ *MᴇɴFᴇss*\n│ ✅ Paired!\n│ Use ${prefix}menfess <message> to chat.\n╰─ Codex-MD`;

                await client.sendMessage(paired.chat1, { text: pairMsg });
                if (paired.chat2 !== paired.chat1) {
                    await client.sendMessage(paired.chat2, { text: pairMsg });
                }
            } else {
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return client.sendMessage(m.chat, {
                    text: pair
                        ? `╭─ *MᴇɴFᴇss*\n│ Skipped. Looking for a new partner... 🕐\n╰─ Codex-MD`
                        : `╭─ *MᴇɴFᴇss*\n│ Looking for a partner... 🕐\n╰─ Codex-MD`
                }, { quoted: fq });
            }

            return;
        }

        const activePair = menfessPairs.get(m.sender);

        if (activePair && text) {
            const partnerId = activePair.partnerId;
            const partnerChat = menfessUserChats.get(partnerId);

            if (!partnerChat) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                return client.sendMessage(m.chat, {
                    text: `╭─ *MᴇɴFᴇss*\n│ Error: Partner chat not found.\n╰─ Codex-MD`
                }, { quoted: fq });
            }

            const sentMsg = await client.sendMessage(partnerChat, {
                text: `╭─ *MᴇɴFᴇss*\n│ Anonymous:\n│\n│ ${text}\n│\n│ Reply with ${prefix}balas <reply> to respond\n╰─ Codex-MD`
            });

            if (sentMsg?.key?.id) {
                confessionChains.set(sentMsg.key.id, {
                    from: m.sender,
                    to: partnerId,
                    message: text,
                    type: 'menfess',
                    timestamp: Date.now()
                });
            }

            return;
        }

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        return client.sendMessage(m.chat, {
            text: `╭─ *MᴇɴFᴇss*\n│ Anonymous Confession & Chat System\n│\n│ ${prefix}confess @user <message>\n│ ${prefix}balas <reply>\n│ ${prefix}menfess_start\n│ ${prefix}menfess_stop\n│ ${prefix}menfess_next\n│ ${prefix}menfess <message>\n╰─ Codex-MD`
        }, { quoted: fq });
    }
};
