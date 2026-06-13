import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import axios from 'axios';

const DUAS = [
    { arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translation: 'In the name of Allah, the Most Gracious, the Most Merciful', reference: 'Quran 1:1' },
    { arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', translation: 'All praise is due to Allah, Lord of the worlds', reference: 'Quran 1:2' },
    { arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', translation: 'The Most Gracious, the Most Merciful', reference: 'Quran 1:3' },
    { arabic: 'مَالِكِ يَوْمِ الدِّينِ', translation: 'Master of the Day of Judgment', reference: 'Quran 1:4' },
    { arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', translation: 'You alone we worship, and You alone we ask for help', reference: 'Quran 1:5' },
    { arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', translation: 'Guide us to the straight path', reference: 'Quran 1:6' },
    { arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', translation: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of existence', reference: 'Quran 2:255 (Ayat al-Kursi)' },
    { arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', translation: 'Our Lord, give us in this world good and in the Hereafter good, and protect us from the punishment of the Fire', reference: 'Quran 2:201' },
    { arabic: 'سُبْحَانَ اللَّهِ', translation: 'Glory be to Allah', reference: 'Tasbeeh' },
    { arabic: 'الْحَمْدُ لِلَّهِ', translation: 'All praise is due to Allah', reference: 'Tahmeed' },
    { arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', translation: 'There is no deity but Allah', reference: 'Tahlil' },
    { arabic: 'اللَّهُ أَكْبَرُ', translation: 'Allah is the Greatest', reference: 'Takbeer' },
    { arabic: 'أَسْتَغْفِرُ اللَّهَ', translation: 'I seek forgiveness from Allah', reference: 'Istighfar' },
    { arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', translation: 'O Allah, send blessings upon Muhammad', reference: 'Durood' },
    { arabic: 'رَبِّ زِدْنِي عِلْمًا', translation: 'My Lord, increase me in knowledge', reference: 'Quran 20:114' },
    { arabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ', translation: 'Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy on us, we will surely be among the losers', reference: 'Quran 7:23' },
    { arabic: 'رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا', translation: 'Our Lord, do not impose blame upon us if we forget or make a mistake', reference: 'Quran 2:286' },
    { arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ', translation: 'Our Lord, grant us from among our wives and children comfort to our eyes', reference: 'Quran 25:74' },
    { arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', translation: 'My Lord, expand for me my chest and ease for me my task', reference: 'Quran 20:25-26' },
    { arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ', translation: 'O Allah, I ask You for well-being in this world and the Hereafter', reference: 'Prophetic Dua' },
];

const HADITHS = [
    { text: 'Actions are judged by intentions, and everyone will be rewarded according to their intention.', narrator: 'Umar ibn Al-Khattab', source: 'Sahih Bukhari 1' },
    { text: 'None of you truly believes until he loves for his brother what he loves for himself.', narrator: 'Prophet Muhammad ﷺ', source: 'Sahih Bukhari 13' },
    { text: 'The best of you are those who are best to their families.', narrator: 'Prophet Muhammad ﷺ', source: 'Sunan Tirmidhi 3895' },
    { text: 'A good word is charity.', narrator: 'Prophet Muhammad ﷺ', source: 'Sahih Bukhari 2989' },
    { text: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.', narrator: 'Prophet Muhammad ﷺ', source: 'Sahih Bukhari 6018' },
    { text: 'The most beloved of people to Allah are those who are most beneficial to others.', narrator: 'Prophet Muhammad ﷺ', source: 'Al-Mu\'jam Al-Awsat 6192' },
    { text: 'Make things easy, do not make things difficult. Give glad tidings, do not repel people.', narrator: 'Prophet Muhammad ﷺ', source: 'Sahih Bukhari 69' },
    { text: 'The strong person is not the one who can wrestle, but the one who controls himself at times of anger.', narrator: 'Prophet Muhammad ﷺ', source: 'Sahih Bukhari 6114' },
    { text: 'Whoever does not thank people, does not thank Allah.', narrator: 'Prophet Muhammad ﷺ', source: 'Sunan Abi Dawud 4811' },
    { text: 'The best of people are those with the best character.', narrator: 'Prophet Muhammad ﷺ', source: 'Sahih Bukhari 6035' },
];

const DEVOTIONAL_FALLBACKS = [
    { title: 'Trust in the Lord', verse: 'Trust in the Lord with all your heart and lean not on your own understanding.', reference: 'Proverbs 3:5', message: 'When life feels uncertain, remember that God\'s plan is greater than our worries. Surrender your anxieties to Him and walk in faith.' },
    { title: 'Strength in Weakness', verse: 'My grace is sufficient for you, for my power is made perfect in weakness.', reference: '2 Corinthians 12:9', message: 'Your weaknesses are not failures — they are opportunities for God\'s strength to shine through you.' },
    { title: 'Love One Another', verse: 'A new command I give you: Love one another. As I have loved you, so you must love one another.', reference: 'John 13:34', message: 'Love is the greatest commandment. Let your actions today reflect the unconditional love God has shown you.' },
    { title: 'Peace in Chaos', verse: 'Peace I leave with you; my peace I give you. I do not give to you as the world gives.', reference: 'John 14:27', message: 'The world\'s peace is temporary, but God\'s peace surpasses all understanding. Seek Him in the midst of your storm.' },
    { title: 'Faith Over Fear', verse: 'Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God.', reference: 'Philippians 4:6', message: 'Fear is a liar. Bring everything to God in prayer and let His peace guard your heart and mind.' },
    { title: 'A Light to the World', verse: 'You are the light of the world. A town built on a hill cannot be hidden.', reference: 'Matthew 5:14', message: 'Let your light shine before others, that they may see your good deeds and glorify your Father in heaven.' },
    { title: 'New Mercies Every Morning', verse: 'The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning.', reference: 'Lamentations 3:22-23', message: 'No matter what happened yesterday, God\'s mercies are fresh today. Start anew.' },
    { title: 'The Shepherd\'s Care', verse: 'The Lord is my shepherd; I shall not want.', reference: 'Psalm 23:1', message: 'God provides for all your needs — physically, emotionally, and spiritually. Rest in His care today.' },
    { title: 'Forgiveness', verse: 'Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.', reference: 'Ephesians 4:32', message: 'Forgiveness is not about the other person — it is about freeing your own heart. Let go and let God.' },
    { title: 'Hope for Today', verse: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.', reference: 'Jeremiah 29:11', message: 'God has a purpose for your life. Trust His timing and walk in hope.' },
];

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export default {
    name: 'religion',
    aliases: ['bible', 'bibleverse', 'dailyverse', 'dailydevotional', 'devotional', 'dua', 'hadith', 'quran', 'quranverse', 'surah', 'ayat'],
    description: 'Religion & spiritual commands — bible, dailyverse, devotional, dua, hadith, quran',
    category: 'General',
    run: async (context) => {
        const { client, m, command, text, args, prefix } = context;
        const fq = getFakeQuoted(m);
        const cmd = command.toLowerCase();
        const input = text ? text.trim() : '';
        const rk = m.reactKey;

        await client.sendMessage(m.chat, { react: { text: '⌛', key: rk } });

        // --- bible / bibleverse ---
        if (cmd === 'bible' || cmd === 'bibleverse') {
            try {
                let url = 'https://bible-api.com/?random=verse';
                if (input) url = `https://bible-api.com/${input.replace(/\s+/g, '+')}`;
                const { data } = await axios.get(url, { timeout: 10000 });
                if (!data?.text) throw new Error('empty');
                const t = data.text.trim();
                const ref = data.reference || 'Unknown';
                const tr = data.translation_name || 'KJV';
                await client.sendMessage(m.chat, { react: { text: '✅', key: rk } });
                return client.sendMessage(m.chat, {
                    text: `╭─ *Bible Verse* ✝️\n│ "${t}"\n│ — ${ref} (${tr})\n╰─ Codex-MD`
                }, { quoted: fq });
            } catch {
                await client.sendMessage(m.chat, { react: { text: '❌', key: rk } }).catch(() => {});
                return client.sendMessage(m.chat, {
                    text: `╭─ *Bible Verse* ✝️\n│ "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future."\n│ — Jeremiah 29:11 (NIV)\n╰─ Codex-MD`
                }, { quoted: fq });
            }
        }

        // --- dailyverse / dailydevotional ---
        if (cmd === 'dailyverse' || cmd === 'dailydevotional') {
            try {
                const { data } = await axios.get('https://beta.ourmanna.com/api/v1/get/?format=json', { timeout: 10000 });
                const verse = data?.verse?.details?.text || data?.verse?.text || 'The Lord is my shepherd; I shall not want.';
                const reference = data?.verse?.details?.reference || data?.verse?.reference || 'Psalm 23:1';
                await client.sendMessage(m.chat, { react: { text: '✅', key: rk } });
                return client.sendMessage(m.chat, {
                    text: `╭─ *Daily Verse* 🌅\n│ "${verse}"\n│ — ${reference}\n╰─ Codex-MD`
                }, { quoted: fq });
            } catch {
                await client.sendMessage(m.chat, { react: { text: '✅', key: rk } });
                return client.sendMessage(m.chat, {
                    text: `╭─ *Daily Verse* 🌅\n│ "This is the day the Lord has made; let us rejoice and be glad in it."\n│ — Psalm 118:24\n╰─ Codex-MD`
                }, { quoted: fq });
            }
        }

        // --- devotional ---
        if (cmd === 'devotional') {
            try {
                const { data } = await axios.get('https://api.akuari.my.id/tools/devotional', { timeout: 10000 });
                if (data?.title) {
                    await client.sendMessage(m.chat, { react: { text: '✅', key: rk } });
                    return client.sendMessage(m.chat, {
                        text: `╭─ *Devotional* 🙏\n│ 📖 ${data.title}\n│ \n│ "${data.verse}"\n│ — ${data.reference || 'Scripture'}\n│ \n│ ${data.message || data.content || ''}\n╰─ Codex-MD`
                    }, { quoted: fq });
                }
                throw new Error('invalid');
            } catch {
                const d = pick(DEVOTIONAL_FALLBACKS);
                await client.sendMessage(m.chat, { react: { text: '✅', key: rk } });
                return client.sendMessage(m.chat, {
                    text: `╭─ *Devotional* 🙏\n│ 📖 ${d.title}\n│ \n│ "${d.verse}"\n│ — ${d.reference}\n│ \n│ ${d.message}\n╰─ Codex-MD`
                }, { quoted: fq });
            }
        }

        // --- dua ---
        if (cmd === 'dua') {
            let pool = DUAS;
            if (input) {
                const q = input.toLowerCase();
                const filtered = DUAS.filter(d =>
                    d.translation.toLowerCase().includes(q) ||
                    d.reference.toLowerCase().includes(q) ||
                    d.arabic.includes(input)
                );
                if (filtered.length) pool = filtered;
            }
            const d = pick(pool);
            await client.sendMessage(m.chat, { react: { text: '✅', key: rk } });
            return client.sendMessage(m.chat, {
                text: `╭─ *Dua* 🤲\n│ ${d.arabic}\n│ \n│ ${d.translation}\n│ 📖 ${d.reference}\n╰─ Codex-MD`
            }, { quoted: fq });
        }

        // --- hadith ---
        if (cmd === 'hadith') {
            try {
                const { data } = await axios.get('https://api.akuari.my.id/tools/hadith?random=true', { timeout: 10000 });
                const t = data?.text || data?.hadith || '';
                const n = data?.narrator || data?.narrator || 'Prophet Muhammad ﷺ';
                const s = data?.source || data?.source || data?.book || 'Hadith';
                if (t) {
                    await client.sendMessage(m.chat, { react: { text: '✅', key: rk } });
                    return client.sendMessage(m.chat, {
                        text: `╭─ *Hadith* 📜\n│ "${t}"\n│ — ${n} (${s})\n╰─ Codex-MD`
                    }, { quoted: fq });
                }
                throw new Error('invalid');
            } catch {
                const h = pick(HADITHS);
                await client.sendMessage(m.chat, { react: { text: '✅', key: rk } });
                return client.sendMessage(m.chat, {
                    text: `╭─ *Hadith* 📜\n│ "${h.text}"\n│ — ${h.narrator} (${h.source})\n╰─ Codex-MD`
                }, { quoted: fq });
            }
        }

        // --- quran / quranverse / surah / ayat ---
        if (['quran', 'quranverse', 'surah', 'ayat'].includes(cmd)) {
            try {
                let ayahId;
                let isSurahMode = false;
                let surahNum = null;

                if (input) {
                    const m2 = input.match(/^(\d+)(?::(\d+))?$/);
                    if (m2) {
                        if (m2[2]) {
                            ayahId = `${m2[1]}:${m2[2]}`;
                        } else {
                            const n = parseInt(m2[1]);
                            if (cmd === 'surah') {
                                isSurahMode = true;
                                surahNum = n;
                            } else if (cmd === 'ayat') {
                                ayahId = String(n);
                            } else {
                                if (n <= 114) {
                                    isSurahMode = true;
                                    surahNum = n;
                                } else {
                                    ayahId = String(n);
                                }
                            }
                        }
                    }
                }

                let arabic, english, surahName, ayahDisplay;

                if (isSurahMode && surahNum) {
                    const { data: surahData } = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNum}`, { timeout: 10000 });
                    const s = surahData?.data;
                    if (!s?.ayahs?.length) throw new Error('no ayahs');
                    const ayah = pick(s.ayahs);
                    arabic = ayah.text;
                    surahName = s.englishName || s.name || '';
                    ayahDisplay = ayah.numberInSurah;
                    const { data: enData } = await axios.get(`https://api.alquran.cloud/v1/surah/${surahNum}/en.asad`, { timeout: 10000 }).catch(() => ({ data: null }));
                    english = enData?.data?.ayahs?.find(a => a.numberInSurah === ayahDisplay)?.text || '';
                } else {
                    if (!ayahId) ayahId = String(Math.floor(Math.random() * 6236) + 1);
                    const [ar, en] = await Promise.all([
                        axios.get(`https://api.alquran.cloud/v1/ayah/${ayahId}`, { timeout: 10000 }).catch(() => null),
                        axios.get(`https://api.alquran.cloud/v1/ayah/${ayahId}/en.asad`, { timeout: 10000 }).catch(() => null),
                    ]);
                    if (!ar?.data?.data) throw new Error('no data');
                    arabic = ar.data.data.text || '';
                    english = en?.data?.data?.text || '';
                    surahName = ar.data.data.surah?.englishName || '';
                    ayahDisplay = ar.data.data.numberInSurah || ayahId;
                }

                if (!arabic) throw new Error('empty');
                await client.sendMessage(m.chat, { react: { text: '✅', key: rk } });
                return client.sendMessage(m.chat, {
                    text: `╭─ *Quran* 📖\n│ ${arabic}\n│ \n│ ${english}\n│ — Surah ${surahNum || ''} (${surahName}), Ayah ${ayahDisplay}\n╰─ Codex-MD`
                }, { quoted: fq });
            } catch {
                await client.sendMessage(m.chat, { react: { text: '❌', key: rk } }).catch(() => {});
                return client.sendMessage(m.chat, {
                    text: `╭─ *Quran* 📖\n│ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ\n│ \n│ Allah! There is no deity except Him, the Ever-Living, the Sustainer of existence\n│ — Surah 2 (Al-Baqarah), Ayah 255\n╰─ Codex-MD`
                }, { quoted: fq });
            }
        }

        await client.sendMessage(m.chat, { react: { text: '✅', key: rk } });
        return client.sendMessage(m.chat, {
            text: `╭─ *Religion Commands* 🙏\n│ • bible [ref] — Bible verse\n│ • dailyverse — Daily verse\n│ • devotional — Daily devotional\n│ • dua [search] — Islamic dua\n│ • hadith — Random hadith\n│ • quran [ref] — Quran verse\n│ • surah <n> — Random ayah from surah\n│ • ayat <n> — Specific ayah\n╰─ Codex-MD`
        }, { quoted: fq });
    }
};
