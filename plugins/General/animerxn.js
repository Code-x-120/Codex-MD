import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import axios from 'axios';

export default {
  name: 'animerxn',
  aliases: ['cryimg', 'cuddleimg', 'danceimg', 'happyimg', 'bonkimg', 'punchimg', 'smileimg', 'waveimg', 'winkimg', 'boredimg', 'killimg', 'handhold', 'pokeimg', 'blushimg', 'nekoimg', 'waifuimg'],
    description: 'Anime reaction GIFs',
    category: 'General',
    run: async (context) => {
        const { client, m, command, text } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        
        const action = command;
        const mentioned = m.mentions?.[0] || '';
        const sender = m.sender;
        const target = mentioned || text || 'themselves';
        
        const user = '@' + sender.split('@')[0];
        const targetUser = mentioned ? '@' + mentioned.split('@')[0] : target;
        
        // Map alias → API endpoint name
        const ALIAS_MAP = {
            cryimg: 'cry', cuddleimg: 'cuddle', danceimg: 'dance',
            happyimg: 'happy', bonkimg: 'bonk', punchimg: 'punch',
            smileimg: 'smile', waveimg: 'wave', winkimg: 'wink',
            boredimg: 'bored', killimg: 'kill', handhold: 'handhold',
            pokeimg: 'poke', blushimg: 'blush', nekoimg: 'neko', waifuimg: 'waifu'
        };
        
        const endpoint = ALIAS_MAP[action] || 'neko';
        
        const ACTION_MSGS = {
            cry: `${user} is crying 😢`,
            cuddle: `${user} cuddles with ${targetUser} 🫂`,
            dance: `${user} dances 💃`,
            happy: `${user} is happy 😊`,
            bonk: `${user} bonks ${targetUser} 🔨`,
            punch: `${user} punches ${targetUser} 👊`,
            smile: `${user} smiles 😊`,
            wave: `${user} waves at ${targetUser} 👋`,
            wink: `${user} winks at ${targetUser} 😉`,
            bored: `${user} is bored 😒`,
            kill: `${user} kills ${targetUser} 💀`,
            handhold: `${user} holds hands with ${targetUser} 🤝`,
            poke: `${user} pokes ${targetUser} 👆`,
            blush: `${user} blushes 😳`,
            neko: `Here's a neko for you! 🐱`,
            waifu: `Here's a waifu for you! 💕`
        };
        
        // Try waifu.pics first, fallback to nekos.life, then nekosapi.com
        let imageUrl;
        try {
            const { data } = await axios.get(`https://api.waifu.pics/sfw/${endpoint}`, { timeout: 8000 });
            imageUrl = data.url;
        } catch {
            try {
                const { data } = await axios.get(`https://nekos.life/api/v2/img/${endpoint}`, { timeout: 8000 });
                imageUrl = data.url;
            } catch {
                try {
                    const { data } = await axios.get(`https://api.nekosapi.com/v3/images/random?tag=${endpoint}&limit=1`, { timeout: 8000 });
                    imageUrl = data.items?.[0]?.image_url || data.url;
                } catch {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    return m.reply("╭─ *Anime Reaction*\n│ Failed to fetch image. Try again.\n╰─ Codex-MD");
                }
            }
        }
        
        const msg = ACTION_MSGS[action] || `Here's a ${action} image!`;
        
        await client.sendMessage(m.chat, { 
            image: { url: imageUrl }, 
            caption: `╭─ *${action.toUpperCase()}*\n│ ${msg}\n╰─ Codex-MD`,
            mentions: mentioned ? [m.sender, mentioned] : [m.sender]
        }, { quoted: fq });
        
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } }).catch(() => {});
    }
};
