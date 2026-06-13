import axios from 'axios';
import { herokuAppName, getHerokuApiKey } from '../../config/settings.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js'; 
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const herokuApiKey = getHerokuApiKey();
        const { client, m, text, Owner, prefix } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (!herokuAppName || !herokuApiKey) {
            await m.reply("╭─ Codex-MD\n│ Heroku app name or API key not set, you clown.\n│ Set HEROKU_APP_NAME and HEROKU_API_KEY first!\n╰─ Codex-MD");
            return;
        }

        if (!text) {
            await m.reply(`╭─ *SETVAR*\n│ Provide a var and value, moron.\n│ Format: ${prefix}setvar VAR_NAME=VALUE\n│ Example: ${prefix}setvar MYCODE=254\n╰─ Codex-MD`);
            return;
        }

        async function setHerokuConfigVar(varName, value) {
            try {
                const response = await axios.patch(
                    `https://api.heroku.com/apps/${herokuAppName}/config-vars`,
                    {
                        [varName]: value
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${herokuApiKey}`,
                            Accept: "application/vnd.heroku+json; version=3",
                        },
                    }
                );

                if (response.status === 200) {
                    await m.reply(`╭─ *SETVAR*\n│ ${varName} updated to "${value}"\n│ Wait 2min for bot to restart, be patient.\n╰─ Codex-MD`);
                } else {
                    await m.reply("╭─ Codex-MD\n│ Failed to update the config var. Try again, loser.\n╰─ Codex-MD");
                }
            } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                const errorMessage = error.response?.data || error.message;
                await m.reply(`╭─ *HEROKU ERROR*\n│ Failed to set config var.\n│ ${errorMessage}\n╰─ Codex-MD`);
                console.error("Error updating config var:", errorMessage);
            }
        }

        const parts = text.split("=");
        if (parts.length !== 2) {
            await m.reply(`╭─ Codex-MD\n│ Invalid format, you illiterate fool.\n│ Use: ${prefix}setvar VAR_NAME=VALUE\n│ Example: ${prefix}setvar MYCODE=254\n╰─ Codex-MD`);
            return;
        }

        const varName = parts[0].trim();
        const value = parts[1].trim();

        await setHerokuConfigVar(varName, value);
    });
};
