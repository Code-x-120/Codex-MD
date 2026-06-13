import { getFakeQuoted } from '../../lib/fakeQuoted.js';
export default {
  name: 'play',
  aliases: ['ply', 'playy', 'pl'],
  description: 'Downloads songs from YouTube and sends audio',
  run: async (context) => {
    const { client, m, text } = context;
    const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    try {
      const query = text ? text.trim() : '';

      if (!query) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return m.reply(`╭─ Codex-MD\n│ You forgot to type something, genius.\n│ Give me a song name OR a YouTube link.\n│ Example: .play harlem shake\n│ Or: .play https://youtu.be/dQw4w9WgXcQ\n╰─ Codex-MD`);
      }

      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

      const isYoutubeLink = /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?[a-zA-Z0-9_-]{11})/gi.test(query);

      let audioUrl, filename, thumbnail, sourceUrl;

      if (isYoutubeLink) {
        const response = await fetch(`https://api.sidycoders.xyz/api/ytdl?url=${encodeURIComponent(query)}&format=mp3&apikey=memberdycoders`);
        const data = await response.json();

        if (!data.status || !data.cdn) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
          return m.reply(`╭─ Codex-MD\n│ Can't download that YouTube link.\n│ Your link is probably broken or private.\n│ Even I have limits, unlike your stupidity.\n╰─ Codex-MD`);
        }

        audioUrl = data.cdn;
        filename = data.title || "Unknown YouTube Song";
        thumbnail = "";
        sourceUrl = query;
      } else {
        if (query.length > 100) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
          return m.reply("╭─ Codex-MD\n│ Song title longer than my patience. 100 chars MAX!\n╰─ Codex-MD");
        }

        const response = await fetch(`https://apiziaul.vercel.app/api/downloader/ytplaymp3?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (!data.status || !data.result?.downloadUrl) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
          return m.reply(`╭─ Codex-MD\n│ No song found for "${query}".\n│ Your music taste is as bad as your search skills.\n╰─ Codex-MD`);
        }

        audioUrl = data.result.downloadUrl;
        filename = data.result.title || "Unknown Song";
        thumbnail = data.result.thumbnail || "";
        sourceUrl = data.result.videoUrl || "";
      }

      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

      await client.sendMessage(m.chat, {
        audio: { url: audioUrl },
        mimetype: "audio/mpeg",
        fileName: `${filename}.mp3`,
        contextInfo: thumbnail ? {
          externalAdReply: {
            title: filename.substring(0, 30),
            body: "Codex-MD",
            thumbnailUrl: thumbnail,
            sourceUrl: sourceUrl,
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        } : undefined,
      }, { quoted: fq });

      await client.sendMessage(m.chat, {
        document: { url: audioUrl },
        mimetype: "audio/mpeg",
        fileName: `${filename.replace(/[<>:"/\\|?*]/g, '_')}.mp3`,
        caption: `╭─ *PLAY*\n│ ${filename}\n╰─ Codex-MD`
      }, { quoted: fq });

    } catch (error) {
      console.error('Play error:', error);
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
      await m.reply(`╭─ *PLAY ERROR*\n│ Play failed. The universe rejects your music taste.\n╰─ Codex-MD`);
    }
  }
};