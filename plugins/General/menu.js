import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import { getDeviceMode } from '../../lib/deviceMode.js';
import { updateSetting } from '../../database/config.js';
import axios from 'axios';
import FormData from 'form-data';

const MENU_PIC_PATH = './data/menu_pic.json';

function loadMenuPic() {
    try {
        if (fs.existsSync(MENU_PIC_PATH)) {
            return JSON.parse(fs.readFileSync(MENU_PIC_PATH, 'utf-8'));
        }
    } catch {}
    return { url: '' };
}

function saveMenuPic(data) {
    const dir = path.dirname(MENU_PIC_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(MENU_PIC_PATH, JSON.stringify(data, null, 2));
}

const menuCommand = {
    name: 'menu',
    aliases: ['commands', 'list', 'cmds', 'm', 'help', 'cmd', 'commandlist', 'allcmds'],
    description: 'Displays the Codex-MD command menu',
    run: async (context) => {
        const { client, m, mode, pict, botname, prefix } = context;
        const fq = getFakeQuoted(m);

        await client.sendMessage(m.chat, { react: { text: '🤖', key: m.key } });

        const bodyText = m.body || '';
        const cleanText = bodyText.trimStart().slice(prefix.length).trimStart();
        const firstWord = cleanText.split(' ')[0].toLowerCase();

        if (cleanText !== '' && !['menu', 'commands', 'list', 'cmds', 'm', 'help', 'cmd', 'commandlist', 'allcmds'].includes(firstWord)) {
            const commandName = cleanText.split(' ')[0];
            return client.sendMessage(m.chat, {
                text: `╭─ *Eʀʀᴏʀ*\n│ Yo ${m.pushName}, what's with the\n│ extra bullshit after "${commandName}"?\n│ Just type *${prefix}menu* properly, moron.\n╰─ Codex-MD`
            }, { quoted: fq });
        }

        const menuText =
            `╭─ Codex-MD\n` +
            `├───≫ Mᴇɴᴜ ≪───\n` +
            `├ \n` +
            `Hoi  @${m.sender.split('@')[0].split(':')[0]}\n` +
            `├ \n` +
            `├ Bot: Codex-MD\n` +
            `├ Prefix: ${prefix}\n` +
            `├ Mode: ${mode}\n` +
            `├ \n` +
            `├ Select a category below.\n` +
            `╰─ Codex-MD\n` +
            ``;

        const sections = [
            {
                title: '⌜ 𝘾𝙤𝙧𝙚 𝘾𝙤𝙢𝙢𝙖𝙣𝙙𝙨 ⌟',
                highlight_label: '© 丨几匚',
                rows: [
                    { title: '𝐅𝐮𝐥𝐥𝐌𝐞𝐧𝐮', description: 'Display all commands', id: `${prefix}fullmenu` },
                    { title: '𝐃𝐞𝐯', description: 'Send developer contact', id: `${prefix}dev` },
                    { title: '𝐑𝐞𝐩𝐨𝐫𝐭', description: 'Report a bug to dev', id: `${prefix}report` },
                ],
            },
            {
                title: '𝙄𝙣𝙛𝙤 𝘽𝙤𝙩',
                highlight_label: '© 丨几匚',
                rows: [
                    { title: '𝐏𝐢𝐧𝐠', description: 'Check bot speed', id: `${prefix}ping` },
                    { title: '𝐒𝐞𝐭𝐭𝐢𝐧𝐠𝐬', description: 'Show bot settings', id: `${prefix}settings` },
                    { title: '𝐌𝐨𝐝𝐞', description: 'Toggle bot mode', id: `${prefix}mode` },
                    { title: '𝐔𝐩𝐭𝐢𝐦𝐞', description: 'Check how long bot has been running', id: `${prefix}uptime` },
                ],
            },
            {
                title: '𝘾𝙖𝙩𝙚𝙜𝙤𝙧𝙮 𝙈𝙚𝙣𝙪𝙨',
                highlight_label: '© 丨几匚',
                rows: [
                    { title: '𝐆𝐞𝐧𝐞𝐫𝐚𝐥𝐌𝐞𝐧𝐮', description: 'General commands', id: `${prefix}generalmenu` },
                    { title: '𝐒𝐞𝐭𝐭𝐢𝐧𝐠𝐬𝐌𝐞𝐧𝐮', description: 'Bot settings commands', id: `${prefix}settingsmenu` },
                    { title: '𝐎𝐰𝐧𝐞𝐫𝐌𝐞𝐧𝐮', description: 'Owner only commands', id: `${prefix}ownermenu` },
                    { title: '𝐆𝐫𝐨𝐮𝐩𝐌𝐞𝐧𝐮', description: 'Group management', id: `${prefix}groupmenu` },
                    { title: '𝐀𝐈𝐌𝐞𝐧𝐮', description: 'AI & chat commands', id: `${prefix}aimenu` },
                    { title: '𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐌𝐞𝐧𝐮', description: 'Media downloaders', id: `${prefix}downloadmenu` },
                    { title: '𝐄𝐝𝐢𝐭𝐢𝐧𝐠𝐌𝐞𝐧𝐮', description: 'Media editing tools', id: `${prefix}editingmenu` },
                    { title: '𝐄𝐟𝐟𝐞𝐜𝐭𝐬𝐌𝐞𝐧𝐮', description: 'Text effect commands', id: `${prefix}effectsmenu` },
                    { title: '𝐔𝐭𝐢𝐥𝐬𝐌𝐞𝐧𝐮', description: 'Utility commands', id: `${prefix}utilsmenu` },
                    { title: '𝐏𝐫𝐢𝐯𝐚𝐜𝐲𝐌𝐞𝐧𝐮', description: 'Privacy commands', id: `${prefix}privacymenu` },
                ],
            },
        ];

        let sentAsImage = false;
        const menuPic = loadMenuPic();
        if (menuPic.url) {
            try {
                await client.sendMessage(m.chat, {
                    image: { url: menuPic.url },
                    caption: menuText,
                    mentions: [m.sender],
                    contextInfo: {
                        externalAdReply: {
                            title: `${botname}`,
                            body: `Yo, ${m.pushName}! Ready to fuck shit up?`,
                            mediaType: 1,
                            thumbnail: pict,
                            mediaUrl: '',
                            sourceUrl: 'https://github.com/Codex-MD/Codex-MD',
                            showAdAttribution: false,
                            renderLargerThumbnail: true,
                        }
                    }
                }, { quoted: fq });
                await client.sendMessage(m.chat, {
                    listMessage: {
                        title: '𝐕𝐈𝐄𝐖 𝐎𝐏𝐓𝐈𝐎𝐍𝐒',
                        description: 'Select a category to view its commands.',
                        buttonText: 'Browse Commands',
                        listType: 1,
                        sections: sections.map(s => ({
                            title: s.title,
                            rows: s.rows.map(r => ({ title: r.title, description: r.description, rowId: r.id }))
                        })),
                        footer: '',
                    },
                }, { quoted: fq });
                sentAsImage = true;
            } catch {
                try {
                    const { fetchBuffer } = context;
                    if (fetchBuffer) {
                        const imgBuf = await fetchBuffer(menuPic.url);
                        await client.sendMessage(m.chat, {
                            image: imgBuf,
                            caption: menuText,
                            mentions: [m.sender],
                            contextInfo: {
                                externalAdReply: {
                                    title: `${botname}`,
                                    body: `Yo, ${m.pushName}! Ready to fuck shit up?`,
                                    mediaType: 1,
                                    thumbnail: pict,
                                    mediaUrl: '',
                                    sourceUrl: 'https://github.com/Codex-MD/Codex-MD',
                                    showAdAttribution: false,
                                    renderLargerThumbnail: true,
                                }
                            }
                        }, { quoted: fq });
                        await client.sendMessage(m.chat, {
                            listMessage: {
                                title: '𝐕𝐈𝐄𝐖 𝐎𝐏𝐓𝐈𝐎𝐍𝐒',
                                description: 'Select a category to view its commands.',
                                buttonText: 'Browse Commands',
                                listType: 1,
                                sections: sections.map(s => ({
                                    title: s.title,
                                    rows: s.rows.map(r => ({ title: r.title, description: r.description, rowId: r.id }))
                                })),
                                footer: '',
                            },
                        }, { quoted: fq });
                        sentAsImage = true;
                    }
                } catch {}
            }
        }

        if (!sentAsImage) {
            const device = await getDeviceMode();

            if (device === 'ios') {
                await client.sendMessage(m.chat, {
                    text: menuText, mentions: [m.sender]
                }, { quoted: fq });
            } else {
                try {
                    const msg = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
                        interactiveMessage: {
                            body: { text: menuText },
                            footer: { text: '' },
                            header: { hasMediaAttachment: false },
                            contextInfo: {
                                mentionedJid: [m.sender],
                                externalAdReply: {
                                    title: `${botname}`,
                                    body: `Yo, ${m.pushName}! Ready to fuck shit up?`,
                                    mediaType: 1,
                                    thumbnail: pict,
                                    mediaUrl: '',
                                    sourceUrl: 'https://github.com/Codex-MD/Codex-MD',
                                    showAdAttribution: false,
                                    renderLargerThumbnail: true,
                                }
                            },
                            nativeFlowMessage: {
                                messageVersion: 1,
                                buttons: [
                                    {
                                        name: 'cta_url',
                                        buttonParamsJson: JSON.stringify({
                                            display_text: 'GitHub Repo',
                                            url: 'https://github.com/Codex-MD/Codex-MD',
                                            merchant_url: 'https://github.com/Codex-MD/Codex-MD'
                                        })
                                    },
                                    {
                                        name: 'single_select',
                                        buttonParamsJson: JSON.stringify({
                                            title: 'Browse Commands',
                                            sections: sections
                                        })
                                    }
                                ]
                            }
                        }
                    }), { userJid: client.user.id });
                    if (!msg?.key?.id) throw new Error('null key');
                    await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
                } catch {
                    await client.sendMessage(m.chat, {
                        image: pict,
                        caption: menuText,
                        mentions: [m.sender],
                        contextInfo: {
                            externalAdReply: {
                                title: `${botname}`,
                                body: `Yo, ${m.pushName}! Ready to fuck shit up?`,
                                mediaType: 1,
                                thumbnail: pict,
                                mediaUrl: '',
                                sourceUrl: 'https://github.com/Codex-MD/Codex-MD',
                                showAdAttribution: false,
                                renderLargerThumbnail: true,
                            }
                        }
                    }, { quoted: fq });
                    await client.sendMessage(m.chat, {
                        listMessage: {
                            title: '𝐕𝐈𝐄𝐖 𝐎𝐏𝐓𝐈𝐎𝐍𝐒',
                            description: 'Select a category to view its commands.',
                            buttonText: 'Browse Commands',
                            listType: 1,
                            sections: sections.map(s => ({
                                title: s.title,
                                rows: s.rows.map(r => ({ title: r.title, description: r.description, rowId: r.id }))
                            })),
                            footer: '',
                        },
                    }, { quoted: fq });
                }
            }
        }

        const xhClintonPaths = [
            path.join(__dirname, 'xh_clinton'),
            path.join(process.cwd(), 'xh_clinton'),
            path.join(__dirname, '..', 'xh_clinton')
        ];
        let audioFolder = null;
        for (const folderPath of xhClintonPaths) {
            if (fs.existsSync(folderPath)) { audioFolder = folderPath; break; }
        }
        if (!audioFolder) return;
        const menuFiles = ['menu1.mp3', 'menu2.mp3', 'menu3.mp3', 'menu4.mp3'];
        const possibleFiles = menuFiles.map(f => path.join(audioFolder, f)).filter(f => fs.existsSync(f));
        if (possibleFiles.length === 0) return;
        const randomFile = possibleFiles[Math.floor(Math.random() * possibleFiles.length)];
        await new Promise(resolve => setTimeout(resolve, 500));
        try {
            const audioBuffer = fs.readFileSync(randomFile);
            await client.sendMessage(m.chat, { audio: audioBuffer, ptt: true, mimetype: 'audio/mpeg', fileName: 'codex-menu.m4a' }, { quoted: fq });
        } catch {
            await client.sendMessage(m.chat, { audio: { url: randomFile }, ptt: true, mimetype: 'audio/mpeg', fileName: 'codex-menu.m4a' }, { quoted: fq });
        }
    },
};

const setmenupicCommand = {
    name: 'setmenupic',
    aliases: ['menupic', 'bpic', 'setbotpic'],
    description: 'Set custom menu picture',
    run: async (context) => {
        const { client, m, Owner, text, prefix } = context;
        const fq = getFakeQuoted(m);

        if (!Owner) {
            return client.sendMessage(m.chat, {
                text: `╭─ *Aᴄᴄᴇss Dᴇɴɪᴇᴅ*\n│ Owner only command\n╰─ Codex-MD`
            }, { quoted: fq });
        }

        let url = text || '';

        if (m.quoted && m.quoted.mtype === 'imageMessage') {
            try {
                const imgBuffer = await client.downloadMediaMessage(m.quoted);
                const form = new FormData();
                form.append('image', imgBuffer.toString('base64'));
                const { data } = await axios.post('https://api.imgbb.com/1/upload?key=1cb14913a7cb3ca3bc8808e7fda051c6', form);
                if (data?.data?.url) {
                    url = data.data.url;
                } else {
                    throw new Error('ImgBB upload failed');
                }
            } catch (e) {
                return client.sendMessage(m.chat, {
                    text: `╭─ *Eʀʀᴏʀ*\n│ Failed to upload image\n╰─ Codex-MD`
                }, { quoted: fq });
            }
        }

        if (!url) {
            return client.sendMessage(m.chat, {
                text: `╭─ *Uꜱᴀɢᴇ*\n│ ${prefix}setmenupic <url>\n│ Or reply to an image\n╰─ Codex-MD`
            }, { quoted: fq });
        }

        saveMenuPic({ url });
        return client.sendMessage(m.chat, {
            text: `╭─ *Dᴏɴᴇ*\n│ Menu picture updated!\n╰─ Codex-MD`
        }, { quoted: fq });
    }
};

const setbotnameCommand = {
    name: 'setbotname',
    aliases: ['botname', 'namebot', 'setname'],
    description: 'Set custom bot name',
    run: async (context) => {
        const { client, m, Owner, text, prefix } = context;
        const fq = getFakeQuoted(m);

        if (!Owner) {
            return client.sendMessage(m.chat, {
                text: `╭─ *Aᴄᴄᴇss Dᴇɴɪᴇᴅ*\n│ Owner only command\n╰─ Codex-MD`
            }, { quoted: fq });
        }

        if (!text) {
            return client.sendMessage(m.chat, {
                text: `╭─ *Uꜱᴀɢᴇ*\n│ ${prefix}setbotname <name>\n╰─ Codex-MD`
            }, { quoted: fq });
        }

        await updateSetting('botname', text);
        return client.sendMessage(m.chat, {
            text: `╭─ *Dᴏɴᴇ*\n│ Bot name changed to: ${text}\n╰─ Codex-MD`
        }, { quoted: fq });
    }
};

export default [menuCommand, setmenupicCommand, setbotnameCommand];
