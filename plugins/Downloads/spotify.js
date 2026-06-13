import { getFakeQuoted } from '../../lib/fakeQuoted.js';
export default {
  name: 'spotify',
  aliases: ['spotifydl', 'spoti', 'spt'],
  description: 'Downloads songs from Spotify',
  run: async (context) => {
    const { client, m, text } = context;
    const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    try {
      const query = (text || '').trim();
      if (!query) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
          return m.reply("╭─ Codex-MD\n│ Give me a song name, you tone-deaf cretin.\n╰─ Codex-MD");
      }

      if (query.length > 100) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
          return m.reply("╭─ Codex-MD\n│ Song title longer than my patience. 100 chars MAX!\n╰─ Codex-MD");
      }

      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

      const response = await fetch(`https://api.ootaizumi.web.id/downloader/spotifyplay?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!data.status || !data.result?.download) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        return m.reply(`╭─ Codex-MD\n│ No song found for "${query}".\n│ Your music taste is as bad as your search skills.\n╰─ Codex-MD`);
      }

      const song = data.result;
      const audioUrl = song.download;
      const filename = song.title || "Unknown Song";
      const artist = song.artists || "Unknown Artist";

      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

      await client.sendMessage(m.chat, {
        audio: { url: audioUrl },
        mimetype: "audio/mpeg",
        fileName: `${filename}.mp3`,
        contextInfo: {
          externalAdReply: {
            title: filename.substring(0, 30),
            body: artist.substring(0, 30),
            thumbnailUrl: song.image || "",
            sourceUrl: song.external_url || "",
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      }, { quoted: fq });

      await client.sendMessage(m.chat, {
        document: { url: audioUrl },
        mimetype: "audio/mpeg",
        fileName: `${filename.replace(/[<>:"/\\|?*]/g, '_')}.mp3`,
        caption: `╭─ *SPOTIFY*\n│ ${filename} - ${artist}\n╰─ Codex-MD`
      }, { quoted: fq });

    } catch (error) {
      console.error('Spotify error:', error);
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
      await m.reply(`╭─ *SPOTIFY ERROR*\n│ Download failed. Universe rejects your music taste.\n│ ${error.message}\n╰─ Codex-MD`);
    }
  }
};
