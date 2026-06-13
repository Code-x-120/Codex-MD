import { getSudoUsers } from '../../database/config.js';

export default {
    name: 'checksudo',
    aliases: ['listsudo', 'sudolist', 'sudos', 'listsudos', 'sudousers', 'getsudo'],
    description: 'List all sudo users',
    run: async (context) => {
        const { client, m } = context;
        await client.sendMessage(m.chat, { react: { text: '⏳', key: m.reactKey } });

        const sudoUsers = await getSudoUsers();

        if (!sudoUsers || sudoUsers.length === 0) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply("╭─ Codex-MD\n│ No Sudo Users found. You're all alone.\n╰──────────────────☑");
        }

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        const sudoList = sudoUsers.map((user, i) => `│ ${i + 1}. ${user}`).join('\n');
        return m.reply("╭─ Codex-MD\n│ *Sudo Users:*\n" + sudoList + "\n╰─ Codex-MD");
    }
};
