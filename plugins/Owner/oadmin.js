import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js'; 
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, Owner, isBotAdmin } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

                 if (!m.isGroup) {
                     await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                     return m.reply(`╭─ Codex-MD\n│ This command is meant for groups.\n╰─ Codex-MD`);
                 }
         if (!isBotAdmin) {
             await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
             return m.reply(`╭─ Codex-MD\n│ I need admin privileges.\n╰─ Codex-MD`); 
         }

                 await client.groupParticipantsUpdate(m.chat,  [m.sender], 'promote'); 
 m.reply(`╭─ *PROMOTED*\n│ Promoted. Now you have power.\n╰─ Codex-MD`); 
          })

}
