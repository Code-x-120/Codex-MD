import { getSettings, updateSetting } from '../../database/config.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
  name: 'autotyping',
  aliases: ['autotype', 'typing'],
  description: 'Toggle auto typing presence in DMs',
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
      await updateSetting('autotyping', value === 'on');
      return client.sendMessage(m.chat, {
        text: `╭─ *AutoTyping*\n│ Status: ${value === 'on' ? '✅ ON' : '❌ OFF'}\n╰─ Codex-MD`
      }, { quoted: fq });
    }

    const isOn = settings.autotyping === true || settings.autotyping === 'true';
    return client.sendMessage(m.chat, {
      text: `╭─ *AutoTyping*\n│ Status: ${isOn ? '✅ ON' : '❌ OFF'}\n│ Usage: ${prefix}autotyping on/off\n╰─ Codex-MD`
    }, { quoted: fq });
  }
};
