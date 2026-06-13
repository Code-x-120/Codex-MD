import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const groupStats = new Map();

export function trackMessage(groupId, sender) {
  if (!groupId || !sender) return;
  if (!groupStats.has(groupId)) {
    groupStats.set(groupId, { total: 0, users: {} });
  }
  const stats = groupStats.get(groupId);
  stats.total++;
  stats.users[sender] = (stats.users[sender] || 0) + 1;
}

export default {
  name: 'myactivity',
  aliases: ['mystats', 'mymsgs', 'activity', 'groupstats', 'gstats', 'topactive', 'topusers', 'myrank'],
  description: 'Check your activity in the group',
  category: 'General',
  run: async (context) => {
    const { client, m, command } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    try {
      if (!m.isGroup) {
        return m.reply("╭─ *Error*\n│ Activity tracking works only in groups.\n╰─ Codex-MD");
      }

      const stats = groupStats.get(m.chat);

      if (command === 'groupstats' || command === 'gstats') {
        if (!stats) return m.reply("╭─ *Group Stats*\n│ No activity data yet.\n╰─ Codex-MD");
        const sorted = Object.entries(stats.users).sort((a, b) => b[1] - a[1]);
        let txt = `╭─ *Group Stats* 📊\n│ Total messages: ${stats.total}\n│ Active users: ${sorted.length}\n│\n`;
        sorted.slice(0, 10).forEach(([user, count], i) => {
          const pct = ((count / stats.total) * 100).toFixed(1);
          txt += `│ ${i + 1}. @${user.split('@')[0]}: ${count} (${pct}%)\n`;
        });
        txt += '╰─ Codex-MD';
        const mentions = sorted.slice(0, 10).map(([u]) => u);
        return await client.sendMessage(m.chat, { text: txt, mentions }, { quoted: fq });
      }

      if (!stats || !stats.users[m.sender]) {
        return m.reply("╭─ *My Activity*\n│ No messages tracked yet. Start chatting!\n╰─ Codex-MD");
      }

      const userCount = stats.users[m.sender];
      const totalMessages = stats.total;
      const percentage = ((userCount / totalMessages) * 100).toFixed(1);
      const sorted = Object.entries(stats.users).sort((a, b) => b[1] - a[1]);
      const rank = sorted.findIndex(([id]) => id === m.sender) + 1;

      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } }).catch(() => {});
      return m.reply(
        `╭─ *My Activity* 📊\n│ Messages: ${userCount}\n│ Share: ${percentage}%\n│ Rank: #${rank} of ${sorted.length}\n╰─ Codex-MD`
      );

    } catch (e) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return m.reply(`╭─ *Error*\n│ ${e.message}\n╰─ Codex-MD`);
    }
  }
};
