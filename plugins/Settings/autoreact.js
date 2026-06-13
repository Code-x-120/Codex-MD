import { getSettings, updateSetting } from '../../database/config.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
  name: 'autoreact',
  aliases: ['autoreaction', 'autoreactmsg'],
  description: 'Toggle auto reaction to all messages',
  run: async (context) => {
    const { client, m, args, prefix, Owner } = context;
    const fq = getFakeQuoted(m);

    if (!Owner) {
      return client.sendMessage(m.chat, {
        text: `╭─ *Access Denied*\n│ Owner only command\n╰─ Codex-MD`
      }, { quoted: fq });
    }

    const settings = await getSettings();
    const value = (args[0] || '').toLowerCase();

    if (value === 'on' || value === 'off') {
      await updateSetting('autoreact', value === 'on');
      return client.sendMessage(m.chat, {
        text: `╭─ *AutoReact*\n│ Status: ${value === 'on' ? '✅ ON' : '❌ OFF'}\n╰─ Codex-MD`
      }, { quoted: fq });
    }

    const isOn = settings.autoreact === true || settings.autoreact === 'true';
    return client.sendMessage(m.chat, {
      text: `╭─ *AutoReact*\n│ Status: ${isOn ? '✅ ON' : '❌ OFF'}\n│ Usage: ${prefix}autoreact on/off\n╰─ Codex-MD`
    }, { quoted: fq });
  }
};
