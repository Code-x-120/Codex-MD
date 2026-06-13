import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const WHITELIST_FILE = './data/whitelist.json';
import fs from 'fs';
import path from 'path';

function loadWhitelist() {
  try {
    if (fs.existsSync(WHITELIST_FILE)) {
      return JSON.parse(fs.readFileSync(WHITELIST_FILE, 'utf-8'));
    }
  } catch {}
  return [];
}

function saveWhitelist(data) {
  const dir = path.dirname(WHITELIST_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(WHITELIST_FILE, JSON.stringify(data, null, 2));
}

export default {
  name: 'whitelist',
  aliases: ['wl', 'trusted'],
  description: 'Manage whitelisted users (bypass group restrictions)',
  run: async (context) => {
    await ownerMiddleware(context, async () => {
      const { client, m, args, prefix } = context;
      const fq = getFakeQuoted(m);

      const action = (args[0] || '').toLowerCase();
      const target = args[1] || '';
      const whitelist = loadWhitelist();

      if (action === 'add') {
        if (!target) {
          const ctx = m.message?.extendedTextMessage?.contextInfo || {};
          const mentioned = ctx.mentionedJid || [];
          if (mentioned.length > 0) {
            mentioned.forEach(j => { if (!whitelist.includes(j)) whitelist.push(j); });
            saveWhitelist(whitelist);
            return client.sendMessage(m.chat, {
              text: `╭─ *Whitelist*\n│ Added ${mentioned.length} user(s)\n╰─ Codex-MD`,
              mentions: mentioned
            }, { quoted: fq });
          }
          return client.sendMessage(m.chat, {
            text: `╭─ *Usage*\n│ ${prefix}whitelist add @user\n│ ${prefix}whitelist remove @user\n│ ${prefix}whitelist list\n╰─ Codex-MD`
          }, { quoted: fq });
        }
        const clean = target.replace(/[^0-9]/g, '');
        const jid = clean.includes('@') ? clean : `${clean}@s.whatsapp.net`;
        if (!whitelist.includes(jid)) whitelist.push(jid);
        saveWhitelist(whitelist);
        return client.sendMessage(m.chat, {
          text: `╭─ *Whitelist*\n│ Added: ${jid}\n╰─ Codex-MD`
        }, { quoted: fq });
      }

      if (action === 'remove' || action === 'delete' || action === 'del') {
        const clean = target.replace(/[^0-9]/g, '');
        const jid = clean.includes('@') ? clean : `${clean}@s.whatsapp.net`;
        const idx = whitelist.indexOf(jid);
        if (idx > -1) whitelist.splice(idx, 1);
        saveWhitelist(whitelist);
        return client.sendMessage(m.chat, {
          text: `╭─ *Whitelist*\n│ Removed: ${jid}\n╰─ Codex-MD`
        }, { quoted: fq });
      }

      if (action === 'list' || action === 'all') {
        if (whitelist.length === 0) {
          return client.sendMessage(m.chat, {
            text: `╭─ *Whitelist*\n│ No whitelisted users.\n╰─ Codex-MD`
          }, { quoted: fq });
        }
        const list = whitelist.map((j, i) => `├ ${i + 1}. @${j.split('@')[0]}`).join('\n');
        return client.sendMessage(m.chat, {
          text: `╭─ *Whitelist (${whitelist.length})*\n${list}\n╰─ Codex-MD`,
          mentions: whitelist
        }, { quoted: fq });
      }

      return client.sendMessage(m.chat, {
        text: `╭─ *Usage*\n│ ${prefix}whitelist add @user\n│ ${prefix}whitelist remove @user\n│ ${prefix}whitelist list\n╰─ Codex-MD`
      }, { quoted: fq });
    });
  }
};
