import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
  name: 'setpp',
  aliases: ['setprofilepic', 'setbotpp', 'setdp'],
  description: 'Change bot profile picture',
  run: async (context) => {
    await ownerMiddleware(context, async () => {
      const { client, m } = context;
      const fq = getFakeQuoted(m);

      const quoted = m.quoted || (m.message?.extendedTextMessage?.contextInfo?.quotedMessage ? { message: m.message.extendedTextMessage.contextInfo.quotedMessage } : null);
      const media = quoted?.message?.imageMessage || quoted?.message?.videoMessage || m.message?.imageMessage;

      if (!media) {
        return client.sendMessage(m.chat, {
          text: `╭─ *Usage*\n│ Reply to an image with\n│ .setpp\n╰─ Codex-MD`
        }, { quoted: fq });
      }

      try {
        const buffer = await client.downloadMediaMessage(media);
        await client.updateProfilePicture(client.user.id, buffer);
        await client.sendMessage(m.chat, {
          text: `╭─ *Done*\n│ Profile picture updated!\n╰─ Codex-MD`
        }, { quoted: fq });
      } catch (e) {
        await client.sendMessage(m.chat, {
          text: `╭─ *Error*\n│ Failed to update profile pic.\n│ ${e.message}\n╰─ Codex-MD`
        }, { quoted: fq });
      }
    });
  }
};
