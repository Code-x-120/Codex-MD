import fetch from 'node-fetch';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

function getHeaders() {
    return {
        'User-Agent': 'Codex-MD-Bot/2.0',
        'Accept': 'application/vnd.github.v3+json'
    };
}

async function getAllRepos(username) {
    let page = 1;
    const allRepos = [];
    while (true) {
        const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}&sort=updated&direction=desc`, { headers: getHeaders() });
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        const repos = await res.json();
        if (!repos.length) break;
        allRepos.push(...repos);
        if (repos.length < 100) break;
        page++;
    }
    return allRepos;
}

export default {
    name: 'githubuser',
    aliases: ['ghuser', 'gituser', 'userrepos', 'ghu'],
    description: 'Show all public repos of a GitHub user',
    run: async (context) => {
        const { client, m, text, prefix } = context;
        const fq = getFakeQuoted(m);

        if (!text) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`╭─ *GitHub User Repos*\n│ Usage: ${prefix}githubuser <username>\n╰─ Codex-MD`);
        }

        const username = text.trim();
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers: getHeaders() });
            if (!userRes.ok) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return m.reply(userRes.status === 404 ? 'User not found.' : 'GitHub API error.');
            }
            const userData = await userRes.json();
            const repos = await getAllRepos(username);

            if (!repos.length) {
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return m.reply(`╭─ *${userData.login}*\n│ No public repos found.\n╰─ Codex-MD`);
            }

            const header = `╭─ *${userData.login}* — ${repos.length} repos\n│ 👤 ${userData.name || userData.login}\n│ ${userData.bio ? '│ ' + userData.bio.substring(0, 50) : ''}\n╰${'─'.repeat(12)}`;

            const chunks = [];
            let current = '';
            for (let i = 0; i < repos.length; i++) {
                const r = repos[i];
                const num = i + 1;
                const line = `\n${num}. ${r.name}\n│ ${r.html_url}\n│ ${r.description ? r.description.substring(0, 70) : 'No description'}\n│ ⭐ ${r.stargazers_count} 🍴 ${r.forks_count} ${r.language ? '🔠 ' + r.language : ''}\n│ 📥 ${prefix}gitclone ${r.html_url}`;
                if ((current + line).length > 4000) {
                    chunks.push(current);
                    current = '';
                }
                current += line;
            }
            if (current) chunks.push(current);

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            for (let i = 0; i < chunks.length; i++) {
                const footer = i === chunks.length - 1 ? '\n╰─ Codex-MD' : '';
                const pageInfo = chunks.length > 1 ? `\n│ Page ${i + 1}/${chunks.length}` : '';
                await client.sendMessage(m.chat, {
                    text: i === 0 ? header + chunks[i] + pageInfo + footer : `╭─ *Continued*${chunks[i]}${pageInfo}${footer}`
                }, { quoted: fq });
            }
        } catch (error) {
            console.error('GitHub user repos error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply('╭─ Codex-MD\n│ Failed to fetch repos. Try again.\n╰─ Codex-MD');
        }
    }
};
