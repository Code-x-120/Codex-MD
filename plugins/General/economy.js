import fs from 'fs';
import path from 'path';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const DATA_PATH = path.resolve('data/economy.json');

let db = { users: {}, shop: {} };

const DEFAULT_SHOP = {
  fishing_rod: { price: 50, desc: 'Better catch rates' },
  pickaxe: { price: 75, desc: 'Better ore finds' },
  axe: { price: 60, desc: 'Better wood yield' },
  hunting_knife: { price: 80, desc: 'Better hunting' },
  health_potion: { price: 25, desc: 'Restore 50 energy' },
  xp_boost: { price: 100, desc: '+50 XP instantly' },
  lucky_charm: { price: 200, desc: 'Double rewards once' }
};

const ITEM_META = {
  common_fish: { emoji: '🐟', name: 'Common Fish', sell: 10 },
  uncommon_fish: { emoji: '🐠', name: 'Uncommon Fish', sell: 25 },
  rare_fish: { emoji: '🐡', name: 'Rare Fish', sell: 50 },
  legendary_fish: { emoji: '🐋', name: 'Legendary Fish', sell: 150 },
  iron_ore: { emoji: '🔩', name: 'Iron Ore', sell: 15 },
  gold_ore: { emoji: '✨', name: 'Gold Ore', sell: 40 },
  diamond_ore: { emoji: '💎', name: 'Diamond Ore', sell: 80 },
  emerald_ore: { emoji: '🟢', name: 'Emerald Ore', sell: 120 },
  rabbit_meat: { emoji: '🐰', name: 'Rabbit Meat', sell: 8 },
  deer_meat: { emoji: '🦌', name: 'Deer Meat', sell: 20 },
  boar_meat: { emoji: '🐗', name: 'Boar Meat', sell: 35 },
  bear_meat: { emoji: '🐻', name: 'Bear Meat', sell: 60 },
  fox_pelt: { emoji: '🦊', name: 'Fox Pelt', sell: 45 },
  oak_wood: { emoji: '🪵', name: 'Oak Wood', sell: 5 },
  birch_wood: { emoji: '🪵', name: 'Birch Wood', sell: 10 },
  maple_wood: { emoji: '🪵', name: 'Maple Wood', sell: 20 },
  mahogany_wood: { emoji: '🪵', name: 'Mahogany Wood', sell: 35 },
  sword: { emoji: '⚔️', name: 'Sword', sell: 100 },
  shield: { emoji: '🛡️', name: 'Shield', sell: 120 },
  bow: { emoji: '🏹', name: 'Bow', sell: 150 },
  armor: { emoji: '🪖', name: 'Armor', sell: 200 }
};

const CRAFT_RECIPES = {
  sword: { iron_ore: 3, oak_wood: 2 },
  shield: { iron_ore: 2, birch_wood: 3 },
  bow: { gold_ore: 1, maple_wood: 2 },
  armor: { diamond_ore: 2, emerald_ore: 1, iron_ore: 3 }
};

function loadData() {
  try {
    if (fs.existsSync(DATA_PATH)) {
      db = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    }
    if (!db.users) db.users = {};
    if (!db.shop || Object.keys(db.shop).length === 0) db.shop = { ...DEFAULT_SHOP };
  } catch {
    db = { users: {}, shop: { ...DEFAULT_SHOP } };
  }
}

function saveData() {
  try {
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify(db, null, 2));
  } catch {}
}

setInterval(saveData, 60000);
loadData();

function getUser(id) {
  if (!db.users[id]) {
    db.users[id] = {
      coins: 100, bank: 0, xp: 0, level: 1,
      energy: 100, maxEnergy: 100,
      dailyClaimed: 0, inventory: {}
    };
  }
  return db.users[id];
}

function addXP(id, amount) {
  const u = getUser(id);
  u.xp += amount;
  let leveled = false;
  while (u.xp >= u.level * 100) {
    u.xp -= u.level * 100;
    u.level++;
    u.maxEnergy += 10;
    u.energy = u.maxEnergy;
    leveled = true;
  }
  return leveled;
}

function hasItem(u, item) {
  return (u.inventory[item] || 0) > 0;
}

function countItem(u, item) {
  return u.inventory[item] || 0;
}

function addItem(u, item, count = 1) {
  u.inventory[item] = (u.inventory[item] || 0) + count;
}

function removeItem(u, item, count = 1) {
  const cur = u.inventory[item] || 0;
  if (cur < count) return false;
  u.inventory[item] = cur - count;
  if (u.inventory[item] <= 0) delete u.inventory[item];
  return true;
}

function getTotalItems(u) {
  return Object.values(u.inventory).reduce((a, b) => a + b, 0);
}

function itemDisplay(key) {
  const m = ITEM_META[key];
  return m ? `${m.emoji} ${m.name}` : key;
}

function fmt(n) {
  return n.toLocaleString();
}

const CMD = {
  DAILY: ['daily'],
  BAL: ['bal', 'balance'],
  FISH: ['fish', 'fishing'],
  MINE: ['mine', 'mining'],
  HUNT: ['hunt', 'hunting'],
  WOOD: ['wood', 'woodcut'],
  INV: ['inv', 'inventory'],
  SHOP: ['shop'],
  BUY: ['buy'],
  SELL: ['sell'],
  TRANSFER: ['transfer', 'pay'],
  GAMBLE: ['gamble'],
  LEVEL: ['level', 'rank'],
  CRAFT: ['craft']
};

function resolveCmd(cmd) {
  for (const [key, list] of Object.entries(CMD)) {
    if (list.includes(cmd)) return key;
  }
  return null;
}

export default {
  name: 'economy',
  aliases: ['bal', 'daily', 'fish', 'mine', 'hunt', 'wood', 'inv', 'shop', 'buy', 'sell', 'transfer', 'gamble', 'level', 'craft', 'rank', 'pay', 'fishing', 'mining', 'hunting', 'woodcut', 'inventory', 'balance'],
  description: 'Economy & RPG system',
  category: 'Economy',
  run: async (context) => {
    const { client, m, command, args, text } = context;
    const fq = getFakeQuoted(m);
    const userId = m.sender;
    const cmdKey = resolveCmd(command);
    if (!cmdKey) return;

    const react = async (emoji) => {
      await client.sendMessage(m.chat, { react: { text: emoji, key: m.reactKey } }).catch(() => {});
    };

    const reply = async (title, body, mentions = []) => {
      return client.sendMessage(m.chat, {
        text: `╭─ *${title}*\n${body}\n╰─ Codex-MD`
      }, { quoted: fq, mentions });
    };

    switch (cmdKey) {

      case 'DAILY': {
        await react('⌛');
        const u = getUser(userId);
        const now = Date.now();
        const cooldown = 86400000;
        const last = u.dailyClaimed || 0;
        if (now - last < cooldown) {
          const remaining = cooldown - (now - last);
          const hrs = Math.floor(remaining / 3600000);
          const mins = Math.floor((remaining % 3600000) / 60000);
          return reply('Dᴀɪʟʏ', `│ ⏳ Already claimed!\n│ Come back in ${hrs}h ${mins}m`);
        }
        const coins = 50 + u.level * 10;
        const xp = 20 + u.level * 2;
        u.coins += coins;
        addXP(userId, xp);
        u.dailyClaimed = now;
        saveData();
        await react('✅');
        return reply('Dᴀɪʟʏ Rᴇᴡᴀʀᴅ', `│ 🪙 +${fmt(coins)} coins\n│ ⭐ +${xp} XP\n│ 📊 Level ${u.level}`);
      }

      case 'BAL': {
        await react('⌛');
        let target = userId;
        if (m.quoted) {
          target = m.quoted.sender;
        } else if (m.mentionedJid && m.mentionedJid.length > 0) {
          target = m.mentionedJid[0];
        } else if (text) {
          const cleaned = text.replace(/[^0-9]/g, '');
          if (cleaned.length >= 10) {
            target = cleaned.includes('@') ? cleaned : `${cleaned}@s.whatsapp.net`;
          }
        }
        const u = getUser(target);
        const displayName = (await client.getName(target).catch(() => target.split('@')[0]));
        await react('✅');
        return reply(`${displayName}'s Bᴀʟᴀɴᴄᴇ`, `│ 🪙 Coins: ${fmt(u.coins)}\n│ 🏦 Bank: ${fmt(u.bank)}\n│ ⚡ Energy: ${u.energy}/${u.maxEnergy}\n│ 📊 Level: ${u.level} (${u.xp}/${u.level * 100} XP)\n│ 📦 Items: ${getTotalItems(u)}`);
      }

      case 'FISH': {
        await react('⌛');
        const u = getUser(userId);
        if (u.energy < 15) return reply('Fɪsʜɪɴɢ', '│ ⚡ Not enough energy!\n│ You need 15 energy.');
        u.energy -= 15;
        const rarities = [
          { key: 'legendary_fish', chance: 0.05, xp: 50, coins: 30 },
          { key: 'rare_fish', chance: 0.15, xp: 30, coins: 15 },
          { key: 'uncommon_fish', chance: 0.35, xp: 15, coins: 8 },
          { key: 'common_fish', chance: 0.45, xp: 8, coins: 3 }
        ];
        const roll = Math.random();
        let caught = rarities[rarities.length - 1];
        let cumulative = 0;
        for (const r of rarities) {
          cumulative += r.chance;
          if (roll < cumulative) { caught = r; break; }
        }
        addItem(u, caught.key);
        addXP(userId, caught.xp);
        u.coins += caught.coins;
        saveData();
        await react('✅');
        const meta = ITEM_META[caught.key];
        return reply('Fɪsʜɪɴɢ', `│ 🎣 You caught ${meta.emoji} *${meta.name}*!\n│ ⭐ +${caught.xp} XP\n│ 🪙 +${caught.coins} coins`);
      }

      case 'MINE': {
        await react('⌛');
        const u = getUser(userId);
        if (u.energy < 20) return reply('Mɪɴɪɴɢ', '│ ⚡ Not enough energy!\n│ You need 20 energy.');
        u.energy -= 20;
        const ores = [
          { key: 'emerald_ore', chance: 0.05, xp: 45, coins: 25 },
          { key: 'diamond_ore', chance: 0.10, xp: 35, coins: 18 },
          { key: 'gold_ore', chance: 0.30, xp: 20, coins: 10 },
          { key: 'iron_ore', chance: 0.55, xp: 10, coins: 5 }
        ];
        const roll = Math.random();
        let found = ores[ores.length - 1];
        let cumulative = 0;
        for (const o of ores) {
          cumulative += o.chance;
          if (roll < cumulative) { found = o; break; }
        }
        addItem(u, found.key);
        addXP(userId, found.xp);
        u.coins += found.coins;
        saveData();
        await react('✅');
        const meta = ITEM_META[found.key];
        return reply('Mɪɴɪɴɢ', `│ ⛏️ You mined ${meta.emoji} *${meta.name}*!\n│ ⭐ +${found.xp} XP\n│ 🪙 +${found.coins} coins`);
      }

      case 'HUNT': {
        await react('⌛');
        const u = getUser(userId);
        if (u.energy < 18) return reply('Hᴜɴᴛɪɴɢ', '│ ⚡ Not enough energy!\n│ You need 18 energy.');
        u.energy -= 18;
        const animals = [
          { key: 'bear_meat', chance: 0.08, xp: 40, coins: 22 },
          { key: 'fox_pelt', chance: 0.15, xp: 30, coins: 15 },
          { key: 'boar_meat', chance: 0.25, xp: 22, coins: 12 },
          { key: 'deer_meat', chance: 0.27, xp: 15, coins: 8 },
          { key: 'rabbit_meat', chance: 0.25, xp: 8, coins: 4 }
        ];
        const roll = Math.random();
        let prey = animals[animals.length - 1];
        let cumulative = 0;
        for (const a of animals) {
          cumulative += a.chance;
          if (roll < cumulative) { prey = a; break; }
        }
        addItem(u, prey.key);
        addXP(userId, prey.xp);
        u.coins += prey.coins;
        saveData();
        await react('✅');
        const meta = ITEM_META[prey.key];
        return reply('Hᴜɴᴛɪɴɢ', `│ 🏹 You hunted ${meta.emoji} *${meta.name}*!\n│ ⭐ +${prey.xp} XP\n│ 🪙 +${prey.coins} coins`);
      }

      case 'WOOD': {
        await react('⌛');
        const u = getUser(userId);
        if (u.energy < 12) return reply('Wᴏᴏᴅᴄᴜᴛᴛɪɴɢ', '│ ⚡ Not enough energy!\n│ You need 12 energy.');
        u.energy -= 12;
        const woods = [
          { key: 'mahogany_wood', chance: 0.05, xp: 35, coins: 20 },
          { key: 'maple_wood', chance: 0.15, xp: 22, coins: 12 },
          { key: 'birch_wood', chance: 0.35, xp: 12, coins: 6 },
          { key: 'oak_wood', chance: 0.45, xp: 5, coins: 3 }
        ];
        const roll = Math.random();
        let log = woods[woods.length - 1];
        let cumulative = 0;
        for (const w of woods) {
          cumulative += w.chance;
          if (roll < cumulative) { log = w; break; }
        }
        addItem(u, log.key);
        addXP(userId, log.xp);
        u.coins += log.coins;
        saveData();
        await react('✅');
        const meta = ITEM_META[log.key];
        return reply('Wᴏᴏᴅᴄᴜᴛᴛɪɴɢ', `│ 🪓 You chopped ${meta.emoji} *${meta.name}*!\n│ ⭐ +${log.xp} XP\n│ 🪙 +${log.coins} coins`);
      }

      case 'INV': {
        await react('⌛');
        const u = getUser(userId);
        const items = Object.entries(u.inventory).filter(([, c]) => c > 0);
        if (items.length === 0) {
          await react('✅');
          return reply('Iɴᴠᴇɴᴛᴏʀʏ', '│ 📭 Your inventory is empty.\n│ Go fishing, mining, hunting, or\n│ chopping wood to get items!');
        }
        const lines = items.map(([k, c]) => {
          const m = ITEM_META[k];
          const name = m ? `${m.emoji} ${m.name}` : k;
          return `│ ${name} ×${c}`;
        });
        await react('✅');
        return reply('Iɴᴠᴇɴᴛᴏʀʏ', `│ 📦 *${getTotalItems(u)} total items*\n${lines.join('\n')}`);
      }

      case 'SHOP': {
        await react('⌛');
        const lines = Object.entries(db.shop).map(([id, item]) =>
          `│ ${id.replace(/_/g, ' ')} — 🪙${item.price}\n│   ${item.desc}`
        );
        await react('✅');
        return reply('Sʜᴏᴘ', `│ Buy with: *buy <item>*\n${lines.join('\n')}\n│ ─────────────\n│ 💡 Sell items with: *sell <item> [count]*`);
      }

      case 'BUY': {
        if (!text) {
          await react('❌');
          return reply('Bᴜʏ', '│ Usage: *buy <item>*\n│ Example: *buy health_potion*');
        }
        await react('⌛');
        const itemId = text.trim().toLowerCase().replace(/\s+/g, '_');
        const shopItem = db.shop[itemId];
        if (!shopItem) {
          await react('❌');
          return reply('Bᴜʏ', `│ ❌ Item "${itemId}" not found in shop.\n│ Use *shop* to see available items.`);
        }
        const u = getUser(userId);
        if (u.coins < shopItem.price) {
          await react('❌');
          return reply('Bᴜʏ', `│ ❌ Not enough coins!\n│ You need 🪙${shopItem.price}, you have 🪙${u.coins}`);
        }
        u.coins -= shopItem.price;
        if (itemId === 'health_potion') {
          u.energy = Math.min(u.energy + 50, u.maxEnergy);
        } else if (itemId === 'xp_boost') {
          addXP(userId, 50);
        } else {
          addItem(u, itemId);
        }
        saveData();
        await react('✅');
        return reply('Bᴜʏ', `│ ✅ You bought *${shopItem.desc || itemId.replace(/_/g, ' ')}*!\n│ 🪙 -${shopItem.price} coins`);
      }

      case 'SELL': {
        const parts = text.trim().split(/\s+/);
        if (parts.length < 1 || !parts[0]) {
          await react('❌');
          return reply('Sᴇʟʟ', '│ Usage: *sell <item> [count]*\n│ Example: *sell iron_ore 5*');
        }
        const itemKey = parts[0].toLowerCase().replace(/-/g, '_');
        const count = Math.max(1, parseInt(parts[1]) || 1);
        const meta = ITEM_META[itemKey];
        if (!meta) {
          await react('❌');
          return reply('Sᴇʟʟ', `│ ❌ Unknown item "${parts[0]}".\n│ Check your inventory with *inv*.`);
        }
        await react('⌛');
        const u = getUser(userId);
        if (!hasItem(u, itemKey) || countItem(u, itemKey) < count) {
          await react('❌');
          return reply('Sᴇʟʟ', `│ ❌ You don't have ${count}× ${meta.emoji}${meta.name}.\n│ You own: ${countItem(u, itemKey)}`);
        }
        removeItem(u, itemKey, count);
        const totalCoins = meta.sell * count;
        u.coins += totalCoins;
        saveData();
        await react('✅');
        return reply('Sᴇʟʟ', `│ ✅ Sold ${count}× ${meta.emoji}${meta.name}\n│ 🪙 +${fmt(totalCoins)} coins (${fmt(meta.sell)} each)`);
      }

      case 'TRANSFER': {
        let target = null;
        if (m.quoted) {
          target = m.quoted.sender;
        } else if (m.mentionedJid && m.mentionedJid.length > 0) {
          target = m.mentionedJid[0];
        }
        const parts = text.trim().split(/\s+/);
        const amount = parseInt(parts[parts.length - 1]);
        if (!target || isNaN(amount) || amount <= 0) {
          await react('❌');
          return reply('Tʀᴀɴsғᴇʀ', '│ Usage: *transfer @user <amount>*\n│ Or reply to someone with *transfer <amount>*');
        }
        if (target === userId) {
          await react('❌');
          return reply('Tʀᴀɴsғᴇʀ', '│ 🤦 You cannot transfer to yourself.');
        }
        await react('⌛');
        const u = getUser(userId);
        if (u.coins < amount) {
          await react('❌');
          return reply('Tʀᴀɴsғᴇʀ', `│ ❌ You only have 🪙${fmt(u.coins)}, not 🪙${fmt(amount)}.`);
        }
        u.coins -= amount;
        const targetUser = getUser(target);
        targetUser.coins += amount;
        saveData();
        const targetName = (await client.getName(target).catch(() => target.split('@')[0]));
        await react('✅');
        return reply('Tʀᴀɴsғᴇʀ', `│ ✅ Transferred 🪙${fmt(amount)} to ${targetName}\n│ Your balance: 🪙${fmt(u.coins)}`, [target]);
      }

      case 'GAMBLE': {
        const amount = parseInt(text.trim());
        if (!amount || amount <= 0) {
          await react('❌');
          return reply('Gᴀᴍʙʟᴇ', '│ Usage: *gamble <amount>*\n│ 50/50 chance to double your coins!');
        }
        await react('⌛');
        const u = getUser(userId);
        if (u.coins < amount) {
          await react('❌');
          return reply('Gᴀᴍʙʟᴇ', `│ ❌ You only have 🪙${fmt(u.coins)}, not 🪙${fmt(amount)}.`);
        }
        const win = Math.random() < 0.5;
        if (win) {
          u.coins += amount;
          saveData();
          await react('✅');
          return reply('Gᴀᴍʙʟᴇ', `│ 🎉 You won 🪙${fmt(amount)}!\n│ Balance: 🪙${fmt(u.coins)}`);
        } else {
          u.coins -= amount;
          saveData();
          await react('❌');
          return reply('Gᴀᴍʙʟᴇ', `│ 💀 You lost 🪙${fmt(amount)}.\n│ Balance: 🪙${fmt(u.coins)}`);
        }
      }

      case 'LEVEL': {
        await react('⌛');
        let target = userId;
        if (m.quoted) {
          target = m.quoted.sender;
        } else if (m.mentionedJid && m.mentionedJid.length > 0) {
          target = m.mentionedJid[0];
        }
        const u = getUser(target);
        const displayName = (await client.getName(target).catch(() => target.split('@')[0]));
        const xpNeeded = u.level * 100;
        const progress = Math.min(u.xp / xpNeeded, 1);
        const barLen = 12;
        const filled = Math.round(progress * barLen);
        const bar = '█'.repeat(filled) + '░'.repeat(barLen - filled);
        await react('✅');
        return reply(`${displayName}'s Lᴇᴠᴇʟ`, `│ 📊 Level: ${u.level}\n│ ⭐ XP: ${u.xp} / ${xpNeeded}\n│ ${bar} ${(progress * 100).toFixed(1)}%\n│ ⚡ Energy: ${u.energy}/${u.maxEnergy}\n│ 🪙 Coins: ${fmt(u.coins)}`);
      }

      case 'CRAFT': {
        if (!text.trim()) {
          await react('❌');
          return reply('Cʀᴀғᴛ', '│ Usage: *craft <item>*\n│ Available: sword, shield, bow, armor\n│ ─────────────\n│ ⚔️ Sword: 3 iron, 2 oak wood\n│ 🛡️ Shield: 2 iron, 3 birch wood\n│ 🏹 Bow: 1 gold, 2 maple wood\n│ 🪖 Armor: 2 diamond, 1 emerald, 3 iron');
        }
        const itemKey = text.trim().toLowerCase();
        const recipe = CRAFT_RECIPES[itemKey];
        if (!recipe) {
          await react('❌');
          return reply('Cʀᴀғᴛ', `│ ❌ Unknown craftable "${itemKey}".\n│ Available: sword, shield, bow, armor`);
        }
        await react('⌛');
        const u = getUser(userId);
        const missing = [];
        for (const [mat, need] of Object.entries(recipe)) {
          const have = countItem(u, mat);
          if (have < need) {
            const meta = ITEM_META[mat];
            const name = meta ? `${meta.emoji}${meta.name}` : mat;
            missing.push(`${name} (need ${need}, have ${have})`);
          }
        }
        if (missing.length > 0) {
          await react('❌');
          return reply('Cʀᴀғᴛ', `│ ❌ Missing materials:\n│ ${missing.join('\n│ ')}`);
        }
        for (const [mat, need] of Object.entries(recipe)) {
          removeItem(u, mat, need);
        }
        addItem(u, itemKey);
        addXP(userId, 30);
        saveData();
        await react('✅');
        const meta = ITEM_META[itemKey];
        return reply('Cʀᴀғᴛ', `│ ✅ You crafted ${meta.emoji} *${meta.name}*!\n│ ⭐ +30 XP`);
      }

      default:
        return;
    }
  }
};
