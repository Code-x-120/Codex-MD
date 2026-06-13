import middleware from '../../utils/botUtil/middleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
  await middleware(context, async () => {
    const { client, m, isBotAdmin, isAdmin } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    if (!m.isGroup) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return m.reply(`╭─ *ERROR*\n│ Yo, genius, this command's\n│ for groups. Quit embarrassing\n│ yourself.\n╰─ Codex-MD`);
    }

    if (!isAdmin) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return m.reply(`╭─ *ERROR*\n│ Pfft, you? Admin? Get real,\n│ loser. Only admins can do this.\n╰─ Codex-MD`);
    }

    if (!isBotAdmin) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return m.reply(`╭─ *ERROR*\n│ I'm not admin, dipshit.\n│ Promote me or stop wasting\n│ my time.\n╰─ Codex-MD`);
    }

    const responseList = await client.groupRequestParticipantsList(m.chat);

    if (responseList.length === 0) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return m.reply(`╭─ *NO REQUESTS*\n│ Wow, no one's dumb enough to\n│ wanna join this trash group.\n│ No requests to reject, moron.\n╰─ Codex-MD`);
    }

    for (const participant of responseList) {
      try {
        const response = await client.groupRequestParticipantsUpdate(
          m.chat,
          [participant.jid],
          "reject"
        );
        console.log(response);
      } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        console.error('Error rejecting participant:', error);
        return m.reply(`╭─ *ERROR*\n│ Screw-up alert! Couldn't reject\n│ @${participant.jid.split('@')[0]}.\n│ Fix your damn group, idiot.\n╰─ Codex-MD`, { mentions: [participant.jid] });
      }
    }

    m.reply(`╭─ *REJECTED*\n│ All those pathetic join requests?\n│ REJECTED. Go cry about it, losers.\n╰─ Codex-MD`);
  });
};
