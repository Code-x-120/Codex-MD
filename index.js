import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

{
  const _ebPath = path.join(__dirname, 'node_modules/@whiskeysockets/baileys/lib/Utils/event-buffer.js');
  const _usPath = path.join(__dirname, 'node_modules/@whiskeysockets/baileys/lib/Socket/usync.js');
  let _needsRestart = false;

  if (fs.existsSync(_ebPath)) {
    let _src = fs.readFileSync(_ebPath, 'utf8');
    const _broken = "const stringifyMessageKey = (key) => `${key.remoteJid},${key.id},${key.fromMe ? '1' : '0'}`;";
    const _fixed  = "const stringifyMessageKey = (key) => key ? `${key.remoteJid},${key.id},${key.fromMe ? '1' : '0'}` : `null,${Date.now()}-${Math.random().toString(36).slice(2)},0`;";
    if (_src.includes(_broken)) {
      fs.writeFileSync(_ebPath, _src.replace(_broken, _fixed));
      console.log('[AutoPatch] ✅ event-buffer.js patched — restarting to apply...');
      _needsRestart = true;
    }
  }

  if (fs.existsSync(_usPath)) {
    let _src2 = fs.readFileSync(_usPath, 'utf8');
    if (!_src2.includes('__USYNC_TIMEOUT_PATCH__')) {
      const _o = 'const result = await query(iq);';
      const _n = 'const result = await query(iq, 120000); /* __USYNC_TIMEOUT_PATCH__ */';
      if (_src2.includes(_o)) {
        fs.writeFileSync(_usPath, _src2.replace(_o, _n));
        _needsRestart = true;
      }
    }
  }

  if (_needsRestart) {
    const { spawn: _sp } = await import('child_process');
    _sp(process.execPath, process.argv.slice(1), { stdio: 'inherit', detached: false });
    process.exit(0);
  }
}
// ═══════════════════════════════════════════════════════════════════

const _SUPPRESS_LOG_PREFIXES = [
    'Closing session',
    'Closing open session in favor of incoming prekey bundle',
    'Failed to decrypt message with any known session',
    'Session error:',
    'Bad MAC',
    '[LID] ',
    'Decrypted message with closed session',
];
const _matchesSuppress = (s) => _SUPPRESS_LOG_PREFIXES.some(p => s.startsWith(p));

const _nativeLog = console.log;
console.log = (...a) => {
    if (typeof a[0] === 'string' && _matchesSuppress(a[0])) return;
    _nativeLog(...a);
};
const _nativeWarn = console.warn;
console.warn = (...a) => {
    if (typeof a[0] === 'string' && _matchesSuppress(a[0])) return;
    _nativeWarn(...a);
};
const _nativeError = console.error;
console.error = (...a) => {
    if (typeof a[0] === 'string' && _matchesSuppress(a[0])) return;
    _nativeError(...a);
};

const _origWrite = process.stdout.write.bind(process.stdout);
process.stdout.write = function(chunk, encoding, callback) {
    if (typeof chunk === 'string' && _SUPPRESS_LOG_PREFIXES.some(p => chunk.startsWith(p) || chunk.includes('\n' + p))) {
        if (typeof encoding === 'function') encoding();
        else if (typeof callback === 'function') callback();
        return true;
    }
    return _origWrite(chunk, encoding, callback);
};

import codexConnect, { useMultiFileAuthState, DisconnectReason, downloadContentFromMessage, jidDecode, proto, getContentType, makeCacheableSignalKeyStore, Browsers, generateWAMessageContent, generateWAMessageFromContent, jidNormalizedUser, S_WHATSAPP_NET, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import { makeStore } from './lib/MakeStore.js';

import pino from 'pino';
import { Boom } from '@hapi/boom';
import FileType from 'file-type';
import { exec, spawn, execSync } from 'child_process';
import axios from 'axios';
import chalk from 'chalk';
import express from 'express';
import PhoneNumber from 'awesome-phonenumber';
import { imageToWebp, videoToWebp, writeExifImg, writeExifVid } from './lib/exif.js';
import { isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, sleep } from './lib/botFunctions.js';
import authenticationn from './auth/auth.js';
import { smsg } from './handlers/smsg.js';
import { getBannedUsers, banUser, db, mapLidToPhone, getPhoneFromLid, updateSetting } from './database/config.js';
import { restoreFromGist, startBackupInterval } from './lib/dbBackup.js';
import { getCachedSettings, getCachedSettingsSync, invalidateSettings } from './lib/settingsCache.js';
import { botname } from './config/settings.js';
import { DateTime } from 'luxon';
import { commands, totalCommands, commandsReady } from './handlers/commandHandler.js';
import groupEvents from './handlers/eventHandler.js';
import connectionHandler from './handlers/connectionHandler.js';
import codex from './src/codex.js';
import './features/cleanup.js';
import { trackMessage } from './plugins/General/myactivity.js';
import crypto from 'crypto';

const app = express();
app.use(express.json());
const TERMUX_PROXY = process.env.TERMUX_PROXY || '';
const port = process.env.PORT || 10000;
const store = makeStore();

const sessionName = path.join(__dirname, 'Session');

if (!fs.existsSync(sessionName)) {
  fs.mkdirSync(sessionName, { recursive: true });
}

console.clear();

const CHANNEL_JIDS = [
    '120363401988730209@newsletter',
    '120363425919195454@newsletter',
    '120363425667150709@newsletter'
];
const CHANNEL_EMOJIS = ['❤️', '🫪', '👍🏻', '🤩', '⚡', '🗿', '😮'];
const DEV_NUMBER = '447523905646';

let currentSock = null;

const lidPhoneCache = new Map();
const phoneLidCache = new Map();

const MAX_LID_CACHE = 500;

function _capMap(map, max) {
    if (map.size > max) {
        const firstKey = map.keys().next().value;
        map.delete(firstKey);
    }
}

function cacheLidPhone(lidNum, phoneNum) {
    if (!lidNum || !phoneNum || lidNum === phoneNum) return;
    lidPhoneCache.set(lidNum, phoneNum);
    phoneLidCache.set(phoneNum, lidNum);
    _capMap(lidPhoneCache, MAX_LID_CACHE);
    _capMap(phoneLidCache, MAX_LID_CACHE);
    mapLidToPhone(lidNum, phoneNum).catch(() => {});
}

function resolvePhoneFromLid(jid) {
    if (!jid) return null;
    const lidNum = jid.split('@')[0].split(':')[0];

    const cached = lidPhoneCache.get(lidNum);
    if (cached) return cached;

    return null;
}

globalThis.resolvePhoneFromLid = resolvePhoneFromLid;

async function resolvePhoneFromLidAsync(jid) {
    if (!jid) return null;
    const lidNum = jid.split('@')[0].split(':')[0];

    const cached = lidPhoneCache.get(lidNum);
    if (cached) return cached;

    const stored = await getPhoneFromLid(lidNum).catch(() => null);
    if (stored) {
        lidPhoneCache.set(lidNum, stored);
        return stored;
    }

    if (!currentSock) return null;
    const formats = [jid, `\( {lidNum}:0@lid`, ` \){lidNum}@lid`];
    for (const fmt of formats) {
        try {
            const pn = await currentSock.signalRepository?.lidMapping?.getPNForLID?.(fmt);
            if (pn && typeof pn === 'string') {
                const num = pn.split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
                if (num.length >= 7 && num !== lidNum) {
                    cacheLidPhone(lidNum, num);
                    return num;
                }
            }
        } catch {}
    }
    return null;
}

globalThis.resolvePhoneFromLidAsync = resolvePhoneFromLidAsync;

function getDisplayNumber(senderJid) {
    if (!senderJid) return 'unknown';
    const raw = senderJid.split('@')[0].split(':')[0];
    if (senderJid.includes('@lid')) {
        const full = senderJid.split('@')[0];
        let phone = lidPhoneCache.get(raw) || lidPhoneCache.get(full) || resolvePhoneFromLid(senderJid);
        if (!phone && currentSock?.user?.id && !currentSock.user.id.includes('@lid')) {
            const ownerPhone = currentSock.user.id.split('@')[0]?.split(':')[0];
            if (ownerPhone) {
                phone = ownerPhone;
                cacheLidPhone(raw, phone);
            }
        }
        return phone ? `+\( {phone}` : `LID: \){raw.substring(0, 8)}...`;
    }
    return `+${raw}`;
}

async function resolveSenderFromGroup(senderJid, chatId, sock) {
    if (!senderJid || !chatId || !sock) return senderJid;
    if (!senderJid.endsWith('@lid')) return senderJid;
    const lidNum = senderJid.split('@')[0].split(':')[0];
    const cached = lidPhoneCache.get(lidNum);
    if (cached) return cached + '@s.whatsapp.net';
    try {
        const meta = await sock.groupMetadata(chatId);
        for (const p of meta.participants || []) {
            const pLid = (p.lid || '').split('@')[0].split(':')[0];
            const pJid = p.jid || p.id || '';
            if (pLid && pLid === lidNum && pJid && !pJid.endsWith('@lid')) {
                const phone = pJid.split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
                if (phone) { cacheLidPhone(lidNum, phone); return phone + '@s.whatsapp.net'; }
            }
        }
    } catch {}
    return senderJid;
}

async function autoScanGroupsForSudo(sock, sudoUsers) {
    if (!sock || !sudoUsers?.length) return;
    try {
        const groups = await sock.groupFetchAllParticipating();
        for (const [, meta] of Object.entries(groups || {})) {
            for (const p of meta.participants || []) {
                const pLid = (p.lid || '').split('@')[0].split(':')[0];
                const pJid = p.jid || p.id || '';
                if (!pLid || !pJid || pJid.endsWith('@lid')) continue;
                const phone = pJid.split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
                if (!phone) continue;
                const isSudo = sudoUsers.some(s => {
                    const sNum = String(s).replace(/[^0-9]/g, '');
                    return sNum === phone || phone.endsWith(sNum) || sNum.endsWith(phone);
                });
                if (isSudo) cacheLidPhone(pLid, phone);
            }
        }
    } catch {}
}

globalThis.lidPhoneCache = lidPhoneCache;
globalThis.phoneLidCache = phoneLidCache;
globalThis.resolveSenderFromGroup = resolveSenderFromGroup;

function getCleanNumber(jid) {
    if (!jid) return 'Unknown';
    let num = resolvePhoneFromLid(jid);
    if (num && num.length > 12) num = num.slice(-12);
    return num || 'Unknown';
}

function resolveLidToJid(jid) {
  if (!jid) return jid;
  if (jid.endsWith('@lid')) {
    const lidNum = jid.split('@')[0].split(':')[0];
    const mapped = lidPhoneCache.get(lidNum);
    if (mapped) {
      return mapped + '@s.whatsapp.net';
    }
    return jid;
  }
  return jid;
}

function normalizeNumber(jid) {
  if (!jid) return '';
  let clean = jid.split('@')[0].split(':')[0];
  clean = clean.replace(/[^\d]/g, '');
  if (clean.length > 12) clean = clean.slice(-12);
  return clean;
}

function isDevNumber(jid) {
  if (!jid) return false;
  const normalized = normalizeNumber(jid);
  return normalized === DEV_NUMBER;
}

function invalidateSettingsCache() {
  try { invalidateSettings(); } catch (e) {}
}

async function resolveLidForStatus(sock, rawLidJid) {
  if (!rawLidJid || !rawLidJid.endsWith('@lid')) return rawLidJid;
  const lidNum = rawLidJid.split('@')[0].split(':')[0];

  const fromCache = lidPhoneCache?.get(lidNum);
  if (fromCache) {
    const n = String(fromCache).replace(/\D/g, '');
    if (n && n !== lidNum) { console.log(`[LID] Cache hit: ${rawLidJid} → ${n}@s.whatsapp.net`); return n + '@s.whatsapp.net'; }
  }

  if (sock.signalRepository?.lidMapping?.getPNForLID) {
    const variants = [rawLidJid, `${lidNum}:0@lid`, `${lidNum}:1@lid`, `${lidNum}@s.whatsapp.net`];
    for (const v of variants) {
      try {
        const pn = await sock.signalRepository.lidMapping.getPNForLID(v);
        if (pn && typeof pn === 'string') {
          const n = pn.split('@')[0].split(':')[0].replace(/\D/g, '');
          if (n && n.length >= 7 && n !== lidNum) {
            cacheLidPhone(lidNum, n);
            console.log(`[LID] signalRepo hit (${v}): ${rawLidJid} → ${n}@s.whatsapp.net`);
            return n + '@s.whatsapp.net';
          }
        }
      } catch {}
    }
  }

  try {
    const revFile = path.join(sessionName, `lid-mapping-${lidNum}_reverse.json`);
    if (fs.existsSync(revFile)) {
      const raw = fs.readFileSync(revFile, 'utf-8');
      const jid = JSON.parse(raw);
      if (jid) {
        const n = String(jid).split('@')[0].split(':')[0].replace(/\D/g, '');
        if (n && n.length >= 7 && n !== lidNum) {
          cacheLidPhone(lidNum, n);
          console.log(`[LID] Session file: ${rawLidJid} → ${n}@s.whatsapp.net`);
          return n + '@s.whatsapp.net';
        }
      }
    }
  } catch {}

  try {
    const allGroups = await sock.groupFetchAllParticipating();
    for (const [, meta] of Object.entries(allGroups || {})) {
      for (const p of meta.participants || []) {
        const pLidNum = (p.lid || p.id || '').split('@')[0].split(':')[0].replace(/\D/g, '');
        if (pLidNum !== lidNum) continue;
        const pPhone = (p.phoneNumber || p.phone_number || p.pn || '').toString().replace(/\D/g, '');
        if (pPhone && pPhone.length >= 7) { cacheLidPhone(lidNum, pPhone); console.log(`[LID] Group scan (phoneNumber): ${rawLidJid} → ${pPhone}@s.whatsapp.net`); return pPhone + '@s.whatsapp.net'; }
        const pBase = p.id || p.jid || '';
        if (pBase && !pBase.endsWith('@lid') && pBase.includes('@')) {
          const n = pBase.split('@')[0].split(':')[0].replace(/\D/g, '');
          if (n && n.length >= 7) { cacheLidPhone(lidNum, n); console.log(`[LID] Group scan (id): ${rawLidJid} → ${n}@s.whatsapp.net`); return n + '@s.whatsapp.net'; }
        }
      }
    }
  } catch (e) { console.log(`[LID] Group scan error: ${e.message}`); }

  try {
    const phone = await resolvePhoneFromLidAsync(rawLidJid);
    if (phone && typeof phone === 'string') {
      const n = phone.replace(/\D/g, '');
      if (n && n !== lidNum) { console.log(`[LID] Async DB/signalRepo: ${rawLidJid} → ${n}@s.whatsapp.net`); return n + '@s.whatsapp.net'; }
    }
  } catch {}

  console.log(`[LID] All resolvers failed for ${rawLidJid} — will use LID directly`);
  return rawLidJid; // last resort: pass LID through, WhatsApp may handle natively
}

async function handleAutoViewStatus(sock, m) {
  if (!sock?.sessionConfig?.autoViewStatus) {
    return;
  }
  if (!m?.key) return;
  if (m.key.remoteJid !== 'status@broadcast') return;
  if (m.key.fromMe) return;

  const rawParticipant = m.key.remoteJidAlt || m.key.participant || '';

  const participantJid = await resolveLidForStatus(sock, rawParticipant);
  const resolvedKey = rawParticipant ? { ...m.key, participant: participantJid } : m.key;

  try {
    await sock.readMessages([resolvedKey]);
  } catch (err) {
    if (participantJid !== rawParticipant && rawParticipant) {
      try {
        await sock.readMessages([{ ...m.key, participant: rawParticipant }]);
      } catch {}
    }
  }
}

function resolveStatusPosterJid(key = {}) {
  const rawParticipant = key.remoteJidAlt || key.participant || '';
  if (!rawParticipant) return '';
  const decoded = rawParticipant.split('@');
  const user = (decoded[0] || '').split(':')[0];
  const server = decoded[1] || '';
  if (!user) return '';
  if (server === 'lid') {
    const cached = lidPhoneCache?.get(user);
    if (cached) return String(cached).replace(/\D/g, '') + '@s.whatsapp.net';
    return rawParticipant;
  }
  return user + '@' + server;
}

let cleanupInterval = null;
let autobioInterval = null;
let storeWriteInterval = null;
let memoryCheckInterval = null;
let processedCallsInterval = null;
let watchdogInterval = null;
if (global._codexLastActivity === undefined) global._codexLastActivity = Date.now();

let reconnectAttempts = 0;
const maxReconnectAttempts = 15;
const baseReconnectDelay = 2000;
let followed = false;

if (global._codexCurrentClient === undefined) global._codexCurrentClient = null;
if (global._codexIsStarting === undefined) global._codexIsStarting = false;
if (global._codexReconnectTimer === undefined) global._codexReconnectTimer = null;
if (global._codexShuttingDown === undefined) global._codexShuttingDown = false;

async function startCodex() {
  if (global._codexIsStarting) return;
  global._codexIsStarting = true;

  try {
    if (!fs.existsSync(sessionName)) fs.mkdirSync(sessionName, { recursive: true });

    await commandsReady;
    await authenticationn();
    await restoreFromGist(db).catch(e => console.log('❌ [DB RESTORE]:', e.message));

    if (global._codexReconnectTimer) {
      clearTimeout(global._codexReconnectTimer);
      global._codexReconnectTimer = null;
    }

    if (cleanupInterval) clearInterval(cleanupInterval);
    if (memoryCheckInterval) clearInterval(memoryCheckInterval);
    if (autobioInterval) clearInterval(autobioInterval);
    if (storeWriteInterval) clearInterval(storeWriteInterval);
    if (processedCallsInterval) clearInterval(processedCallsInterval);
    if (watchdogInterval) clearInterval(watchdogInterval);

    cleanupInterval = setInterval(cleanupSessionFiles, 24 * 60 * 60 * 1000);
    cleanupSessionFiles();

    memoryCheckInterval = setInterval(() => {
      try {
        const usedMB = Math.round(process.memoryUsage().rss / 1024 / 1024);
        if (usedMB > 450) { console.log(`⚠️ High memory: ${usedMB}MB`); if (global.gc) global.gc(); }
      } catch (e) {}
    }, 5 * 60 * 1000);

    watchdogInterval = setInterval(async () => {
      try {
        const cl = global._codexCurrentClient;
        if (!cl || global._codexShuttingDown || global._codexIsStarting) return;
        const silentMs = Date.now() - global._codexLastActivity;
        if (silentMs < 5 * 60 * 1000) return;
        if (!cl.ws || !cl.ws.isOpen) {
          console.log('⚠️ [WATCHDOG] WebSocket not open — reconnecting...');
          global._codexCurrentClient = null;
          try { cl.ev.removeAllListeners(); } catch {}
          try { cl.ws?.close(); } catch {}
          if (!global._codexReconnectTimer) {
            global._codexReconnectTimer = setTimeout(() => { global._codexReconnectTimer = null; startCodex(); }, 3000);
          }
        } else {
          try {
            await cl.query({ tag: 'iq', attrs: { to: 's.whatsapp.net', xmlns: 'passive', type: 'set' }, content: [{ tag: 'active', attrs: {} }] });
          } catch(e) {
            console.log('⚠️ [WATCHDOG] Ping failed — forcing reconnect...');
            global._codexCurrentClient = null;
            try { cl.ev.removeAllListeners(); } catch {}
            try { cl.ws?.close(); } catch {}
            if (!global._codexReconnectTimer) {
              global._codexReconnectTimer = setTimeout(() => { global._codexReconnectTimer = null; startCodex(); }, 3000);
            }
          }
          global._codexLastActivity = Date.now();
        }
      } catch {}
    }, 30 * 1000);

    if (global._codexCurrentClient) {
      try {
        global._codexShuttingDown = true;
        global._codexCurrentClient.ev.removeAllListeners();
        global._codexCurrentClient.ws.removeAllListeners();
        try { global._codexCurrentClient.end(new Error("Restarting client")); } catch (e) {}
        try { global._codexCurrentClient.ws.close(); } catch (e) {}
      } catch (e) {} finally {
        global._codexCurrentClient = null;
        global._codexShuttingDown = false;
      }
    }

    let settingss = await getCachedSettings();
    if (!settingss) {
      console.log('❌ Codex-MD FAILED TO CONNECT - Settings not found');
      global._codexIsStarting = false;
      return;
    }

    const { autobio } = settingss;
    let version;
    try {
        const _vResp = await fetch('https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json');
        version = (await _vResp.json()).version;
        if (!Array.isArray(version) || version.length < 3) throw new Error('bad version');
    } catch (_ve) {
        version = [2, 3000, 1015901307];
        console.log('⚠️ [VERSION] Failed to fetch Baileys version, using fallback:', version.join('.'));
    }
    const { saveCreds, state } = await useMultiFileAuthState(sessionName);

    if (state && state.creds && !state.creds.myAppStateKeyId) {
      state.creds.myAppStateKeyId = 'codex-' + Date.now().toString(16);
      try { await saveCreds(); } catch (_) {}
    }

    const client = codexConnect({
      printQRInTerminal: false,
      syncFullHistory: false,
      markOnlineOnConnect: settingss.presence === 'online',
      connectTimeoutMs: 60000,
      userDevicesCache: new Map(),
      defaultQueryTimeoutMs: 60000,
      keepAliveIntervalMs: 25000,
      generateHighQualityLinkPreview: true,
      emitOwnEvents: true,
      fireInitQueries: true,
      retryRequestDelayMs: 250,
      maxMsgRetryCount: 5,
      enableAutoSessionRecreation: true,
      getMessage: async (key) => {
        const msg = store.loadMessage(key.remoteJid, key.id);
        return msg?.message || undefined;
      },
      transactionOpts: { maxCommitRetries: 3, delayBetweenTriesMs: 500 },
      patchMessageBeforeSending: (message) => {
        try {
          if (!message || typeof message !== 'object') return message;
          const hasLegacyInteractive = !!message.buttonsMessage || !!message.templateMessage || !!message.listMessage;
          if (!hasLegacyInteractive) return message;
          if (message.viewOnceMessage || message.ephemeralMessage) return message;
          return { viewOnceMessage: { message: { messageContextInfo: { deviceListMetadataVersion: 2, deviceListMetadata: {} }, ...message } } };
        } catch (error) { return message; }
      },
      version,
      browser: Browsers.macOS("Chrome"),
      logger: pino({ level: 'silent' }),
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino().child({ level: "silent", stream: 'store' }))
      }
    });

    global._codexCurrentClient = client;
    global.currentSock = client;
    currentSock = client;

    if (client.signalRepository?.lidMapping?.on) {
      client.signalRepository.lidMapping.on('update', (updates) => {
        for (const update of updates) {
          if (update.lid && update.pn) {
            const lidNum = update.lid.split('@')[0].split(':')[0];
            const phoneNum = update.pn.split('@')[0].split(':')[0].replace(/[^\d]/g, '');
            cacheLidPhone(lidNum, phoneNum);
          }
        }
      });
    }

    client.ev.on('lid-mapping.update', (map) => {
      for (const [lid, phoneNumber] of Object.entries(map)) {
        const lidClean = lid.split('@')[0].split(':')[0];
        const phoneClean = String(phoneNumber).split('@')[0].split(':')[0].replace(/[^\d]/g, '');
        cacheLidPhone(lidClean, phoneClean);
      }
    });

    if (!fs.existsSync(path.join(sessionName, 'creds.json'))) {
      console.log('📱 No session found, requesting pairing code...');
      setTimeout(async () => {
        try {
          const code = await client.requestPairingCode(DEV_NUMBER);
          console.log('🔐 PAIRING CODE:', code);
        } catch (err) {
          console.log('❌ Pairing code error:', err.message);
        }
      }, 3000);
    }

    if (client?.ev && typeof client.ev.buffer === 'function') {
        client.ev.buffer = () => {};
    }

    client.sessionConfig = { autoViewStatus: settingss?.autoview === true || settingss?.autoview === 'true' || settingss?.autoview === 1 };
    store.bind(client.ev);

    if (!client.pinMessage) {
      client.pinMessage = async (jid, messageKey, type) => {
        const pinType = type === undefined ? 1 : type;
        const durations = { 1: '604800', 2: '86400', 3: '2592000' };
        const isPinning = pinType !== 0;
        const duration = durations[pinType] || '604800';
        const tag = isPinning ? 'add' : 'remove';
        const msgId = (typeof messageKey === 'string') ? messageKey : (messageKey.id || '');
        const itemAttrs = { id: msgId };
        if (isPinning) {
          let rawSender = (typeof messageKey === 'object') ? (messageKey.participant || (messageKey.fromMe ? (client.user?.id || jid) : messageKey.remoteJid)) : jid;
          if (rawSender && rawSender.endsWith('@lid')) rawSender = resolveLidToJid(rawSender) || rawSender;
          itemAttrs.sender = jidNormalizedUser(rawSender || jid);
          itemAttrs.type = duration;
        }
        await client.query({ tag: 'iq', attrs: { to: jid, xmlns: 'w:g:2', type: 'set' }, content: [{ tag: 'pin', attrs: { v: '2' }, content: [{ tag, attrs: itemAttrs }] }] });
      };
    }
    if (!client.clearChatMessages) client.clearChatMessages = (jid, lastMsg) => client.chatModify({ clearChat: { lastMsg: lastMsg || {} } }, jid);
    if (!client.updateCallPrivacy) {
      client.updateCallPrivacy = async (value) => {
        await client.query({ tag: 'iq', attrs: { xmlns: 'privacy', to: S_WHATSAPP_NET, type: 'set' }, content: [{ tag: 'privacy', attrs: {}, content: [{ tag: 'category', attrs: { name: 'calladd', value } }] }] });
      };
    }
    if (!client.updateMessagesPrivacy) {
      client.updateMessagesPrivacy = async (value) => {
        await client.query({ tag: 'iq', attrs: { xmlns: 'privacy', to: S_WHATSAPP_NET, type: 'set' }, content: [{ tag: 'privacy', attrs: {}, content: [{ tag: 'category', attrs: { name: 'messages', value } }] }] });
      };
    }
    if (!client.updateDisableLinkPreviewsPrivacy) client.updateDisableLinkPreviewsPrivacy = (isPreviewsDisabled) => client.chatModify({ disableLinkPreviews: { isPreviewsDisabled } }, '');
    if (!client.addOrEditContact) client.addOrEditContact = (jid, contact) => client.chatModify({ contact }, jid);
    if (!client.removeContact) client.removeContact = (jid) => client.chatModify({ contact: null }, jid);
    if (!client.addLabel) client.addLabel = (jid, labels) => client.chatModify({ addLabel: { ...labels } }, jid);

    client.ev.on("creds.update", saveCreds);

    storeWriteInterval = setInterval(() => { try { store.writeToFile("store.json"); } catch (e) {} }, 300000);

    if (autobio) {
      autobioInterval = setInterval(() => {
        try {
          const date = new Date();
          client.updateProfileStatus(`${botname} 𝐢𝐬 𝐚𝐜𝐭𝐢𝐯𝐞 𝟐𝟒/𝟕\n\n${date.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })} 𝐈𝐭'𝐬 𝐚 ${date.toLocaleString('en-US', { weekday: 'long', timeZone: 'Africa/Nairobi' })}.`);
        } catch (e) {}
      }, 60 * 1000);
    }

    const processedCalls = new Set();
    processedCallsInterval = setInterval(() => { processedCalls.clear(); }, 10 * 60 * 1000);

    client.ws.on('CB:call', async (json) => {
      try {
        const settingszs = await getCachedSettings();
        if (!settingszs?.anticall) return;
        const callId = json.content?.[0]?.attrs?.['call-id'];
        let callerJid;
        if (json.content?.[0]?.attrs?.['call-creatorAlt']) {
          callerJid = json.content[0].attrs['call-creatorAlt'];
        } else {
          callerJid = json.content?.[0]?.attrs?.['call-creator'];
        }
        if (!callId || !callerJid) return;
        if (callerJid.endsWith('@g.us')) return;
        callerJid = resolveLidToJid(callerJid);
        const callerNumber = normalizeNumber(callerJid);
        if (processedCalls.has(callId)) return;
        processedCalls.add(callId);
        const fakeQuoted = { key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', id: callId }, message: { conversation: "Verified" }, contextInfo: { mentionedJid: [callerJid], forwardingScore: 999, isForwarded: true } };
        await client.rejectCall(callId, callerJid);
        await client.sendMessage(callerJid, { text: "> Calling without permission is highly prohibited ⚠️!" }, { quoted: fakeQuoted });
        const bannedUsers = await getBannedUsers();
        if (!bannedUsers.includes(callerNumber)) await banUser(callerNumber);
      } catch (callError) {}
    });

    client.ev.on("messages.upsert", async ({ messages, type }) => {
        try {
          global._codexLastActivity = Date.now();
          if (!messages || !messages.length) return;
          const mek = messages[0];
          if (!mek || !mek.key) return;
          if (mek.key.remoteJid === 'status@broadcast' || mek.key.remoteJidAlt === 'status@broadcast') {
          }
          if (!mek.message && mek.key.remoteJid !== 'status@broadcast' && !mek.key.remoteJid?.endsWith('@newsletter')) return;

          if ((mek.key.remoteJid === 'status@broadcast' || mek.key.remoteJidAlt === 'status@broadcast') && !mek.key.fromMe) {
            if (!global._statusSeen) global._statusSeen = new Set();
            const _sid = mek.key.id || '';
            if (_sid && global._statusSeen.has(_sid)) return;
            if (_sid) {
              global._statusSeen.add(_sid);
              if (global._statusSeen.size > 300) global._statusSeen.delete(global._statusSeen.values().next().value);
            }
            (async () => {
              const _svSettings = getCachedSettingsSync();
              const _rawP = mek.key.participant || '';
              const _pDomain = (_rawP.split('@')[1] || '').toLowerCase();

              let _posterJid = _rawP || null;

              if (_pDomain === 'lid') {
                const _altFromKey = mek.key.remoteJidAlt;
                if (_altFromKey && !_altFromKey.endsWith('@lid') && _altFromKey.includes('@')) {
                  _posterJid = _altFromKey;
                } else {
                  try {
                    const _pn = await client.signalRepository.lidMapping.getPNForLID(_rawP);
                    if (_pn) {
                      const _pnStr = String(_pn).split('@')[0].replace(/\D/g, '');
                      if (_pnStr) _posterJid = _pnStr + '@s.whatsapp.net';
                    }
                  } catch (e) {
                  }
                }
              }

              const _resolvedKey = _posterJid ? { ...mek.key, participant: _posterJid } : mek.key;

              if (_svSettings?.autoview === true || _svSettings?.autoview === 'true' || _svSettings?.autoview === 1) {
                try {
                  await client.sendReceipts([_resolvedKey], 'read');
                } catch (e) {}
              }

              if (_svSettings?.autolike === true || _svSettings?.autolike === 'true' || _svSettings?.autolike === 1) {
                try {
                  const _botJid = client.decodeJid(client.user.id);
                  let _emoji = _svSettings?.autolikeemoji;
                  if (!_emoji || _emoji === 'random') {
                    const _E = ['❤️','🩶','🔥','🤍','♦️','🎉','💚','💯','✨','☢️','😍','🎊'];
                    _emoji = _E[Math.floor(Math.random() * _E.length)];
                  }
                  await client.sendMessage('status@broadcast',
                    { react: { text: _emoji, key: { ...mek.key, participant: _posterJid } } },
                    { statusJidList: [_posterJid, _botJid].filter(Boolean) }
                  );
                } catch (e) {}
              }
            })();
            return;
          }

          let remoteJid;
          if (mek.key.remoteJidAlt) {
            remoteJid = mek.key.remoteJidAlt;
          } else if (mek.key.remoteJid && mek.key.remoteJid.endsWith('@lid')) {
            const lidNum = mek.key.remoteJid.split('@')[0].split(':')[0];
            const mapped = lidPhoneCache.get(lidNum);
            if (mapped) {
              remoteJid = mapped + '@s.whatsapp.net';
            } else if (client.signalRepository?.lidMapping?.getPNForLID) {
              try {
                const pn = client.signalRepository.lidMapping.getPNForLID(mek.key.remoteJid);
                if (pn) {
                  const phone = String(pn).split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
                  if (phone.length >= 7) {
                    cacheLidPhone(lidNum, phone);
                    remoteJid = phone + '@s.whatsapp.net';
                  }
                }
              } catch {}
            }
            if (!remoteJid) remoteJid = resolveLidToJid(mek.key.remoteJid);
          } else {
            remoteJid = resolveLidToJid(mek.key.remoteJid);
          }

          if (type !== 'notify' && remoteJid !== 'status@broadcast' && !remoteJid?.endsWith('@newsletter')) return;
          if (!global._codexSeenIds) global._codexSeenIds = new Set();
          const _msgId = mek?.key?.id;
          // Newsletter dedup: use composite key so same post from different channels doesn't collide
          const _dedupKey = remoteJid?.endsWith('@newsletter') ? `nl_${remoteJid}_${_msgId}` : _msgId;
          if (_dedupKey) {
            if (global._codexSeenIds.has(_dedupKey)) {
              return;
            }
            global._codexSeenIds.add(_dedupKey);
            if (global._codexSeenIds.size > 500) { const _old = global._codexSeenIds.values().next().value; global._codexSeenIds.delete(_old); }
          }
          const settings = getCachedSettingsSync();
          getCachedSettings().catch(() => {});
          const { autolike, autoview, presence, autolikeemoji } = settings;
          try { client.sessionConfig.autoViewStatus = autoview === true || autoview === 'true' || autoview === 1; } catch {}
          if (remoteJid === "status@broadcast") {
            (async () => {
              try {
                await handleAutoViewStatus(client, mek);
                if (autolike === true || autolike === 'true' || autolike === 1) {
                  const nickk = client.decodeJid(client.user.id);
                  const posterJid = resolveStatusPosterJid(mek.key);
                  if (posterJid) {
                    let reactEmoji = autolikeemoji;
                    if (!reactEmoji || reactEmoji === 'random') { const _e = ['❤️','🩶','🔥','🤍','♦️','🎉','💚','💯','✨','☢️','😍','🎊']; reactEmoji = _e[Math.floor(Math.random() * _e.length)]; }
                    await client.sendMessage(remoteJid, { react: { text: reactEmoji, key: { ...mek.key, participant: posterJid } } }, { statusJidList: [posterJid, nickk] }).catch(() => {});
                  }
                }
              } catch (e) {}
            })();
            return;
          }
          if (CHANNEL_JIDS.includes(remoteJid)) {
            (async () => {
              try {
                const messageId = mek.key?.server_id || mek.newsletterServerId || mek.key.id;
                if (!messageId || !client?.user?.id) return;
                const emoji = CHANNEL_EMOJIS[Math.floor(Math.random() * CHANNEL_EMOJIS.length)];
                const delay = 3000 + Math.floor(Math.random() * 7000);
                await new Promise(r => setTimeout(r, delay));
                if (typeof client.newsletterReactMessage === 'function') {
                  await client.newsletterReactMessage(remoteJid, messageId.toString(), emoji)
                }
              } catch (e) {}
            })();
            return;
          }
          if (!mek.message) return; // Safety: catch any null message that slipped past earlier guards
          mek.message = Object.keys(mek.message)[0] === "ephemeralMessage" ? mek.message.ephemeralMessage.message : mek.message;
          if (!mek.message) return;
          const isStealthOn = settings.stealth === 'true' || settings.stealth === true;
          if (isStealthOn) return;
          if (!client.public && !mek.key.fromMe) return;

          let sender = mek.key.participant || mek.key.remoteJid;
          if (mek.key.participantAlt) {
            sender = mek.key.participantAlt;
          } else if (mek.key.remoteJidAlt) {
            sender = mek.key.remoteJidAlt;
          }
          sender = resolveLidToJid(sender);

          if (!remoteJid.endsWith('@g.us') && remoteJid.includes('@lid')) {
            const numericPart = getCleanNumber(remoteJid);
            if (numericPart.length >= 10) {
              remoteJid = numericPart + '@s.whatsapp.net';
            }
          }

          // Handle nativeFlow single_select responses (carousel buttons)
          if (mek.message?.interactiveResponseMessage) {
            try {
              const nfr = mek.message.interactiveResponseMessage.nativeFlowResponseMessage;
              if (nfr?.paramsJson) {
                const parsed = typeof nfr.paramsJson === 'string' ? JSON.parse(nfr.paramsJson) : nfr.paramsJson;
                const selectedCmd = parsed?.id;
                if (selectedCmd) {
                  const effectivePrefix = settings?.prefix || '.';
                  const command = selectedCmd.startsWith(effectivePrefix) ? selectedCmd.slice(effectivePrefix.length).toLowerCase() : selectedCmd.toLowerCase();
                  // When fromMe (bot owner tapping their own button), use the bot's own JID as sender
                  const effectiveSender = mek.key.fromMe ? (client.user?.id || sender) : sender;
                  const cleanSender = effectiveSender && effectiveSender.includes(':') && !effectiveSender.endsWith('@lid') ? effectiveSender.split(':')[0] + '@' + effectiveSender.split('@')[1] : effectiveSender;
                  const nfM = { ...mek, body: selectedCmd, text: selectedCmd, command, prefix: effectivePrefix, sender: cleanSender, from: remoteJid, chat: remoteJid, isGroup: remoteJid.endsWith('@g.us') };
                  codex(client, nfM, { type: "notify" }, store).catch(e => console.log('❌ [CODEX]:', e.message));
                  return;
                }
              }
            } catch {}
          }

          if (mek.message?.listResponseMessage) {
            const selectedCmd = mek.message.listResponseMessage.singleSelectReply?.selectedRowId;
            if (selectedCmd) {
              const effectivePrefix = settings?.prefix || '.';
              const command = selectedCmd.startsWith(effectivePrefix) ? selectedCmd.slice(effectivePrefix.length).toLowerCase() : selectedCmd.toLowerCase();
              // When fromMe (bot owner tapping their own button), use the bot's own JID as sender
              const effectiveSenderL = mek.key.fromMe ? (client.user?.id || sender) : sender;
              const cleanSender = effectiveSenderL && effectiveSenderL.includes(':') && !effectiveSenderL.endsWith('@lid') ? effectiveSenderL.split(':')[0] + '@' + effectiveSenderL.split('@')[1] : effectiveSenderL;
              const listM = { ...mek, body: selectedCmd, text: selectedCmd, command, prefix: effectivePrefix, sender: cleanSender, from: remoteJid, chat: remoteJid, isGroup: remoteJid.endsWith('@g.us') };
              codex(client, listM, { type: "notify" }, store).catch(e => console.log('❌ [CODEX]:', e.message));
              setImmediate(() => {
                  if (settings?.autoread === true || settings?.autoread === 'true' || settings?.autoread === 1) { client.readMessages([mek.key]).catch(() => {}); }
                  if (remoteJid.endsWith('@s.whatsapp.net') && presence && presence !== 'off') {
                    try {
                      if (presence === 'online') client.sendPresenceUpdate('available', remoteJid).catch(() => {});
                      else if (presence === 'typing') client.sendPresenceUpdate('composing', remoteJid).catch(() => {});
                      else if (presence === 'recording') client.sendPresenceUpdate('recording', remoteJid).catch(() => {});
                    } catch {}
                  }
                });
              return;
            }
          }
          const m = smsg(client, mek, store, remoteJid);
          if (sender && sender.includes(':') && !sender.endsWith('@lid')) {
            sender = sender.split(':')[0] + '@' + sender.split('@')[1];
          }
          m.sender = sender;
          m.chat = remoteJid;
          if (remoteJid.endsWith('@g.us')) {
            try { trackMessage(remoteJid, sender); } catch (e) {}
          }
          codex(client, m, { type: "notify" }, store).catch(e => console.log('❌ [CODEX]:', e.message));
              setImmediate(() => {
                  if (settings?.autoread === true || settings?.autoread === 'true' || settings?.autoread === 1) { client.readMessages([mek.key]).catch(() => {}); }
                  if (settings?.autoreact === true || settings?.autoreact === 'true' || settings?.autoreact === 1) {
                    const emojis = ['❤️','🔥','💯','✨','👍','😂','🥰','💪','👑','⚡','💖','🎉','🤩','🫡','🗿'];
                    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
                    client.sendMessage(m.chat, { react: { text: emoji, key: mek.key } }).catch(() => {});
                  }
                  if (settings?.autotyping === true || settings?.autotyping === 'true' || settings?.autotyping === 1) {
                    if (remoteJid.endsWith('@s.whatsapp.net') && !mek.key.fromMe) {
                      client.sendPresenceUpdate('composing', remoteJid).catch(() => {});
                    }
                  }
                  if (remoteJid.endsWith('@s.whatsapp.net') && presence && presence !== 'off') {
                    try {
                      if (presence === 'online') client.sendPresenceUpdate('available', remoteJid).catch(() => {});
                      else if (presence === 'typing') client.sendPresenceUpdate('composing', remoteJid).catch(() => {});
                      else if (presence === 'recording') client.sendPresenceUpdate('recording', remoteJid).catch(() => {});
                    } catch {}
                  }
                });
        } catch (syncErr) { console.log('❌ [UPSERT SYNC]:', syncErr?.message || String(syncErr)); }
      });
    client.ev.on("messages.update", (updates) => {
      Promise.all(updates.map(async (update) => {
        try {
          if (update.key && update.key.remoteJid === "status@broadcast" && update.update?.messageStubType === 1) {
            const settings = await getCachedSettings();
            client.sessionConfig.autoViewStatus = settings?.autoview === true || settings?.autoview === 'true' || settings?.autoview === 1;
            handleAutoViewStatus(client, { key: update.key }).catch(() => {});
          }
        } catch (e) {}
      })).catch(() => {});
    });

    client.decodeJid = (jid) => {
      if (!jid) return jid;
      if (/:\d+@/gi.test(jid)) {
        let decode = jidDecode(jid) || {};
        return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
      } else return jid;
    };

    client.getName = (jid, withoutContact = false) => {
      const id = client.decodeJid(jid);
      withoutContact = client.withoutContact || withoutContact;
      let v;
      if (id.endsWith("@g.us")) {
        return new Promise(async (resolve) => {
          v = store.contacts[id] || {};
          if (!(v.name || v.subject)) v = await client.groupMetadata(id);
          resolve(v.name || v.subject || PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international"));
        });
      } else {
        v = id === "0@s.whatsapp.net" ? { id, name: "WhatsApp" } : id === client.decodeJid(client.user.id) ? client.user : store.contacts[id] || {};
      }
      return (withoutContact ? "" : v.name) || v.subject || v.verifiedName || PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international");
    };

    client.public = true;
    client.serializeM = (m) => smsg(client, m, store);

    client.ev.on("group-participants.update", async (m) => {
      try { await groupEvents(client, m, null); } catch (error) {
        console.log('[EVENTS] groupEvents error:', error.message);
      }
    });

    client.ev.on("presence.update", ({ id, presences }) => {
      if (!global._codexPresenceMap) global._codexPresenceMap = new Map();
      for (const [jid, data] of Object.entries(presences || {})) {
        global._codexPresenceMap.set(jid, { ...data, timestamp: Date.now() });
      }
    });

    client.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;
      const reason = lastDisconnect?.error ? new Boom(lastDisconnect.error).output.statusCode : null;

      if (connection !== "open") {
        if (global._codexKeepalive) { clearInterval(global._codexKeepalive); global._codexKeepalive = null; }
        if (global._codexDrainInterval) { clearInterval(global._codexDrainInterval); global._codexDrainInterval = null; }
        if (global._codexDrainTimer) { clearTimeout(global._codexDrainTimer); global._codexDrainTimer = null; }
        if (global._codexGhost) { clearInterval(global._codexGhost); global._codexGhost = null; }
    }
    if (connection === "open") {
        global._codexSessionTs = Math.floor(Date.now() / 1000);
        global._codexSeenIds = new Set();
        global._codexRealTime = false;
        reconnectAttempts = 0;
        global._codexLastActivity = Date.now();
        if (!followed) {
          followed = true;
          for (const cjid of CHANNEL_JIDS) {
            try { await client.newsletterFollow(cjid); await sleep(500); } catch {}
          }
        }
        console.log(chalk.green(`\n╭───(    `) + chalk.bold.cyan(`𝐂𝐨𝐝𝐞𝐱-𝐌D`) + chalk.green(`    )───`));
        console.log(chalk.green(`> ───≫ `) + chalk.yellow(`🚀 Connected Successfully`) + chalk.green(`<<───`));
        console.log(chalk.green(`> `) + chalk.white(`\`々\` 𝐒𝐭𝐚𝐭𝐮𝐬 : `) + chalk.green(`Started Successfully ✓`));
        console.log(chalk.green(`> `) + chalk.white(`\`々\` 𝐌𝐨𝐝𝐞 : `) + chalk.cyan(`${settingss.mode || 'public'}`));
        console.log(chalk.green(`╰─ Codex-MD\n`));
        global._codexConnectTime = Date.now();
            if (global._codexDrainTimer) clearTimeout(global._codexDrainTimer);
        if (global._codexDrainInterval) clearInterval(global._codexDrainInterval);
        const _drainBuf = () => { try { if (typeof client.ev.flush === 'function') client.ev.flush(true); } catch {} };
        global._codexDrainTimer = setTimeout(_drainBuf, 500);
        if (global._codexKeepalive) clearInterval(global._codexKeepalive);
        global._codexKeepalive = null;

        if (global._codexGhost) clearInterval(global._codexGhost);
if (client.ws && typeof client.ws.on === 'function') {
              client.ws.on('close', () => {
                  console.log('🔌 [WS CLOSE] WebSocket closed');
                  if (!global._codexShuttingDown && !global._codexReconnectTimer) {
                      global._codexReconnectTimer = setTimeout(() => { global._codexReconnectTimer = null; startCodex(); }, 3000);
                  }
              });
client.ws.on('CB:ib', (node) => {
                  const child = (node?.content || []).map(c => c?.tag).join(',');
              });
          }
          setTimeout(async () => {
              try {
                  await client.query({ tag: 'iq', attrs: { to: 's.whatsapp.net', xmlns: 'passive', type: 'set' }, content: [{ tag: 'active', attrs: {} }] });
              } catch (e) {
              }
          }, 500);
          let _initDone = false;
          setTimeout(() => { _initDone = true; }, 2000);
            setTimeout(async () => {
              try {
                const groups = await client.groupFetchAllParticipating();
                if (!global._codexGroupMetaCache) global._codexGroupMetaCache = new Map();
                for (const [jid, meta] of Object.entries(groups || {})) {
                  global._codexGroupMetaCache.set(jid, { data: meta, time: Date.now() });
                }
                const { getSudoUsers } = await import('./database/config.js');
                const sudoList = await getSudoUsers().catch(() => []);
                autoScanGroupsForSudo(client, sudoList).catch(() => {});
              } catch {}
            }, 4000);
          if (global._codexBatchPoll) clearInterval(global._codexBatchPoll);
        global._codexBatchPoll = null;
}

      if (connection === "close") {
        if (global._codexShuttingDown) return;
        global._codexCurrentClient = null;

        if (reason === DisconnectReason.loggedOut || reason === 401) {
          try { fs.rmSync(sessionName, { recursive: true, force: true }); } catch (e) {}
          invalidateSettingsCache();
          if (!global._codexReconnectTimer) global._codexReconnectTimer = setTimeout(() => { global._codexReconnectTimer = null; startCodex(); }, 2000);
          return;
        }

        if (reason === DisconnectReason.connectionClosed || reason === DisconnectReason.connectionLost || reason === DisconnectReason.timedOut || reason === 408 || reason === 503 || reason === 500 || reason === 515) {
          const delay = Math.min(baseReconnectDelay * Math.pow(1.5, reconnectAttempts), 30000);
          reconnectAttempts++;
          if (!global._codexReconnectTimer) global._codexReconnectTimer = setTimeout(() => { global._codexReconnectTimer = null; startCodex(); }, delay);
          return;
        }

        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(baseReconnectDelay * Math.pow(2, reconnectAttempts), 60000);
          reconnectAttempts++;
          if (!global._codexReconnectTimer) global._codexReconnectTimer = setTimeout(() => { global._codexReconnectTimer = null; startCodex(); }, delay);
          return;
        } else {
          reconnectAttempts = 0;
          if (!global._codexReconnectTimer) global._codexReconnectTimer = setTimeout(() => { global._codexReconnectTimer = null; startCodex(); }, 30000);
          return;
        }
      }

      try { await connectionHandler(client, update, startCodex); } catch (error) {}
    });

    client.sendText = (jid, text, quoted = "", options) => client.sendMessage(jid, { text, ...options }, { quoted });

    client.downloadMediaMessage = async (message) => {
      let mime = (message.msg || message).mimetype || '';
      let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
      const validTypes = ['image', 'video', 'audio', 'sticker', 'document', 'ptv'];
      if (!validTypes.includes(messageType)) {
        if (mime.startsWith('application/') || mime.startsWith('text/')) messageType = 'document';
        else if (mime.startsWith('image/')) messageType = 'image';
        else if (mime.startsWith('video/')) messageType = 'video';
        else if (mime.startsWith('audio/')) messageType = 'audio';
        else messageType = 'document';
      }
      const stream = await downloadContentFromMessage(message, messageType);
      let buffer = Buffer.from([]);
      for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
      return buffer;
    };

    client.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
      let quoted = message.msg ? message.msg : message;
      let mime = (message.msg || message).mimetype || '';
      let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
      const validSaveTypes = ['image', 'video', 'audio', 'sticker', 'document', 'ptv'];
      if (!validSaveTypes.includes(messageType)) {
        if (mime.startsWith('application/') || mime.startsWith('text/')) messageType = 'document';
        else if (mime.startsWith('image/')) messageType = 'image';
        else if (mime.startsWith('video/')) messageType = 'video';
        else if (mime.startsWith('audio/')) messageType = 'audio';
        else messageType = 'document';
      }
      const stream = await downloadContentFromMessage(quoted, messageType);
      let buffer = Buffer.from([]);
      for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
      let type = await FileType.fromBuffer(buffer);
      const trueFileName = attachExtension && type?.ext ? (filename + '.' + type.ext) : filename;
      fs.writeFileSync(trueFileName, buffer);
      return trueFileName;
    };

    global._codexIsStarting = false;
  } catch (error) {
    console.log('❌ [START CODEX ERROR]:', error);
    global._codexCurrentClient = null;
    global._codexIsStarting = false;
    if (!global._codexReconnectTimer) global._codexReconnectTimer = setTimeout(() => { global._codexReconnectTimer = null; startCodex(); }, 5000);
  }
}

function cleanupSessionFiles() {
    try {
        if (!fs.existsSync(sessionName)) return;
        const files = fs.readdirSync(sessionName);
        const keepFiles = ['creds.json', 'app-state-sync-version-', 'pre-key-', 'session-', 'sender-key-', 'app-state-sync-key-'];
        files.forEach(file => {
            const filePath = path.join(sessionName, file);
            try {
                const stats = fs.statSync(filePath);
                const shouldKeep = keepFiles.some(pattern => pattern.endsWith('-') ? file.startsWith(pattern) : file === pattern);
                if (!shouldKeep) {
                    const hoursOld = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60);
                    if (hoursOld > 24) fs.unlinkSync(filePath);
                }
            } catch (fileError) {}
        });
    } catch (error) {}
}

app.use(express.static('public'));
app.get("/", (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });
app.get("/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));
app.get("/pair", (req, res) => { res.sendFile(path.join(__dirname, 'public', 'pair.html')); });
app.get("/sessions", (req, res) => { res.sendFile(path.join(__dirname, 'public', 'sessions.html')); });

// Set owner number (stored in DB settings)
app.post('/api/set-owner', express.json(), async (req, res) => {
  try {
    const { number } = req.body;
    if (!number) return res.status(400).json({ error: 'Number required' });
    const clean = number.replace(/\D/g, '').slice(-12);
    if (clean.length < 7) return res.status(400).json({ error: 'Invalid number' });
    await updateSetting('ownerNumber', clean);
    console.log('[SET-OWNER] Owner number set to', clean);
    res.json({ ok: true, number: clean });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Auto-register tunnel URL from Termux (no manual paste needed)
let _tunnelUrl = process.env.TERMUX_PROXY || '';

app.post('/api/register-tunnel', express.json(), (req, res) => {
  const { url } = req.body;
  if (!url || !url.startsWith('https://')) return res.status(400).json({ error: 'Valid URL required' });
  _tunnelUrl = url.replace(/\/+$/, '');
  console.log('[TUNNEL] Registered:', _tunnelUrl);
  res.json({ ok: true, url: _tunnelUrl });
});

app.get('/api/tunnel-url', (req, res) => {
  res.json({ url: _tunnelUrl || null });
});

// ── Pair API (works directly on Railway, no external server needed) ──
const pairSessions = new Map();

function cleanupPairSession(sessionId) {
  const s = pairSessions.get(sessionId);
  if (!s) return;
  try { s.sock?.ev?.removeAllListeners(); s.sock?.ws?.close(); s.sock?.end?.(new Error('cleanup')); } catch {}
  try { if (s.authPath) fs.rmSync(s.authPath, { recursive: true, force: true }); } catch {}
  pairSessions.delete(sessionId);
}

app.post('/api/pair/start', async (req, res) => {
  try {
    let { number } = req.body;
    if (!number) return res.status(400).json({ error: 'Number required' });
    number = number.replace(/\D/g, '');
    if (number.length < 7) return res.status(400).json({ error: 'Invalid number' });
    if (number.startsWith('0')) number = number.slice(1);

    const id = crypto.randomUUID();
    const authPath = path.join(__dirname, 'temp_pair', id);
    fs.mkdirSync(authPath, { recursive: true });
    const { state, saveCreds } = await useMultiFileAuthState(authPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version, auth: state, printQRInTerminal: false,
      logger: pino({ level: 'silent' }),
      browser: Browsers.macOS('Chrome'),
      syncFullHistory: false, markOnlineOnConnect: false,
      defaultQueryTimeoutMs: 120000,
      getMessage: async () => ({ conversation: '' }),
    });

    const session = { id, sock, authPath, saveCreds, number, pairingCode: null, status: 'connecting', sessionPackage: null, error: null, createdAt: Date.now() };
    pairSessions.set(id, session);

    function onPairUpdate(upd) {
      const s = pairSessions.get(id);
      if (!s) return;
      if (upd.qr && !s.pairingCode) {
        sock.waitForSocketOpen().then(() => {
          setTimeout(async () => {
            try {
              const code = await sock.requestPairingCode(number);
              s.pairingCode = code.match(/.{1,4}/g)?.join('-') || code;
              s.status = 'waiting';
            } catch (e) {
              s.error = e?.message || 'Failed'; s.status = 'error';
            }
          }, 2000);
        }).catch(() => {});
      }
      if (upd.connection === 'open') {
        s.status = 'connected';
        try {
          const zipPath = authPath + '.zip';
          execSync(`cd "${authPath}" && zip -q -r "${zipPath}" . -i "*.json"`, { timeout: 10000 });
          const zipBuf = fs.readFileSync(zipPath);
          s.sessionPackage = 'CODEX-MD:~' + zipBuf.toString('base64');
          try { fs.unlinkSync(zipPath); } catch {}
        } catch {}
        try { sock.ev.removeAllListeners(); sock.ws?.close(); sock.end?.(undefined); } catch {}
      } else if (upd.connection === 'close') {
        if (s.status === 'connected') return;
        const code = upd.lastDisconnect?.error?.output?.statusCode;
        if (code === 515) {
          s.status = 'reconnecting';
          try { sock.ev.removeAllListeners(); sock.ws?.close(); sock.end?.(undefined); } catch {}
          useMultiFileAuthState(authPath).then(({ state: newState, saveCreds: newSave }) => {
            const newSock = makeWASocket({
              version, auth: newState, printQRInTerminal: false,
              logger: pino({ level: 'silent' }), browser: Browsers.macOS('Chrome'),
              syncFullHistory: false, markOnlineOnConnect: false,
              defaultQueryTimeoutMs: 120000,
              getMessage: async () => ({ conversation: '' }),
            });
            s.sock = newSock; s.saveCreds = newSave;
            newSock.ev.on('creds.update', newSave);
            newSock.ev.on('connection.update', onPairUpdate);
          }).catch(e => { s.status = 'error'; s.error = e?.message; });
        } else {
          s.status = 'error'; s.error = `Closed (code ${code})`;
        }
      }
    }

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', onPairUpdate);

    res.json({ sessionId: id, number });
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Failed' });
  }
});

app.get('/api/pair/status/:sessionId', (req, res) => {
  const s = pairSessions.get(req.params.sessionId);
  if (!s) return res.status(404).json({ error: 'Session expired' });
  res.json({ status: s.status, pairingCode: s.pairingCode, sessionPackage: s.sessionPackage, error: s.error });
});

// Cleanup old pair sessions
setInterval(() => {
  const now = Date.now();
  for (const [id, s] of pairSessions) {
    if (now - s.createdAt > 300000) cleanupPairSession(id);
  }
}, 60000);

// Cleanup temp_pair dir on start
try { fs.rmSync(path.join(__dirname, 'temp_pair'), { recursive: true, force: true }); } catch {}

// Proxy all /api/* requests to Termux (cloudflared tunnel)
// Priority: 1) auto-registered  2) TERMUX_PROXY env var
app.all('/api/*', async (req, res) => {
  const tunnelUrl = _tunnelUrl || TERMUX_PROXY;
  if (!tunnelUrl) {
    return res.status(503).json({ error: 'Termux backend not connected. Start the tunnel on Termux.' });
  }
  try {
    const url = tunnelUrl + req.originalUrl;
    const headers = { 'Content-Type': 'application/json' };
    if (req.headers['x-client-id']) headers['x-client-id'] = req.headers['x-client-id'];
    const body = ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined;
    const r = await fetch(url, { method: req.method, headers, body });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    console.log('⚠️ [PROXY] Termux backend error:', e?.message?.slice(0, 100));
    res.status(502).json({ error: 'Termux backend unreachable. Is cloudflared running?' });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));

startBackupInterval(db);
startCodex();

export { startCodex, invalidateSettingsCache, cacheLidPhone, lidPhoneCache, phoneLidCache, getCleanNumber, getDisplayNumber, resolvePhoneFromLid, resolvePhoneFromLidAsync, resolveSenderFromGroup, autoScanGroupsForSudo };