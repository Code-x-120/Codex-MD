import middleware from '../../utils/botUtil/middleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    await middleware(context, async () => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

const response = await client.groupRequestParticipantsList(m.chat);

if (response.length === 0) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return m.reply(`╭─ Codex-MD\n│ There are no pending join requests.\n╰─ Codex-MD`);
}

let jids = ''; 

response.forEach((participant, index) => {
    jids +='+' + participant.jid.split('@')[0];
    if (index < response.length - 1) {
        jids += '\n│ '; 
    }
});

 client.sendMessage(m.chat, {text:`╭─ *PENDING REQUESTS*\n│ ${jids}\n│ Use .approve-all or .reject-all\n│ to handle these join requests.\n╰─ Codex-MD`}, { quoted: fq }); 

})

}
