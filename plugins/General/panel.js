import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = './data/panel_config.json';

function loadConfig() {
    try {
        if (fs.existsSync(CONFIG_PATH)) {
            return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
        }
    } catch {}
    return { domain: '', apikey: '', capikey: '', egg: '', nestid: '', location: '', admins: [] };
}

function saveConfig(config) {
    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

const pricing = {
    '1gb': { ram: 1024, cpu: 40, disk: 1024, label: '1 GB' },
    '2gb': { ram: 2048, cpu: 60, disk: 2048, label: '2 GB' },
    '3gb': { ram: 3072, cpu: 100, disk: 2048, label: '3 GB' },
    '4gb': { ram: 4096, cpu: 120, disk: 3072, label: '4 GB' },
    '5gb': { ram: 5120, cpu: 150, disk: 4096, label: '5 GB' },
    '6gb': { ram: 6144, cpu: 170, disk: 4096, label: '6 GB' },
    '7gb': { ram: 7168, cpu: 190, disk: 5120, label: '7 GB' },
    '8gb': { ram: 8192, cpu: 200, disk: 5120, label: '8 GB' },
    '9gb': { ram: 9216, cpu: 220, disk: 5120, label: '9 GB' },
    '10gb': { ram: 10240, cpu: 240, disk: 6144, label: '10 GB' },
    'unli': { ram: 0, cpu: 300, disk: 10240, label: 'Unlimited' }
};

function send(client, m, text) {
    return client.sendMessage(m.chat, { text }, { quoted: getFakeQuoted(m) });
}

const ownerCmds = ['setdomain', 'setapikey', 'setcapikey', 'setegg', 'setnest', 'setloc', 'addsrv', 'cadmin', 'deladmin', 'listadmin'];
const adminCmds = ['adduser', 'listpanel', 'delpanel', 'pricing', ...Object.keys(pricing)];
const needsPanel = ['adduser', 'listpanel', 'delpanel', ...Object.keys(pricing)];

export default {
    name: 'panel',
    aliases: ['1gb', '2gb', '3gb', '4gb', '5gb', '6gb', '7gb', '8gb', '9gb', '10gb', 'unli', 'listpanel', 'delpanel', 'cadmin', 'listadmin', 'deladmin', 'addsrv', 'adduser', 'pricing'],
    description: 'Pterodactyl panel management',
    category: 'Owner',
    run: async (context) => {
        const { client, m, command, text, args, prefix, Owner } = context;
        const config = loadConfig();
        const lowerCmd = command.toLowerCase();
        const isOwner = !!Owner;
        const isAdmin = isOwner || (config.admins || []).includes(m.sender);

        if (ownerCmds.includes(lowerCmd) && !isOwner) {
            return send(client, m, '╭─ *Aᴄᴄᴇss Dᴇɴɪᴇᴅ*\n│ Owner only command\n╰─ Codex-MD');
        }

        if (adminCmds.includes(lowerCmd) && lowerCmd !== 'pricing' && !isAdmin) {
            return send(client, m, '╭─ *Aᴄᴄᴇss Dᴇɴɪᴇᴅ*\n│ You are not authorized\n╰─ Codex-MD');
        }

        if (needsPanel.includes(lowerCmd) && lowerCmd !== 'pricing' && (!config.domain || !config.apikey)) {
            return send(client, m, '╭─ *Eʀʀᴏʀ*\n│ Panel not configured!\n│ Use addsrv or setdomain/setapikey\n╰─ Codex-MD');
        }

        if (lowerCmd === 'pricing') {
            let msg = '╭─ *Pʀɪᴄɪɴɢ Tɪᴇʀs*\n';
            for (const val of Object.values(pricing)) {
                msg += `│ *${val.label}*  ${val.cpu}% CPU  ${val.disk} MB SSD\n`;
            }
            msg += '╰─ Codex-MD';
            return send(client, m, msg);
        }

        if (lowerCmd === 'setdomain') {
            if (!text) return send(client, m, '╭─ *Uꜱᴀɢᴇ*\n│ setdomain <domain>\n╰─ Codex-MD');
            config.domain = text;
            saveConfig(config);
            return send(client, m, '╭─ *Sᴜᴄᴄᴇss*\n│ Domain set\n╰─ Codex-MD');
        }

        if (lowerCmd === 'setapikey') {
            if (!text) return send(client, m, '╭─ *Uꜱᴀɢᴇ*\n│ setapikey <key>\n╰─ Codex-MD');
            config.apikey = text;
            saveConfig(config);
            return send(client, m, '╭─ *Sᴜᴄᴄᴇss*\n│ API key (ptla) set\n╰─ Codex-MD');
        }

        if (lowerCmd === 'setcapikey') {
            if (!text) return send(client, m, '╭─ *Uꜱᴀɢᴇ*\n│ setcapikey <key>\n╰─ Codex-MD');
            config.capikey = text;
            saveConfig(config);
            return send(client, m, '╭─ *Sᴜᴄᴄᴇss*\n│ Client API (ptlc) set\n╰─ Codex-MD');
        }

        if (lowerCmd === 'setegg') {
            if (!text) return send(client, m, '╭─ *Uꜱᴀɢᴇ*\n│ setegg <egg_id>\n╰─ Codex-MD');
            config.egg = text;
            saveConfig(config);
            return send(client, m, '╭─ *Sᴜᴄᴄᴇss*\n│ Egg ID set\n╰─ Codex-MD');
        }

        if (lowerCmd === 'setnest') {
            if (!text) return send(client, m, '╭─ *Uꜱᴀɢᴇ*\n│ setnest <nest_id>\n╰─ Codex-MD');
            config.nestid = text;
            saveConfig(config);
            return send(client, m, '╭─ *Sᴜᴄᴄᴇss*\n│ Nest ID set\n╰─ Codex-MD');
        }

        if (lowerCmd === 'setloc') {
            if (!text) return send(client, m, '╭─ *Uꜱᴀɢᴇ*\n│ setloc <location_id>\n╰─ Codex-MD');
            config.location = text;
            saveConfig(config);
            return send(client, m, '╭─ *Sᴜᴄᴄᴇss*\n│ Location ID set\n╰─ Codex-MD');
        }

        if (lowerCmd === 'addsrv') {
            if (!args[0] || !args[1]) return send(client, m, '╭─ *Uꜱᴀɢᴇ*\n│ addsrv <domain> <apikey>\n╰─ Codex-MD');
            config.domain = args[0];
            config.apikey = args[1];
            saveConfig(config);
            return send(client, m, '╭─ *Sᴜᴄᴄᴇss*\n│ Panel server added\n│ ' + args[0] + '\n╰─ Codex-MD');
        }

        if (lowerCmd === 'cadmin') {
            const mentioned = m.mentionedJid?.[0];
            if (!mentioned) return send(client, m, '╭─ *Uꜱᴀɢᴇ*\n│ cadmin <@user>\n╰─ Codex-MD');
            if (config.admins.includes(mentioned)) return send(client, m, '╭─ *Iɴғᴏ*\n│ Already an admin\n╰─ Codex-MD');
            config.admins.push(mentioned);
            saveConfig(config);
            return send(client, m, '╭─ *Sᴜᴄᴄᴇss*\n│ Admin added: @' + mentioned.split('@')[0] + '\n╰─ Codex-MD');
        }

        if (lowerCmd === 'listadmin') {
            if (config.admins.length === 0) return send(client, m, '╭─ *Iɴғᴏ*\n│ No admins\n╰─ Codex-MD');
            let msg = '╭─ *Aᴅᴍɪɴ Lɪsᴛ*\n';
            config.admins.forEach((a, i) => msg += `│ ${i + 1}. @${a.split('@')[0]}\n`);
            msg += '╰─ Codex-MD';
            return await client.sendMessage(m.chat, { text: msg, mentions: config.admins }, { quoted: getFakeQuoted(m) });
        }

        if (lowerCmd === 'deladmin') {
            const mentioned = m.mentionedJid?.[0];
            if (!mentioned) return send(client, m, '╭─ *Uꜱᴀɢᴇ*\n│ deladmin <@user>\n╰─ Codex-MD');
            const idx = config.admins.indexOf(mentioned);
            if (idx === -1) return send(client, m, '╭─ *Iɴғᴏ*\n│ Not an admin\n╰─ Codex-MD');
            config.admins.splice(idx, 1);
            saveConfig(config);
            return send(client, m, '╭─ *Sᴜᴄᴄᴇss*\n│ Admin removed\n╰─ Codex-MD');
        }

        if (lowerCmd === 'adduser') {
            const [username, password] = args;
            if (!username || !password) return send(client, m, '╭─ *Uꜱᴀɢᴇ*\n│ adduser <username> <password>\n╰─ Codex-MD');
            try {
                const email = `${username}_${Date.now()}@panel.local`;
                const { data } = await axios.post(`${config.domain}/api/application/users`, {
                    username, email,
                    first_name: username,
                    last_name: username,
                    password
                }, {
                    headers: {
                        Authorization: `Bearer ${config.apikey}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                const uid = data.attributes.id;
                return send(client, m, `╭─ *Uꜱᴇʀ Cʀᴇᴀᴛᴇᴅ*\n│ User: ${username}\n│ Pass: ${password}\n│ ID: ${uid}\n╰─ Codex-MD`);
            } catch (e) {
                const err = e.response?.data?.errors?.[0]?.detail || e.message;
                return send(client, m, `╭─ *Eʀʀᴏʀ*\n│ ${err}\n╰─ Codex-MD`);
            }
        }

        const tier = pricing[lowerCmd];
        if (tier) {
            const username = args[0];
            if (!username) return send(client, m, `╭─ *Uꜱᴀɢᴇ*\n│ ${prefix}${lowerCmd} <username>\n╰─ Codex-MD`);
            if (!config.egg || !config.location) {
                return send(client, m, '╭─ *Eʀʀᴏʀ*\n│ Set egg & location first\n│ Use setegg & setloc\n╰─ Codex-MD');
            }
            try {
                const email = `${username}_${Date.now()}@panel.local`;
                const { data: u } = await axios.post(`${config.domain}/api/application/users`, {
                    username, email,
                    first_name: username,
                    last_name: username,
                    password: username + '123'
                }, {
                    headers: {
                        Authorization: `Bearer ${config.apikey}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                const userId = u.attributes.id;

                const { data: s } = await axios.post(`${config.domain}/api/application/servers`, {
                    name: `${lowerCmd.toUpperCase()}-${username}`,
                    user: userId,
                    egg: parseInt(config.egg),
                    limits: {
                        memory: tier.ram,
                        swap: 0,
                        disk: tier.disk,
                        io: 500,
                        cpu: tier.cpu
                    },
                    feature_limits: {
                        databases: 1,
                        allocations: 1,
                        backups: 1
                    },
                    deploy: {
                        locations: [parseInt(config.location)],
                        dedicated_ip: false,
                        port_range: []
                    },
                    skip_scripts: true,
                    oom_disabled: false
                }, {
                    headers: {
                        Authorization: `Bearer ${config.apikey}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                const a = s.attributes;
                return send(client, m, `╭─ *Sᴇʀᴠᴇʀ Cʀᴇᴀᴛᴇᴅ*\n│ Name: ${a.name}\n│ ID: ${a.id}\n│ Plan: ${tier.label}\n│ CPU: ${tier.cpu}%\n│ Disk: ${tier.disk} MB\n│ User: ${username}\n│ Pass: ${username}123\n╰─ Codex-MD`);
            } catch (e) {
                const err = e.response?.data?.errors?.[0]?.detail || e.message;
                return send(client, m, `╭─ *Eʀʀᴏʀ*\n│ ${err}\n╰─ Codex-MD`);
            }
        }

        if (lowerCmd === 'listpanel') {
            const page = parseInt(args[0]) || 1;
            try {
                const { data } = await axios.get(`${config.domain}/api/application/servers?page=${page}`, {
                    headers: {
                        Authorization: `Bearer ${config.apikey}`,
                        'Accept': 'application/json'
                    }
                });
                const servers = data.data || [];
                if (servers.length === 0) return send(client, m, '╭─ *Iɴғᴏ*\n│ No servers found\n╰─ Codex-MD');
                const tp = data.meta?.pagination?.total_pages || 1;
                const tt = data.meta?.pagination?.total || 0;
                let msg = `╭─ *Sᴇʀᴠᴇʀ Lɪsᴛ* (${page}/${tp})\n│ Total: ${tt}\n`;
                servers.forEach((srv, i) => {
                    const a = srv.attributes;
                    const mem = a.limits.memory === 0 ? '∞' : a.limits.memory + 'MB';
                    msg += `│ ${(page - 1) * 25 + i + 1}. ${a.name}\n│    ID:${a.id} RAM:${mem}\n`;
                });
                msg += '╰─ Codex-MD';
                return send(client, m, msg);
            } catch (e) {
                const err = e.response?.data?.errors?.[0]?.detail || e.message;
                return send(client, m, `╭─ *Eʀʀᴏʀ*\n│ ${err}\n╰─ Codex-MD`);
            }
        }

        if (lowerCmd === 'delpanel') {
            const serverId = args[0];
            if (!serverId) return send(client, m, '╭─ *Uꜱᴀɢᴇ*\n│ delpanel <server_id>\n╰─ Codex-MD');
            try {
                await axios.delete(`${config.domain}/api/application/servers/${serverId}`, {
                    headers: {
                        Authorization: `Bearer ${config.apikey}`,
                        'Accept': 'application/json'
                    }
                });
                return send(client, m, `╭─ *Sᴇʀᴠᴇʀ Dᴇʟᴇᴛᴇᴅ*\n│ ID: ${serverId}\n╰─ Codex-MD`);
            } catch (e) {
                const err = e.response?.data?.errors?.[0]?.detail || e.message;
                return send(client, m, `╭─ *Eʀʀᴏʀ*\n│ ${err}\n╰─ Codex-MD`);
            }
        }

        send(client, m, `╭─ *Pᴀɴᴇʟ*\n│ Use ${prefix}panel for help\n╰─ Codex-MD`);
    }
};
