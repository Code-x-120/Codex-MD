import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import axios from 'axios';
import crypto from 'crypto';
import { gzipSync, gunzipSync } from 'zlib';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);
const __dirname = path.resolve();
const timers = new Map();
const reminders = new Map();

function parseDuration(str) {
  const match = str.match(/^(\d+)\s*(s|sec|second|seconds|m|min|minute|minutes|h|hour|hours|d|day|days)$/i);
  if (!match) return null;
  const num = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  if (unit.startsWith('s')) return num * 1000;
  if (unit.startsWith('m')) return num * 60000;
  if (unit.startsWith('h')) return num * 3600000;
  if (unit.startsWith('d')) return num * 86400000;
  return null;
}

function formatTime(ms) {
  const date = new Date(Date.now() + ms);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default {
  name: 'convertmore',
  aliases: ['compress', 'decompress', 'binary', 'biner', 'hex', 'hexadecimal', 'currency', 'exchangerate', 'timer', 'countdown', 'reminder', 'remind', 'randomnum', 'randomnumber', 'randnum', 'tomp3', 'toaudio', 'tomp4', 'tovideo', 'tobase64', 'frombase64', 'toqr', 'fromqr', 'png2webp', 'webp2png', 'tobinary', 'frombinary', 'fromhex', 'tohex'],
  description: 'Extra converter & utility tools',
  category: 'General',
  run: async (context) => {
    const { client, m, text, command, prefix } = context;
    const fq = getFakeQuoted(m);
    const args = (text || '').trim();

    const react = async (emoji) => {
      try { await client.sendMessage(m.chat, { react: { text: emoji, key: m.reactKey } }); } catch {}
    };

    const sendBox = async (title, body) => {
      const box = `╭─ *${title}*\n${body.split('\n').map(l => `│ ${l}`).join('\n')}\n╰─ Codex-MD`;
      return client.sendMessage(m.chat, { text: box }, { quoted: fq });
    };

    const quoted = m.quoted || m;

    await react('⌛');

    switch (command) {
      case 'compress': {
        if (!args) {
          await react('❌');
          return sendBox('Text Compression', 'Provide text to compress.\nUsage: .compress some text here');
        }
        const input = Buffer.from(args);
        const compressed = gzipSync(input).toString('base64');
        await react('✅');
        return sendBox('Text Compression', `Original: ${input.length} chars\nCompressed: ${compressed.length} chars\nResult: ${compressed.slice(0, 100)}...`);
      }

      case 'decompress': {
        if (!args) {
          await react('❌');
          return sendBox('Text Decompression', 'Provide compressed text to decompress.\nUsage: .decompress H4sI...');
        }
        try {
          const decompressed = gunzipSync(Buffer.from(args, 'base64')).toString();
          await react('✅');
          return sendBox('Text Decompression', `Result: ${decompressed}`);
        } catch {
          await react('❌');
          return sendBox('Text Decompression', 'Invalid compressed data. Make sure it is a valid gzip base64 string.');
        }
      }

      case 'binary':
      case 'biner':
      case 'tobinary': {
        if (!args) {
          await react('❌');
          return sendBox('Text to Binary', 'Provide text to convert.\nUsage: .binary hello');
        }
        const binary = [...args].map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
        await react('✅');
        return sendBox('Text to Binary', `Text: ${args}\nBinary: ${binary}`);
      }

      case 'frombinary': {
        if (!args) {
          await react('❌');
          return sendBox('Binary to Text', 'Provide binary to convert.\nUsage: .frombinary 01101000 01101001');
        }
        try {
          const textOut = args.split(/\s+/).map(b => String.fromCharCode(parseInt(b, 2))).join('');
          await react('✅');
          return sendBox('Binary to Text', `Binary: ${args}\nText: ${textOut}`);
        } catch {
          await react('❌');
          return sendBox('Binary to Text', 'Invalid binary string. Use space-separated 8-bit binary values.');
        }
      }

      case 'hex':
      case 'hexadecimal':
      case 'tohex': {
        if (!args) {
          await react('❌');
          return sendBox('Text to Hex', 'Provide text to convert.\nUsage: .hex hello');
        }
        const hex = Buffer.from(args).toString('hex');
        await react('✅');
        return sendBox('Text to Hex', `Text: ${args}\nHex: ${hex}`);
      }

      case 'fromhex': {
        if (!args) {
          await react('❌');
          return sendBox('Hex to Text', 'Provide hex to convert.\nUsage: .fromhex 68656c6c6f');
        }
        try {
          const textOut = Buffer.from(args.replace(/\s+/g, ''), 'hex').toString();
          await react('✅');
          return sendBox('Hex to Text', `Hex: ${args}\nText: ${textOut}`);
        } catch {
          await react('❌');
          return sendBox('Hex to Text', 'Invalid hex string.');
        }
      }

      case 'currency':
      case 'exchangerate': {
        const parts = args.split(/\s+/).filter(Boolean);
        if (parts.length < 2) {
          await react('❌');
          return sendBox('Currency Converter', 'Usage: .currency 100 USD to EUR\nOr: .currency USD EUR');
        }
        try {
          let amount = 1;
          let from, to;
          if (isNaN(parts[0])) {
            from = parts[0].toUpperCase();
            to = parts[parts.length - 1].toUpperCase();
          } else {
            amount = parseFloat(parts[0]);
            const idx = parts.findIndex(p => p.toLowerCase() === 'to');
            if (idx !== -1) {
              from = parts[idx - 1]?.toUpperCase();
              to = parts[idx + 1]?.toUpperCase();
            } else {
              from = parts[1]?.toUpperCase();
              to = parts[2]?.toUpperCase();
            }
          }
          if (!from || !to) {
            await react('❌');
            return sendBox('Currency Converter', 'Could not parse currency codes.\nUsage: .currency 100 USD to EUR');
          }
          const { data } = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`, { timeout: 10000 });
          const rate = data.rates[to];
          if (!rate) {
            await react('❌');
            return sendBox('Currency Converter', `Currency "${to}" not found.`);
          }
          const result = (amount * rate).toFixed(2);
          await react('✅');
          return sendBox('Currency Converter', `${amount} ${from} = ${result} ${to}\nRate: 1 ${from} = ${rate} ${to}`);
        } catch {
          await react('❌');
          return sendBox('Currency Converter', 'Failed to fetch exchange rates. Try again later.');
        }
      }

      case 'timer':
      case 'countdown': {
        if (!args) {
          await react('❌');
          return sendBox('Timer', 'Usage: .timer 10s, .timer 5m, .timer 1h');
        }
        const ms = parseDuration(args);
        if (!ms || ms > 86400000) {
          await react('❌');
          return sendBox('Timer', 'Invalid duration. Use: 10s, 5m, 1h, 1d (max 24h)');
        }
        const chatId = m.chat;
        if (timers.has(chatId)) {
          clearTimeout(timers.get(chatId));
          timers.delete(chatId);
        }
        const timerId = setTimeout(async () => {
          try {
            await client.sendMessage(chatId, { text: `⏰ *Timer Done!* ⏰\n│ ${args} timer is up!` });
          } catch {}
          timers.delete(chatId);
        }, ms);
        timers.set(chatId, timerId);
        await react('✅');
        return sendBox('Timer Set', `Duration: ${args}\nWill notify at: ${formatTime(ms)}`);
      }

      case 'reminder':
      case 'remind': {
        const parts = args.split(/\s+/);
        const durStr = parts[0];
        const msg = parts.slice(1).join(' ') || 'Reminder!';
        const ms = parseDuration(durStr);
        if (!ms || ms > 86400000) {
          await react('❌');
          return sendBox('Reminder', 'Usage: .remind 10m drink water');
        }
        const chatId = m.chat;
        if (reminders.has(chatId)) {
          clearTimeout(reminders.get(chatId));
          reminders.delete(chatId);
        }
        const remindId = setTimeout(async () => {
          try {
            await client.sendMessage(chatId, { text: `⏰ *Reminder!* ⏰\n│ ${msg}` });
          } catch {}
          reminders.delete(chatId);
        }, ms);
        reminders.set(chatId, remindId);
        await react('✅');
        return sendBox('Reminder Set', `Message: ${msg}\nIn: ${durStr}\nAt: ${formatTime(ms)}`);
      }

      case 'randomnum':
      case 'randomnumber':
      case 'randnum': {
        const nums = args.split(/\s+/).filter(Boolean);
        let min = 1, max = 100;
        if (nums.length >= 2) {
          min = parseInt(nums[0]) || 1;
          max = parseInt(nums[1]) || 100;
        } else if (nums.length === 1) {
          max = parseInt(nums[0]) || 100;
        }
        if (min > max) [min, max] = [max, min];
        const result = Math.floor(Math.random() * (max - min + 1)) + min;
        await react('✅');
        return sendBox('Random Number', `Range: ${min} - ${max}\nResult: ${result}`);
      }

      case 'tomp3':
      case 'toaudio': {
        const mime = quoted?.mimetype || '';
        if (!/video|audio/.test(mime)) {
          await react('❌');
          return sendBox('Convert to MP3', 'Reply to a video/audio message with .tomp3');
        }
        try {
          const mediaBuf = await client.downloadMediaMessage(quoted);
          const tmpDir = path.join(__dirname, 'tmp');
          if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
          const inputPath = path.join(tmpDir, `input_${Date.now()}.tmp`);
          const outputPath = path.join(tmpDir, `output_${Date.now()}.mp3`);
          fs.writeFileSync(inputPath, mediaBuf);
          await execAsync(`ffmpeg -i "${inputPath}" -vn -acodec libmp3lame -qscale:a 2 "${outputPath}" -y`, { timeout: 60000 });
          const outputBuf = fs.readFileSync(outputPath);
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
          await react('✅');
          return client.sendMessage(m.chat, {
            audio: outputBuf,
            mimetype: 'audio/mpeg',
            fileName: 'converted.mp3'
          }, { quoted: fq });
        } catch (e) {
          await react('❌');
          return sendBox('Convert to MP3', e.message.includes('ffmpeg') ? 'ffmpeg is not installed on this system.' : `Conversion failed: ${e.message}`);
        }
      }

      case 'tomp4':
      case 'tovideo': {
        const mime = quoted?.mimetype || '';
        if (!/sticker|image|webp/.test(mime) && !quoted?.isAnimated) {
          await react('❌');
          return sendBox('Convert to MP4', 'Reply to a sticker/image with .tomp4');
        }
        try {
          const mediaBuf = await client.downloadMediaMessage(quoted);
          const tmpDir = path.join(__dirname, 'tmp');
          if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
          const inputPath = path.join(tmpDir, `input_${Date.now()}.tmp`);
          const outputPath = path.join(tmpDir, `output_${Date.now()}.mp4`);
          fs.writeFileSync(inputPath, mediaBuf);
          if (mime.includes('webp') || mime.includes('sticker')) {
            await execAsync(`ffmpeg -i "${inputPath}" -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2" -c:v libx264 -pix_fmt yuv420p "${outputPath}" -y`, { timeout: 60000 });
          } else {
            await execAsync(`ffmpeg -i "${inputPath}" -c:v libx264 -pix_fmt yuv420p "${outputPath}" -y`, { timeout: 60000 });
          }
          const outputBuf = fs.readFileSync(outputPath);
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
          await react('✅');
          return client.sendMessage(m.chat, {
            video: outputBuf,
            mimetype: 'video/mp4',
            fileName: 'converted.mp4'
          }, { quoted: fq });
        } catch (e) {
          await react('❌');
          return sendBox('Convert to MP4', e.message.includes('ffmpeg') ? 'ffmpeg is not installed on this system.' : `Conversion failed: ${e.message}`);
        }
      }

      case 'tobase64': {
        if (!args) {
          await react('❌');
          return sendBox('Base64', 'Provide text to encode.\nUsage: .tobase64 hello world');
        }
        const encoded = Buffer.from(args).toString('base64');
        await react('✅');
        return sendBox('Base64', encoded);
      }

      case 'frombase64': {
        if (!args) {
          await react('❌');
          return sendBox('Base64', 'Provide base64 to decode.\nUsage: .frombase64 aGVsbG8=');
        }
        try {
          const decoded = Buffer.from(args, 'base64').toString();
          await react('✅');
          return sendBox('Base64 Decoded', decoded);
        } catch {
          await react('❌');
          return sendBox('Base64', 'Invalid base64 string.');
        }
      }

      case 'toqr': {
        if (!args) {
          await react('❌');
          return sendBox('QR Generator', 'Provide text or link to generate QR.\nUsage: .toqr https://example.com');
        }
        try {
          const url = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(args)}`;
          const { data } = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
          await react('✅');
          return client.sendMessage(m.chat, {
            image: Buffer.from(data),
            caption: `╭─ *QR Code Generated*\n│ Data: ${args.slice(0, 50)}${args.length > 50 ? '...' : ''}\n╰─ Codex-MD`
          }, { quoted: fq });
        } catch {
          await react('❌');
          return sendBox('QR Generator', 'Failed to generate QR code.');
        }
      }

      case 'fromqr': {
        if (!m.quoted || !/image/.test(m.quoted?.mimetype || '')) {
          await react('❌');
          return sendBox('QR Decoder', 'Reply to a QR code image with .fromqr');
        }
        try {
          const imgBuf = await client.downloadMediaMessage(m.quoted);
          const tmpDir = path.join(__dirname, 'tmp');
          if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
          const imgPath = path.join(tmpDir, `qr_${Date.now()}.png`);
          fs.writeFileSync(imgPath, imgBuf);
          const response = await axios.post('https://api.qrserver.com/v1/read-qr-code/', null, {
            params: { fileurl: '' },
            timeout: 15000
          });
          const { data } = await axios.get(`https://api.qrserver.com/v1/read-qr-code/?fileurl=`, { timeout: 15000 });
          fs.unlinkSync(imgPath);
          await react('❌');
          return sendBox('QR Decoder', 'QR decoding via API requires a public URL.\nUpload the image somewhere and use: .fromqr with a URL.\nOr use a local QR decoder library.');
        } catch {
          await react('❌');
          return sendBox('QR Decoder', 'Failed to decode QR code.');
        }
      }

      case 'png2webp': {
        if (!m.quoted || !/image|png/.test(m.quoted?.mimetype || '')) {
          await react('❌');
          return sendBox('PNG to WebP', 'Reply to a PNG image with .png2webp');
        }
        try {
          const imgBuf = await client.downloadMediaMessage(m.quoted);
          const tmpDir = path.join(__dirname, 'tmp');
          if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
          const inputPath = path.join(tmpDir, `img_${Date.now()}.png`);
          const outputPath = path.join(tmpDir, `img_${Date.now()}.webp`);
          fs.writeFileSync(inputPath, imgBuf);
          await execAsync(`ffmpeg -i "${inputPath}" -vcodec libwebp -lossless 1 -q:v 80 "${outputPath}" -y`, { timeout: 30000 });
          const outputBuf = fs.readFileSync(outputPath);
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
          await react('✅');
          return client.sendMessage(m.chat, {
            sticker: outputBuf,
            mimetype: 'image/webp'
          }, { quoted: fq });
        } catch (e) {
          await react('❌');
          return sendBox('PNG to WebP', e.message.includes('ffmpeg') ? 'ffmpeg is not installed on this system.' : `Conversion failed: ${e.message}`);
        }
      }

      case 'webp2png': {
        if (!m.quoted || !/webp|sticker/.test(m.quoted?.mimetype || '')) {
          await react('❌');
          return sendBox('WebP to PNG', 'Reply to a WebP sticker/image with .webp2png');
        }
        try {
          const imgBuf = await client.downloadMediaMessage(m.quoted);
          const tmpDir = path.join(__dirname, 'tmp');
          if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
          const inputPath = path.join(tmpDir, `img_${Date.now()}.webp`);
          const outputPath = path.join(tmpDir, `img_${Date.now()}.png`);
          fs.writeFileSync(inputPath, imgBuf);
          await execAsync(`ffmpeg -i "${inputPath}" "${outputPath}" -y`, { timeout: 30000 });
          const outputBuf = fs.readFileSync(outputPath);
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
          await react('✅');
          return client.sendMessage(m.chat, {
            image: outputBuf,
            mimetype: 'image/png',
            caption: `╭─ *WebP to PNG*\n│ Converted successfully\n╰─ Codex-MD`
          }, { quoted: fq });
        } catch (e) {
          await react('❌');
          return sendBox('WebP to PNG', e.message.includes('ffmpeg') ? 'ffmpeg is not installed on this system.' : `Conversion failed: ${e.message}`);
        }
      }

      default: {
        await react('❌');
        return sendBox('Convert More', `Unknown command "${command}".\nAvailable: compress, decompress, binary, frombinary, hex, fromhex, currency, timer, reminder, randomnum, tomp3, tomp4, tobase64, frombase64, toqr, fromqr, png2webp, webp2png`);
      }
    }
  }
};
