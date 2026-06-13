import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import axios from 'axios';

export default {
  name: 'profil',
  aliases: ['getpp', 'getpic', 'profilepic', 'avatar', 'listonline', 'onlinemembers', 'lastseen', 'seen', 'userinfo', 'whois'],
  description: 'Profile & user info commands',
  category: 'General',
  run: async (context) => {
    const { client, m, command, text, args } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    try {
      switch (command) {
        case 'getpp':
        case 'getpic':
        case 'profilepic':
        case 'avatar': {
          let target = m.mentions?.[0] || m.quoted?.sender || m.sender;
          try {
            const ppUrl = await client.profilePictureUrl(target, 'image');
            await client.sendMessage(m.chat, {
              image: { url: ppUrl },
              caption: `╭─ *Profile Picture*\n│ @${target.split('@')[0]}\n╰─ Codex-MD`,
              mentions: [target]
            }, { quoted: fq });
          } catch {
            return m.reply("╭─ *Error*\n│ No profile picture found.\n╰─ Codex-MD");
          }
          break;
        }

        case 'listonline':
        case 'onlinemembers': {
          if (!m.isGroup) return m.reply("╭─ *Error*\n│ This command works only in groups.\n╰─ Codex-MD");
          const groupMeta = await client.groupMetadata(m.chat);
          const participants = groupMeta.participants || [];
          let online = [];
          for (let p of participants) {
            const pres = await client.presenceSubscribe(p.id).catch(() => {});
            if (pres) online.push(p.id);
          }
          if (!online.length) {
            return m.reply("╭─ *Online Members*\n│ No members online right now.\n╰─ Codex-MD");
          }
          let txt = '╭─ *Online Members* 🌐\n';
          online.forEach((u, i) => { txt += `│ ${i + 1}. @${u.split('@')[0]}\n`; });
          txt += '╰─ Codex-MD';
          await client.sendMessage(m.chat, { text: txt, mentions: online }, { quoted: fq });
          break;
        }

        case 'lastseen':
        case 'seen': {
          let target = m.mentions?.[0] || m.quoted?.sender || m.sender;
          try {
            const presence = await client.presenceSubscribe(target);
            const lastSeen = await client.lastSeen(target).catch(() => null);
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } }).catch(() => {});
            return m.reply(
              `╭─ *Last Seen*\n│ User: @${target.split('@')[0]}\n│ Last seen: ${lastSeen ? new Date(lastSeen).toLocaleString() : 'Unknown / Hidden'}\n╰─ Codex-MD`
            );
          } catch {
            return m.reply("╭─ *Error*\n│ Could not fetch last seen.\n╰─ Codex-MD");
          }
        }

        case 'userinfo':
        case 'whois': {
          let target = m.mentions?.[0] || m.quoted?.sender || m.sender;
          const name = m.pushname || 'Unknown';
          let ppStatus = 'No';
          try {
            await client.profilePictureUrl(target, 'image');
            ppStatus = 'Yes';
          } catch {}
          const bio = await client.fetchStatus(target).catch(() => ({}));
          return m.reply(
            `╭─ *User Info* 👤\n│ Name: ${name}\n│ JID: ${target}\n│ Has PP: ${ppStatus}\n│ Bio: ${bio.status || 'No bio'}\n│ Number: ${target.split('@')[0]}\n╰─ Codex-MD`
          );
        }

        default:
          return m.reply("╭─ *Profile Commands*\n│ .getpp - Get profile pic\n│ .avatar - Get avatar\n│ .listonline - Online members\n│ .lastseen - Last seen\n│ .userinfo - User info\n╰─ Codex-MD");
      }
      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } }).catch(() => {});
    } catch (e) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      m.reply(`╭─ *Error*\n│ ${e.message}\n╰─ Codex-MD`);
    }
  }
};
