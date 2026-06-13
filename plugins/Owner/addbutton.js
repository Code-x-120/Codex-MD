import { getSettings } from '../../database/config.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
  name: 'addbutton',
  aliases: ['addbtn'],
  description: 'Adds a custom button to the menu',
  run: async (context) => {
    const { client, m, args } = context;
    const fq = getFakeQuoted(m);
    try {
      if (args.length < 2) {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        await client.sendMessage(m.chat, { text: `╭─ *USAGE*\n│ .addbutton <button_name> <command>\n╰─ Codex-MD` }, { quoted: fq });
        return;
      }
      const buttonName = args[0];
      const command = args[1];
      await client.sendMessage(m.chat, { text: `╭─ *BUTTON ADDED*\n│ Added button "${buttonName}"\n│ for command "${command}"\n╰─ Codex-MD` }, { quoted: fq });
    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      console.error(`AddButton error: ${error.stack}`);
      await client.sendMessage(m.chat, { text: `╭─ *ERROR*\n│ Error adding custom button.\n╰─ Codex-MD` }, { quoted: fq });
    }
  }
};
