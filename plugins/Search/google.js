import { getFakeQuoted } from '../../lib/fakeQuoted.js';
  import axios from 'axios';
export default async (context) => {
  const { client, m, text } = context;
  const fq = getFakeQuoted(m);
  await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

  if (!text) {
    m.reply(
      "╭─ Codex-MD\n" +
      "├ ERROR\n" +
      "╭─ Codex-MD\n" +
      "│ 🚫 Please provide a search term!\n" +
      "├ Example: .google What is treason\n" +
      "╰─ Codex-MD"
    );
    return;
  }

  try {
    let { data } = await axios.get(
      `https://www.googleapis.com/customsearch/v1?q=${text}&key=AIzaSyDMbI3nvmQUrfjoCJYLS69Lej1hSXQjnWI&cx=baf9bdb0c631236e5`
    );

    if (data.items.length == 0) {
      m.reply(
        "╭─ Codex-MD\n" +
        "├ ERROR\n" +
        "╭─ Codex-MD\n" +
        "│ ❌ Unable to find any results\n" +
        "╰─ Codex-MD"
      );
      return;
    }

    let tex = "";
    tex += "╭─ Codex-MD\n";
    tex += "├ GOOGLE SEARCH\n";
    tex += "╭─ Codex-MD\n";
    tex += "│ 🔍 Search Term: " + text + "\n";
    tex += "╭─ Codex-MD\n";

    for (let i = 0; i < data.items.length; i++) {
      tex += "├ Result " + (i + 1) + "\n";
      tex += "│ 🪧 Title: " + data.items[i].title + "\n";
      tex += "│ 📝 Description: " + data.items[i].snippet + "\n";
      tex += "│ 🌐 Link: " + data.items[i].link + "\n";
      tex += "╭─ Codex-MD\n";
    }

    m.reply(tex);
  } catch (e) {
    m.reply(
      "╭─ Codex-MD\n" +
      "├ ERROR\n" +
      "╭─ Codex-MD\n" +
      "│ ❌ An error occurred: " + e.message + "\n" +
      "╰─ Codex-MD"
    );
  }
};