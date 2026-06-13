import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
  name: 'setabout',
  aliases: ['setstatus', 'setbio', 'updatestatus'],
  description: 'Change bot about/status text',
  run: async (context) => {
    await ownerMiddleware(context, async () => {
      const { client, m, text, prefix } = context;
      const fq = getFakeQuoted(m);

      if (!text) {
        return client.sendMessage(m.chat, {
          text: `╭─ *Usage*\n│ ${prefix}setabout <text>\n╰─ Codex-MD`
        }, { quoted: fq });
      }

      try {
        await client.updateProfileStatus(text);
        await client.sendMessage(m.chat, {
          text: `╭─ *Done*\n│ About status updated to:\n│ ${text}\n╰─ Codex-MD`
        }, { quoted: fq });
      } catch (e) {
        await client.sendMessage(m.chat, {
          text: `╭─ *Error*\n│ ${e.message}\n╰─ Codex-MD`
        }, { quoted: fq });
      }
    });
  }
};
