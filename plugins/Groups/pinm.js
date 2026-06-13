import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const parseDuration = (input) => {
    const m = String(input).toLowerCase().match(/^(\d+)\s*(s|m|h|d)$/);
    if (m) {
        const n = parseInt(m[1], 10);
        if (m[2] === 's') return n;
        if (m[2] === 'm') return n * 60;
        if (m[2] === 'h') return n * 3600;
        if (m[2] === 'd') return n * 86400;
    }
    if (/^\d+$/.test(input)) return parseInt(input, 10);
    return null;
};

const durationLabel = (secs) => {
    if (secs >= 86400 && secs % 86400 === 0) return `${secs / 86400}d`;
    if (secs >= 3600 && secs % 3600 === 0) return `${secs / 3600}h`;
    if (secs >= 60 && secs % 60 === 0) return `${secs / 60}m`;
    return `${secs}s`;
};

export default {
  name: 'pinm',
  aliases: ['pinmessage', 'pinmsg'],
  description: 'Pin a replied-to message. Usage: reply + duration (1s / 30m / 6h / 7d)',
  run: async (context) => {
    const { client, m, prefix, IsGroup, args } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    if (!IsGroup) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return client.sendMessage(m.chat, {
        text: `╭─ Codex-MD\n│ This command can only be used in groups.\n╰─ Codex-MD`
      }, { quoted: fq });
    }

    if (!m.quoted) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return client.sendMessage(m.chat, {
        text: `╭─ Codex-MD\n│ Reply to a message to pin it.\n│ Examples:\n│ ${prefix}pinm 1h  → pin for 1 hour\n│ ${prefix}pinm 30m → pin for 30 minutes\n│ ${prefix}pinm 7d  → pin for 7 days\n│ ${prefix}pinm 60s → pin for 60 seconds\n╰─ Codex-MD`
      }, { quoted: fq });
    }

    const rawInput = args[0] || '86400';
    const time = parseDuration(rawInput);

    if (!time || time <= 0) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return client.sendMessage(m.chat, {
        text: `╭─ Codex-MD\n│ Invalid duration. Use:\n│ 1s / 5m / 2h / 30d\n╰─ Codex-MD`
      }, { quoted: fq });
    }

    try {
      const messageKey = {
        remoteJid: m.chat,
        id: m.quoted.id,
        fromMe: m.quoted.fromMe || false,
        participant: m.quoted.sender
      };

      await client.sendMessage(m.chat, { pin: messageKey, type: 1, time });

      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      await client.sendMessage(m.chat, {
        text: `╭─ Codex-MD\n│ ✅ Message pinned!\n│ Duration: ${durationLabel(time)}\n╰─ Codex-MD`
      }, { quoted: fq });

    } catch (error) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      await client.sendMessage(m.chat, {
        text: `╭─ Codex-MD\n│ ❌ Failed to pin message.\n│ ${error.message}\n╰─ Codex-MD`
      }, { quoted: fq });
    }
  }
};
