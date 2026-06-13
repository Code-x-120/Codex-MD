import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import axios from 'axios';

const handlers = {
  anime: async ({ client, m, text, fq }) => {
    if (!text) {
      return m.reply(`╭─ *Anime Search*\n│ Usage: .anime <anime name>\n│ Example: .anime Attack on Titan\n╰─ Codex-MD`);
    }
    const { data } = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(text)}&limit=1`, { timeout: 15000 });
    const anime = data.data?.[0];
    if (!anime) {
      return m.reply(`╭─ *Anime Search*\n│ No results found for "${text}".\n╰─ Codex-MD`);
    }
    const synopsis = (anime.synopsis || 'No synopsis').slice(0, 200);
    const caption = `╭─ *Anime Search*\n│ Title: ${anime.title}\n│ Type: ${anime.type || 'N/A'}\n│ Episodes: ${anime.episodes ?? 'N/A'}\n│ Status: ${anime.status || 'N/A'}\n│ Score: ${anime.score || 'N/A'}/10\n│ Synopsis: ${synopsis}...\n│ URL: ${anime.url || 'N/A'}\n╰─ Codex-MD`;
    if (anime.images?.jpg?.image_url) {
      await client.sendMessage(m.chat, { image: { url: anime.images.jpg.image_url }, caption }, { quoted: fq });
    } else {
      m.reply(caption);
    }
  },

  manga: async ({ client, m, text, fq }) => {
    if (!text) {
      return m.reply(`╭─ *Manga Search*\n│ Usage: .manga <manga name>\n│ Example: .manga One Piece\n╰─ Codex-MD`);
    }
    const { data } = await axios.get(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(text)}&limit=1`, { timeout: 15000 });
    const manga = data.data?.[0];
    if (!manga) {
      return m.reply(`╭─ *Manga Search*\n│ No results found for "${text}".\n╰─ Codex-MD`);
    }
    const synopsis = (manga.synopsis || 'No synopsis').slice(0, 200);
    const caption = `╭─ *Manga Search*\n│ Title: ${manga.title}\n│ Type: ${manga.type || 'N/A'}\n│ Chapters: ${manga.chapters ?? 'N/A'}\n│ Volumes: ${manga.volumes ?? 'N/A'}\n│ Score: ${manga.score || 'N/A'}/10\n│ Synopsis: ${synopsis}...\n│ URL: ${manga.url || 'N/A'}\n╰─ Codex-MD`;
    if (manga.images?.jpg?.image_url) {
      await client.sendMessage(m.chat, { image: { url: manga.images.jpg.image_url }, caption }, { quoted: fq });
    } else {
      m.reply(caption);
    }
  },

  news: async ({ client, m, text, fq }) => {
    let articles = [];
    try {
      const { data } = await axios.get('https://api.akuari.my.id/tools/news', { timeout: 10000 });
      articles = data.result || data.data || data.articles || [];
    } catch {
      try {
        const { data } = await axios.get('https://api.erdwpe.com/api/news', { timeout: 10000 });
        articles = data.result || data.data || data.articles || [];
      } catch {
        throw new Error('All news APIs failed');
      }
    }
    if (!articles.length) {
      return m.reply(`╭─ *Latest News*\n│ No news articles available right now.\n╰─ Codex-MD`);
    }
    const top5 = articles.slice(0, 5);
    let reply = `╭─ *Latest News* 📰\n`;
    top5.forEach((article, i) => {
      const title = article.title || article.judul || 'No title';
      const source = article.source || article.sumber || article.media || 'Unknown';
      const time = article.time || article.waktu || article.publishedAt || article.date || '';
      reply += `│ ${i + 1}. ${title}\n`;
      reply += `│    ${source}${time ? ` - ${time}` : ''}\n`;
    });
    reply += `╰─ Codex-MD`;
    m.reply(reply);
  },

  reddit: async ({ client, m, text, fq }) => {
    let subreddit = 'programming';
    if (text) {
      const cleaned = text.trim().replace(/^r\//, '');
      if (cleaned) subreddit = cleaned;
    }
    const { data } = await axios.get(`https://www.reddit.com/r/${encodeURIComponent(subreddit)}/hot.json?limit=5`, {
      timeout: 15000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Codex-MD-Bot/1.0)' }
    });
    const posts = data.data?.children || [];
    if (!posts.length) {
      return m.reply(`╭─ *r/${subreddit}* 🔴\n│ No posts found in this subreddit.\n╰─ Codex-MD`);
    }
    let reply = `╭─ *r/${subreddit}* 🔴\n`;
    posts.slice(0, 5).forEach((post, i) => {
      const p = post.data;
      const title = p.title || 'No title';
      const ups = p.ups || 0;
      const comments = p.num_comments || 0;
      reply += `│ ${i + 1}. ${title}\n`;
      reply += `│    👍 ${ups.toLocaleString()} | 💬 ${comments.toLocaleString()}\n`;
    });
    reply += `╰─ Codex-MD`;
    m.reply(reply);
  },

  ytsearch: async ({ client, m, text, fq }) => {
    if (!text) {
      return m.reply(`╭─ *YouTube Search*\n│ Usage: .youtube <query>\n│ Example: .youtube never gonna give you up\n╰─ Codex-MD`);
    }
    let results = [];
    try {
      const { data } = await axios.get(`https://api.akuari.my.id/tools/ytsearch?query=${encodeURIComponent(text)}`, { timeout: 10000 });
      results = data.result || data.data || data.videos || [];
    } catch {
      try {
        const { data } = await axios.get(`https://api.erdwpe.com/api/search/ytsearch?query=${encodeURIComponent(text)}`, { timeout: 10000 });
        results = data.result || data.data || data.videos || [];
      } catch {
        throw new Error('All YouTube APIs failed');
      }
    }
    if (!results.length) {
      return m.reply(`╭─ *YouTube Search*\n│ No results found for "${text}".\n╰─ Codex-MD`);
    }
    const top5 = results.slice(0, 5);
    let reply = `╭─ *YouTube Search* ▶️\n`;
    top5.forEach((video, i) => {
      const title = video.title || video.judul || 'No title';
      const channel = video.channel || video.author || video.artist || 'Unknown';
      const views = video.views ? Number(video.views).toLocaleString() : video.viewCount || 'N/A';
      const duration = video.duration || video.timestamp || video.length || 'N/A';
      reply += `│ ${i + 1}. ${title}\n`;
      reply += `│    👤 ${channel} | 👁️ ${views} | ⏱️ ${duration}\n`;
    });
    reply += `╰─ Codex-MD`;
    m.reply(reply);
  },

  dictionary: async ({ client, m, text, fq }) => {
    if (!text) {
      return m.reply(`╭─ *Dictionary* 📖\n│ Usage: .define <word>\n│ Example: .define hello\n╰─ Codex-MD`);
    }
    const { data } = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`, { timeout: 15000 });
    const entry = data[0];
    if (!entry) {
      return m.reply(`╭─ *Dictionary* 📖\n│ No definition found for "${text}".\n╰─ Codex-MD`);
    }
    const phonetic = entry.phonetic || (entry.phonetics?.find(p => p.text)?.text) || '';
    let reply = `╭─ *Dictionary* 📖\n│ Word: ${entry.word}\n`;
    if (phonetic) reply += `│ Phonetic: ${phonetic}\n`;
    reply += `│\n`;
    const meanings = entry.meanings || [];
    let defCount = 0;
    for (const meaning of meanings) {
      for (const def of meaning.definitions || []) {
        if (defCount >= 5) break;
        defCount++;
        reply += `│ ${defCount}. ${meaning.partOfSpeech}: ${def.definition}\n`;
        if (def.example) {
          reply += `│    Example: ${def.example}\n`;
        }
      }
      if (defCount >= 5) break;
    }
    reply += `╰─ Codex-MD`;
    m.reply(reply);
  },

  wikimedia: async ({ client, m, text, fq }) => {
    if (!text) {
      return m.reply(`╭─ *Wikipedia*\n│ Usage: .wikisearch <query>\n│ Example: .wikisearch JavaScript\n╰─ Codex-MD`);
    }
    const { data } = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(text)}`, { timeout: 15000 });
    if (!data || data.title === 'Not found' || data.type === 'disambiguation') {
      return m.reply(`╭─ *Wikipedia*\n│ No results found for "${text}".\n╰─ Codex-MD`);
    }
    const extract = (data.extract || 'No summary available').slice(0, 1500);
    const reply = `╭─ *Wikipedia* 📚\n│ ${data.title}\n│ ${data.description || ''}\n│\n│ ${extract}\n│\n│ URL: ${data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`}\n╰─ Codex-MD`;
    if (data.thumbnail?.source) {
      await client.sendMessage(m.chat, { image: { url: data.thumbnail.source }, caption: reply }, { quoted: fq });
    } else {
      m.reply(reply);
    }
  },

  wikidata: async ({ client, m, text, fq }) => {
    if (!text) {
      return m.reply(`╭─ *Wikidata*\n│ Usage: .wikidata <entity ID or query>\n│ Example: .wikidata Q42\n╰─ Codex-MD`);
    }
    const query = text.trim();
    const isQId = /^Q\d+$/.test(query);
    if (isQId) {
      const { data } = await axios.get(`https://www.wikidata.org/wiki/Special:EntityData/${query}.json`, { timeout: 15000 });
      const entity = data?.entities?.[query];
      if (!entity) throw new Error('Entity not found');
      const label = entity.labels?.en?.value || query;
      const desc = entity.descriptions?.en?.value || 'No description';
      m.reply(`╭─ *Wikidata* 🔍\n│ ID: ${query}\n│ Label: ${label}\n│ Description: ${desc}\n│ Site Links: ${Object.keys(entity.sitelinks || {}).length}\n│ URL: https://www.wikidata.org/wiki/${query}\n╰─ Codex-MD`);
    } else {
      const { data } = await axios.get(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(query)}&language=en&format=json`, { timeout: 15000 });
      const results = data.search || [];
      if (!results.length) {
        return m.reply(`╭─ *Wikidata*\n│ No results found for "${text}".\n╰─ Codex-MD`);
      }
      let reply = `╭─ *Wikidata Search* 🔍\n`;
      results.slice(0, 5).forEach((r, i) => {
        reply += `│ ${i + 1}. ${r.label || r.id}\n`;
        reply += `│    ${r.description || ''} (${r.id})\n`;
      });
      reply += `╰─ Codex-MD`;
      m.reply(reply);
    }
  }
};

export default {
  name: 'searchmore',
  aliases: ['anime', 'character', 'manga', 'news', 'reddit', 'youtube', 'ytsearch', 'define', 'dictionary', 'wikimedia', 'wikisearch', 'wikidata'],
  description: 'Extra search commands',
  category: 'Search',
  run: async (context) => {
    const { client, m, command, text, args } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    const cmd = command.toLowerCase();
    const handlerMap = {
      anime: 'anime',
      character: 'anime',
      manga: 'manga',
      news: 'news',
      reddit: 'reddit',
      youtube: 'ytsearch',
      ytsearch: 'ytsearch',
      define: 'dictionary',
      dictionary: 'dictionary',
      wikimedia: 'wikimedia',
      wikisearch: 'wikimedia',
      wikidata: 'wikidata'
    };

    const handler = handlerMap[cmd];
    if (handler && handlers[handler]) {
      try {
        await handlers[handler]({ client, m, text, fq });
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      } catch (e) {
        console.error(`searchmore ${cmd} error:`, e);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        m.reply(`╭─ *${cmd.charAt(0).toUpperCase() + cmd.slice(1)} Error*\n│ Something went wrong.\n╰─ Codex-MD`);
      }
    } else {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      m.reply(`╭─ *Invalid Command*\n│ Unknown search command: ${command}\n╰─ Codex-MD`);
    }
  }
};
