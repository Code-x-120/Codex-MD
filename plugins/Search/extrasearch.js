import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import axios from 'axios';

const GenshinChars = [
  { name: 'Hu Tao', element: 'Pyro', weapon: 'Polearm', region: 'Liyue', rarity: 5, description: 'The 77th Director of the Wangsheng Funeral Parlor. She holds grand ceremonies for the departed and pranks the living.', specialDish: 'Ghostly March', va: 'Takahashi Rie / Brianna Knickerbocker' },
  { name: 'Ganyu', element: 'Cryo', weapon: 'Bow', region: 'Liyue', rarity: 5, description: 'A half-qilin Adeptus serving as the general secretary of the Liyue Qixing.', specialDish: 'Prosperous Peace', va: 'Ueda Reina / Jennifer Losi' },
  { name: 'Zhongli', element: 'Geo', weapon: 'Polearm', region: 'Liyue', rarity: 5, description: 'The Geo Archon, Rex Lapis, now living as a consultant for the Wangsheng Funeral Parlor.', specialDish: 'Slow-Cooked Bamboo Shoot Soup', va: 'Maeno Tomoaki / Keith Silverstein' },
  { name: 'Raiden Shogun', element: 'Electro', weapon: 'Polearm', region: 'Inazuma', rarity: 5, description: 'The Electro Archon, ruler of Inazuma. She pursues eternity and wields the Musou no Hitotachi.', specialDish: 'Omurice Waltz', va: 'Sawashiro Miyuki / Anne Yatco' },
  { name: 'Venti', element: 'Anemo', weapon: 'Bow', region: 'Mondstadt', rarity: 5, description: 'The Anemo Archon, Barbatos, who now wanders Mondstadt as a carefree bard.', specialDish: 'A Buoyant Breeze', va: 'Murase Ayumu / Erika Harlacher' },
  { name: 'Xiao', element: 'Anemo', weapon: 'Polearm', region: 'Liyue', rarity: 5, description: 'The last surviving Yaksha, a vigilant Adeptus who protects Liyue from evil.', specialDish: 'Sweet Dream', va: 'Matsuoka Yoshitsugu / Laila Berzins' },
  { name: 'Kamisato Ayaka', element: 'Cryo', weapon: 'Sword', region: 'Inazuma', rarity: 5, description: 'The eldest daughter of the Kamisato Clan and the Shirasagi Himegimi of the Yashiro Commission.', specialDish: 'All-Weather Beauty', va: 'Hayami Saori / Erica Mendez' },
  { name: 'Diluc', element: 'Pyro', weapon: 'Claymore', region: 'Mondstadt', rarity: 5, description: 'The wealthy owner of the Dawn Winery and a darknight hero fighting against the Abyss Order.', specialDish: 'Pile Em Up', va: 'Ono Kensho / Sean Chiplock' },
  { name: 'Keqing', element: 'Electro', weapon: 'Sword', region: 'Liyue', rarity: 5, description: 'The Yuheng of the Liyue Qixing who questions the reliance on the Adepti and the Archon.', specialDish: 'Survival Grilled Fish', va: 'Kitamura Eri / Kayli Mills' },
  { name: 'Mona', element: 'Hydro', weapon: 'Catalyst', region: 'Mondstadt', rarity: 5, description: 'A mysterious astrologist who reads fate through hydromancy and lives in poverty.', specialDish: 'Come and Get It', va: 'Kohara Konomi / Felecia Angelle' },
  { name: 'Jean', element: 'Anemo', weapon: 'Sword', region: 'Mondstadt', rarity: 5, description: 'The Acting Grand Master of the Knights of Favonius, dedicated to protecting Mondstadt.', specialDish: 'Pile Em Up', va: 'Saito Chiwa / Stephanie Southerland' },
  { name: 'Klee', element: 'Pyro', weapon: 'Catalyst', region: 'Mondstadt', rarity: 5, description: 'The spark knight of the Knights of Favonius, known for her love of explosives and fish blasting.', specialDish: 'Fish-Flavored Toast', va: 'Kuno Misaki / Poonam Basu' },
  { name: 'Tartaglia', element: 'Hydro', weapon: 'Bow', region: 'Snezhnaya', rarity: 5, description: 'The 11th Harbinger of the Fatui, also known as Childe, a master of combat who wields a Hydro blade.', specialDish: 'Come and Get It', va: 'Namikawa Daisuke / Griffin Burns' },
  { name: 'Eula', element: 'Cryo', weapon: 'Claymore', region: 'Mondstadt', rarity: 5, description: 'The Spindrift Knight, a descendant of the Lawrence Clan who serves the Knights of Favonius.', specialDish: 'Stormcrest Pie', va: 'Sato Satomi / Amber May' },
  { name: 'Yoimiya', element: 'Pyro', weapon: 'Bow', region: 'Inazuma', rarity: 5, description: 'The owner of the Naganohara Fireworks shop, known as the Queen of the Summer Festival.', specialDish: 'Summer Festival Fish', va: 'Uchida Maaya / Jenny Yokobori' },
  { name: 'Kaedehara Kazuha', element: 'Anemo', weapon: 'Sword', region: 'Inazuma', rarity: 5, description: 'A wandering samurai from the once-famous Kaedehara Clan, now a crew member of the Crux Fleet.', specialDish: 'All-Weather Beauty', va: 'Shimono Hiro / Mark Whitten' },
  { name: 'Arataki Itto', element: 'Geo', weapon: 'Claymore', region: 'Inazuma', rarity: 5, description: 'The flashy and boisterous leader of the Arataki Gang, a half-oni from Inazuma.', specialDish: 'Way of the Strong', va: 'Nishiyama Koutarou / Max Mittelman' },
  { name: 'Albedo', element: 'Geo', weapon: 'Sword', region: 'Mondstadt', rarity: 5, description: 'The Chief Alchemist of the Knights of Favonius, a synthetic human with vast knowledge of alchemy.', specialDish: 'Woodland Dream', va: 'Nojima Kenji / Khoi Dao' }
];

const handlers = {
  genshin: async ({ client, m, text, fq }) => {
    if (!text) {
      const charList = GenshinChars.map(c => `├ ${c.name}`).join('\n');
      return m.reply(`╭─ *Genshin Characters*\n│ Usage: .genshin <character>\n│ Available characters:\n${charList}\n╰─ Codex-MD`);
    }
    const query = text.toLowerCase();
    const char = GenshinChars.find(c => c.name.toLowerCase().includes(query));
    if (!char) {
      const charList = GenshinChars.map(c => `├ ${c.name}`).join('\n');
      return m.reply(`╭─ *Not Found*\n│ "${text}" not in my database.\n│ Available characters:\n${charList}\n╰─ Codex-MD`);
    }
    m.reply(`╭─ *${char.name}*\n│ Element: ${char.element}\n│ Weapon: ${char.weapon}\n│ Region: ${char.region}\n│ Rarity: ${'★'.repeat(char.rarity)}\n│ Description: ${char.description}\n│ Special Dish: ${char.specialDish}\n│ Voice Actor: ${char.va}\n╰─ Codex-MD`);
  },

  gempa: async ({ client, m, fq }) => {
    try {
      const { data } = await axios.get('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json', { timeout: 15000 });
      const g = data.Infogempa.gempa;
      const tsunami = g.Potensi && g.Potensi.toLowerCase().includes('tsunami') ? '⚠️ TSUNAMI WARNING' : g.Potensi || 'None';
      m.reply(`╭─ *LATEST EARTHQUAKE*\n│ Time: ${g.Tanggal} ${g.Jam}\n│ Magnitude: ${g.Magnitude} SR\n│ Depth: ${g.Kedalaman}\n│ Epicenter: ${g.Wilayah}\n│ Coordinates: ${g.Lintang}, ${g.Bujur}\n│ Tsunami: ${tsunami}\n╰─ Codex-MD`);
    } catch {
      m.reply('╭─ *Earthquake Error*\n│ Failed to fetch earthquake data from BMKG.\n╰─ Codex-MD');
    }
  },

  covid: async ({ client, m, text, fq }) => {
    if (!text) return m.reply('╭─ *COVID-19*\n│ Usage: .covid <country>\n│ Example: .covid Indonesia\n╰─ Codex-MD');
    try {
      const { data } = await axios.get(`https://disease.sh/v3/covid-19/countries/${encodeURIComponent(text)}`, { timeout: 15000 });
      m.reply(`╭─ *COVID-19 Stats - ${data.country}*\n│ Cases: ${data.cases.toLocaleString()}\n│ Today: +${data.todayCases.toLocaleString()}\n│ Deaths: ${data.deaths.toLocaleString()}\n│ Today Deaths: +${data.todayDeaths.toLocaleString()}\n│ Recovered: ${data.recovered.toLocaleString()}\n│ Active: ${data.active.toLocaleString()}\n│ Critical: ${data.critical.toLocaleString()}\n│ Tests: ${data.tests.toLocaleString()}\n╰─ Codex-MD`);
    } catch {
      m.reply(`╭─ *COVID Error*\n│ Country "${text}" not found or API failed.\n╰─ Codex-MD`);
    }
  },

  mcserver: async ({ client, m, text, fq }) => {
    if (!text) return m.reply('╭─ *Minecraft Server*\n│ Usage: .mcserver <server_ip>\n│ Example: .mcserver mc.hypixel.net\n╰─ Codex-MD');
    try {
      const { data } = await axios.get(`https://api.mcsrvstat.us/2/${encodeURIComponent(text)}`, { timeout: 15000 });
      const online = data.online ? '🟢 Online' : '🔴 Offline';
      const motd = data.motd?.clean?.join('\n') || 'N/A';
      const players = data.players ? `${data.players.online}/${data.players.max}` : 'N/A';
      m.reply(`╭─ *Minecraft Server*\n│ IP: ${text}\n│ Status: ${online}\n│ Version: ${data.version || 'N/A'}\n│ Players: ${players}\n│ MOTD:\n${motd}\n│ Ping: ${data.debug?.ping ? data.debug.ping + 'ms' : 'N/A'}\n╰─ Codex-MD`);
    } catch {
      m.reply(`╭─ *MC Server Error*\n│ Failed to fetch server status for "${text}".\n╰─ Codex-MD`);
    }
  },

  lyrics: async ({ client, m, text, fq }) => {
    if (!text) return m.reply('╭─ *Lyrics*\n│ Usage: .lyrics <artist - song>\n│ Example: .lyrics Alan Walker - Faded\n╰─ Codex-MD');
    let artist, song;
    if (text.includes(' - ')) {
      const parts = text.split(' - ');
      artist = parts[0].trim();
      song = parts.slice(1).join(' - ').trim();
    } else {
      artist = '';
      song = text;
    }
    let lyrics = null;
    if (artist && song) {
      try {
        const { data } = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`, { timeout: 10000 });
        if (data.lyrics) lyrics = data.lyrics;
      } catch {}
    }
    if (!lyrics) {
      try {
        const { data } = await axios.get(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(text)}`, { timeout: 10000 });
        if (data.lyrics) {
          lyrics = data.lyrics;
          artist = data.author || artist;
          song = data.title || song;
        }
      } catch {}
    }
    if (!lyrics) {
      return m.reply(`╭─ *Lyrics Error*\n│ No lyrics found for "${text}".\n╰─ Codex-MD`);
    }
    const title = artist ? `${artist} - ${song}` : song;
    const truncated = lyrics.length > 3500 ? lyrics.slice(0, 3500) + '...' : lyrics;
    m.reply(`╭─ *${title}*\n${truncated}\n╰─ Codex-MD`);
  },

  pinterest: async ({ client, m, text, fq }) => {
    if (!text) return m.reply('╭─ *Pinterest*\n│ Usage: .pinterest <query>\n│ Example: .pinterest anime girl\n╰─ Codex-MD');
    try {
      const { data } = await axios.get(`https://api.siputzx.my.id/api/search/pinterest?query=${encodeURIComponent(text)}`, { timeout: 20000 });
      const results = data.data || data.result || data.images || [];
      const top5 = results.slice(0, 5);
      if (!top5.length) {
        return m.reply(`╭─ *Pinterest*\n│ No results for "${text}".\n╰─ Codex-MD`);
      }
      for (let i = 0; i < top5.length; i++) {
        const img = top5[i].images_url || top5[i].image || top5[i].url || top5[i];
        const imgUrl = typeof img === 'string' ? img : (img.original || img.medium || img.url);
        const title = top5[i].title || top5[i].description || 'Pinterest Image';
        if (imgUrl) {
          await client.sendMessage(m.chat, { image: { url: imgUrl }, caption: `╭─ *Pinterest ${i + 1}/${top5.length}*\n│ ${title}\n╰─ Codex-MD` }, { quoted: fq });
          if (i < top5.length - 1) await new Promise(r => setTimeout(r, 1200));
        }
      }
    } catch {
      m.reply(`╭─ *Pinterest Error*\n│ Failed to search Pinterest for "${text}".\n╰─ Codex-MD`);
    }
  },

  playstore: async ({ client, m, text, fq }) => {
    if (!text) return m.reply('╭─ *Play Store*\n│ Usage: .playstore <app name>\n│ Example: .playstore WhatsApp\n╰─ Codex-MD');
    try {
      const { data } = await axios.get(`https://api.siputzx.my.id/api/search/playstore?query=${encodeURIComponent(text)}`, { timeout: 20000 });
      const apps = data.data || data.result || [];
      if (!apps.length) return m.reply(`╭─ *Play Store*\n│ No apps found for "${text}".\n╰─ Codex-MD`);
      const top3 = apps.slice(0, 3);
      let reply = `╭─ *Play Store - ${text}*\n`;
      top3.forEach((app, i) => {
        const name = app.title || app.name || 'Unknown';
        const dev = app.developer || app.developerId || app.developer_name || 'Unknown';
        const rating = app.score || app.rating || app.ratings || 'N/A';
        const downloads = app.downloads || app.installs || app.download_count || 'N/A';
        const desc = (app.description || app.summary || 'No description').slice(0, 200);
        reply += `\n├ ${i + 1}. ${name}\n│  👤 ${dev}\n│  ⭐ ${rating} | 📥 ${downloads}\n│  ${desc}\n`;
      });
      reply += `╰─ Codex-MD`;
      m.reply(reply);
    } catch {
      m.reply(`╭─ *Play Store Error*\n│ Failed to search Play Store for "${text}".\n╰─ Codex-MD`);
    }
  },

  animeinfo: async ({ client, m, text, fq }) => {
    if (!text) return m.reply('╭─ *Anime Info*\n│ Usage: .animeinfo <name>\n│ Example: .animeinfo Attack on Titan\n╰─ Codex-MD');
    try {
      const { data } = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(text)}&limit=1`, { timeout: 15000 });
      const anime = data.data?.[0];
      if (!anime) return m.reply(`╭─ *Anime Info*\n│ No anime found for "${text}".\n╰─ Codex-MD`);
      const synopsis = (anime.synopsis || 'No synopsis').slice(0, 500);
      m.reply(`╭─ *${anime.title}*\n│ Type: ${anime.type || 'N/A'}\n│ Episodes: ${anime.episodes || 'N/A'}\n│ Status: ${anime.status || 'N/A'}\n│ Score: ${anime.score || 'N/A'}${anime.scored_by ? ` (by ${anime.scored_by.toLocaleString()})` : ''}\n│ Synopsis: ${synopsis}\n╰─ Codex-MD`);
    } catch {
      m.reply(`╭─ *Anime Error*\n│ Failed to fetch anime info for "${text}".\n╰─ Codex-MD`);
    }
  },

  mangainfo: async ({ client, m, text, fq }) => {
    if (!text) return m.reply('╭─ *Manga Info*\n│ Usage: .mangainfo <name>\n│ Example: .mangainfo One Piece\n╰─ Codex-MD');
    try {
      const { data } = await axios.get(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(text)}&limit=1`, { timeout: 15000 });
      const manga = data.data?.[0];
      if (!manga) return m.reply(`╭─ *Manga Info*\n│ No manga found for "${text}".\n╰─ Codex-MD`);
      const synopsis = (manga.synopsis || 'No synopsis').slice(0, 500);
      m.reply(`╭─ *${manga.title}*\n│ Type: ${manga.type || 'N/A'}\n│ Volumes: ${manga.volumes || 'N/A'}\n│ Chapters: ${manga.chapters || 'N/A'}\n│ Score: ${manga.score || 'N/A'}${manga.scored_by ? ` (by ${manga.scored_by.toLocaleString()})` : ''}\n│ Synopsis: ${synopsis}\n╰─ Codex-MD`);
    } catch {
      m.reply(`╭─ *Manga Error*\n│ Failed to fetch manga info for "${text}".\n╰─ Codex-MD`);
    }
  }
};

export default {
  name: 'extrasearch',
  aliases: ['genshin', 'earthquake', 'gempa', 'covid', 'minecraft', 'mcserver', 'lyrics', 'lirik', 'pinterest', 'playstore', 'wattpad', 'animeinfo', 'mangainfo'],
  description: 'Extra search & info commands',
  category: 'Search',
  run: async (context) => {
    const { client, m, command, text, args, prefix } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    const cmd = command.toLowerCase();
    const handlerKey = {
      genshin: 'genshin',
      earthquake: 'gempa',
      gempa: 'gempa',
      covid: 'covid',
      minecraft: 'mcserver',
      mcserver: 'mcserver',
      lyrics: 'lyrics',
      lirik: 'lyrics',
      pinterest: 'pinterest',
      playstore: 'playstore',
      animeinfo: 'animeinfo',
      mangainfo: 'mangainfo'
    }[cmd];

    if (handlerKey && handlers[handlerKey]) {
      try {
        await handlers[handlerKey]({ client, m, text, fq });
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      } catch (e) {
        console.error(`extrasearch ${cmd} error:`, e);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        m.reply(`╭─ *${cmd.toUpperCase()} Error*\n│ Something went wrong.\n╰─ Codex-MD`);
      }
    } else {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      m.reply(`╭─ *Invalid Command*\n│ Unknown search command: ${command}\n╰─ Codex-MD`);
    }
  }
};
