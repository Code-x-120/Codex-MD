import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import axios from 'axios';
import { herokuAppName, getHerokuApiKey } from '../../config/settings.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const SENSITIVE = ['heroku_api_key', 'api_key', 'database_url', 'session', 'secret', 'password', 'token', 'private_key', 'auth', 'key'];

function isSensitive(key) {
    const lk = key.toLowerCase();
    return SENSITIVE.some(s => lk.includes(s));
}

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const herokuApiKey = getHerokuApiKey();

        if (!herokuAppName || !herokuApiKey) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await m.reply("╭─ Codex-MD\n│ HEROKU_APP_NAME or HEROKU_API_KEY not set.\n╰─ Codex-MD");
        }

        try {
            const response = await axios.get(`https://api.heroku.com/apps/${herokuAppName}/config-vars`, {
                headers: { Authorization: `Bearer ${herokuApiKey}`, Accept: "application/vnd.heroku+json; version=3" }
            });

            const configVars = response.data;
            if (!configVars || Object.keys(configVars).length === 0) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return await m.reply("╭─ Codex-MD\n│ No config vars found.\n╰─ Codex-MD");
            }

            let msg = "╭─ *HEROKU VARS*\n";
            for (const [key, value] of Object.entries(configVars)) {
                msg += `├ ${key}: ${isSensitive(key) ? '**REDACTED**' : value}\n`;
            }
            msg += "╰─ Codex-MD";

            const dmJid = typeof m.sender === 'string' && m.sender.endsWith('@s.whatsapp.net') ? m.sender : null;
            if (dmJid) {
                await client.sendMessage(dmJid, { text: msg }, { quoted: fq });
                await m.reply("╭─ Codex-MD\n│ Vars sent to your DM only. 🔒\n│ Sensitive keys are always redacted.\n╰─ Codex-MD");
            } else {
                await m.reply("╭─ Codex-MD\n│ Couldn't resolve your JID for DM.\n│ Use this command from DM only.\n╰─ Codex-MD");
            }
        } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            await m.reply(`╭─ Codex-MD\n│ Failed to fetch config vars.\n│ ${error.response?.data || error.message}\n╰─ Codex-MD`);
        }
    });
};
