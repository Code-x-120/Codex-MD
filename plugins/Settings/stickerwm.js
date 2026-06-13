import { getSettings, updateSetting } from '../../database/config.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args } = context;
        const fq = getFakeQuoted(m);
        const newStickerWM = args.join(" ") || null;  

        let settings = await getSettings();

        if (!settings) {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await m.reply("╭─ Codex-MD\n│ Settings not found. Something's seriously broken.\n╰─ Codex-MD");
        }

        if (newStickerWM !== null) {
            if (newStickerWM === 'null') {
                if (!settings.packname) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    return await m.reply("╭─ Codex-MD\n│ Bot already has no sticker watermark, genius.\n╰─ Codex-MD");
                }
                await updateSetting('packname', '');
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                await m.reply("╭─ Codex-MD\n│ Sticker watermark removed. Happy now?\n╰─ Codex-MD");
            } else {
                if (settings.packname === newStickerWM) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    return await m.reply(`╭─ Codex-MD\n│ Watermark already set to: ${newStickerWM}\n│ Stop wasting my time.\n╰─ Codex-MD`);
                }
                await updateSetting('packname', newStickerWM);
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                await m.reply(`╭─ *STICKER WM*\n│ Watermark updated to: ${newStickerWM}\n╰─ Codex-MD`);
            }
        } else {
            await m.reply(`╭─ *STICKER WM*\n│ Current watermark: ${settings.packname || 'None set'}\n│ Use '${settings.prefix}stickerwm null' to remove\n│ Use '${settings.prefix}stickerwm <text>' to set\n╰─ Codex-MD`);
        }
    });
};
