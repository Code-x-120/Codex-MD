import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import { exec } from 'child_process';
import { PassThrough } from 'stream';

const EFFECTS = {
  bass: { desc: 'Bass Boosted', filter: '-af equalizer=f=54:width_type=o:width=2:g=20' },
  blown: { desc: 'Blown Speakers', filter: '-af acrusher=.1:1:64:0:log' },
  deep: { desc: 'Deep Voice', filter: '-af atempo=4/4,asetrate=44500*2/3' },
  earrape: { desc: 'Earrape', filter: '-af volume=12' },
  fast: { desc: 'Fast Forward', filter: '-filter:a "atempo=1.63,asetrate=44100"' },
  fat: { desc: 'Fat Voice', filter: '-filter:a "atempo=1.6,asetrate=22100"' },
  nightcore: { desc: 'Nightcore', filter: '-filter:a atempo=1.06,asetrate=44100*1.25' },
  reverse: { desc: 'Reversed', filter: '-filter_complex "areverse"' },
  robot: { desc: 'Robot Voice', filter: '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"' },
  slow: { desc: 'Slow Motion', filter: '-filter:a "atempo=0.7,asetrate=44100"' },
  smooth: { desc: 'Smooth', filter: '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"' },
  tupai: { desc: 'Squirrel Voice', filter: '-filter:a "atempo=0.5,asetrate=65100"' },
  vibrato: { desc: 'Vibrato', filter: '-af vibrato=f=5:d=0.5' },
  chipmunk: { desc: 'Chipmunk', filter: '-filter:a "atempo=1.3,asetrate=52000"' },
  echo: { desc: 'Echo', filter: '-af aecho=0.8:0.9:1000:0.3' },
  flanger: { desc: 'Flanger', filter: '-af flanger' },
  haas: { desc: 'Haas Effect', filter: '-af haas' },
  phaser: { desc: 'Phaser', filter: '-af phaser' },
  pitch: { desc: 'Pitch Down', filter: '-af asetrate=36000' },
  reverb: { desc: 'Reverb', filter: '-af aecho=0.8:0.9:500:0.5' },
  treble: { desc: 'Treble Boost', filter: '-af equalizer=f=8000:width_type=o:width=2:g=15' },
  volume: { desc: 'Volume Up', filter: '-af volume=5' },
};

async function applyEffect(buffer, effect) {
  return new Promise((resolve, reject) => {
    const input = new PassThrough();
    input.end(buffer);
    const chunks = [];
    const proc = exec(
      `ffmpeg -i pipe:0 ${effect} -f mp3 pipe:1`,
      { maxBuffer: 100 * 1024 * 1024 },
      (err, stdout, stderr) => {
        if (err) reject(new Error(err.message));
        else resolve(Buffer.concat(chunks));
      }
    );
    proc.stdin.write(buffer);
    proc.stdin.end();
    proc.stdout.on('data', c => chunks.push(c));
    proc.stdout.on('end', () => {
      if (chunks.length) resolve(Buffer.concat(chunks));
    });
    proc.on('error', reject);
  });
}

export default {
  name: 'audiofx',
  aliases: Object.keys(EFFECTS).map(k => k),
  description: 'Apply audio effects to voice/audio messages',
  run: async (context) => {
    const { client, m, text, command } = context;
    const fq = getFakeQuoted(m);
    const effectName = command || (text || '').trim().split(/\s+/)[0];
    const effect = EFFECTS[effectName];

    if (!effect) {
      const list = Object.entries(EFFECTS).map(([k, v]) => `  ${k}: ${v.desc}`).join('\n');
      return client.sendMessage(m.chat, {
        text: `╭─ *Aᴜᴅɪᴏ Fx*\n│ Available effects:\n${list}\n│ Reply to an audio with: .${effectName}\n╰─ Codex-MD`
      }, { quoted: fq });
    }

    const quoted = m.quoted || m;
    const mime = quoted?.mimetype || '';
    if (!/audio/.test(mime)) {
      return client.sendMessage(m.chat, {
        text: `╭─ *Eʀʀᴏʀ*\n│ Reply to an audio message.\n╰─ Codex-MD`
      }, { quoted: fq });
    }

    await client.sendMessage(m.chat, { react: { text: '⏳', key: m.reactKey } });

    try {
      const audioBuf = await client.downloadMediaMessage(quoted);
      const resultBuf = await applyEffect(audioBuf, effect.filter);
      await client.sendMessage(m.chat, {
        audio: resultBuf,
        mimetype: 'audio/mpeg',
        ptt: false
      }, { quoted: fq });
      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
    } catch (e) {
      await client.sendMessage(m.chat, {
        text: `╭─ *Fᴀɪʟᴇᴅ*\n│ ${e.message || 'Audio processing error'}\n╰─ Codex-MD`
      }, { quoted: fq });
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
    }
  }
};
