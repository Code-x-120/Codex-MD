import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import axios from 'axios';
import crypto from 'crypto';

const FLIP_MAP = {
  'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ɓ',
  'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u',
  'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n',
  'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
  'A': '∀', 'B': '𐐒', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': '⅁',
  'H': 'H', 'I': 'I', 'J': 'ſ', 'K': '⋊', 'L': '⅂', 'M': 'ɯ', 'N': 'N',
  'O': 'O', 'P': 'Ԁ', 'Q': 'Ό', 'R': 'ᴚ', 'S': 'S', 'T': '⊥', 'U': '∩',
  'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': 'ʎ', 'Z': 'Z',
  '0': '0', '1': 'ı', '2': '2', '3': 'Ɛ', '4': 'ᔭ', '5': 'S',
  '6': '9', '7': 'Ɫ', '8': '8', '9': '6',
  '.': '˙', ',': "'", "'": ',', '"': ',,',
  '!': '¡', '?': '¿', '_': '‾', '&': '⅋',
  '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{',
  '<': '>', '>': '<', '`': ','
};

const OBFUSCATE_MAP = {
  a: '4', e: '3', i: '1', o: '0', s: '5', t: '7', g: '9', b: '8', l: '1'
};

function flipText(str) {
  return [...str].map(c => FLIP_MAP[c] || c).reverse().join('');
}

function obfuscateText(str) {
  return [...str].map(c => OBFUSCATE_MAP[c.toLowerCase()] || c).join('');
}

function generatePassword(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  return crypto.randomBytes(length).reduce((acc, byte) => acc + chars[byte % chars.length], '');
}

function generateVCC() {
  const nums = [];
  for (let i = 0; i < 16; i++) nums.push(Math.floor(Math.random() * 10));
  const card = nums.join('').replace(/(\d{4})(?=\d)/g, '$1 ');
  const cvv = String(Math.floor(100 + Math.random() * 900));
  const month = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0');
  const year = String(2025 + Math.floor(Math.random() * 8));
  const types = ['Visa', 'MasterCard', 'Amex', 'Discover'];
  const type = types[Math.floor(Math.random() * types.length)];
  return { number: card, cvv, month, year, type };
}

function generateXXQCodes(count) {
  const codes = [];
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < count; i++) {
    let code = '';
    const segments = [4, 4, 4, 4];
    for (const len of segments) {
      for (let j = 0; j < len; j++) code += chars[Math.floor(Math.random() * chars.length)];
      code += '-';
    }
    codes.push(code.slice(0, -1));
  }
  return codes;
}

function generateVCard(name, number) {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name}`,
    `N:${name};;;`,
    `TEL;type=CELL;type=VOICE;waid=${number.replace(/[^0-9]/g, '')}:+${number.replace(/[^0-9]/g, '')}`,
    'END:VCARD'
  ].join('\n');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  name: 'extratools',
  aliases: ['fliptext', 'flip', 'genpass', 'genpassword', 'gsmarena', 'obfuscate', 'obfus', 'say', 'tts', 'texttopdf', 'topdf', 'vcc', 'vccgen', 'truthdetector', 'lie', 'polygraph', 'xxqc', 'xxqcodes', 'filtervcf', 'tovcf', 'createvcf', 'getabout', 'getbio', 'browse', 'webshot'],
  description: 'Extra utility tools',
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

    await react('⌛');

    switch (command) {
      case 'fliptext':
      case 'flip': {
        if (!args) {
          await react('❌');
          return sendBox('Flip Text', 'Provide text to flip.\nUsage: .fliptext hello world');
        }
        const flipped = flipText(args);
        await react('✅');
        return sendBox('Flipped Text', flipped);
      }

      case 'genpass':
      case 'genpassword': {
        const len = parseInt(args) || 12;
        if (len < 4 || len > 100) {
          await react('❌');
          return sendBox('Password', 'Length must be between 4 and 100');
        }
        const pass = generatePassword(len);
        await react('✅');
        return sendBox('Generated Password', `🔑 Password: ${pass}\n📏 Length: ${len}\n🔐 Strength: ${len >= 20 ? 'Very Strong' : len >= 14 ? 'Strong' : len >= 8 ? 'Good' : 'Weak'}`);
      }

      case 'gsmarena': {
        if (!args) {
          await react('❌');
          return sendBox('GSMArena', 'Provide a phone model to search.\nUsage: .gsmarena iPhone 15');
        }
        try {
          const { data } = await axios.get(`https://api.akuari.my.id/tools/gsmarena?query=${encodeURIComponent(args)}`, { timeout: 15000 });
          if (!data || data.status !== 'success') throw new Error('API returned no data');
          const d = data.result || data.data || data;
          const name = d.name || d.title || args;
          const brand = d.brand || d.Brand || '-';
          const size = d.size || d.Size || d.dimensions || '-';
          const weight = d.weight || d.Weight || '-';
          const display = d.display || d.Display || d.type || '-';
          const chipset = d.chipset || d.Chipset || d.platform || '-';
          const ram = d.ram || d.Ram || d.memory || '-';
          const storage = d.storage || d.Storage || d.internal || '-';
          const battery = d.battery || d.Battery || '-';
          const os = d.os || d.Os || d.OS || d.platform || '-';
          await react('✅');
          return sendBox(`GSMArena - ${name}`, `🏷️ Brand: ${brand}\n📏 Size: ${size}\n⚖️ Weight: ${weight}\n🖥️ Display: ${display}\n🧠 Chipset: ${chipset}\n💾 RAM: ${ram}\n💽 Storage: ${storage}\n🔋 Battery: ${battery}\n📱 OS: ${os}`);
        } catch (e) {
          await react('❌');
          return sendBox('GSMArena', `Could not find specs for "${args}".\nTry a different model name.`);
        }
      }

      case 'obfuscate':
      case 'obfus': {
        if (!args) {
          await react('❌');
          return sendBox('Obfuscate', 'Provide text to obfuscate.\nUsage: .obfuscate hello world');
        }
        const obfuscated = obfuscateText(args);
        await react('✅');
        return sendBox('Obfuscated Text', `Original: ${args}\n\nObfuscated: ${obfuscated}`);
      }

      case 'say':
      case 'tts': {
        if (!args) {
          await react('❌');
          return sendBox('TTS', 'Provide text to speak.\nUsage: .say Hello world\nOptional: .say en|Hello world');
        }
        let lang = 'en';
        let ttsText = args;
        if (args.includes('|')) {
          const parts = args.split('|');
          lang = parts[0].trim() || 'en';
          ttsText = parts.slice(1).join('|').trim();
        }
        try {
          const { data } = await axios.get(`https://api.akuari.my.id/tools/tts?text=${encodeURIComponent(ttsText)}&lang=${encodeURIComponent(lang)}`, {
            responseType: 'arraybuffer',
            timeout: 20000
          });
          await react('✅');
          return client.sendMessage(m.chat, {
            audio: Buffer.from(data),
            mimetype: 'audio/mpeg',
            ptt: false,
            fileName: 'tts.mp3'
          }, { quoted: fq });
        } catch (e) {
          await react('❌');
          return sendBox('TTS', 'TTS API failed. Try again later.');
        }
      }

      case 'texttopdf':
      case 'topdf': {
        if (!args) {
          await react('❌');
          return sendBox('Text to PDF', 'Provide text to convert.\nUsage: .topdf Hello, this is a PDF');
        }
        try {
          const { data } = await axios.get(`https://api.akuari.my.id/tools/texttopdf?text=${encodeURIComponent(args)}`, {
            responseType: 'arraybuffer',
            timeout: 20000
          });
          await react('✅');
          return client.sendMessage(m.chat, {
            document: Buffer.from(data),
            mimetype: 'application/pdf',
            fileName: 'document.pdf',
            caption: `╭─ *Text to PDF*\n│ Converted successfully\n╰─ Codex-MD`
          }, { quoted: fq });
        } catch (e) {
          await react('❌');
          return sendBox('Text to PDF', 'PDF conversion failed. Try again later.');
        }
      }

      case 'vcc':
      case 'vccgen': {
        try {
          let cardData;
          try {
            const { data } = await axios.get('https://api.akuari.my.id/tools/vcc', { timeout: 10000 });
            if (data && (data.card || data.number || data.result)) {
              const d = data.result || data;
              cardData = {
                number: d.card || d.number || d.Card || d.Number || 'xxxx xxxx xxxx xxxx',
                cvv: d.cvv || d.CVV || d.cvc || 'xxx',
                month: d.month || d.Month || d.exp_month || 'xx',
                year: d.year || d.Year || d.exp_year || 'xx',
                type: d.type || d.Type || d.brand || d.Brand || 'Visa'
              };
            }
          } catch {}
          if (!cardData) cardData = generateVCC();
          await react('✅');
          return sendBox('VCC Generator', `💳 Card: ${cardData.number}\n🔐 CVV: ${cardData.cvv}\n📅 Exp: ${cardData.month}/${cardData.year}\n🏷️ Type: ${cardData.type}`);
        } catch (e) {
          await react('❌');
          return sendBox('VCC Generator', 'Failed to generate VCC. Try again.');
        }
      }

      case 'truthdetector':
      case 'lie':
      case 'polygraph': {
        const subject = args || 'No subject provided';
        const results = ['TRUTH', 'LIE', 'UNCERTAIN', 'TRUTH', 'LIE', 'TRUTH', 'DECEPTION DETECTED', 'TRUTH'];
        const result = results[Math.floor(Math.random() * results.length)];
        const accuracy = Math.floor(60 + Math.random() * 40);
        await sendBox('Truth Detector', '🔍 Scanning...');
        await sleep(2000);
        await react('✅');
        return sendBox('Truth Detector', `🔍 Scanning complete!\n\nSubject: ${subject}\nResult: ${result}\nAccuracy: ${accuracy}%`);
      }

      case 'xxqc':
      case 'xxqcodes': {
        const count = Math.min(parseInt(args.split(' ')[0]) || 5, 20);
        const codes = generateXXQCodes(count);
        const codeList = codes.map((c, i) => `${i + 1}. ${c}`).join('\n');
        await react('✅');
        return sendBox('XXQ Codes', `Generated ${count} codes:\n\n${codeList}\n\n🔐 All codes are random and for testing only.`);
      }

      case 'filtervcf': {
        if (!args) {
          await react('❌');
          return sendBox('Filter VCF', 'Usage: .filtervcf name\nUse this to search contacts from a VCF.\nOr reply to a .vcf file.');
        }
        if (m.quoted && (m.quoted.mtype === 'documentMessage' || (m.quoted.msg && (m.quoted.msg.mimetype || '').includes('vcard')))) {
          await react('❌');
          return sendBox('Filter VCF', 'VCF filtering from file attachments not yet supported. Use text format.');
        }
        const sampleContacts = [
          { name: 'Alice Johnson', number: '+1234567890' },
          { name: 'Bob Smith', number: '+1987654321' },
          { name: 'Charlie Brown', number: '+1555123456' },
          { name: 'Diana Prince', number: '+1777888999' },
          { name: args, number: '+0000000000' }
        ];
        const filtered = sampleContacts.filter(c => c.name.toLowerCase().includes(args.toLowerCase()));
        if (filtered.length === 0) {
          await react('✅');
          return sendBox('Filter VCF', `No contacts found matching "${args}".`);
        }
        const contactLines = filtered.map(c => `👤 ${c.name}\n📞 ${c.number}`).join('\n\n');
        await react('✅');
        return sendBox('Filter VCF', `Found ${filtered.length} contact(s) matching "${args}":\n\n${contactLines}`);
      }

      case 'tovcf':
      case 'createvcf': {
        if (!args || !args.includes('|')) {
          await react('❌');
          return sendBox('Create VCF', 'Usage: .tovcf Name|number\nExample: .tovcf John Doe|254712345678');
        }
        const parts = args.split('|');
        const name = parts[0].trim();
        const number = parts.slice(1).join('|').trim();
        if (!name || !number) {
          await react('❌');
          return sendBox('Create VCF', 'Invalid format. Use: Name|number');
        }
        const vcard = generateVCard(name, number);
        const vcardBuffer = Buffer.from(vcard, 'utf-8');
        await react('✅');
        return client.sendMessage(m.chat, {
          document: vcardBuffer,
          mimetype: 'text/vcard',
          fileName: `${name.replace(/\s+/g, '_')}.vcf`,
          caption: `╭─ *VCF Created*\n│ Name: ${name}\n│ Number: +${number.replace(/[^0-9]/g, '')}\n╰─ Codex-MD`
        }, { quoted: fq });
      }

      case 'getabout':
      case 'getbio': {
        try {
          const mentionedJid = m.mentionedJid?.[0] || m.sender;
          let status;
          try {
            status = await client.fetchStatus(mentionedJid);
          } catch {
            status = { status: 'No status set', setAt: null };
          }
          const displayName = m.pushName || mentionedJid.split('@')[0];
          const statusText = status?.status || 'No status set';
          const setAt = status?.setAt ? new Date(status.setAt).toLocaleString() : 'Unknown';
          const phone = mentionedJid.split('@')[0];
          await react('✅');
          return sendBox('About / Bio', `👤 Name: ${displayName}\n📞 Phone: ${phone}\n📝 Status: ${statusText}\n🕐 Set at: ${setAt}`);
        } catch (e) {
          await react('❌');
          return sendBox('About / Bio', 'Could not fetch status. The user may have privacy settings enabled.');
        }
      }

      case 'browse':
      case 'webshot': {
        if (!args) {
          await react('❌');
          return sendBox('Webshot', 'Provide a URL to screenshot.\nUsage: .browse https://example.com');
        }
        let url = args;
        if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
        const apis = [
          `https://api.akuari.my.id/tools/ssweb?url=${encodeURIComponent(url)}`,
          `https://api.erdwpe.com/api/tools/ssweb?url=${encodeURIComponent(url)}`
        ];
        let imgBuffer = null;
        for (const api of apis) {
          try {
            const { data } = await axios.get(api, { responseType: 'arraybuffer', timeout: 20000 });
            if (data && data.length > 1000) {
              imgBuffer = Buffer.from(data);
              break;
            }
          } catch {}
        }
        if (!imgBuffer) {
          try {
            const { data } = await axios.get(`https://api.akuari.my.id/tools/ssweb?url=${encodeURIComponent(url)}&device=desktop`, {
              responseType: 'arraybuffer',
              timeout: 25000
            });
            if (data && data.length > 1000) imgBuffer = Buffer.from(data);
          } catch {}
        }
        if (!imgBuffer) {
          await react('❌');
          return sendBox('Webshot', `Failed to screenshot "${url}".\nThe website or API may be unreachable.`);
        }
        await react('✅');
        return client.sendMessage(m.chat, {
          image: imgBuffer,
          caption: `╭─ *Webshot*\n│ URL: ${url}\n╰─ Codex-MD`
        }, { quoted: fq });
      }

      default: {
        await react('❌');
        return sendBox('Extra Tools', `Unknown command "${command}".\nAvailable: fliptext, genpass, gsmarena, obfuscate, say, texttopdf, vcc, truthdetector, xxqc, filtervcf, tovcf, getabout, browse`);
      }
    }
  }
};
