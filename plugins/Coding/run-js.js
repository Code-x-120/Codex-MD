import { getFakeQuoted } from '../../lib/fakeQuoted.js';
    import { node } from 'compile-run';
export default async (context) => {
    const { m, text } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    let code = text;

    if (m.quoted && m.quoted.text) {
        code = m.quoted.text;
    }

    if (!code) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return m.reply('╭─ *JS COMPILER*\n│ Provide JavaScript code or quote one.\n│ Example: .runjs console.log("hello")\n╰─ Codex-MD');
    }

    try {
        let result = await node.runSource(code);
        console.log(result);
        
        let output = result.stdout || 'No output';
        let error = result.stderr ? `├ stderr: ${result.stderr}\n` : '';
        
        m.reply(`╭─ *JS OUTPUT*\n│ ${output}\n${error}╰─ Codex-MD`);
        
    } catch (err) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        console.log(err);
        m.reply(`╭─ *JS ERROR*\n│ ${err.stderr || err.message}\n╰─ Codex-MD`);
    }
};