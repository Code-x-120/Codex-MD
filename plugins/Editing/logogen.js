import axios from 'axios';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
  const { client, m, text } = context;
  const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

  if (!text) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return m.reply('╭─ *LOGO GEN*\n│ Enter title, idea, and slogan.\n│ Format: _logogen Title|Idea|Slogan_\n│ Example: _logogen CodexTech|AI-Powered\n│ Services|Innovation Meets Simplicity_\n╰─ Codex-MD');
  }

  const [title, idea, slogan] = text.split("|");

  if (!title || !idea || !slogan) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return m.reply('╭─ *LOGO GEN*\n│ Incorrect format, are you illiterate?\n│ Use: _logogen Title|Idea|Slogan_\n╰─ Codex-MD');
  }

  await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
  try {
    const payload = {
      ai_icon: [333276, 333279],
      height: 300,
      idea,
      industry_index: "N",
      industry_index_id: "",
      pagesize: 4,
      session_id: "",
      slogan,
      title,
      whiteEdge: 80,
      width: 400,
    };

    const { data } = await axios.post("https://www.sologo.ai/v1/api/logo/logo_generate", payload);

    if (!data.data.logoList || data.data.logoList.length === 0) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return m.reply('╭─ *FAILED*\n│ Failed to generate logo.\n│ Try again, loser.\n╰─ Codex-MD');
    }

    for (const logo of data.data.logoList) {
      await client.sendMessage(m.chat, {
        image: { url: logo.logo_thumb },
        caption: `╭─ *LOGO*\n│ Generated Logo for "${title}"\n╰─ Codex-MD`
      }, { quoted: fq });
    }
  } catch (err) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    console.error("Logo generation error:", err);
    await m.reply('╭─ *ERROR*\n│ An error occurred while creating\n│ the logo. Pathetic.\n╰─ Codex-MD');
  }
};