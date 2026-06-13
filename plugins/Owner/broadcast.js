import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, participants, pushname } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

if (!text) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return m.reply(`╭─ Codex-MD\n│ Provide a broadcast message!\n╰─ Codex-MD`);
}
if (!m.isGroup) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return m.reply(`╭─ Codex-MD\n│ This command is meant for groups.\n╰─ Codex-MD`);
}

let getGroups = await client.groupFetchAllParticipating() 
         let groups = Object.entries(getGroups) 
             .slice(0) 
             .map(entry => entry[1]) 
         let res = groups.map(v => v.id) 

await m.reply(`╭─ *BROADCAST*\n│ Sending broadcast message...\n╰─ Codex-MD`)

for (let i of res) { 

let txt = `╭─ *BROADCAST*\n│ Message: ${text}\n│ Written by: ${pushname}\n╰─ Codex-MD` 

await client.sendMessage(i, { 
                 image: { 
                     url: "https://qu.ax/XxQwp.jpg" 
                 }, mentions: participants.map(a => a.id),
                 caption: `${txt}` 
             }, { quoted: fq }) 
         } 
await m.reply(`╭─ *DONE*\n│ Message sent across all groups.\n╰─ Codex-MD`);
})

}
