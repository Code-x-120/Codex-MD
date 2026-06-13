import { c, cpp, node, python, java } from 'compile-run';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
export default async (context) => {
    const { m } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    if (m.quoted && m.quoted.text) {
        const code = m.quoted.text;

async function runCode() {
  try {
    let result = await c.runSource(code);
    console.log(result);
    m.reply(`╭─ *C OUTPUT*\n│ ${result.stdout || 'No output'}\n${result.stderr ? '├ stderr: ' + result.stderr + '\n' : ''}╰─ Codex-MD`);
  } catch (err) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    console.log(err);
    m.reply(`╭─ *C ERROR*\n│ ${err.stderr || err.message}\n╰─ Codex-MD`);
  }
}

runCode();

} else { 

m.reply('╭─ *C COMPILER*\n│ Quote a valid and short C code\n│ to compile, you absolute walnut.\n╰─ Codex-MD')

}

}