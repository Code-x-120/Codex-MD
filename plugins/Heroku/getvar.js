import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import axios from 'axios';
import { herokuAppName, getHerokuApiKey } from '../../config/settings.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const SENSITIVE = ['heroku_api_key', 'api_key', 'database_url', 'session', 'secret', 'password', 'token', 'private_key', 'auth', 'key'];

function isSensitive(key) {
    return SENSITIVE.some(s => key.toLowerCase().includes(s));
}

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, prefix } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const herokuApiKey = getHerokuApiKey();

        if (!herokuAppName || !herokuApiKey) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await m.reply("╭─ Codex-MD\n│ HEROKU_APP_NAME or HEROKU_API_KEY not set.\n╰─ Codex-MD");
        }

        if (!text) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await m.reply(`╭─ Codex-MD\n│ Usage: ${prefix}getvar VAR_NAME\n╰─ Codex-MD`);
        }

        const varName = text.trim().split(" ")[0];

        if (isSensitive(varName)) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await m.reply("╭─ Codex-MD\n│ That variable is protected and cannot be retrieved. 🔒\n│ For your own security.\n╰─ Codex-MD");
        }

        if (m.isGroup) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await m.reply("╭─ Codex-MD\n│ Use this command in your DM only, not in groups. 🔒\n╰─ Codex-MD");
        }

        try {
            const response = await axios.get(`https://api.heroku.com/apps/${herokuAppName}/config-vars`, {
                headers: { Authorization: `Bearer ${herokuApiKey}`, Accept: "application/vnd.heroku+json; version=3" }
            });
            const varValue = response.data[varName];
            if (varValue !== undefined) {
                await m.reply(`╭─ *GETVAR*\n│ ${varName} = ${varValue}\n╰─ Codex-MD`);
            } else {
                await m.reply(`╭─ Codex-MD\n│ Var "${varName}" doesn't exist.\n╰─ Codex-MD`);
            }
        } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            await m.reply(`╭─ Codex-MD\n│ Failed to fetch var.\n│ ${error.response?.data || error.message}\n╰─ Codex-MD`);
        }
    });
};
