import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (!text) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return m.reply(`╭─ Codex-MD\n│ No command provided. Provide a\n│ valid shell command, fool.\n╰─ Codex-MD`);
        }

        try {
            const { stdout, stderr } = await execAsync(text, { timeout: 30000 });
            const output = stdout || stderr || '(no output)';
            await client.sendMessage(m.chat, { react: { text: stderr && !stdout ? '❌' : '✅', key: m.reactKey } });
            await m.reply(`╭─ *SHELL OUTPUT*\n${output.split('\n').map(l => `├ ${l}`).join('\n')}\n╰─ Codex-MD`);
        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await m.reply(`╭─ *SHELL ERROR*\n│ ${error.message}\n╰─ Codex-MD`);
        }
    });
};
