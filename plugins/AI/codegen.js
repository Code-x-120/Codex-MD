import axios from 'axios';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    const { client, m, text } = context;
    const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    if (!text) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return m.reply(`╭─ *Cᴏᴅᴇɢᴇɴ*\n│ Example usage:\n│ .codegen Function to calculate triangle area|Python\n╰─ Codex-MD`);
    }

    let [prompt, language] = text.split("|").map(v => v.trim());

    if (!prompt || !language) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return m.reply(`╭─ *Eʀʀᴏʀ*\n│ Invalid format!\n│ Use the format: .codegen <prompt>|<language>\n│ Example: .codegen Check for prime number|JavaScript\n╰─ Codex-MD`);
    }

    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
    try {
        const payload = {
            customInstructions: prompt,
            outputLang: language
        };

        const { data } = await axios.post("https://www.codeconvert.ai/api/generate-code", payload);

        if (!data || typeof data !== "string") {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`╭─ *Eʀʀᴏʀ*\n│ Failed to retrieve code from API.\n╰─ Codex-MD`);
        }

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        m.reply(`╭─ *Cᴏᴅᴇɢᴇɴ (${language})*\n` + "```" + language.toLowerCase() + "\n" + data.trim() + "\n```" + `\n╰─ Codex-MD`);

    } catch (error) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        console.error(error);
        m.reply(`╭─ *Eʀʀᴏʀ*\n│ An error occurred while processing your request.\n╰─ Codex-MD`);
    }
};