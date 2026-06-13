import { getFakeQuoted } from '../../lib/fakeQuoted.js';
export default async (context) => {
  const { client, m, chatUpdate, store, isBotAdmin, isAdmin } = context;
  const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

  if (!m.isGroup) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return m.reply(`╭─ *ERROR*\n│ Yo, dumbass, this command's\n│ for groups only.\n│ Stop screwing around.\n╰─ Codex-MD`);
  }

  if (!isAdmin) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return m.reply(`╭─ *ERROR*\n│ Nice try, loser. You need\n│ admin powers to pull this off.\n│ Get lost.\n╰─ Codex-MD`);
  }

  if (!isBotAdmin) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return m.reply(`╭─ *ERROR*\n│ I ain't got admin rights, moron.\n│ Make me admin or quit\n│ wasting my time.\n╰─ Codex-MD`);
  }

  const responseList = await client.groupRequestParticipantsList(m.chat);

  if (responseList.length === 0) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return m.reply(`╭─ *NO REQUESTS*\n│ What a surprise, no one's\n│ begging to join this dumpster fire.\n│ No pending requests, idiot.\n╰─ Codex-MD`);
  }

  await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });

  for (const participant of responseList) {
    try {
      const response = await client.groupRequestParticipantsUpdate(
        m.chat,
        [participant.jid],
        "approve"
      );
      console.log(response);
    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      console.error('Error approving participant:', error);
      return m.reply(`╭─ *ERROR*\n│ Shit hit the fan, couldn't approve\n│ @${participant.jid.split('@')[0]}.\n│ Fix your group, dumbass.\n╰─ Codex-MD`, { mentions: [participant.jid] });
    }
  }

  m.reply(`╭─ *APPROVED*\n│ Ugh, fine, all the desperate\n│ wannabes got approved.\n│ Happy now, you pest?\n╰─ Codex-MD`);
};
