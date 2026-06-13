import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const sessions = new Map();
const QUESTIONS_PER_GAME = 10;

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pickQuestions(pool, n = QUESTIONS_PER_GAME) {
    return shuffle(pool).slice(0, n);
}

const TEBAKKATA = [
    { clue: "Buah yang warnanya merah", answer: "apel" },
    { clue: "Hewan yang berkokok di pagi hari", answer: "ayam" },
    { clue: "Kendaraan yang terbang di udara", answer: "pesawat" },
    { clue: "Alat untuk menulis di papan tulis", answer: "kapur" },
    { clue: "Tempat belajar siswa", answer: "sekolah" },
    { clue: "Air yang turun dari langit", answer: "hujan" },
    { clue: "Hewan yang bisa berenang di air", answer: "ikan" },
    { clue: "Benda yang digunakan untuk melihat waktu", answer: "jam" },
    { clue: "Makanan pokok orang Indonesia", answer: "nasi" },
    { clue: "Hewan berkaki empat yang suka menggonggong", answer: "anjing" },
    { clue: "Tempat tinggal manusia", answer: "rumah" },
    { clue: "Kendaraan beroda dua", answer: "sepeda" },
    { clue: "Hewan yang suka memakan pisang", answer: "monyet" },
    { clue: "Bunga yang berwarna merah dan berduri", answer: "mawar" },
    { clue: "Alat komunikasi genggam", answer: "handphone" },
    { clue: "Hewan yang suka memakan wortel", answer: "kelinci" },
    { clue: "Sumber cahaya di siang hari", answer: "matahari" },
    { clue: "Alat untuk memotong di dapur", answer: "pisau" },
    { clue: "Kendaraan yang berlayar di laut", answer: "kapal" },
    { clue: "Hewan yang memiliki belalai panjang", answer: "gajah" },
    { clue: "Buah yang memiliki duri tajam", answer: "durian" },
    { clue: "Alat untuk menggoreng di dapur", answer: "wajan" },
    { clue: "Hewan yang bisa terbang di angkasa", answer: "burung" },
    { clue: "Tempat menyimpan uang dan kartu", answer: "dompet" },
    { clue: "Alat penerangan saat listrik padam", answer: "lilin" },
    { clue: "Pakaian yang dikenakan di bagian atas tubuh", answer: "baju" },
    { clue: "Hewan yang tinggal di gurun pasir", answer: "unta" },
    { clue: "Buah berwarna kuning dengan rasa asam", answer: "lemon" },
    { clue: "Alat musik petik bersenar enam", answer: "gitar" },
    { clue: "Hewan yang suka tidur di siang hari", answer: "kucing" },
    { clue: "Tempat ibadah umat Islam", answer: "masjid" },
    { clue: "Benda langit yang bersinar di malam hari", answer: "bulan" },
    { clue: "Alat untuk membersihkan lantai", answer: "sapu" },
    { clue: "Hewan dengan garis hitam putih di tubuhnya", answer: "zebra" },
    { clue: "Minuman yang terbuat dari biji kopi", answer: "kopi" },
];

const ASAHOTAK = [
    { question: "Apa yang semakin diisi semakin ringan?", answer: "balon" },
    { question: "Apa yang memiliki leher tetapi tidak memiliki kepala?", answer: "botol" },
    { question: "Apa yang memiliki kunci tetapi tidak bisa membuka pintu?", answer: "piano" },
    { question: "Apa yang memiliki mata tetapi tidak bisa melihat?", answer: "jarum" },
    { question: "Apa yang memiliki banyak gigi tetapi tidak bisa makan?", answer: "sisir" },
    { question: "Apa yang selalu diikuti tetapi tidak pernah bisa dikejar?", answer: "bayangan" },
    { question: "Apa yang bisa mengelilingi dunia tetapi tetap di sudut?", answer: "perangko" },
    { question: "Apa yang semakin banyak diambil semakin besar?", answer: "lubang" },
    { question: "Apa yang bisa terbang tanpa sayap?", answer: "angin" },
    { question: "Apa yang mati saat diminum?", answer: "api" },
    { question: "Apa yang memiliki seribu mata tetapi tidak bisa melihat?", answer: "kentang" },
    { question: "Dia milikmu tetapi orang lain lebih sering menggunakannya", answer: "nama" },
    { question: "Apa yang bisa dipegang tetapi tidak bisa disentuh?", answer: "janji" },
    { question: "Apa yang memiliki kata tetapi tidak bisa berbicara?", answer: "buku" },
    { question: "Apa yang berdiri meskipun tidak memiliki kaki?", answer: "gunung" },
    { question: "Apa yang jika dipotong justru semakin panjang?", answer: "lubang" },
    { question: "Apa yang bisa berbicara semua bahasa?", answer: "gema" },
    { question: "Apa yang memiliki banyak lubang tetapi bisa menampung air?", answer: "spons" },
    { question: "Apa yang memiliki sembilan nyawa?", answer: "kucing" },
    { question: "Apa yang memiliki tangan tetapi tidak bisa bertepuk tangan?", answer: "jam" },
    { question: "Apa yang selalu ada di depan tetapi tidak pernah bisa dilihat?", answer: "masa depan" },
    { question: "Apa yang memiliki dua tangan dan dua kaki tetapi tidak bergerak?", answer: "patung" },
    { question: "Apa yang semakin lama semakin cepat?", answer: "waktu" },
    { question: "Apa yang memiliki kepala dan ekor tetapi tidak memiliki tubuh?", answer: "koin" },
    { question: "Apa yang memiliki satu mata tetapi bisa melihat banyak hal?", answer: "kamera" },
    { question: "Apa yang bisa ditangkap tetapi tidak bisa dilempar?", answer: "penyakit" },
    { question: "Apa yang memiliki lutut tetapi tidak memiliki kaki?", answer: "meja" },
    { question: "Apa yang naik tetapi tidak pernah turun?", answer: "usia" },
    { question: "Apa yang dapat memecahkan kaca tanpa disentuh?", answer: "suara" },
    { question: "Apa yang memiliki akar tetapi tidak pernah terlihat?", answer: "masalah" },
    { question: "Apa yang memiliki ujung tetapi tidak memiliki pangkal?", answer: "jalan" },
    { question: "Apa yang berjalan di atas kepala?", answer: "kutu" },
    { question: "Apa yang turun tetapi tidak pernah naik?", answer: "hujan" },
    { question: "Apa yang menjadi lebih basah saat mengeringkan?", answer: "handuk" },
    { question: "Buah apa yang selalu terasa dingin?", answer: "semangka" },
];

const SUSUNKATA = [
    { scrambled: "I-N-D-O-N-E-S-I-A", clue: "Negara dengan ibu kota Jakarta", answer: "indonesia" },
    { scrambled: "J-A-K-A-R-T-A", clue: "Ibu kota Indonesia", answer: "jakarta" },
    { scrambled: "P-E-S-A-W-A-T", clue: "Alat transportasi udara", answer: "pesawat" },
    { scrambled: "S-E-K-O-L-A-H", clue: "Tempat untuk belajar", answer: "sekolah" },
    { scrambled: "H-A-N-D-P-H-O-N-E", clue: "Alat komunikasi genggam", answer: "handphone" },
    { scrambled: "K-E-L-I-N-C-I", clue: "Hewan yang suka wortel", answer: "kelinci" },
    { scrambled: "M-A-T-A-H-A-R-I", clue: "Sumber cahaya terbesar", answer: "matahari" },
    { scrambled: "P-E-N-S-I-L", clue: "Alat untuk menulis", answer: "pensil" },
    { scrambled: "R-U-M-A-H", clue: "Tempat tinggal", answer: "rumah" },
    { scrambled: "G-A-J-A-H", clue: "Hewan dengan belalai", answer: "gajah" },
    { scrambled: "B-U-R-U-N-G", clue: "Hewan yang bisa terbang", answer: "burung" },
    { scrambled: "M-A-W-A-R", clue: "Bunga berwarna merah", answer: "mawar" },
    { scrambled: "P-I-S-A-U", clue: "Alat dapur untuk memotong", answer: "pisau" },
    { scrambled: "D-U-R-I-A-N", clue: "Buah yang berduri", answer: "durian" },
    { scrambled: "W-A-J-A-N", clue: "Alat untuk menggoreng", answer: "wajan" },
    { scrambled: "K-A-P-A-L", clue: "Kendaraan di laut", answer: "kapal" },
    { scrambled: "S-E-P-E-D-A", clue: "Kendaraan roda dua", answer: "sepeda" },
    { scrambled: "M-O-N-Y-E-T", clue: "Hewan yang suka pisang", answer: "monyet" },
    { scrambled: "N-A-S-I", clue: "Makanan pokok Indonesia", answer: "nasi" },
    { scrambled: "S-I-S-I-R", clue: "Alat merapikan rambut", answer: "sisir" },
    { scrambled: "J-A-M", clue: "Penunjuk waktu", answer: "jam" },
    { scrambled: "I-K-A-N", clue: "Hewan yang hidup di air", answer: "ikan" },
    { scrambled: "D-O-M-P-E-T", clue: "Tempat menyimpan uang", answer: "dompet" },
    { scrambled: "G-I-T-A-R", clue: "Alat musik petik", answer: "gitar" },
    { scrambled: "B-A-J-U", clue: "Pakaian bagian atas", answer: "baju" },
    { scrambled: "M-A-S-J-I-D", clue: "Tempat ibadah umat Islam", answer: "masjid" },
    { scrambled: "S-A-P-U", clue: "Alat membersihkan lantai", answer: "sapu" },
    { scrambled: "B-U-L-A-N", clue: "Benda langit malam", answer: "bulan" },
    { scrambled: "Z-E-B-R-A", clue: "Hewan dengan garis hitam putih", answer: "zebra" },
    { scrambled: "A-N-J-I-N-G", clue: "Hewan yang setia", answer: "anjing" },
    { scrambled: "C-I-N-T-A", clue: "Perasaan sayang", answer: "cinta" },
    { scrambled: "K-O-P-I", clue: "Minuman hitam pahit", answer: "kopi" },
    { scrambled: "P-I-A-N-O", clue: "Alat musik tuts", answer: "piano" },
    { scrambled: "B-O-T-O-L", clue: "Tempat menyimpan air minum", answer: "botol" },
    { scrambled: "L-E-M-O-N", clue: "Buah berwarna kuning asam", answer: "lemon" },
];

const FAMILY100 = [
    { question: "Sebutkan hewan berkaki empat!", answers: ["kucing", "anjing", "kambing", "sapi", "kuda", "kelinci", "gajah"] },
    { question: "Sebutkan jenis buah-buahan!", answers: ["apel", "pisang", "jeruk", "mangga", "anggur", "semangka", "durian"] },
    { question: "Sebutkan profesi atau pekerjaan!", answers: ["dokter", "guru", "polisi", "insinyur", "perawat", "pilot", "pengacara"] },
    { question: "Sebutkan transportasi darat!", answers: ["mobil", "motor", "sepeda", "bus", "kereta", "becak", "delman"] },
    { question: "Sebutkan jenis olahraga!", answers: ["sepak bola", "bulu tangkis", "basket", "renang", "lari", "voli", "tenis"] },
    { question: "Sebutkan nama bunga yang terkenal!", answers: ["mawar", "melati", "anggrek", "tulip", "matahari", "kenanga", "lavender"] },
    { question: "Sebutkan alat musik tradisional Indonesia!", answers: ["gamelan", "angklung", "sasando", "gong", "rebana", "tifa", "suling"] },
    { question: "Sebutkan benda yang ada di dapur!", answers: ["wajan", "panci", "piring", "gelas", "sendok", "kompor", "lemari es"] },
    { question: "Sebutkan negara di Asia Tenggara!", answers: ["indonesia", "malaysia", "singapura", "thailand", "vietnam", "filipina", "myanmar"] },
    { question: "Sebutkan jenis ikan konsumsi!", answers: ["kakap", "gurame", "lele", "nila", "mas", "tuna", "bawal"] },
    { question: "Sebutkan merek ponsel terkenal!", answers: ["samsung", "iphone", "xiaomi", "oppo", "vivo", "nokia", "realme"] },
    { question: "Sebutkan tempat wisata di Indonesia!", answers: ["bali", "raja ampat", "borobudur", "komodo", "bromo", "prambanan", "bunaken"] },
    { question: "Sebutkan pahlawan nasional Indonesia!", answers: ["soekarno", "diponegoro", "kartini", "sudirman", "hasanuddin", "sutomo", "patimura"] },
    { question: "Sebutkan makanan khas Indonesia!", answers: ["nasi goreng", "sate", "gado gado", "rendang", "bakso", "mie goreng", "soto"] },
    { question: "Sebutkan jenis sayuran hijau!", answers: ["bayam", "kangkung", "sawi", "brokoli", "kacang panjang", "buncis", "selada"] },
    { question: "Sebutkan nama pahlawan super!", answers: ["superman", "batman", "spiderman", "ironman", "thor", "captain america", "wonder woman"] },
    { question: "Sebutkan jenis penyakit umum!", answers: ["demam", "flu", "batuk", "sakit kepala", "diabetes", "hipertensi", "asma"] },
    { question: "Sebutkan jenis pakaian!", answers: ["baju", "celana", "rok", "kemeja", "gaun", "jaket", "kaos"] },
    { question: "Sebutkan planet di tata surya!", answers: ["bumi", "mars", "venus", "jupiter", "saturnus", "uranus", "neptunus"] },
    { question: "Sebutkan jenis alat tulis!", answers: ["pensil", "pena", "penggaris", "penghapus", "buku", "spidol", "krayon"] },
    { question: "Sebutkan merek mobil terkenal!", answers: ["toyota", "honda", "bmw", "mercedes", "ferrari", "lamborghini", "audi"] },
    { question: "Sebutkan jenis hobi!", answers: ["membaca", "memasak", "berolahraga", "bermain game", "menonton film", "fotografi", "berkebun"] },
    { question: "Sebutkan minuman hangat!", answers: ["kopi", "teh", "susu hangat", "jahe", "coklat panas", "bandrek", "wedang"] },
    { question: "Sebutkan ibu kota negara ASEAN!", answers: ["jakarta", "kuala lumpur", "singapura", "bangkok", "hanoi", "manila", "naypyidaw"] },
    { question: "Sebutkan jenis kendaraan umum!", answers: ["bus", "angkot", "ojek", "taksi", "kereta", "bajaj", "mikrolet"] },
    { question: "Sebutkan benua di dunia!", answers: ["asia", "afrika", "eropa", "amerika", "australia", "antartika", "amerika selatan"] },
    { question: "Sebutkan permainan tradisional!", answers: ["engklek", "congklak", "lompat tali", "kelereng", "petak umpet", "gasing", "benteng"] },
    { question: "Sebutkan jenis warna!", answers: ["merah", "biru", "hijau", "kuning", "hitam", "putih", "ungu"] },
    { question: "Sebutkan jenis logam!", answers: ["emas", "perak", "tembaga", "besi", "timah", "platina", "perunggu"] },
    { question: "Sebutkan anggota keluarga!", answers: ["ibu", "ayah", "kakak", "adik", "nenek", "kakek", "paman"] },
    { question: "Sebutkan hewan yang bisa terbang!", answers: ["burung", "kelelawar", "kupu kupu", "capung", "lebah", "elang", "merpati"] },
    { question: "Sebutkan benda elektronik di rumah!", answers: ["televisi", "kulkas", "setrika", "kipas angin", "microwave", "rice cooker", "blender"] },
    { question: "Sebutkan makanan ringan atau camilan!", answers: ["keripik", "coklat", "biskuit", "kue", "permen", "martabak", "pisang goreng"] },
    { question: "Sebutkan nama samudra di dunia!", answers: ["pasifik", "atlantik", "hindia", "artik", "antartika", "selatan", "pasifik barat"] },
    { question: "Sebutkan jenis tanaman obat!", answers: ["jahe", "kunyit", "kencur", "temulawak", "lidah buaya", "sambiloto", "daun sirih"] },
];

const TEBAKBENDERA = [
    { clue: "Negara dengan ibu kota Tokyo", answer: "jepang" },
    { clue: "Negara dengan ibu kota London", answer: "inggris" },
    { clue: "Negara dengan ibu kota Paris", answer: "prancis" },
    { clue: "Negara dengan ibu kota Berlin", answer: "jerman" },
    { clue: "Negara dengan ibu kota Roma", answer: "italia" },
    { clue: "Negara dengan ibu kota Madrid", answer: "spanyol" },
    { clue: "Negara dengan ibu kota Seoul", answer: "korea selatan" },
    { clue: "Negara dengan ibu kota Beijing", answer: "china" },
    { clue: "Negara dengan ibu kota Kuala Lumpur", answer: "malaysia" },
    { clue: "Negara dengan ibu kota Canberra", answer: "australia" },
    { clue: "Negara dengan ibu kota New Delhi", answer: "india" },
    { clue: "Negara dengan ibu kota Brasilia", answer: "brazil" },
    { clue: "Negara dengan ibu kota Ottawa", answer: "kanada" },
    { clue: "Negara dengan ibu kota Moskow", answer: "rusia" },
    { clue: "Negara dengan ibu kota Bangkok", answer: "thailand" },
    { clue: "Negara dengan ibu kota Hanoi", answer: "vietnam" },
    { clue: "Negara dengan ibu kota Manila", answer: "filipina" },
    { clue: "Negara dengan ibu kota Singapura", answer: "singapura" },
    { clue: "Negara dengan ibu kota Washington DC", answer: "amerika serikat" },
    { clue: "Negara dengan ibu kota Kairo", answer: "mesir" },
    { clue: "Negara dengan ibu kota Ankara", answer: "turki" },
    { clue: "Negara dengan ibu kota Athena", answer: "yunani" },
    { clue: "Negara dengan ibu kota Lisbon", answer: "portugal" },
    { clue: "Negara dengan ibu kota Amsterdam", answer: "belanda" },
    { clue: "Negara dengan ibu kota Stockholm", answer: "swedia" },
    { clue: "Negara dengan ibu kota Oslo", answer: "norwegia" },
    { clue: "Negara dengan ibu kota Helsinki", answer: "finlandia" },
    { clue: "Negara dengan ibu kota Warsawa", answer: "polandia" },
    { clue: "Negara dengan ibu kota Wellington", answer: "selandia baru" },
    { clue: "Negara dengan ibu kota Dublin", answer: "irlandia" },
    { clue: "Negara dengan ibu kota Wina", answer: "austria" },
    { clue: "Negara dengan ibu kota Budapest", answer: "hongaria" },
    { clue: "Negara dengan ibu kota Dublin", answer: "irlandia" },
    { clue: "Negara dengan ibu kota Kopenhagen", answer: "denmark" },
    { clue: "Negara dengan ibu kota Bern", answer: "swiss" },
];

const TEBAKKIMIA = [
    { hint: "Lambang H | Nomor atom 1 | Gas paling ringan", answer: "hidrogen" },
    { hint: "Lambang He | Nomor atom 2 | Gas mulia untuk balon", answer: "helium" },
    { hint: "Lambang Li | Nomor atom 3 | Logam ringan untuk baterai", answer: "litium" },
    { hint: "Lambang C | Nomor atom 6 | Dasar dari semua senyawa organik", answer: "karbon" },
    { hint: "Lambang N | Nomor atom 7 | 78% dari atmosfer bumi", answer: "nitrogen" },
    { hint: "Lambang O | Nomor atom 8 | Gas yang kita hirup setiap saat", answer: "oksigen" },
    { hint: "Lambang Na | Nomor atom 11 | Komponen utama garam dapur", answer: "natrium" },
    { hint: "Lambang Mg | Nomor atom 12 | Logam ringan untuk kembang api", answer: "magnesium" },
    { hint: "Lambang Al | Nomor atom 13 | Logam untuk badan pesawat", answer: "aluminium" },
    { hint: "Lambang Si | Nomor atom 14 | Bahan utama chip komputer", answer: "silikon" },
    { hint: "Lambang K | Nomor atom 19 | Penting untuk fungsi saraf", answer: "kalium" },
    { hint: "Lambang Ca | Nomor atom 20 | Penting untuk tulang dan gigi", answer: "kalsium" },
    { hint: "Lambang Fe | Nomor atom 26 | Logam paling umum digunakan manusia", answer: "besi" },
    { hint: "Lambang Cu | Nomor atom 29 | Logam penghantar listrik yang baik", answer: "tembaga" },
    { hint: "Lambang Zn | Nomor atom 30 | Digunakan untuk melapisi besi", answer: "seng" },
    { hint: "Lambang Au | Nomor atom 79 | Logam mulia berwarna kuning", answer: "emas" },
    { hint: "Lambang Ag | Nomor atom 47 | Logam mulia untuk perhiasan", answer: "perak" },
    { hint: "Lambang Hg | Nomor atom 80 | Satu-satunya logam cair pada suhu kamar", answer: "raksa" },
    { hint: "Lambang Pb | Nomor atom 82 | Digunakan untuk aki mobil", answer: "timbal" },
    { hint: "Lambang S | Nomor atom 16 | Berwarna kuning, bau khas menyengat", answer: "belerang" },
    { hint: "Lambang Cl | Nomor atom 17 | Digunakan untuk pemurnian air", answer: "klorin" },
    { hint: "Lambang P | Nomor atom 15 | Komponen penting DNA dan tulang", answer: "fosfor" },
    { hint: "Lambang Mn | Nomor atom 25 | Digunakan dalam pembuatan baja", answer: "mangan" },
    { hint: "Lambang Ni | Nomor atom 28 | Untuk pembuatan stainless steel", answer: "nikel" },
    { hint: "Lambang Sn | Nomor atom 50 | Untuk kaleng makanan kemasan", answer: "timah" },
    { hint: "Lambang Cr | Nomor atom 24 | Untuk lapisan krom yang mengilap", answer: "kromium" },
    { hint: "Lambang Co | Nomor atom 27 | Warna biru untuk keramik", answer: "kobalt" },
    { hint: "Lambang U | Nomor atom 92 | Bahan bakar pembangkit nuklir", answer: "uranium" },
    { hint: "Lambang Pt | Nomor atom 78 | Logam mulia untuk katalis", answer: "platina" },
    { hint: "Lambang Ba | Nomor atom 56 | Digunakan dalam prosedur sinar-X", answer: "barium" },
    { hint: "Lambang Ar | Nomor atom 18 | Gas mulia untuk pengelasan", answer: "argon" },
    { hint: "Lambang Ne | Nomor atom 10 | Gas untuk lampu neon", answer: "neon" },
    { hint: "Lambang I | Nomor atom 53 | Penting untuk fungsi kelenjar tiroid", answer: "iodium" },
    { hint: "Lambang F | Nomor atom 9 | Terdapat dalam pasta gigi", answer: "fluorin" },
    { hint: "Lambang Br | Nomor atom 35 | Satu-satunya nonlogam cair", answer: "bromin" },
];

const CAKLONTONG = [
    { question: "Apa bahasa Inggrisnya nasi goreng?", answer: "nasi goreng" },
    { question: "Kucing apa yang paling sakti?", answer: "kucing" },
    { question: "Buah apa yang selalu dibicarakan orang?", answer: "buah bibir" },
    { question: "Sayur apa yang paling pintar?", answer: "sayur mayur" },
    { question: "Hewan apa yang tidak pernah bohong?", answer: "hewan" },
    { question: "Gunung apa yang paling hemat?", answer: "gunung berapi" },
    { question: "Kota apa yang paling keren?", answer: "kota" },
    { question: "Minyak apa yang paling dingin?", answer: "minyak bumi" },
    { question: "Buku apa yang tidak bisa dibaca?", answer: "buku" },
    { question: "Penyanyi apa yang sering direpotkan?", answer: "penyanyi" },
    { question: "Bola apa yang mirip kucing?", answer: "bola" },
    { question: "Kue apa yang besar tetapi kecil?", answer: "kue cubit" },
    { question: "Air apa yang paling keras?", answer: "air batu" },
    { question: "Tumbuhan apa yang paling kaya?", answer: "tumbuhan" },
    { question: "Batu apa yang tidak pernah sakit?", answer: "batu" },
    { question: "Ayam apa yang paling besar?", answer: "ayam" },
    { question: "Sungai apa yang letaknya di dalam rumah?", answer: "sungai" },
    { question: "Api apa yang paling dingin?", answer: "api" },
    { question: "Mata apa yang tidak bisa melihat?", answer: "mata" },
    { question: "Kepala apa yang tidak punya rambut?", answer: "kepala" },
    { question: "Telinga apa yang paling besar?", answer: "telinga" },
    { question: "Kaki apa yang tidak bisa berjalan?", answer: "kaki" },
    { question: "Rambut apa yang paling lurus?", answer: "rambut" },
    { question: "Daging apa yang paling enak?", answer: "daging" },
    { question: "Tahu apa yang paling pintar?", answer: "tahu" },
    { question: "Kentang apa yang paling berani?", answer: "kentang" },
    { question: "Cabe apa yang paling pedas?", answer: "cabe" },
    { question: "Garam apa yang paling asin?", answer: "garam" },
    { question: "Gula apa yang paling manis?", answer: "gula" },
    { question: "Susu apa yang paling putih?", answer: "susu" },
    { question: "Mie apa yang paling panjang?", answer: "mie" },
    { question: "Roti apa yang paling empuk?", answer: "roti" },
    { question: "Telur apa yang paling bulat?", answer: "telur" },
    { question: "Tempe apa yang paling sedih?", answer: "tempe" },
    { question: "Ikan apa yang paling berani?", answer: "ikan" },
];

function getTitle(cmd) {
    const titles = {
        tebakkata: 'Tᴇʙᴀᴋᴋᴀᴛᴀ',
        asahotak: 'Aᴅᴀʜᴏᴛᴀᴋ',
        susunkata: 'Sᴜsᴜɴᴋᴀᴛᴀ',
        family100: 'Fᴀᴍɪʟʏ 100',
        tebakbendera: 'Tᴇʙᴀᴋ Bᴇɴᴅᴇʀᴀ',
        tebakkimia: 'Tᴇʙᴀᴋ Kɪᴍɪᴀ',
        caklontong: 'Cᴀᴋ Lᴏɴᴛᴏɴɢ',
    };
    return titles[cmd] || 'Gᴀᴍᴇs';
}

function getQuestionPool(cmd) {
    const pools = { tebakkata: TEBAKKATA, asahotak: ASAHOTAK, susunkata: SUSUNKATA, family100: FAMILY100, tebakbendera: TEBAKBENDERA, tebakkimia: TEBAKKIMIA, caklontong: CAKLONTONG };
    return pools[cmd] || [];
}

async function showCommonQuestion(client, m, fq, cmd, session, q, prefix) {
    const title = getTitle(cmd);
    let content = '';

    switch (cmd) {
        case 'tebakkata':
            content = `🧩 Clue: ${q.clue}\n📍 Q${session.currentIndex + 1}/${session.questions.length} | Skor: ${session.score}`;
            break;
        case 'asahotak':
            content = `🧠 ${q.question}\n📍 Q${session.currentIndex + 1}/${session.questions.length} | Skor: ${session.score}`;
            break;
        case 'susunkata':
            content = `🔀 Huruf: ${q.scrambled}\n💡 Clue: ${q.clue}\n📍 Q${session.currentIndex + 1}/${session.questions.length} | Skor: ${session.score}`;
            break;
        case 'tebakbendera':
            content = `🏳️ Clue: ${q.clue}\n📍 Q${session.currentIndex + 1}/${session.questions.length} | Skor: ${session.score}`;
            break;
        case 'tebakkimia':
            content = `🧪 ${q.hint}\n📍 Q${session.currentIndex + 1}/${session.questions.length} | Skor: ${session.score}`;
            break;
        case 'caklontong':
            content = `🤔 ${q.question}\n📍 Q${session.currentIndex + 1}/${session.questions.length} | Skor: ${session.score}`;
            break;
    }

    return client.sendMessage(m.chat, {
        text: `╭─ *${title}*\n├\n│ ${content}\n│ 📝 \`${prefix}${cmd} <jawaban>\`\n│ 🛑 \`${prefix}${cmd} stop\`\n╰─ Codex-MD`
    }, { quoted: fq });
}

function getAnswerFromQuestion(cmd, q) {
    if (cmd === 'tebakkata' || cmd === 'susunkata' || cmd === 'tebakbendera' || cmd === 'tebakkimia' || cmd === 'asahotak' || cmd === 'caklontong') {
        return q.answer;
    }
    return '';
}

async function startCommonGame(client, m, fq, cmd, sessions, prefix, answerText) {
    const sessionKey = m.sender;
    const pool = getQuestionPool(cmd);
    const title = getTitle(cmd);
    let session = sessions.get(sessionKey);

    if (answerText && ['stop', 'exit', 'selesai'].includes(answerText.toLowerCase())) {
        if (!session || session.game !== cmd) {
            return client.sendMessage(m.chat, {
                text: `╭─ *${title}*\n├\n│ ❌ Tidak ada permainan aktif.\n╰─ Codex-MD`
            }, { quoted: fq });
        }
        const finalScore = session.score;
        const finalStreak = session.maxStreak || 0;
        sessions.delete(sessionKey);
        await client.sendMessage(m.chat, { react: { text: '🛑', key: m.reactKey } });
        return client.sendMessage(m.chat, {
            text: `╭─ *${title}*\n├\n│ 🛑 Permainan dihentikan.\n│ 📊 Skor: ${finalScore}\n│ 🔥 Streak terbaik: ${finalStreak}\n╰─ Codex-MD`
        }, { quoted: fq });
    }

    if (!session || session.game !== cmd) {
        const questions = pickQuestions(pool);
        session = { game: cmd, questions, currentIndex: 0, score: 0, streak: 0, maxStreak: 0 };
        sessions.set(sessionKey, session);
        await client.sendMessage(m.chat, { react: { text: '🎯', key: m.reactKey } });
    }

    const q = session.questions[session.currentIndex];
    if (!q) {
        sessions.delete(sessionKey);
        return client.sendMessage(m.chat, {
            text: `╭─ *${title}*\n├\n│ 🎮 Permainan selesai!\n│ 📊 Skor akhir: ${session.score}/${session.questions.length * 10}\n│ 🔥 Streak terbaik: ${session.maxStreak}\n╰─ Codex-MD`
        }, { quoted: fq });
    }

    if (answerText && answerText.toLowerCase() !== 'skip') {
        const userAns = answerText.toLowerCase().trim();
        const correctAnswer = getAnswerFromQuestion(cmd, q).toLowerCase();
        const isCorrect = userAns === correctAnswer;

        if (isCorrect) {
            session.score += 10;
            session.streak++;
            if (session.streak > session.maxStreak) session.maxStreak = session.streak;
            session.currentIndex++;

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

            if (session.currentIndex >= session.questions.length) {
                const finalScore = session.score;
                const finalStreak = session.maxStreak;
                sessions.delete(sessionKey);
                return client.sendMessage(m.chat, {
                    text: `╭─ *${title}*\n├\n│ ✅ Benar! +10 poin\n│ 📍 Jawaban: ${correctAnswer}\n├\n│ 🎮 Permainan selesai!\n│ 📊 Skor akhir: ${finalScore}/${session.questions.length * 10}\n│ 🔥 Streak terbaik: ${finalStreak}\n╰─ Codex-MD`
                }, { quoted: fq });
            }

            const nextQ = session.questions[session.currentIndex];
            return client.sendMessage(m.chat, {
                text: `╭─ *${title}*\n├\n│ ✅ Benar! +10 poin\n│ 📍 Jawaban: ${correctAnswer}\n🔥 Streak: ${session.streak}\n├\n${formatQuestionPreview(cmd, nextQ, session)}\n╰─ Codex-MD`
            }, { quoted: fq });
        } else {
            session.streak = 0;
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭─ *${title}*\n├\n│ ❌ Jawaban "${userAns}" salah! Coba lagi.\n│ 📍 Q${session.currentIndex + 1}/${session.questions.length} | Skor: ${session.score}\n╰─ Codex-MD`
            }, { quoted: fq });
        }
    }

    if (answerText && answerText.toLowerCase() === 'skip') {
        session.currentIndex++;
        if (session.currentIndex >= session.questions.length) {
            sessions.delete(sessionKey);
            return client.sendMessage(m.chat, {
                text: `╭─ *${title}*\n├\n│ ⏭️ Semua soal telah dilewati.\n│ 📊 Skor akhir: ${session.score}/${session.questions.length * 10}\n╰─ Codex-MD`
            }, { quoted: fq });
        }
        const nextQ = session.questions[session.currentIndex];
        await client.sendMessage(m.chat, { react: { text: '⏭️', key: m.reactKey } });
        return showCommonQuestion(client, m, fq, cmd, session, nextQ, prefix);
    }

    return showCommonQuestion(client, m, fq, cmd, session, q, prefix);
}

function formatQuestionPreview(cmd, q, session) {
    switch (cmd) {
        case 'tebakkata':
            return `│ 🧩 Clue: ${q.clue}\n│ 📍 Q${session.currentIndex + 1}/${session.questions.length} | Skor: ${session.score}`;
        case 'asahotak':
            return `│ 🧠 ${q.question}\n│ 📍 Q${session.currentIndex + 1}/${session.questions.length} | Skor: ${session.score}`;
        case 'susunkata':
            return `│ 🔀 Huruf: ${q.scrambled}\n│ 💡 Clue: ${q.clue}\n│ 📍 Q${session.currentIndex + 1}/${session.questions.length} | Skor: ${session.score}`;
        case 'tebakbendera':
            return `│ 🏳️ Clue: ${q.clue}\n│ 📍 Q${session.currentIndex + 1}/${session.questions.length} | Skor: ${session.score}`;
        case 'tebakkimia':
            return `│ 🧪 ${q.hint}\n│ 📍 Q${session.currentIndex + 1}/${session.questions.length} | Skor: ${session.score}`;
        case 'caklontong':
            return `│ 🤔 ${q.question}\n│ 📍 Q${session.currentIndex + 1}/${session.questions.length} | Skor: ${session.score}`;
        default:
            return '';
    }
}

async function handleFamily100(client, m, fq, sessions, prefix, answerText) {
    const sessionKey = m.sender;
    const title = 'Fᴀᴍɪʟʏ 100';
    let session = sessions.get(sessionKey);

    if (answerText && ['stop', 'exit', 'selesai'].includes(answerText.toLowerCase())) {
        if (!session || session.game !== 'family100') {
            return client.sendMessage(m.chat, {
                text: `╭─ *${title}*\n├\n│ ❌ Tidak ada permainan aktif.\n╰─ Codex-MD`
            }, { quoted: fq });
        }
        const finalScore = session.score;
        sessions.delete(sessionKey);
        await client.sendMessage(m.chat, { react: { text: '🛑', key: m.reactKey } });
        return client.sendMessage(m.chat, {
            text: `╭─ *${title}*\n├\n│ 🛑 Permainan dihentikan.\n│ 📊 Skor: ${finalScore}\n╰─ Codex-MD`
        }, { quoted: fq });
    }

    if (!session || session.game !== 'family100') {
        const questions = pickQuestions(FAMILY100);
        session = { game: 'family100', questions, currentIndex: 0, foundAnswers: [], attempts: 0, maxAttempts: 3, score: 0 };
        sessions.set(sessionKey, session);
        await client.sendMessage(m.chat, { react: { text: '🎯', key: m.reactKey } });
    }

    const q = session.questions[session.currentIndex];
    if (!q) {
        sessions.delete(sessionKey);
        return client.sendMessage(m.chat, {
            text: `╭─ *${title}*\n├\n│ 🎮 Permainan selesai!\n│ 📊 Skor akhir: ${session.score}\n╰─ Codex-MD`
        }, { quoted: fq });
    }

    if (answerText) {
        const userAns = answerText.toLowerCase().trim();

        if (session.foundAnswers.includes(userAns)) {
            return client.sendMessage(m.chat, {
                text: `╭─ *${title}*\n├\n│ ⚠️ "${userAns}" sudah ditemukan!\n│ 🔍 Cari jawaban lain.\n╰─ Codex-MD`
            }, { quoted: fq });
        }

        const matched = q.answers.find(a => a.toLowerCase() === userAns);

        if (matched) {
            session.foundAnswers.push(userAns);
            session.score += 10;
            session.attempts++;

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

            if (session.foundAnswers.length >= q.answers.length || session.attempts >= session.maxAttempts) {
                session.currentIndex++;
                const allFound = session.foundAnswers.length >= q.answers.length;
                const revealed = q.answers.map(a =>
                    session.foundAnswers.includes(a.toLowerCase()) ? a : `~~${a}~~`
                ).join(', ');

                if (session.currentIndex >= session.questions.length) {
                    sessions.delete(sessionKey);
                    return client.sendMessage(m.chat, {
                        text: `╭─ *${title}*\n├\n│ ✅ +10 poin untuk "${matched}"\n│ 📍 Jawaban: ${revealed}\n├\n│ 🎮 Permainan selesai!\n│ 📊 Skor akhir: ${session.score}\n╰─ Codex-MD`
                    }, { quoted: fq });
                }

                const nextQ = session.questions[session.currentIndex];
                session.foundAnswers = [];
                session.attempts = 0;
                return client.sendMessage(m.chat, {
                    text: `╭─ *${title}*\n├\n│ ✅ +10 poin untuk "${matched}"\n│ 📍 Jawaban: ${revealed}\n├\n│ 🎯 Soal ${session.currentIndex + 1}/${session.questions.length}\n│ 📌 ${nextQ.question}\n╰─ Codex-MD`
                }, { quoted: fq });
            }

            const remainingTries = session.maxAttempts - session.attempts;
            return client.sendMessage(m.chat, {
                text: `╭─ *${title}*\n├\n│ ✅ Benar! +10 poin\n│ 📍 "${matched}"\n│ 🎯 Ditemukan: ${session.foundAnswers.length}/${q.answers.length}\n│ 🔍 Sisa ${remainingTries} tebakan\n╰─ Codex-MD`
            }, { quoted: fq });
        } else {
            session.attempts++;
            const remainingTries = session.maxAttempts - session.attempts;

            if (remainingTries <= 0) {
                session.currentIndex++;
                const revealed = q.answers.join(', ');

                if (session.currentIndex >= session.questions.length) {
                    sessions.delete(sessionKey);
                    return client.sendMessage(m.chat, {
                        text: `╭─ *${title}*\n├\n│ ❌ Kesempatan habis!\n│ 📍 Jawaban: ${revealed}\n├\n│ 🎮 Permainan selesai!\n│ 📊 Skor akhir: ${session.score}\n╰─ Codex-MD`
                    }, { quoted: fq });
                }

                const nextQ = session.questions[session.currentIndex];
                session.foundAnswers = [];
                session.attempts = 0;
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                return client.sendMessage(m.chat, {
                    text: `╭─ *${title}*\n├\n│ ❌ "${userAns}" salah! Kesempatan habis.\n│ 📍 Jawaban: ${revealed}\n├\n│ 🎯 Soal ${session.currentIndex + 1}/${session.questions.length}\n│ 📌 ${nextQ.question}\n╰─ Codex-MD`
                }, { quoted: fq });
            }

            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭─ *${title}*\n├\n│ ❌ "${userAns}" bukan jawaban tepat!\n│ 🔍 Sisa ${remainingTries} tebakan\n│ 🎯 Ditemukan: ${session.foundAnswers.length}/${q.answers.length}\n╰─ Codex-MD`
            }, { quoted: fq });
        }
    }

    const foundStr = session.foundAnswers.length > 0
        ? `✓ Ditemukan: ${session.foundAnswers.map(f => `"${f}"`).join(', ')}\n│ `
        : '';
    const remainingTries = session.maxAttempts - session.attempts;
    return client.sendMessage(m.chat, {
        text: `╭─ *${title}*\n├\n│ 🎯 Soal ${session.currentIndex + 1}/${session.questions.length}\n│ 📌 ${q.question}\n│ ${foundStr}🔍 Sisa ${remainingTries} tebakan | Skor: ${session.score}\n│ 📝 \`${prefix}family100 <jawaban>\`\n│ 🛑 \`${prefix}family100 stop\`\n╰─ Codex-MD`
    }, { quoted: fq });
}

export default {
    name: 'games',
    aliases: ['tebakkata', 'asahotak', 'susunkata', 'family100', 'tebakbendera', 'tebakkimia', 'caklontong'],
    description: 'Trivia & puzzle games — tebakkata, asahotak, susunkata, family100, tebakbendera, tebakkimia, caklontong',
    category: 'Games',
    run: async (context) => {
        const { client, m, command, text, args, prefix } = context;
        const fq = getFakeQuoted(m);
        const cmd = command.toLowerCase();
        const answerText = args.join(' ').trim();

        if (cmd === 'family100') {
            return handleFamily100(client, m, fq, sessions, prefix, answerText);
        }

        const commonGames = ['tebakkata', 'asahotak', 'susunkata', 'tebakbendera', 'tebakkimia', 'caklontong'];
        if (commonGames.includes(cmd)) {
            return startCommonGame(client, m, fq, cmd, sessions, prefix, answerText);
        }

        return client.sendMessage(m.chat, {
            text: `╭─ *Gᴀᴍᴇs*\n├\n│ 🎮 Game tersedia:\n│ • tebakkata — Tebak kata dari clue\n│ • asahotak — Teka-teki logika\n│ • susunkata — Susun huruf acak\n│ • family100 — Family Feud\n│ • tebakbendera — Tebak negara\n│ • tebakkimia — Tebak unsur kimia\n│ • caklontong — Tebak-tebakan lucu\n├\n│ 📝 \`${prefix}tebakkata\` untuk mulai\n╰─ Codex-MD`
        }, { quoted: fq });
    }
};
