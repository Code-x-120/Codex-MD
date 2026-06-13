import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
  name: 'test',
  aliases: ['tst', 'testcmd'],
  description: 'Sends a test voice note to check if you\'re worthy',
  run: async (context) => {
    const { client, m, botname, text } = context;
    const fq = getFakeQuoted(m);

    if (text) {
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
      return client.sendMessage(m.chat, { text: `╭─ *Eʀʀᴏʀ*\n│ Yo, @${m.sender.split('@')[0].split(':')[0]}, what's this extra\n│ garbage? Just say .test, you clown.\n╰─ Codex-MD` }, { quoted: fq, mentions: [m.sender] });
    }

    try {
      const possibleAudioPaths = [
        path.join(__dirname, 'xh_clinton', 'test.mp3'),
        path.join(process.cwd(), 'xh_clinton', 'test.mp3'),
        path.join(__dirname, '..', 'xh_clinton', 'test.mp3'),
      ];

      let audioPath = null;
      for (const possiblePath of possibleAudioPaths) {
        if (fs.existsSync(possiblePath)) {
          audioPath = possiblePath;
          break;
        }
      }

      if (audioPath) {
        console.log(`✅ Found audio file at: ${audioPath}`);
        await client.sendMessage(m.chat, {
          audio: { url: audioPath },
          ptt: true,
          mimetype: 'audio/mpeg',
          fileName: 'test.mp3'
        }, { quoted: fq });
      } else {
        console.error('❌ Audio file not found at any of the following paths:', possibleAudioPaths);
        await client.sendMessage(m.chat, {
          text: `╭─ *Fᴀɪʟᴇᴅ*\n│ Shit, couldn't find test.mp3 in\n│ xh_clinton/. Fix your files, you slacker.\n╰─ Codex-MD`
        }, { quoted: fq });
      }
    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      console.error('Error in test command:', error);
      await client.sendMessage(m.chat, {
        text: `╭─ *Eʀʀᴏʀ*\n│ Yo, something fucked up the test\n│ audio. Try again later, dumbass.\n╰─ Codex-MD`
      }, { quoted: fq });
    }
  }
};
