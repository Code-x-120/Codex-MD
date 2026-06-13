import fetch from 'node-fetch';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
  name: 'ttprofile',
  aliases: ['tiktokprofile', 'tiktokuser', 'ttuser'],
  description: 'Lookup TikTok user profile',
  run: async (context) => {
    const { client, m, text } = context;
    const fq = getFakeQuoted(m);

    const username = text?.trim().replace(/^@/, '');
    if (!username) {
      return client.sendMessage(m.chat, {
        text: `╭─ *Usage*\n│ .ttprofile <username>\n╰─ Codex-MD`
      }, { quoted: fq });
    }

    try {
      const res = await fetch(`https://www.tikwm.com/api/user/info?unique_id=@${username}`, { timeout: 15000 });
      const json = await res.json();
      if (!json?.data?.user) throw new Error('User not found');

      const u = json.data.user;
      const info =
        `╭─ *TikTok Profile*\n` +
        `├ Nickname: ${u.nickname || 'N/A'}\n` +
        `├ Username: @${u.unique_id || username}\n` +
        `├ Followers: ${u.follower_count || 0}\n` +
        `├ Following: ${u.following_count || 0}\n` +
        `├ Likes: ${u.heart_count || 0}\n` +
        `├ Videos: ${u.video_count || 0}\n` +
        `├ Bio: ${u.signature || 'No bio'}\n` +
        `├ Private: ${u.private_account ? 'Yes 🔒' : 'No'}\n` +
        `╰─ Codex-MD`;

      const avatar = u.avatar_larger || u.avatar_medium || u.avatar_thumb;
      if (avatar) {
        await client.sendMessage(m.chat, { image: { url: avatar }, caption: info }, { quoted: fq });
      } else {
        await client.sendMessage(m.chat, { text: info }, { quoted: fq });
      }
    } catch (e) {
      await client.sendMessage(m.chat, {
        text: `╭─ *Error*\n│ TikTok user not found or API error.\n╰─ Codex-MD`
      }, { quoted: fq });
    }
  }
};
