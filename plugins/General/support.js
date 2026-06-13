import { getFakeQuoted } from '../../lib/fakeQuoted.js';
export default async (context) => {
  const { client, m } = context;
  const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

  const message = `╭─ *Sᴜᴘᴘᴏʀᴛ Lɪɴᴋs*

│ *Owner*
│ https:

│ *Channel Link*
│ https:

│ *Group*
│ https:
╰─ Codex-MD`

  try {
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
    await client.sendMessage(
      m.chat,
      { text: message },
      { quoted: fq }
    );
  } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    console.error("Support command error:", error);
    await m.reply(`╭─ *Eʀʀᴏʀ*\n│ Failed to send support links.\n│ Try again, you impatient fool.\n╰─ Codex-MD`);
  }
};
