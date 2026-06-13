import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const normalizeNumber = (jid) => {
    if (!jid) return '';
    return jid.split('@')[0].split(':')[0].replace(/\D/g, '') + '@s.whatsapp.net';
};

const DEVELOPER = normalizeNumber('254114885159');
const FEATURES_DIR = path.join(__dirname, '..', '..', 'features');

export default async (context) => {
    const { client, m, text, prefix } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '🔍', key: m.reactKey } });

    if (normalizeNumber(m.sender) !== DEVELOPER) {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        return await client.sendMessage(m.chat, {
            text: `╭─ *ACCESS DENIED*\n│ This command is restricted to the bot owner.\n╰─ Codex-MD`
        }, { quoted: fq });
    }

    if (!text) {
        let files = [];
        try { const entries = await fs.readdir(FEATURES_DIR); files = entries.filter(f => f.endsWith('.js')); } catch {}
        const fileList = files.map(f => `├ • ${f.replace('.js', '')}`).join('\n');
        return await client.sendMessage(m.chat, {
            text: `╭─ *GETFUNC*\n│ Usage: ${prefix}getfunc <name>\n│ Available features:\n${fileList || '├ (none found)'}\n╰─ Codex-MD`
        }, { quoted: fq });
    }

    const funcName = text.trim().endsWith('.js') ? text.trim().slice(0, -3) : text.trim();
    const filePath = path.join(FEATURES_DIR, `${funcName}.js`);

    try {
        const data = await fs.readFile(filePath, 'utf8');
        const fileBuffer = Buffer.from(data, 'utf8');

        await client.sendMessage(m.chat, {
            text: `╭─ *FEATURE FILE*\n│ File: ${funcName}.js\n│ Size: ${data.length} chars\n\`\`\`javascript\n${data}\n\`\`\`\n╰─ Codex-MD`
        }, { quoted: fq });

        await client.sendMessage(m.chat, {
            document: fileBuffer,
            fileName: `${funcName}.js`,
            mimetype: 'application/javascript',
            caption: `╭─ Codex-MD\n│ 📄 ${funcName}.js\n│ Folder: features/\n│ Size: ${data.length} chars\n╰─ Codex-MD`
        }, { quoted: fq });

    } catch (err) {
        if (err.code === 'ENOENT') {
            let files = [];
            try { const entries = await fs.readdir(FEATURES_DIR); files = entries.filter(f => f.endsWith('.js')); } catch {}
            const fileList = files.map(f => `├ • ${f.replace('.js', '')}`).join('\n');
            return await client.sendMessage(m.chat, {
                text: `╭─ *NOT FOUND*\n│ "${funcName}" not found in features/.\n│ Available:\n${fileList || '├ (none found)'}\n╰─ Codex-MD`
            }, { quoted: fq });
        }
        return await client.sendMessage(m.chat, {
            text: `╭─ *ERROR*\n│ Error reading file: ${err.message}\n╰─ Codex-MD`
        }, { quoted: fq });
    }
};