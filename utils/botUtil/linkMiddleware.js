export default async (context, next) => {
    const { m, isBotAdmin } = context;

    if (!m.isGroup) {
        return m.reply(`╭─ *Gʀᴏᴜᴘ Oɴʟʏ*\n│ This command only works in groups!\n│ Private chat? For this? Pathetic.\n╰─ Codex-MD`);
    }

    if (!isBotAdmin) {
        return m.reply(`╭─ *Aᴅᴍɪɴ Rᴇϙᴜɪʀᴇᴅ*\n│ I need admin rights to get the group link!\n│ Make me admin or watch me do nothing.\n╰─ Codex-MD`);
    }

    await next();
};