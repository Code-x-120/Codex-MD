import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../../data/subscription.json');

let db = { trial: {}, premium: {}, premiumLog: [], owners: [] };
if (fs.existsSync(DB_FILE)) {
  try { db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch (e) {}
}

function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export default {
  name: 'subscription',
  aliases: ['sub', 'premium', 'trial', 'buy', 'plans'],
  description: 'Subscription & premium management',
  category: 'General',
  run: async (context) => {
    const { client, m, args, text, Owner } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    try {
      const sender = m.sender;
      const now = Date.now();
      const cmd = args[0]?.toLowerCase() || '';

      if (db.trial[sender] && db.trial[sender] <= now) {
        delete db.trial[sender];
        saveDB();
      }
      if (db.premium[sender] && db.premium[sender] !== 'lifetime' && db.premium[sender] <= now) {
        delete db.premium[sender];
        saveDB();
      }

      const isOwner = Owner.includes(sender) || db.owners.includes(sender);

      if (cmd === 'give' && isOwner) {
        const userArg = args[1];
        const days = parseInt(args[2]);
        if (!userArg || !days) return m.reply("Usage: .sub give <number> <days>");
        const user = userArg.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        db.trial[user] = now + days * 86400000;
        saveDB();
        return m.reply(`╭─ *Subscription* ✅\n│ ${days}-day trial activated for ${userArg}\n╰─ Codex-MD`);
      }

      if (cmd === 'grant' && isOwner) {
        const userArg = args[1];
        if (!userArg) return m.reply("Usage: .sub grant <number>");
        const user = userArg.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        db.premium[user] = 'lifetime';
        db.premiumLog.push({ user, grantedBy: sender, date: new Date().toLocaleString() });
        saveDB();
        return m.reply(`╭─ *Premium* 🔥\n│ Lifetime Premium granted to ${userArg}\n╰─ Codex-MD`);
      }

      if (cmd === 'check') {
        let status = '❌ No active subscription';
        if (db.premium[sender] === 'lifetime') status = '💎 Lifetime Premium';
        else if (db.premium[sender] && db.premium[sender] > now) status = '💎 Premium Active';
        else if (db.trial[sender] && db.trial[sender] > now) status = '🆓 Trial Active';
        return m.reply(`╭─ *Subscription* 📋\n│ Status: ${status}\n╰─ Codex-MD`);
      }

      if (cmd === 'plans' || cmd === 'buy') {
        return m.reply(
          `╭─ *Premium Plans* 💎\n│ 1 Week: 300 PKR\n│ 1 Month: 600 PKR\n│ Lifetime: 1500 PKR\n│ Contact owner to buy!\n╰─ Codex-MD`
        );
      }

      if (cmd === 'log' && isOwner) {
        if (!db.premiumLog.length) return m.reply("╭─ *Premium Log*\n│ No premium users yet.\n╰─ Codex-MD");
        let list = '╭─ *Premium Log* 📜\n';
        db.premiumLog.forEach((item, i) => {
          list += `│ ${i + 1}. ${item.user}\n│    By: ${item.grantedBy}\n│    ${item.date}\n`;
        });
        list += '╰─ Codex-MD';
        return m.reply(list);
      }

      return m.reply(
        `╭─ *Subscription Commands* 📋\n│ .sub check - Check status\n│ .sub plans - View plans\n│ .sub give <num> <days> (Owner)\n│ .sub grant <num> (Owner)\n│ .sub log (Owner)\n╰─ Codex-MD`
      );

    } catch (e) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return m.reply(`╭─ *Error*\n│ ${e.message}\n╰─ Codex-MD`);
    }
  }
};
