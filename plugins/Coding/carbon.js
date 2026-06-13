import fetch from 'node-fetch';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
export default async (context) => {
  const { client, m, text, botname } = context;
  const fq = getFakeQuoted(m);
  await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

  let cap = `╭─ *CARBON*\n│ Converted By ${botname}\n╰─ Codex-MD`;

  if (m.quoted && m.quoted.text) {
    const forq = m.quoted.text;

    try {
      let response = await fetch('https://carbonara.solopov.dev/api/cook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: forq,
          backgroundColor: '#1F816D',
        }),
      });

      if (!response.ok) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
          return m.reply('╭─ *ERROR*\n│ API failed to fetch a valid response.\n│ Try again later, genius.\n╰─ Codex-MD')
      }

      let per = await response.buffer();

      await client.sendMessage(m.chat, { image: per, caption: cap }, { quoted: fq });
    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      m.reply(`╭─ *ERROR*\n│ An error occured, you broke it.\n│ ${error}\n╰─ Codex-MD`)
    }
  } else {
    m.reply('╭─ *CARBON*\n│ Quote a code message, idiot.\n╰─ Codex-MD');
  }
}