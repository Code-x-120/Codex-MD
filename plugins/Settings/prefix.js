import { getSettings, updateSetting } from '../../database/config.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args } = context;
    const fq = getFakeQuoted(m);
    const newPrefix = args[0];

    const settings = await getSettings();

    if (newPrefix === 'null') {
      if (!settings.prefix) {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return await m.reply(
          `╭─ Codex-MD\n` +
          `├ Already prefixless, you clueless twit! 😈\n` +
          `├ Stop wasting my time! 🖕\n` +
          `╰─ Codex-MD`

        );
      }
      await updateSetting('prefix', '');
      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      await m.reply(
        `╭─ Codex-MD\n` +
        `├ Prefix obliterated! 🔥\n` +
        `├ I’m prefixless now, bow down! 😈\n` +
`╰─ Codex-MD`

       );
    } else if (newPrefix) {
      if (settings.prefix === newPrefix) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return await m.reply(
          `╭─ Codex-MD\n` +
          `├ Prefix is already ${newPrefix}, moron! 😈\n` +
          `├ Try something new, fool! 🥶\n` +
          `╰─ Codex-MD`

        );
      }
      await updateSetting('prefix', newPrefix);
      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      await m.reply(
        `╭─ Codex-MD\n` +
        `├ New prefix set to ${newPrefix}! 🔥\n` +
        `├ Obey the new order, king! 😈\n` +
`╰─ Codex-MD`

       );
    } else {
      await m.reply(
        `╭─ Codex-MD\n` +
        `├ Current Prefix: ${settings.prefix || 'No prefix, peasant! 🥶'}\n` +
        `├ Use "${settings.prefix || '.'}prefix null" to go prefixless or "${settings.prefix || '.'}prefix <symbol>" to set one, noob!\n` +
`╰─ Codex-MD`

       );
    }
  });
};