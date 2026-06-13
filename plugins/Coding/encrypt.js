import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import Obf from 'javascript-obfuscator';
export default async (context) => {
    const { m } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    
    if (m.quoted && m.quoted.text) {
        const forq = m.quoted.text;

       
        const obfuscationResult = Obf.obfuscate(forq, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: true,
            simplify: true,
            stringArrayShuffle: true,
            splitStrings: true,
            stringArrayThreshold: 1
        });

        console.log("Successfully encrypted the code");
        m.reply(`╭─ *ENCRYPTED*\n│ ${obfuscationResult.getObfuscatedCode()}\n╰─ Codex-MD`);
    } else {
        m.reply('╭─ *ENCRYPT*\n│ Tag a valid JavaScript code to encrypt!\n│ Stop wasting my time.\n╰─ Codex-MD');
    }
};