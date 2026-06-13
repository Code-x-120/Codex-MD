import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const ZODIAC = [
  { name: 'Capricorn', dates: 'Dec 22 - Jan 19', symbol: '♑', element: 'Earth', quality: 'Cardinal', ruler: 'Saturn', planet: 'Saturn', traits: ['Disciplined', 'Responsible', 'Patient', 'Ambitious', 'Practical'], strength: 'Discipline, responsibility, patience', weakness: 'Stubbornness, pessimism, rigidity', likes: 'Family, tradition, quality music', dislikes: 'Chaos, disorganization, laziness', color: 'Brown', day: 'Saturday', compat: ['Taurus', 'Virgo', 'Scorpio', 'Pisces'], incompat: ['Aries', 'Libra'], today: ['An unexpected opportunity will come your way today. Stay alert and ready to seize it.', 'Today favors reflection. Take time to plan your next move carefully.', 'Your patience will be tested today, but staying calm will bring rewards.'] },
  { name: 'Aquarius', dates: 'Jan 20 - Feb 18', symbol: '♒', element: 'Air', quality: 'Fixed', ruler: 'Uranus', planet: 'Uranus', traits: ['Innovative', 'Humanitarian', 'Independent', 'Intellectual', 'Eccentric'], strength: 'Creativity, humanitarianism, originality', weakness: 'Detachment, unpredictability, stubbornness', likes: 'Fun with friends, fighting for causes, intellectual conversations', dislikes: 'Limitations, broken promises, boredom', color: 'Blue', day: 'Saturday', compat: ['Gemini', 'Libra', 'Sagittarius', 'Aries'], incompat: ['Taurus', 'Scorpio'], today: ['Your innovative ideas will attract attention today. Speak up!', 'A surprising friendship will deepen today. Treasure it.', 'Trust your intuition about a new person you meet today.'] },
  { name: 'Pisces', dates: 'Feb 19 - Mar 20', symbol: '♓', element: 'Water', quality: 'Mutable', ruler: 'Neptune', planet: 'Neptune', traits: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle', 'Wise'], strength: 'Compassion, artistry, intuition', weakness: 'Escapism, over-sensitivity, indecisiveness', likes: 'Being alone, music, art, swimming', dislikes: 'Criticism, cruelty, harsh reality', color: 'Sea green', day: 'Thursday', compat: ['Cancer', 'Scorpio', 'Taurus', 'Capricorn'], incompat: ['Gemini', 'Sagittarius'], today: ['Your creative energy is at its peak. Channel it into something beautiful.', 'Someone from your past may reappear. Handle with care.', 'Listen to your dreams tonight — they carry a message for you.'] },
  { name: 'Aries', dates: 'Mar 21 - Apr 19', symbol: '♈', element: 'Fire', quality: 'Cardinal', ruler: 'Mars', planet: 'Mars', traits: ['Courageous', 'Determined', 'Confident', 'Enthusiastic', 'Optimistic'], strength: 'Courage, passion, confidence', weakness: 'Impatience, impulsiveness, aggression', likes: 'Competition, leadership, adventure', dislikes: 'Waiting, following, being ignored', color: 'Red', day: 'Tuesday', compat: ['Leo', 'Sagittarius', 'Gemini', 'Aquarius'], incompat: ['Cancer', 'Capricorn'], today: ['Your energy is magnetic today. Use it to lead a project or inspire someone.', 'A challenge will test your patience. Don\'t rush into decisions.', 'New beginnings are highlighted. Start that thing you\'ve been postponing.'] },
  { name: 'Taurus', dates: 'Apr 20 - May 20', symbol: '♉', element: 'Earth', quality: 'Fixed', ruler: 'Venus', planet: 'Venus', traits: ['Reliable', 'Patient', 'Practical', 'Devoted', 'Stable'], strength: 'Reliability, patience, practicality', weakness: 'Stubbornness, possessiveness, laziness', likes: 'Gardening, cooking, music, romance', dislikes: 'Change, instability, criticism', color: 'Green', day: 'Friday', compat: ['Virgo', 'Capricorn', 'Cancer', 'Pisces'], incompat: ['Leo', 'Aquarius'], today: ['Financial matters look promising. A small investment may pay off.', 'Your determination will overcome a stubborn obstacle today.', 'Take time to enjoy the simple pleasures — a good meal or a beautiful view.'] },
  { name: 'Gemini', dates: 'May 21 - Jun 20', symbol: '♊', element: 'Air', quality: 'Mutable', ruler: 'Mercury', planet: 'Mercury', traits: ['Adaptable', 'Outgoing', 'Intelligent', 'Versatile', 'Curious'], strength: 'Communication, adaptability, wit', weakness: 'Indecision, inconsistency, superficiality', likes: 'Talking, learning new things, variety', dislikes: 'Boredom, routine, being alone', color: 'Yellow', day: 'Wednesday', compat: ['Libra', 'Aquarius', 'Aries', 'Leo'], incompat: ['Virgo', 'Pisces'], today: ['A conversation today could open a door you didn\'t know existed.', 'Your dual nature serves you well — adapt to the changes coming your way.', 'Curiosity leads to discovery. Follow a random thought.'] },
  { name: 'Cancer', dates: 'Jun 21 - Jul 22', symbol: '♋', element: 'Water', quality: 'Cardinal', ruler: 'Moon', planet: 'Moon', traits: ['Tenacious', 'Loyal', 'Emotional', 'Intuitive', 'Protective'], strength: 'Tenacity, loyalty, intuition', weakness: 'Moodiness, clinginess, oversensitivity', likes: 'Art, home decorating, cooking, family', dislikes: 'Strangers, criticism, being ignored', color: 'Silver', day: 'Monday', compat: ['Scorpio', 'Pisces', 'Taurus', 'Virgo'], incompat: ['Aries', 'Libra'], today: ['Your intuition is spot on today. Trust your gut feelings.', 'Home and family matters need your attention. Nurture your relationships.', 'Emotional clarity comes after a quiet moment of reflection.'] },
  { name: 'Leo', dates: 'Jul 23 - Aug 22', symbol: '♌', element: 'Fire', quality: 'Fixed', ruler: 'Sun', planet: 'Sun', traits: ['Creative', 'Passionate', 'Generous', 'Warm', 'Cheerful'], strength: 'Creativity, generosity, leadership', weakness: 'Arrogance, stubbornness, vanity', likes: 'Theater, luxury, attention, vacations', dislikes: 'Being ignored, mundane tasks, criticism', color: 'Gold', day: 'Sunday', compat: ['Sagittarius', 'Aries', 'Gemini', 'Libra'], incompat: ['Taurus', 'Scorpio'], today: ['The spotlight finds you today. Own it with grace and humility.', 'Your generosity will touch someone deeply. A kind gesture goes far.', 'Creative projects flourish under today\'s energetic influence.'] },
  { name: 'Virgo', dates: 'Aug 23 - Sep 22', symbol: '♍', element: 'Earth', quality: 'Mutable', ruler: 'Mercury', planet: 'Mercury', traits: ['Analytical', 'Practical', 'Diligent', 'Modest', 'Intelligent'], strength: 'Analytical mind, practicality, diligence', weakness: 'Perfectionism, worry, criticism', likes: 'Order, cleanliness, animals, books', dislikes: 'Chaos, laziness, rudeness', color: 'Navy', day: 'Wednesday', compat: ['Taurus', 'Capricorn', 'Cancer', 'Scorpio'], incompat: ['Gemini', 'Sagittarius'], today: ['Your attention to detail will catch something important today.', 'Help someone without expecting anything in return. Good karma awaits.', 'Organize your space — it will bring mental clarity.'] },
  { name: 'Libra', dates: 'Sep 23 - Oct 22', symbol: '♎', element: 'Air', quality: 'Cardinal', ruler: 'Venus', planet: 'Venus', traits: ['Diplomatic', 'Social', 'Fair', 'Graceful', 'Charming'], strength: 'Diplomacy, fairness, charm', weakness: 'Indecisiveness, avoidance of conflict, superficiality', likes: 'Balance, harmony, art, music', dislikes: 'Injustice, conflict, ugliness', color: 'Pink', day: 'Friday', compat: ['Gemini', 'Aquarius', 'Leo', 'Sagittarius'], incompat: ['Cancer', 'Capricorn'], today: ['A relationship in your life needs balance. Initiate a heartfelt conversation.', 'Your sense of justice will be called upon. Stand up for what\'s right.', 'Beauty surrounds you — take a moment to appreciate the art in everyday life.'] },
  { name: 'Scorpio', dates: 'Oct 23 - Nov 21', symbol: '♏', element: 'Water', quality: 'Fixed', ruler: 'Pluto', planet: 'Pluto', traits: ['Passionate', 'Resourceful', 'Brave', 'Mysterious', 'Loyal'], strength: 'Passion, resourcefulness, bravery', weakness: 'Jealousy, secrecy, stubbornness', likes: 'Truth, puzzles, deep conversations', dislikes: 'Lies, superficiality, betrayal', color: 'Black', day: 'Tuesday', compat: ['Cancer', 'Pisces', 'Virgo', 'Capricorn'], incompat: ['Leo', 'Aquarius'], today: ['A mystery will unfold today. Your investigative skills are needed.', 'Your intensity is your superpower. Channel it into something productive.', 'Transformation is in the air. Let go of what no longer serves you.'] },
  { name: 'Sagittarius', dates: 'Nov 22 - Dec 21', symbol: '♐', element: 'Fire', quality: 'Mutable', ruler: 'Jupiter', planet: 'Jupiter', traits: ['Optimistic', 'Adventurous', 'Honest', 'Independent', 'Philosophical'], strength: 'Optimism, honesty, adventurousness', weakness: 'Tactlessness, impatience, restlessness', likes: 'Travel, freedom, philosophy, nature', dislikes: 'Restrictions, routine, clingy people', color: 'Purple', day: 'Thursday', compat: ['Aries', 'Leo', 'Libra', 'Aquarius'], incompat: ['Virgo', 'Pisces'], today: ['Adventure calls! A spontaneous decision could lead to wonderful memories.', 'Your optimism is contagious. Share it with someone who needs a lift.', 'A philosophical insight will bring clarity to a nagging question.'] }
];

const SHIO = [
  { name: 'Tikus', en: 'Rat', years: [1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020, 2032], element: 'Air', traits: ['Cerdas', 'Karismatik', 'Kreatif', 'Pekerja keras', 'Murah hati'], strength: 'Kecerdasan, karisma, kreativitas', weakness: 'Kepercayaan, manipulatif, ambisi berlebih', best: ['Naga', 'Monyet', 'Kerbau'], worst: ['Kuda', 'Kelinci', 'Kambing'], desc: 'Orang bershio Tikus memiliki pesona dan kecerdasan alami. Mereka adalah pemecah masalah ulung dan selalu punya rencana cadangan.' },
  { name: 'Kerbau', en: 'Ox', years: [1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021, 2033], element: 'Air', traits: ['Setia', 'Teliti', 'Pekerja keras', 'Sabtu', 'Dapat diandalkan'], strength: 'Kesetiaan, ketelitian, keandalan', weakness: 'Keras kepala, konservatif, lambat berubah', best: ['Ular', 'Ayam', 'Tikus'], worst: ['Harimau', 'Kambing', 'Anjing'], desc: 'Shio Kerbau dikenal karena ketekunan dan sifatnya yang dapat diandalkan. Mereka adalah fondasi yang kokoh bagi keluarga dan komunitas.' },
  { name: 'Harimau', en: 'Tiger', years: [1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022, 2034], element: 'Kayu', traits: ['Berani', 'Percaya diri', 'Berwibawa', 'Antusias', 'Murah hati'], strength: 'Keberanian, percaya diri, kewibawaan', weakness: 'Temperamental, sembrono, pemberontak', best: ['Kuda', 'Naga', 'Anjing'], worst: ['Monyet', 'Kambing', 'Ular'], desc: 'Harimau adalah pemimpin alami. Mereka berani mengambil risiko dan tidak pernah mundur dari tantangan.' },
  { name: 'Kelinci', en: 'Rabbit', years: [1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023, 2035], element: 'Kayu', traits: ['Lembut', 'Elegan', 'Penyayang', 'Waspada', 'Beruntung'], strength: 'Kelembutan, keanggunan, keberuntungan', weakness: 'Pemalu, terlalu hati-hati, suka menghindar', best: ['Kambing', 'Babi', 'Anjing'], worst: ['Ayam', 'Tikus', 'Naga'], desc: 'Kelinci adalah shio yang paling beruntung. Mereka memiliki naluri yang tajam dan selalu dikelilingi orang-orang yang menyayangi mereka.' },
  { name: 'Naga', en: 'Dragon', years: [1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024, 2036], element: 'Tanah', traits: ['Karismatik', 'Berbakat', 'Percaya diri', 'Kuat', 'Inovatif'], strength: 'Karisma, bakat, inovasi', weakness: 'Arogan, temperamen, perfeksionis', best: ['Tikus', 'Monyet', 'Ayam'], worst: ['Anjing', 'Kelinci', 'Kerbau'], desc: 'Naga adalah makhluk legendaris yang karismatik. Mereka dilahirkan untuk menjadi pemimpin dan memiliki ambisi besar.' },
  { name: 'Ular', en: 'Snake', years: [1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025, 2037], element: 'Tanah', traits: ['Bijaksana', 'Misterius', 'Anggun', 'Intuitif', 'Kaya'], strength: 'Kebijaksanaan, intuisi, keanggunan', weakness: 'Curiga, posesif, malas', best: ['Kerbau', 'Ayam', 'Naga'], worst: ['Harimau', 'Babi', 'Monyet'], desc: 'Ular adalah simbol kebijaksanaan. Mereka intuitif, misterius, dan selalu tahu cara mencapai tujuan mereka dengan tenang.' },
  { name: 'Kuda', en: 'Horse', years: [1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026, 2038], element: 'Api', traits: ['Bersemangat', 'Mandiri', 'Petualang', 'Ceria', 'Ramah'], strength: 'Semangat, kemandirian, keramahan', weakness: 'Impulsif, keras kepala, tidak sabar', best: ['Harimau', 'Kambing', 'Anjing'], worst: ['Tikus', 'Kerbau', 'Monyet'], desc: 'Kuda adalah jiwa yang bebas. Mereka petualang, energik, dan tidak bisa diikat oleh rutinitas yang monoton.' },
  { name: 'Kambing', en: 'Goat', years: [1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027, 2039], element: 'Api', traits: ['Lembut', 'Kreatif', 'Tenang', 'Penyayang', 'Artistik'], strength: 'Kreativitas, kelembutan, kesenian', weakness: 'Terlalu sensitif, mudah khawatir, suka mengeluh', best: ['Kelinci', 'Babi', 'Kuda'], worst: ['Kerbau', 'Anjing', 'Tikus'], desc: 'Kambing adalah jiwa seni. Mereka lembut, kreatif, dan sangat menghargai keindahan di sekeliling mereka.' },
  { name: 'Monyet', en: 'Monkey', years: [1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028, 2040], element: 'Logam', traits: ['Cerdik', 'Lucu', 'Inovatif', 'Licin', 'Mudah bergaul'], strength: 'Kecerdikan, inovasi, humor', weakness: 'Nakal, kurang sabar, manipulatif', best: ['Naga', 'Tikus', 'Kelinci'], worst: ['Harimau', 'Anjing', 'Babi'], desc: 'Monyet adalah shio yang paling cerdik. Mereka jenius dalam memecahkan masalah dan selalu selangkah lebih maju.' },
  { name: 'Ayam', en: 'Rooster', years: [1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029, 2041], element: 'Logam', traits: ['Teliti', 'Percaya diri', 'Tepat waktu', 'Terorganisir', 'Jujur'], strength: 'Ketelitian, kejujuran, organisasi', weakness: 'Kritik berlebihan, sombong, perfeksionis', best: ['Kerbau', 'Naga', 'Ular'], worst: ['Tikus', 'Kelinci', 'Anjing'], desc: 'Ayam adalah penjaga waktu. Mereka teliti, terorganisir, dan selalu menepati janji mereka.' },
  { name: 'Anjing', en: 'Dog', years: [1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030, 2042], element: 'Tanah', traits: ['Setia', 'Jujur', 'Melindungi', 'Pemberani', 'Dapat dipercaya'], strength: 'Kesetiaan, kejujuran, keberanian', weakness: 'Pesimis, keras kepala, cemas', best: ['Harimau', 'Kelinci', 'Kuda'], worst: ['Naga', 'Ayam', 'Monyet'], desc: 'Anjing adalah sahabat terbaik. Mereka setia, jujur, dan akan selalu ada saat Anda membutuhkan mereka.' },
  { name: 'Babi', en: 'Pig', years: [1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031, 2043], element: 'Tanah', traits: ['Murah hati', 'Pemaaf', 'Pekerja keras', 'Jujur', 'Teguh'], strength: 'Kemurahan hati, kejujuran, keteguhan', weakness: 'Mudah percaya, naif, materialistis', best: ['Kambing', 'Kelinci', 'Harimau'], worst: ['Ular', 'Monyet', 'Tikus'], desc: 'Babi adalah shio yang paling tulus. Mereka murah hati, pekerja keras, dan selalu melihat yang terbaik dalam diri orang lain.' }
];

const WETON_DATA = {
  days: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
  dayNeptu: { 'Minggu': 5, 'Senin': 4, 'Selasa': 3, 'Rabu': 7, 'Kamis': 8, 'Jumat': 6, 'Sabtu': 9 },
  pasaran: ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'],
  pasaranNeptu: { 'Legi': 5, 'Pahing': 9, 'Pon': 7, 'Wage': 4, 'Kliwon': 8 }
};

const NEUTRAL_TEMPLATES = [
  'Saya melihat potensi besar dalam diri {name}. Dengan kerja keras, semua impian bisa tercapai.',
  'Garis kehidupan {name} menunjukkan perjalanan yang penuh liku namun berakhir bahagia.',
  'Energi positif mengelilingi {name}. Manfaatkan momentum ini untuk hal-hal besar.',
  'Bintang-bintang bersinar terang untuk {name}. Ini adalah waktu yang tepat untuk memulai sesuatu yang baru.'
];

const LOVE_TEMPLATES_HIGH = [
  '{name1} dan {name2} bagaikan dua sisi mata uang. Cocok dan saling melengkapi!',
  'Hubungan {name1} dan {name2} sangat harmonis. Kalian seperti ditakdirkan bersama!',
  'Chemistry antara {name1} dan {name2} sangat kuat. Ini adalah pasangan yang solid!',
  'Bintang-bintang merestui hubungan {name1} dan {name2}. Bersiaplah untuk kebahagiaan!'
];

const LOVE_TEMPLATES_MED = [
  '{name1} dan {name2} memiliki kecocokan yang cukup baik. Perlu usaha untuk membuatnya sempurna.',
  'Antara {name1} dan {name2} ada getaran yang menarik. Coba lebih sering berkomunikasi.',
  'Hubungan {name1} dan {name2} seperti taman yang perlu dirawat. Saling pengertian adalah kuncinya.',
  '{name1} dan {name2} punya potensi yang bagus. Jangan biarkan ego merusak segalanya.'
];

const LOVE_TEMPLATES_LOW = [
  '{name1} dan {name2} memiliki perbedaan yang cukup signifikan. Butuh kompromi besar.',
  'Antara {name1} dan {name2} perlu banyak penyesuaian. Cinta sejati bisa mengatasi ini.',
  'Bintang-bintang menunjukkan {name1} dan {name2} berasal dari dunia yang berbeda. Tapi bukan berarti mustahil.',
  'Kecocokan {name1} dan {name2} memang rendah, tapi dengan usaha keras, semua bisa diatasi.'
];

function getZodiac(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  const month = d.getMonth() + 1;
  const day = d.getDate();
  if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return ZODIAC[0];
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return ZODIAC[1];
  if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return ZODIAC[2];
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return ZODIAC[3];
  if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return ZODIAC[4];
  if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return ZODIAC[5];
  if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return ZODIAC[6];
  if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return ZODIAC[7];
  if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return ZODIAC[8];
  if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return ZODIAC[9];
  if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return ZODIAC[10];
  if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return ZODIAC[11];
  return null;
}

function getShio(year) {
  const y = parseInt(year);
  if (isNaN(y)) return null;
  return SHIO.find(s => s.years.includes(y)) || null;
}

function nameAnalysis(name) {
  const clean = name.replace(/\s+/g, '').toLowerCase();
  const vowels = (clean.match(/[aiueo]/gi) || []).length;
  const consonants = clean.length - vowels;
  const totalWeight = clean.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const score = (vowels * 7 + consonants * 3 + totalWeight % 100) % 100;
  const elements = [];
  if (vowels > consonants) elements.push('Udara (Air)');
  else if (consonants > vowels) elements.push('Tanah (Earth)');
  else elements.push('Api (Fire)');
  if (clean.length <= 4) elements.push('Pendek → Cepat dalam mengambil keputusan');
  else if (clean.length <= 7) elements.push('Sedang → Seimbang dalam bertindak');
  else elements.push('Panjang → Teliti dan penuh pertimbangan');
  const fortune = score > 66 ? 'Cerah' : score > 33 ? 'Berkabut' : 'Mendung';
  const meaning = score > 66
    ? 'Nama ini membawa energi positif yang kuat. Pemiliknya cenderung sukses dalam karir dan percintaan.'
    : score > 33
    ? 'Nama ini memiliki keseimbangan yang baik. Kehidupan akan penuh dengan pasang surut yang wajar.'
    : 'Nama ini membutuhkan energi tambahan. Disarankan untuk menggunakan nama panggilan yang lebih positif.';
  return { score, vowels, consonants, elements, fortune, meaning };
}

function dreamInterpretation(dream) {
  const dreamLower = dream.toLowerCase();
  const keywords = {
    air: ['air', 'laut', 'sungai', 'danau', 'hujan', 'banjir', 'ombak'],
    api: ['api', 'kebakaran', 'terbakar', 'menyala', 'panas'],
    terbang: ['terbang', 'melayang', 'penerbangan', 'pesawat'],
    hewan: ['kucing', 'anjing', 'ular', 'harimau', 'gajah', 'burung', 'ikan', 'kuda'],
    orang: ['orang', 'teman', 'keluarga', 'ibu', 'ayah', 'saudara', 'mantan'],
    uang: ['uang', 'emas', 'berlian', 'harta', 'kaya', 'dompet'],
    kematian: ['mati', 'meninggal', 'kubur', 'mayat', 'jenazah', 'kematian'],
    makanan: ['makan', 'minum', 'nasi', 'roti', 'buah', 'kue'],
    rumah: ['rumah', 'gedung', 'kantor', 'sekolah', 'bangunan'],
    pernikahan: ['nikah', 'kawin', 'menikah', 'pengantin', 'cincin'],
    bayi: ['bayi', 'hamil', 'melahirkan', 'anak kecil', 'balita'],
    gigi: ['gigi', 'cabut gigi', 'gigi copot', 'gigi patah'],
    telanjang: ['telanjang', 'bugil', 'tanpa busana', 'tanpa pakaian'],
    dikejar: ['dikejar', 'kejaran', 'dikejar-kejar', 'dikejar orang']
  };
  let matched = [];
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(w => dreamLower.includes(w))) matched.push(category);
  }
  if (matched.length === 0) matched = ['umum'];
  const interpretations = {
    air: 'Mimpi tentang air menandakan emosi dan perasaan Anda saat ini. Air jernih = ketenangan, air keruh = kegelisahan.',
    api: 'Api dalam mimpi melambangkan semangat, transformasi, atau kemarahan yang terpendam. Bisa juga pertanda perubahan besar.',
    terbang: 'Mimpi terbang menunjukkan keinginan untuk bebas dari tekanan. Anda sedang mencari perspektif baru dalam hidup.',
    hewan: 'Hewan dalam mimpi mewakili naluri dasar Anda. Perhatikan sifat hewan tersebut untuk memahami pesannya.',
    orang: 'Mimpi tentang orang tertentu bisa berarti ada urusan yang belum selesai dengan mereka atau Anda merindukan sesuatu dari mereka.',
    uang: 'Mimpi tentang uang jarang tentang keuangan. Lebih sering tentang harga diri, kekuasaan, atau rasa takut kehilangan kendali.',
    kematian: 'Kematian dalam mimpi jarang berarti kematian sungguhan. Ini simbol akhir dari satu fase dan awal fase baru.',
    makanan: 'Makanan dalam mimpi melambangkan kepuasan, pengetahuan, atau kelaparan emosional. Perhatikan apakah makanannya enak atau basi.',
    rumah: 'Rumah mewakili diri Anda sendiri. Ruangan yang berbeda mewakili aspek berbeda dari kepribadian Anda.',
    pernikahan: 'Mimpi menikah menandakan persatuan, komitmen, atau penyatuan dua aspek dalam diri Anda.',
    bayi: 'Bayi melambangkan awal baru, kepolosan, atau proyek baru yang sedang Anda mulai.',
    gigi: 'Gigi copot sering menandakan kecemasan tentang penampilan atau ketakutan kehilangan sesuatu yang penting.',
    telanjang: 'Mimpi telanjang di tempat umum menandakan rasa rentan atau takut ketahuan akan sesuatu.',
    dikejar: 'Mimpi dikejar menunjukkan Anda sedang menghindari suatu masalah atau situasi dalam kehidupan nyata.',
    umum: 'Mimpi ini penuh makna pribadi. Coba renungkan apa yang sedang Anda pikirkan akhir-akhir ini dan kaitkan dengan mimpi tersebut.'
  };
  const selected = matched.map(m => interpretations[m] || interpretations['umum']);
  const main = selected[Math.floor(Math.random() * selected.length)];
  const fortune = ['Mimpi ini membawa pertanda baik.', 'Perhatikan detail dalam mimpi ini — ada pesan penting.', 'Mimpi ini adalah cerminan dari alam bawah sadar Anda.', 'Jangan terlalu khawatir. Mimpi adalah cara otak memproses informasi.'][Math.floor(Math.random() * 4)];
  return { main, fortune, elements: selected };
}

function getDayName(date) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[date.getDay()];
}

function getPasaran(date) {
  const start = new Date(2000, 0, 1);
  const diff = Math.floor((date - start) / 86400000);
  const p = ((diff % 5) + 5) % 5;
  return WETON_DATA.pasaran[p];
}

function getNeptu(dayName, pasaran) {
  return (WETON_DATA.dayNeptu[dayName] || 0) + (WETON_DATA.pasaranNeptu[pasaran] || 0);
}

function wetonAnalysis(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  const dayName = getDayName(d);
  const pasaran = getPasaran(d);
  const neptu = getNeptu(dayName, pasaran);
  const goodDays = [];
  const badDays = [];
  const hariBaik = ['Senin Legi', 'Kamis Pon', 'Jumat Wage', 'Sabtu Kliwon', 'Rabu Pahing', 'Minggu Pon', 'Selasa Kliwon'];
  const hariBuruk = ['Sabtu Pon', 'Selasa Wage', 'Minggu Kliwon', 'Senin Pahing', 'Rabu Legi', 'Kamis Wage', 'Jumat Pon'];
  for (let i = 0; i < 7; i++) {
    const future = new Date(d);
    future.setDate(future.getDate() + i + 1);
    const fDay = getDayName(future);
    const fPas = getPasaran(future);
    const str = `${fDay} ${fPas}`;
    if (hariBaik.includes(str)) goodDays.push(str);
    if (hariBuruk.includes(str)) badDays.push(str);
  }
  const neptuDesc = {
    7: 'Neptu rendah. Anda adalah pribadi yang tenang dan damai. Cocok bekerja di bidang seni atau pelayanan.',
    8: 'Neptu cukup rendah. Pribadi yang teliti dan bertanggung jawab. Baik dalam hal keuangan.',
    9: 'Neptu sedang. Anda memiliki jiwa kepemimpinan dan karisma alami.',
    10: 'Neptu sedang. Kreatif dan inovatif. Cocok untuk wirausaha.',
    11: 'Neptu cukup tinggi. Anda ambisius dan pekerja keras. Jaga kesehatan.',
    12: 'Neptu tinggi. Pribadi yang kuat dan berwibawa. Bisa menjadi pemimpin besar.',
    13: 'Neptu tinggi. Anda misterius dan karismatik. Banyak orang terpesona oleh Anda.',
    14: 'Neptu sangat tinggi. Anda memiliki energi spiritual yang kuat dan intuisi tajam.',
    15: 'Neptu sangat tinggi. Pribadi yang sempurna dan penuh keberuntungan.',
    16: 'Neptu tertinggi. Anda adalah pribadi yang istimewa dengan bakat luar biasa. Gunakan dengan bijak.'
  };
  return { dayName, pasaran, neptu, description: neptuDesc[neptu] || `Neptu ${neptu}. Anda memiliki karakter yang unik dan Istimewa.`, goodDays: goodDays.slice(0, 3), badDays: badDays.slice(0, 3) };
}

function characterAnalysis(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const sumDigits = n => n.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  const lifePath = sumDigits(day + month + year);
  const lp = lifePath > 9 ? sumDigits(lifePath) : lifePath;
  const biorhythm = Math.floor((day * month + year) % 100);
  const characters = {
    1: { title: 'Pemimpin', desc: 'Anda terlahir sebagai pemimpin. Mandiri, inovatif, dan berani mengambil inisiatif.' },
    2: { title: 'Diplomat', desc: 'Anda adalah pribadi yang peka dan diplomatis. Mudah bergaul dan menjembatani perbedaan.' },
    3: { title: 'Komunikator', desc: 'Kreatif, ekspresif, dan penuh inspirasi. Anda mampu mempengaruhi orang lain dengan kata-kata.' },
    4: { title: 'Pekerja Keras', desc: 'Disiplin, praktis, dan dapat diandalkan. Anda membangun kesuksesan dengan kerja keras.' },
    5: { title: 'Petualang', desc: 'Bebas, dinamis, dan penuh rasa ingin tahu. Anda butuh variasi dalam hidup.' },
    6: { title: 'Pengasuh', desc: 'Penuh kasih, bertanggung jawab, dan melindungi. Keluarga adalah prioritas utama Anda.' },
    7: { title: 'Pencari Kebenaran', desc: 'Analitis, intuitif, dan spiritual. Anda terus mencari makna kehidupan.' },
    8: { title: 'Penguasa', desc: 'Ambisis, berwibawa, dan visioner. Anda ditakdirkan untuk mencapai posisi tinggi.' },
    9: { title: 'Humanis', desc: 'Dermawan, bijaksana, dan penuh cinta kasih. Misi Anda adalah membuat dunia lebih baik.' }
  };
  const char = characters[lp] || characters[1];
  return { day, month, year, lifePath: lp, title: char.title, desc: char.desc, biorhythm, mood: biorhythm > 50 ? 'Positif' : biorhythm > 25 ? 'Netral' : 'Butuh Semangat' };
}

function destinyReading(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const total = day + month + year;
  const reduced = total.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  const final = reduced > 9 ? reduced.toString().split('').reduce((a, b) => a + parseInt(b), 0) : reduced;
  const dest = {
    1: { area: 'Kepemimpinan & Inovasi', advice: 'Fokus pada tujuan Anda. Jangan takut sendiri.', love: 'Pasangan yang cocok adalah pribadi yang mandiri seperti Anda.' },
    2: { area: 'Kerja Sama & Hubungan', advice: 'Belajar menyeimbangkan memberi dan menerima.', love: 'Carilah pasangan yang sabar dan pengertian.' },
    3: { area: 'Ekspresi Diri & Kreativitas', advice: 'Salurkan energi kreatif Anda ke hal-hal produktif.', love: 'Pasangan yang menghargai kreativitas Anda adalah jodoh sejati.' },
    4: { area: 'Stabilitas & Kerja Keras', advice: 'Bangun fondasi yang kuat untuk masa depan.', love: 'Cinta sejati datang pada mereka yang sabar.' },
    5: { area: 'Kebebasan & Petualangan', advice: 'Jangan takut mengambil risiko yang terukur.', love: 'Pasangan yang bisa mengikuti ritme Anda adalah yang terbaik.' },
    6: { area: 'Keluarga & Tanggung Jawab', advice: 'Jaga keharmonisan keluarga. Itu adalah kekayaan sejati.', love: 'Cinta sejati dimulai dari rumah.' },
    7: { area: 'Spiritualitas & Pengetahuan', advice: 'Carilah kebijaksanaan dalam setiap pengalaman.', love: 'Hubungan yang dalam secara spiritual akan membawa kebahagiaan.' },
    8: { area: 'Kekuasaan & Kemakmuran', advice: 'Gunakan pengaruh Anda untuk kebaikan.', love: 'Keseimbangan antara karir dan cinta adalah kunci.' },
    9: { area: 'Pengabdian & Kemanusiaan', advice: 'Memberi adalah menerima. Bagikan kebahagiaan.', love: 'Cinta sejati datang saat Anda tidak mencarinya.' }
  };
  const destiny = dest[final] || dest[1];
  return { total, reduced: final, destiny, day, month, year };
}

function loveCalc(name1, name2) {
  const n1 = name1.toLowerCase().replace(/\s/g, '');
  const n2 = name2.toLowerCase().replace(/\s/g, '');
  let match = 0;
  for (const ch of n1) if (n2.includes(ch)) match += 5;
  for (const ch of n2) if (n1.includes(ch)) match += 3;
  const totalLen = n1.length + n2.length;
  const vowelCount1 = (n1.match(/[aiueo]/gi) || []).length;
  const vowelCount2 = (n2.match(/[aiueo]/gi) || []).length;
  const vowelSim = Math.abs(vowelCount1 - vowelCount2);
  match += (vowelSim < 2 ? 15 : vowelSim < 4 ? 10 : 0);
  match += n1.length === n2.length ? 10 : 0;
  const score = Math.min(100, match + Math.floor(Math.random() * 15));
  return Math.max(15, score);
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default {
  name: 'primbon',
  aliases: ['zodiak', 'shio', 'artinama', 'artimimpi', 'ramaljodoh', 'weton', 'karakter', 'nasib', 'ramalcinta'],
  description: 'Primbon & fortune telling',
  category: 'Fun',
  run: async (context) => {
    const { client, m, command, text, args, prefix } = context;
    const fq = getFakeQuoted(m);
    const cmd = command.toLowerCase();

    if (!text && !['artimimpi'].includes(cmd)) {
      return client.sendMessage(m.chat, {
        text: `╭─ *Pʀɪᴍʙᴏɴ*\n├\n│ Commands:\n│ ${prefix}zodiak <nama> <tgl_lahir>\n│ ${prefix}shio <tahun>\n│ ${prefix}artinama <nama>\n│ ${prefix}artimimpi <mimpi>\n│ ${prefix}ramaljodoh <name1> | <name2>\n│ ${prefix}ramalcinta <name1> | <name2>\n│ ${prefix}weton <tgl_lahir>\n│ ${prefix}karakter <tgl_lahir>\n│ ${prefix}nasib <tgl_lahir>\n╰─ Codex-MD`
      }, { quoted: fq });
    }

    await client.sendMessage(m.chat, { react: { text: '🔮', key: m.reactKey } });

    try {
      // --- ZODIAK ---
      if (cmd === 'zodiak') {
        const parts = (text || '').trim().split(/\s+/);
        if (parts.length < 2) {
          return client.sendMessage(m.chat, {
            text: `╭─ *Zᴏᴅɪᴀᴋ*\n├\n│ Usage: ${prefix}zodiak <nama> <tgl_lahir>\n│ Example: ${prefix}zodiak Andi 15-08-1995\n╰─ Codex-MD`
          }, { quoted: fq });
        }
        const name = parts.slice(0, -1).join(' ');
        const dateStr = parts[parts.length - 1];
        const dateParts = dateStr.split(/[-/]/);
        if (dateParts.length !== 3) {
          return client.sendMessage(m.chat, {
            text: `╭─ *Zᴏᴅɪᴀᴋ*\n├\n│ Format tanggal: DD-MM-YYYY atau DD/MM/YYYY\n╰─ Codex-MD`
          }, { quoted: fq });
        }
        const birthDate = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
        const zodiac = getZodiac(birthDate);
        if (!zodiac) {
          return client.sendMessage(m.chat, {
            text: `╭─ *Zᴏᴅɪᴀᴋ*\n├\n│ Tanggal lahir tidak valid.\n╰─ Codex-MD`
          }, { quoted: fq });
        }
        const todayFortune = getRandomItem(zodiac.today);
        return client.sendMessage(m.chat, {
          text: `╭─ *Zᴏᴅɪᴀᴋ*\n├\n│ 👤 Nama: ${name}\n│ 🎂 Lahir: ${dateStr}\n├\n│ ${zodiac.symbol} ${zodiac.name} (${zodiac.dates})\n│ ▪ Elemen: ${zodiac.element}\n│ ▪ Sifat: ${zodiac.quality}\n│ ▪ Planet: ${zodiac.planet}\n│ ▪ Warna: ${zodiac.color}\n│ ▪ Hari: ${zodiac.day}\n├\n│ *Kepribadian:*\n│ ${zodiac.traits.join(', ')}\n├\n│ *Kelebihan:* ${zodiac.strength}\n│ *Kekurangan:* ${zodiac.weakness}\n├\n│ *Cocok dengan:* ${zodiac.compat.join(', ')}\n│ *Kurang cocok:* ${zodiac.incompat.join(', ')}\n├\n│ *Ramalan Hari Ini:*\n│ ${todayFortune}\n╰─ Codex-MD`
        }, { quoted: fq });
      }

      // --- SHIO ---
      if (cmd === 'shio') {
        const year = (text || '').trim();
        if (!/^\d{4}$/.test(year)) {
          return client.sendMessage(m.chat, {
            text: `╭─ *Sʜɪᴏ*\n├\n│ Usage: ${prefix}shio <tahun>\n│ Example: ${prefix}shio 1996\n╰─ Codex-MD`
          }, { quoted: fq });
        }
        const shio = getShio(year);
        if (!shio) {
          return client.sendMessage(m.chat, {
            text: `╭─ *Sʜɪᴏ*\n├\n│ Tahun ${year} tidak ditemukan.\n│ Shio: ${SHIO.map(s => s.years.join(', ')).join(' | ')}\n╰─ Codex-MD`
          }, { quoted: fq });
        }
        const fortune = ['Tahun ini membawa keberuntungan dalam karir dan keuangan.', 'Tahun yang baik untuk memulai hubungan baru.', 'Waspada dengan keputusan finansial. Jangan tergiur investasi bodong.', 'Kesehatan perlu perhatian ekstra tahun ini.', 'Tahun ini penuh dengan peluang menarik. Jangan sia-siakan!', 'Keberuntungan dalam percintaan menghampiri Anda.'] [Math.floor(Math.random() * 6)];
        return client.sendMessage(m.chat, {
          text: `╭─ *Sʜɪᴏ*\n├\n│ 🐾 ${shio.name} (${shio.en})\n│ Tahun Lahir: ${year}\n│ Elemen: ${shio.element}\n├\n│ *Kepribadian:*\n│ ${shio.traits.join(', ')}\n├\n│ *Kelebihan:* ${shio.strength}\n│ *Kekurangan:* ${shio.weakness}\n├\n│ *Cocok dengan:* ${shio.best.join(', ')}\n│ *Hindari:* ${shio.worst.join(', ')}\n├\n│ ${shio.desc}\n├\n│ 🔮 *Ramalan ${year}*:\n│ ${fortune}\n╰─ Codex-MD`
        }, { quoted: fq });
      }

      // --- ARTINAMA ---
      if (cmd === 'artinama') {
        const name = (text || '').trim();
        if (!name || name.length < 2) {
          return client.sendMessage(m.chat, {
            text: `╭─ *Aʀᴛɪ Nᴀᴍᴀ*\n├\n│ Usage: ${prefix}artinama <nama>\n│ Example: ${prefix}artinama Andi Pratama\n╰─ Codex-MD`
          }, { quoted: fq });
        }
        const analysis = nameAnalysis(name);
        return client.sendMessage(m.chat, {
          text: `╭─ *Aʀᴛɪ Nᴀᴍᴀ*\n├\n│ Nama: ${name}\n├\n│ 🔤 Total Huruf: ${name.replace(/\s/g, '').length}\n│ 🔡 Vokal: ${analysis.vowels}\n│ 🔠 Konsonan: ${analysis.consonants}\n│ 🧮 Skor: ${analysis.score}%\n├\n│ *Elemen:* ${analysis.elements.join(' | ')}\n│ *Nasib:* ${analysis.fortune}\n├\n│ ${analysis.meaning}\n├\n│ ${getRandomItem(NEUTRAL_TEMPLATES).replace('{name}', name)}\n╰─ Codex-MD`
        }, { quoted: fq });
      }

      // --- ARTIMIMPI ---
      if (cmd === 'artimimpi') {
        const dream = (text || '').trim();
        if (!dream || dream.length < 3) {
          return client.sendMessage(m.chat, {
            text: `╭─ *Aʀᴛɪ Mɪᴍᴘɪ*\n├\n│ Usage: ${prefix}artimimpi <deskripsi mimpi>\n│ Example: ${prefix}artimimpi mimpi melihat air laut\n╰─ Codex-MD`
          }, { quoted: fq });
        }
        const interpretation = dreamInterpretation(dream);
        return client.sendMessage(m.chat, {
          text: `╭─ *Aʀᴛɪ Mɪᴍᴘɪ*\n├\n│ 😴 Mimpi: ${dream}\n├\n│ ${interpretation.main}\n├\n│ ${interpretation.fortune}\n├\n│ *Elemen: ${interpretation.elements.join(', ')}*\n╰─ Codex-MD`
        }, { quoted: fq });
      }

      // --- RAMALJODOH / RAMALCINTA ---
      if (cmd === 'ramaljodoh' || cmd === 'ramalcinta') {
        const input = (text || '').trim();
        let parts;
        if (input.includes('|')) {
          parts = input.split('|').map(s => s.trim());
        } else if (input.includes('/')) {
          parts = input.split('/').map(s => s.trim());
        } else {
          const words = input.split(/\s+/);
          if (words.length < 2) {
            return client.sendMessage(m.chat, {
              text: `╭─ *${cmd === 'ramaljodoh' ? 'Rᴀᴍᴀʟ Jᴏᴅᴏʜ' : 'Rᴀᴍᴀʟ Cɪɴᴛᴀ'}*\n├\n│ Usage: ${prefix}${cmd} <nama1> | <nama2>\n│ Example: ${prefix}${cmd} Andi | Siska\n╰─ Codex-MD`
            }, { quoted: fq });
          }
          parts = [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')];
        }
        const [name1, name2] = parts;
        if (!name2 || name1.length < 1 || name2.length < 1) {
          return client.sendMessage(m.chat, {
            text: `╭─ *${cmd === 'ramaljodoh' ? 'Rᴀᴍᴀʟ Jᴏᴅᴏʜ' : 'Rᴀᴍᴀʟ Cɪɴᴛᴀ'}*\n├\n│ Berikan dua nama yang valid.\n╰─ Codex-MD`
          }, { quoted: fq });
        }
        const score = loveCalc(name1, name2);
        const template = score > 66 ? getRandomItem(LOVE_TEMPLATES_HIGH) : score > 33 ? getRandomItem(LOVE_TEMPLATES_MED) : getRandomItem(LOVE_TEMPLATES_LOW);
        const message = template.replace('{name1}', name1).replace('{name2}', name2);
        const stars = score > 80 ? '⭐⭐⭐⭐⭐' : score > 60 ? '⭐⭐⭐⭐' : score > 40 ? '⭐⭐⭐' : score > 25 ? '⭐⭐' : '⭐';
        const notes = [
          'Saran: Perbanyak komunikasi untuk memperkuat hubungan.',
          'Saran: Saling pengertian adalah kunci hubungan yang langgeng.',
          'Saran: Jangan lupa untuk saling menghargai perbedaan.',
          'Saran: Luangkan waktu bersama untuk mempererat ikatan.',
          'Saran: Kepercayaan adalah fondasi hubungan yang sehat.'
        ];
        return client.sendMessage(m.chat, {
          text: `╭─ *${cmd === 'ramaljodoh' ? 'Rᴀᴍᴀʟ Jᴏᴅᴏʜ' : 'Rᴀᴍᴀʟ Cɪɴᴛᴀ'}*\n├\n│ 💑 ${name1} ❤️ ${name2}\n├\n│ Kecocokan: ${score}%\n│ ${stars}\n├\n│ ${message}\n├\n│ ${getRandomItem(notes)}\n╰─ Codex-MD`
        }, { quoted: fq });
      }

      // --- WETON ---
      if (cmd === 'weton') {
        const dateStr = (text || '').trim();
        const dateParts = dateStr.split(/[-/]/);
        if (dateParts.length !== 3) {
          return client.sendMessage(m.chat, {
            text: `╭─ *Wᴇᴛᴏɴ*\n├\n│ Usage: ${prefix}weton <tgl_lahir>\n│ Example: ${prefix}weton 15-08-1995\n│ Format: DD-MM-YYYY\n╰─ Codex-MD`
          }, { quoted: fq });
        }
        const birthDate = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
        const weton = wetonAnalysis(birthDate);
        if (!weton) {
          return client.sendMessage(m.chat, {
            text: `╭─ *Wᴇᴛᴏɴ*\n├\n│ Tanggal tidak valid.\n╰─ Codex-MD`
          }, { quoted: fq });
        }
        return client.sendMessage(m.chat, {
          text: `╭─ *Wᴇᴛᴏɴ*\n├\n│ 📅 Tanggal: ${dateStr}\n│ 📆 Hari: ${weton.dayName}\n│ 🎭 Pasaran: ${weton.pasaran}\n│ 🔢 Neptu: ${weton.neptu}\n├\n│ ${weton.description}\n├\n│ *Hari Baik:* ${weton.goodDays.join(', ') || 'Tidak ada hari baik dalam 7 hari ke depan'}\n│ *Hari Kurang Baik:* ${weton.badDays.join(', ') || 'Tidak ada hari kurang baik dalam 7 hari ke depan'}\n╰─ Codex-MD`
        }, { quoted: fq });
      }

      // --- KARAKTER ---
      if (cmd === 'karakter') {
        const dateStr = (text || '').trim();
        const dateParts = dateStr.split(/[-/]/);
        if (dateParts.length !== 3) {
          return client.sendMessage(m.chat, {
            text: `╭─ *Kᴀʀᴀᴋᴛᴇʀ*\n├\n│ Usage: ${prefix}karakter <tgl_lahir>\n│ Example: ${prefix}karakter 15-08-1995\n│ Format: DD-MM-YYYY\n╰─ Codex-MD`
          }, { quoted: fq });
        }
        const birthDate = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
        const char = characterAnalysis(birthDate);
        if (!char) {
          return client.sendMessage(m.chat, {
            text: `╭─ *Kᴀʀᴀᴋᴛᴇʀ*\n├\n│ Tanggal tidak valid.\n╰─ Codex-MD`
          }, { quoted: fq });
        }
        return client.sendMessage(m.chat, {
          text: `╭─ *Kᴀʀᴀᴋᴛᴇʀ*\n├\n│ 📅 Lahir: ${dateStr}\n├\n│ 🧠 *Angka Jiwa:* ${char.lifePath}\n│ 🏷️ *Tipe:* ${char.title}\n├\n│ ${char.desc}\n├\n│ 📊 *Bioritme:* ${char.biorhythm}%\n│ 😊 *Mood:* ${char.mood}\n╰─ Codex-MD`
        }, { quoted: fq });
      }

      // --- NASIB ---
      if (cmd === 'nasib') {
        const dateStr = (text || '').trim();
        const dateParts = dateStr.split(/[-/]/);
        if (dateParts.length !== 3) {
          return client.sendMessage(m.chat, {
            text: `╭─ *Nᴀsɪʙ*\n├\n│ Usage: ${prefix}nasib <tgl_lahir>\n│ Example: ${prefix}nasib 15-08-1995\n│ Format: DD-MM-YYYY\n╰─ Codex-MD`
          }, { quoted: fq });
        }
        const birthDate = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
        const destiny = destinyReading(birthDate);
        if (!destiny) {
          return client.sendMessage(m.chat, {
            text: `╭─ *Nᴀsɪʙ*\n├\n│ Tanggal tidak valid.\n╰─ Codex-MD`
          }, { quoted: fq });
        }
        return client.sendMessage(m.chat, {
          text: `╭─ *Nᴀsɪʙ*\n├\n│ 📅 Lahir: ${dateStr}\n│ 🔢 Angka Nasib: ${destiny.reduced}\n├\n│ *Bidang Kehidupan:* ${destiny.destiny.area}\n├\n│ ${destiny.destiny.advice}\n├\n│ *Percintaan:* ${destiny.destiny.love}\n├\n│ 📝 Catatan: Setiap orang adalah penulis takdirnya sendiri. Gunakan ramalan ini sebagai panduan, bukan patokan.\n╰─ Codex-MD`
        }, { quoted: fq });
      }

    } catch (e) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
      return client.sendMessage(m.chat, {
        text: `╭─ *Pʀɪᴍʙᴏɴ*\n├\n│ Ada yang error. Coba lagi nanti.\n╰─ Codex-MD`
      }, { quoted: fq });
    }
  }
};
