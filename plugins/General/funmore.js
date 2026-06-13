import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const ballAnswers = [
    'It is certain', 'It is decidedly so', 'Without a doubt', 'Yes definitely',
    'You may rely on it', 'As I see it, yes', 'Most likely', 'Outlook good',
    'Yes', 'Signs point to yes', 'Reply hazy try again', 'Ask again later',
    'Better not tell you now', 'Cannot predict now', 'Concentrate and ask again',
    "Don't count on it", 'My reply is no', 'My sources say no',
    'Outlook not so good', 'Very doubtful'
];

const hangmanWords = [
    'apple', 'beach', 'chair', 'dance', 'eagle', 'flame', 'ghost', 'heart',
    'image', 'joker', 'knife', 'lemon', 'magic', 'night', 'ocean', 'piano',
    'queen', 'river', 'stone', 'tiger', 'ultra', 'voice', 'water', 'zebra',
    'brave', 'crane', 'drake', 'elite', 'frost', 'grape', 'honey', 'ivory',
    'jewel', 'koala', 'lunar', 'mango', 'noble', 'opera', 'pearl', 'quiet',
    'royal', 'sugar', 'tulip', 'umbra', 'vigor', 'whale', 'xenon', 'yacht',
    'yield', 'blaze', 'crisp', 'dwarf', 'flair', 'gleam', 'humor', 'jolly'
];

const moods = [
    '😊 Happy', '😢 Sad', '😡 Angry', '😴 Sleepy', '🤩 Excited',
    '😰 Anxious', '😎 Cool', '🥰 Loved', '🤪 Crazy', '😌 Peaceful',
    '😤 Determined', '🥱 Bored', '😨 Scared', '🤔 Confused', '😈 Mischievous'
];

const slotSymbols = ['🍒', '🍇', '🍊', '🍋', '🍉', '🎰', '💎', '7️⃣'];

const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

const rateComments = [
    'Absolutely terrible 💀', 'Pretty bad ngl 😬', 'Not great chief 🙃',
    'Below average 🤷', 'Mediocre at best 😐', 'Decent enough 👍',
    'Pretty good actually 👌', 'Very nice! 😊', 'Excellent stuff! 🔥',
    'Absolutely perfect! 🌟'
];

const simpComments = [
    'You are a free soul 🕊️', 'Minimal simp energy 😌', 'Casual simp 🧐',
    'Getting there... 🤨', 'Moderate simp 😅', 'Respectable simp level 😂',
    'Danger zone! ⚠️', 'Major simp! 🚨', 'Ultimate simp! 👑', 'SIMPhony! 🎵'
];

const hangmanGames = new Map();
const tttGames = new Map();

function getHangmanDisplay(state) {
    const display = state.word.split('').map(c => state.guessed.has(c) ? c : '_').join(' ');
    const wrongStr = state.wrong.length > 0 ? state.wrong.join(', ') : 'None';
    const lives = '♥'.repeat(state.maxWrong - state.wrong.length) + '♡'.repeat(state.wrong.length);
    return `Word: ${display}\nWrong: ${wrongStr}\nLives: ${lives}`;
}

function buildTTTBoard(board) {
    const cells = board.map((c, i) => c || (i + 1).toString());
    return [
        `╭─ *TicTacToe*`,
        `│  ${cells[0]}  │  ${cells[1]}  │  ${cells[2]}  `,
        `│─────┼─────┼─────`,
        `│  ${cells[3]}  │  ${cells[4]}  │  ${cells[5]}  `,
        `│─────┼─────┼─────`,
        `│  ${cells[6]}  │  ${cells[7]}  │  ${cells[8]}  `,
        `│ `,
        `│ Your turn! Pick 1-9`,
        `│ You: ❌  Bot: ⭕`,
        `╰─ Codex-MD`
    ].join('\n');
}

function botTTTMove(board) {
    const available = board.map((c, i) => c === null ? i : -1).filter(i => i !== -1);
    if (available.length === 0) return -1;
    return available[Math.floor(Math.random() * available.length)];
}

function checkTTTWinner(board) {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    for (const [a,b,c] of wins) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    if (board.every(c => c !== null)) return 'tie';
    return null;
}

function spinReels() {
    return Array.from({ length: 3 }, () => slotSymbols[Math.floor(Math.random() * slotSymbols.length)]);
}

function evalSlot(reels) {
    if (reels[0] === reels[1] && reels[1] === reels[2]) return 'JACKPOT! 🎉';
    if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) return 'Small Win! ✨';
    return 'Try Again! 😅';
}

function sarcasmConvert(t) {
    return t.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
}

export default {
    name: 'funmore',
    aliases: ['8ball', 'magicball', 'hangman', 'rps', 'rockpaperscissors', 'slot', 'slotmachine', 'tictactoe', 'ttt', 'love', 'lovecalc', 'mood', 'rate', 'roll', 'dice', 'simp', 'simprate', 'energy', 'luck', 'clap', 'sarcasm', 'braincells'],
    description: 'Extra fun & games',
    category: 'General',
    run: async (context) => {
        const { client, m, command, text, args, pushname } = context;
        const fq = getFakeQuoted(m);
        const name = pushname || m.pushName || 'User';

        try {
            switch (command) {
                case '8ball':
                case 'magicball': {
                    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                    if (!text) {
                        return client.sendMessage(m.chat, {
                            text: `╭─ *Magic 8-Ball* 🎱\n│ Ask me a question first!\n╰─ Codex-MD`
                        }, { quoted: fq });
                    }
                    const answer = ballAnswers[Math.floor(Math.random() * ballAnswers.length)];
                    await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                    return client.sendMessage(m.chat, {
                        text: `╭─ *Magic 8-Ball* 🎱\n├\n│ Question: ${text}\n│ Answer: ${answer}\n╰─ Codex-MD`
                    }, { quoted: fq });
                }

                case 'hangman': {
                    const chatId = m.chat;
                    if (!text) {
                        const word = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
                        hangmanGames.set(chatId, { word, guessed: new Set(), wrong: [], maxWrong: 6 });
                        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                        const state = hangmanGames.get(chatId);
                        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                        return client.sendMessage(m.chat, {
                            text: `╭─ *Hangman* 🎮\n│ New game started!\n│ ${getHangmanDisplay(state)}\n╰─ Codex-MD`
                        }, { quoted: fq });
                    }
                    const state = hangmanGames.get(chatId);
                    if (!state) {
                        return client.sendMessage(m.chat, {
                            text: `╭─ *Hangman* 🎮\n│ No active game! Send .hangman to start.\n╰─ Codex-MD`
                        }, { quoted: fq });
                    }
                    const letter = text.toLowerCase().trim()[0];
                    if (!letter || !/[a-z]/.test(letter)) {
                        return client.sendMessage(m.chat, {
                            text: `╭─ *Hangman* 🎮\n│ Send a single letter!\n╰─ Codex-MD`
                        }, { quoted: fq });
                    }
                    if (state.guessed.has(letter) || state.wrong.includes(letter)) {
                        return client.sendMessage(m.chat, {
                            text: `╭─ *Hangman* 🎮\n│ Letter "${letter}" already guessed!\n│ ${getHangmanDisplay(state)}\n╰─ Codex-MD`
                        }, { quoted: fq });
                    }
                    if (state.word.includes(letter)) {
                        state.guessed.add(letter);
                        const won = state.word.split('').every(c => state.guessed.has(c));
                        if (won) {
                            hangmanGames.delete(chatId);
                            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                            return client.sendMessage(m.chat, {
                                text: `╭─ *Hangman* 🎮\n│ You won! 🎉\n│ Word: ${state.word}\n╰─ Codex-MD`
                            }, { quoted: fq });
                        }
                        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                        return client.sendMessage(m.chat, {
                            text: `╭─ *Hangman* 🎮\n│ Correct! ✅\n│ ${getHangmanDisplay(state)}\n╰─ Codex-MD`
                        }, { quoted: fq });
                    } else {
                        state.wrong.push(letter);
                        if (state.wrong.length >= state.maxWrong) {
                            hangmanGames.delete(chatId);
                            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                            return client.sendMessage(m.chat, {
                                text: `╭─ *Hangman* 🎮\n│ Game Over! 💀\n│ Word: ${state.word}\n╰─ Codex-MD`
                            }, { quoted: fq });
                        }
                        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                        return client.sendMessage(m.chat, {
                            text: `╭─ *Hangman* 🎮\n│ Wrong! ❌\n│ ${getHangmanDisplay(state)}\n╰─ Codex-MD`
                        }, { quoted: fq });
                    }
                }

                case 'rps':
                case 'rockpaperscissors': {
                    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                    const choices = ['rock', 'paper', 'scissors'];
                    const emojis = { rock: '👊', paper: '✋', scissors: '✌️' };
                    const userChoice = text ? text.toLowerCase().trim() : '';
                    if (!choices.includes(userChoice)) {
                        return client.sendMessage(m.chat, {
                            text: `╭─ *Rock Paper Scissors*\n│ Use: .rps rock / paper / scissors\n╰─ Codex-MD`
                        }, { quoted: fq });
                    }
                    const botChoice = choices[Math.floor(Math.random() * 3)];
                    let result;
                    if (userChoice === botChoice) {
                        result = 'Tie';
                    } else if (
                        (userChoice === 'rock' && botChoice === 'scissors') ||
                        (userChoice === 'paper' && botChoice === 'rock') ||
                        (userChoice === 'scissors' && botChoice === 'paper')
                    ) {
                        result = 'Win';
                    } else {
                        result = 'Lose';
                    }
                    const resultEmojis = { Win: '🎉', Lose: '😭', Tie: '🤝' };
                    await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                    return client.sendMessage(m.chat, {
                        text: `╭─ *Rock Paper Scissors*\n│ You: ${userChoice} ${emojis[userChoice]}\n│ Bot: ${botChoice} ${emojis[botChoice]}\n│ Result: ${resultEmojis[result]} ${result}!\n╰─ Codex-MD`
                    }, { quoted: fq });
                }

                case 'slot':
                case 'slotmachine': {
                    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                    const bet = Math.min(Math.max(parseInt(text) || 0, 0), 10000);
                    const reels = spinReels();
                    const slotResult = evalSlot(reels);
                    await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                    return client.sendMessage(m.chat, {
                        text: `╭─ *Slot Machine* 🎰\n│ [${reels[0]}] [${reels[1]}] [${reels[2]}]\n│ Bet: ${bet || 'Free'}\n│ Result: ${slotResult}\n╰─ Codex-MD`
                    }, { quoted: fq });
                }

                case 'tictactoe':
                case 'ttt': {
                    const chatId = m.chat;
                    if (!text || text.toLowerCase().trim() === 'start') {
                        const board = Array(9).fill(null);
                        tttGames.set(chatId, { board, turn: 'X', over: false });
                        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                        return client.sendMessage(m.chat, {
                            text: buildTTTBoard(board)
                        }, { quoted: fq });
                    }
                    const game = tttGames.get(chatId);
                    if (!game || game.over) {
                        return client.sendMessage(m.chat, {
                            text: `╭─ *TicTacToe*\n│ No active game! Send .ttt start\n╰─ Codex-MD`
                        }, { quoted: fq });
                    }
                    const pos = parseInt(text.trim()) - 1;
                    if (isNaN(pos) || pos < 0 || pos > 8) {
                        return client.sendMessage(m.chat, {
                            text: `╭─ *TicTacToe*\n│ Pick a number 1-9!\n╰─ Codex-MD`
                        }, { quoted: fq });
                    }
                    if (game.board[pos] !== null) {
                        return client.sendMessage(m.chat, {
                            text: `╭─ *TicTacToe*\n│ That spot is taken!\n╰─ Codex-MD`
                        }, { quoted: fq });
                    }
                    game.board[pos] = 'X';
                    let winner = checkTTTWinner(game.board);
                    if (winner) {
                        tttGames.delete(chatId);
                        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                        const msg = winner === 'tie' ? "It's a tie!" : 'You win! 🎉';
                        return client.sendMessage(m.chat, {
                            text: `╭─ *TicTacToe*\n│ ${msg}\n${buildTTTBoard(game.board).split('\n').slice(1).join('\n')}`
                        }, { quoted: fq });
                    }
                    const botPos = botTTTMove(game.board);
                    if (botPos === -1) {
                        tttGames.delete(chatId);
                        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                        return client.sendMessage(m.chat, {
                            text: `╭─ *TicTacToe*\n│ It's a tie!\n${buildTTTBoard(game.board).split('\n').slice(1).join('\n')}`
                        }, { quoted: fq });
                    }
                    game.board[botPos] = 'O';
                    winner = checkTTTWinner(game.board);
                    if (winner) {
                        tttGames.delete(chatId);
                        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                        const msg = winner === 'tie' ? "It's a tie!" : 'Bot wins! 😵';
                        return client.sendMessage(m.chat, {
                            text: `╭─ *TicTacToe*\n│ ${msg}\n${buildTTTBoard(game.board).split('\n').slice(1).join('\n')}`
                        }, { quoted: fq });
                    }
                    await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                    return client.sendMessage(m.chat, {
                        text: buildTTTBoard(game.board)
                    }, { quoted: fq });
                }

                case 'love':
                case 'lovecalc': {
                    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                    if (!text) {
                        return client.sendMessage(m.chat, {
                            text: `╭─ *Love Calculator* 💕\n│ Enter two names!\n│ .lovecalc Name1 + Name2\n╰─ Codex-MD`
                        }, { quoted: fq });
                    }
                    const parts = text.split(/\+/).map(s => s.trim());
                    const name1 = parts[0] || name;
                    const name2 = parts[1] || 'Unknown';
                    const pct = Math.floor(Math.random() * 101);
                    let msg;
                    if (pct <= 20) msg = 'Not meant to be 😅';
                    else if (pct <= 40) msg = 'Maybe friends 🤔';
                    else if (pct <= 60) msg = 'Could work! 😊';
                    else if (pct <= 80) msg = 'Great match! 💑';
                    else msg = 'Soulmates! 💞';
                    await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                    return client.sendMessage(m.chat, {
                        text: `╭─ *Love Calculator* 💕\n├\n│ ${name1} ❤️ ${name2}\n│ Compatibility: ${pct}%\n│ ${msg}\n╰─ Codex-MD`
                    }, { quoted: fq });
                }

                case 'mood': {
                    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                    const mood = moods[Math.floor(Math.random() * moods.length)];
                    const target = text || name;
                    await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                    return client.sendMessage(m.chat, {
                        text: `╭─ *Mood Check* 🌤️\n├\n│ ${target}'s mood today: ${mood}\n╰─ Codex-MD`
                    }, { quoted: fq });
                }

                case 'rate': {
                    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                    if (!text) {
                        return client.sendMessage(m.chat, {
                            text: `╭─ *Rate-o-Meter* ⭐\n│ What should I rate?\n╰─ Codex-MD`
                        }, { quoted: fq });
                    }
                    const rating = Math.floor(Math.random() * 10) + 1;
                    const comment = rateComments[rating - 1];
                    await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                    return client.sendMessage(m.chat, {
                        text: `╭─ *Rate-o-Meter* ⭐\n├\n│ You asked: ${text}\n│ Rating: ${rating}/10\n│ ${comment}\n╰─ Codex-MD`
                    }, { quoted: fq });
                }

                case 'roll':
                case 'dice': {
                    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                    const sides = Math.max(2, Math.min(parseInt(text) || 6, 100));
                    const roll = Math.floor(Math.random() * sides) + 1;
                    let face = '';
                    if (sides === 6) {
                        face = diceFaces[roll - 1];
                    }
                    await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                    return client.sendMessage(m.chat, {
                        text: `╭─ *Dice Roll* 🎲\n├\n│ You rolled: ${face || roll}\n│ (out of ${sides})\n╰─ Codex-MD`
                    }, { quoted: fq });
                }

                case 'simp':
                case 'simprate': {
                    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                    const target = text || name;
                    const pct = Math.floor(Math.random() * 101);
                    const idx = Math.min(Math.floor(pct / 10), 9);
                    const comment = simpComments[idx];
                    await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                    return client.sendMessage(m.chat, {
                        text: `╭─ *Simp Rate* 👑\n├\n│ ${target}: ${pct}% simp\n│ ${comment}\n╰─ Codex-MD`
                    }, { quoted: fq });
                }

                case 'energy': {
                    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                    const pct = Math.floor(Math.random() * 101);
                    const filled = Math.floor(pct / 10);
                    const empty = 10 - filled;
                    const bar = '█'.repeat(filled) + '░'.repeat(empty);
                    await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                    return client.sendMessage(m.chat, {
                        text: `╭─ *Energy Check* ⚡\n├\n│ ${name}'s energy: ${pct}%\n│ ${bar}\n╰─ Codex-MD`
                    }, { quoted: fq });
                }

                case 'luck': {
                    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                    const pct = Math.floor(Math.random() * 101);
                    await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                    return client.sendMessage(m.chat, {
                        text: `╭─ *Luck Meter* 🍀\n├\n│ ${name}'s luck today: ${pct}%\n╰─ Codex-MD`
                    }, { quoted: fq });
                }

                case 'clap': {
                    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                    if (!text) {
                        return client.sendMessage(m.chat, {
                            text: `╭─ *Clap*\n│ Send text to clap-ify!\n╰─ Codex-MD`
                        }, { quoted: fq });
                    }
                    const clapped = text.trim().split(/\s+/).join(' 👏 ');
                    await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                    return client.sendMessage(m.chat, {
                        text: `╭─ *Clap* 👏\n├\n│ ${clapped} 👏\n╰─ Codex-MD`
                    }, { quoted: fq });
                }

                case 'sarcasm': {
                    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                    if (!text) {
                        return client.sendMessage(m.chat, {
                            text: `╭─ *Sarcasm*\n│ Send text to sarcasm-ify!\n╰─ Codex-MD`
                        }, { quoted: fq });
                    }
                    const sass = sarcasmConvert(text.trim());
                    await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                    return client.sendMessage(m.chat, {
                        text: `╭─ *Sarcasm* 😏\n├\n│ ${sass}\n╰─ Codex-MD`
                    }, { quoted: fq });
                }

                case 'braincells': {
                    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                    let count;
                    const r = Math.random();
                    if (r < 0.6) count = Math.floor(Math.random() * 4);
                    else if (r < 0.8) count = Math.floor(Math.random() * 11) + 4;
                    else if (r < 0.95) count = Math.floor(Math.random() * 40) + 15;
                    else count = Math.floor(Math.random() * 61) + 40;
                    await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                    return client.sendMessage(m.chat, {
                        text: `╭─ *Brain Cell Count* 🧠\n├\n│ ${name} has ${count} brain cells\n╰─ Codex-MD`
                    }, { quoted: fq });
                }

                default:
                    return client.sendMessage(m.chat, {
                        text: `╭─ *Error*\n│ Unknown subcommand\n╰─ Codex-MD`
                    }, { quoted: fq });
            }
        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return client.sendMessage(m.chat, {
                text: `╭─ *Error*\n│ Something went wrong!\n╰─ Codex-MD`
            }, { quoted: fq });
        }
    }
};
