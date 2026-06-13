import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
  name: 'stickerinfo',
  aliases: ['sinfo', 'stinfo', 'stickerdata'],
  description: 'Get sticker metadata information',
  category: 'General',
  run: async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    try {
      if (!m.quoted) {
        return m.reply("╭─ *Sticker Info*\n│ Reply to a sticker to see its info.\n╰─ Codex-MD");
      }

      const msg = m.quoted.message || m.quoted;
      const stickerMsg = msg.imageMessage || msg.videoMessage || msg.stickerMessage || msg.documentMessage || {};
      const mimetype = stickerMsg.mimetype || '';

      if (!mimetype.includes('webp')) {
        return m.reply("╭─ *Error*\n│ That's not a sticker! Reply to a sticker.\n╰─ Codex-MD");
      }

      const pack = stickerMsg?.contextInfo?.quotedMessage?.stickerMessage?.packname
        || stickerMsg?.stickersetName || 'Unknown';
      const author = stickerMsg?.contextInfo?.quotedMessage?.stickerMessage?.author
        || stickerMsg?.stickerAuthor || 'Unknown';
      const isAnimated = stickerMsg?.isAnimated ? 'Yes' : 'No';
      const sizeKB = stickerMsg?.fileLength
        ? (stickerMsg.fileLength / 1024).toFixed(2) + ' KB' : 'N/A';
      const mimeType = mimetype || 'N/A';
      const fileEncSha256 = stickerMsg?.fileEncSha256 ? stickerMsg.fileEncSha256.toString('base64').slice(0, 20) + '...' : 'N/A';

      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } }).catch(() => {});
      return m.reply(
        `╭─ *Sticker Info* 🧩\n│ 📦 Pack: ${pack}\n│ ✍️ Author: ${author}\n│ 🎞 Animated: ${isAnimated}\n│ 📁 Size: ${sizeKB}\n│ 🏷️ MIME: ${mimeType}\n│ 🔑 Hash: ${fileEncSha256}\n╰─ Codex-MD`
      );
    } catch (e) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return m.reply(`╭─ *Error*\n│ ${e.message}\n╰─ Codex-MD`);
    }
  }
};
