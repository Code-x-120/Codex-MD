import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const TRUTHS = [
    "Kya tumne kabhi kisi ko ghost kiya hai?",
    "Tumhara sabse embarassing moment kya tha?",
    "Kya tumne kabhi apne best friend ke partner ko like kiya hai?",
    "Batao tumne aaj tak jo sabse bada lie bola hai wo kya tha?",
    "Tumhara secret crush kon hai?",
    "Kya tumne kabhi cheating ki hai exam mein?",
    "Tumhari sabse weird habit kya hai?",
    "Kya tum kabhi apne ex ke paas wapas gaye ho?",
    "Batao wo cheez jo tum kabhi kisi ko nahi bata sakte?",
    "Tumne kabhi kisi ke baare mein bura gossip spread kiya hai?",
    "Kya tumne kabhi kisi aur ke naam se account banaya hai?",
    "Tumhara guilty pleasure kya hai?",
    "Kya tum apne phone ka password kisi ko jaante ho?",
    "Batao wo time jab tum sabse zyada embarrass hue the?",
    "Tum kis celebrity ko date karna chahoge?",
    "Kya tumne kabhi kisi se pyar mein pretend kiya hai?",
    "Tumhara last Google search kya tha?",
    "Tumhari life ki biggest regret kya hai?",
    "Kya tumne kabhi apne parents ko kuch aisa bataya jo sach nahi tha?",
    "Tum kis cheez mein sabse zyada jealous hote ho?",
    "Batao wo cheez jo tum subah uthke pehle check karte ho?",
    "Kya tumne kabhi hidden camera lagaya hai?",
    "Tumhara sabse awkward date experience kya tha?",
    "Kya tumhe kisi ka number churake use karna yaad hai?",
    "Tumne kabhi apne friend ke saath kya secret share kiya jo ab regret ho raha hai?",
    "Batao wo ek cheez jo tum apne phone mein chhupake rakhte ho?",
    "Kya tumne kabhi apne se younger ko date kiya hai?",
    "Tumhara sabse embarrassing ringtone/tune kya tha?",
    "Batao wo time jab tum roye the but sabko bataya ki nhi roye?",
    "Kya tumne kabhi kisi ka dress secretly check kiya hai?",
    "Tumhara sabse bura haircut memory kya hai?",
    "Kya tumne kabhi apne bhai/behen ke saath fight ki hai?",
    "Batao wo habit jo tum chhupate ho sabse?",
    "Tumhare closet mein sabse weird item kya hai?",
    "Kya tumne kabhi public mein embarrassing dance kiya hai?",
    "Tumhe apne baare mein kis cheez ka ghamand hai?",
    "Batao wo DP/tune jo tumne kabhi lagayi thi aur regret ki?",
    "Tum kis cheez mein no.1 ho?",
    "Kya tumne kabhi kisi famous person ko dekha hai?",
    "Batao wo time jab tum sirf dikhane ke liye kuch kiya?",
    "Tumhari life ki sabse boring day kaisi thi?",
    "Kya tum kisi ke saath justify kar sakte ho?",
    "Batao wo song jo tum gaate ho but kisi ko batate nahi?",
    "Tumhara sabse favorite time waste app kon sa hai?",
    "Kya tumne kabhi apne crush ko message bheja aur ignore hua?",
    "Batao wo famous personality jisse tum milna chahoge?",
    "Tumhare andar ka ek chhupa talent batao?",
    "Kya tumhe lagta hai tum attractive ho?",
    "Batao wo movie jo tum dekh ke roye the?",
    "Kya tumne kabhi apni photo edit karke bheji hai?",
    "Tumhara sabse expensive waste of money kya hai?",
    "Kya tumne kabhi kisi ko intentionally hurt kiya hai?",
    "Batao wo time jab tumhe apni life ki direction pata nahi thi?",
    "Tumhara sabse awkward zoom/online class moment?",
    "Kya tumhe kabhi apni age se bada/older lagta hai?",
    "Batao wo skill jo tum seekhna chahoge?",
    "Tumne kabhi apne partner ke saath dhokha kiya hai?",
    "Kya tum apne aap ko lucky samajhte ho?",
    "Batao wo desh jo tum sabse zyada visit karna chahoge?",
    "Tumhara sabse odd food combination kya hai?",
    "Kya tumne kabhi haunted jagah experience kiya hai?",
    "Batao wo childhood habit jo abhi bhi tumhare andar hai?",
    "Tumhari zindagi ka sabse embarrassing ringtone moment?",
    "Kya tumne kabhi apne maa baap se kuch chhupaya hai?",
    "Batao wo raaz jo tum apne dost ko nahi bata sakte?",
    "Tum kis chiz mein sabse lazy ho?",
    "Kya tum kabhi apne partner ki loyalty doubt karte ho?",
    "Batao wo fake story jo tumne apne friends ko sunai thi?",
    "Tumhara sabse badtameez moment kya tha?",
    "Kya tumne kabhi apne senior se attitude dikhaya hai?",
    "Batao wo topic jispe tum apna opinion change karte ho?",
    "Tumne kabhi kisi ka item bina permission liya hai?",
    "Kya tumne kabhi kisi ko bully kiya hai?",
    "Batao wo website/app jo tum raat ko use karte ho?",
    "Tumhari life ka most awkward family moment?",
    "Kya tumne kabhi kiss kiya hai?",
    "Batao wo food jo sabko pasand hai but tumhe nahi?",
    "Tumhara imaginary friend tha?",
    "Kya tum kabhi apne partner ke phone mein dekhte ho?",
    "Batao wo quality jo tum logo mein dekhte ho?",
    "Tumne kabhi borrowed item wapas nahi kiya?",
    "Kya tumhe lagta hai tum ek good person ho?",
    "Batao wo time jab tumne apni galti maan li thi?",
    "Tumhari sabse badi weakness kya hai?",
    "Kya tumne kabhi apne bhai/behen ke secrets expose kiye?",
    "Batao wo random thought jo raat ko aati hai?",
    "Tumhara sabse memorable birthday kaisa tha?",
    "Kya tum kabhi apne feelings express karte ho ya dabaate ho?",
    "Batao wo chiz jo tum kisi ko bataoge nahi kabhi?",
    "Tumhari life ka turning point kya tha?",
    "Kya tum apne aap ko interesting samajhte ho?",
    "Batao wo lie jo tum apne parents ko regularly bolte ho?",
    "Tumhara sabse chhupa hua fantasy kya hai?",
    "Kya tumne kabhi apne friend ke partner mein interest liya?",
    "Batao wo personality trait jo tum apne aap mein sudharna chahoge?",
    "Tumhari life ka sabse rock bottom moment?",
    "Kya tum apne aap ko self-obsessed samajhte ho?",
    "Batao wo embarrassing laugh jo tumhe control karna hai?",
    "Tumne kabhi apne dil ki baat kisi ko nahi batayi?",
    "Kya tum kabhi apne aap ko pity karte ho?",
    "Batao wo thing jo tumhe raat ko jagaye rakhti hai?",
    "Tumhara sabse bada what-if scenario?",
    "Kya tumhe lagta hai dosti mein honesty zaroori hai?",
    "Batao wo incident jisne tumhe badal diya?",
];

const DARES = [
    "Apne current wallpaper ko change karo aur 1 week mat badlo!",
    "Kisi bhi random contact ko 'I love you' text karo!",
    "Apni 3 most recent photos mein se worst photo yahan send karo!",
    "Voice note mein apna worst singing record karo!",
    "Apna phone 5 minute ke liye kisi aur ko pakda do!",
    "Last Google search ka screenshot dalo!",
    "Apne status pe 'I am single' likho aur 1 ghanta mat hatayo!",
    "Kisi bhi number ko 'You are the best' likh ke bhejo!",
    "Apni ek aisi photo bhejo jo tumhe pasand nahi!",
    "Apne last 5 messages ka screenshot dalo!",
    "Kisi random person ko compliment bhejo!",
    "Apna favourite TikTok dance karo!",
    "Kisi stranger ko 'Happy Birthday' wish karo!",
    "Apna phone ka battery percentage batao!",
    "Next 10 messages mein emoji use karo har message mein!",
    "Apni gallery se koi embarrassing photo dhundh kar bhejo!",
    "Kisi group mein funny sticker bhejo!",
    "Voice note mein apna best actor impression do!",
    "Apne best friend ko call karke 'I miss you' bolo!",
    "Kisi neend wale ko call karke kuch bhi bolo!",
    "Apni bucket list ki 5 cheezein batao!",
    "Apne ex ka naam batao!",
    "Kisi ke saath selfie lo aur bhejo!",
    "Apna favourite pick-up line bolo!",
    "Kisi bhi unknown number ko 'I know your secret' bhejo!",
    "1 minute tak apni breath hold karo!",
    "Apne aap ki photo filter ke bina bhejo!",
    "Apna shoe smell karo aur react karo!",
    "Apni contact list se 5th person ko good morning wish karo!",
    "Kisi bhi vegetable ka naam lo aur uski tarah dance karo!",
    "Apna last dream batao!",
    "Kisi random page par first post ko like karo!",
    "Apna morning routine video banao!",
    "Kisi se 5 minute tak baat karo without using 'haan' ya 'nahi'!",
    "Apne bestie ka ringtone set karo apne phone mein!",
    "Kisi bhi contact ka profile picture copy karke bhejo!",
    "Apne 3 favourite contact names batao!",
    "Koi bhi aisi picture bhejo jo abhi click karo!",
    "Apne recent gallery ka screenshot bhejo!",
    "Apna last online time chhupao!",
    "Kisi bhi contact ko random facts bhejo!",
    "Apne favourite snack ka naam batao!",
    "Apni handwriting ka photo bhejo!",
    "Kisi bhi song ke lyrics likh ke bhejo!",
    "Apne 3 crushes ke naam initials mein batao!",
    "Apne room ka photo bejh kar dikhao!",
    "Apni favourite app ka screen time share karo!",
    "Kisi random famous quote ko apna naam de kar bhejo!",
    "Apne shoes ka lace galat tarah se bandh karo aur ghoomo!",
    "Kisi friend ko 'tum meri life ki best person ho' likho!",
    "Apne aap ko mirror mein dekhte hue compliment do!",
    "Apni last 3 WhatsApp status ka screenshot bhejo!",
    "Kisi joke ko padh kar sunao voice note mein!",
    "Apna favourite emoji use karo har reply mein agle 10 min!",
    "Kisi bhi contact ko meme bhejo!",
    "Apna password hint share karo!",
    "Ek minute ke liye ek leg par khade raho!",
    "Apni mom/dad ko gaana sunao phone par!",
    "Apne 3 guilty pleasures batao!",
    "Accidentally on purpose kisi ko double text karo!",
    "Apni weather app ka screenshot bhejo!",
    "Kisi ko heart emoji react karo random message par!",
    "Apna chat background change karo aur dikhao!",
    "Apne phone ka home screen share karo!",
    "Kisi ke message ko 24 hours ignore karo!",
    "Apni subah ki first thought batao!",
    "Kisi bhi contact ko 'You are amazing' bolke bhejo!",
    "Voice note mein whisper karo kuch funny!",
    "Apna last YouTube search batao!",
    "Kisi se call par 5 minute baat karo sirf emojis se!",
    "Apna most used emoji batao!",
    "Kisi contact ka naam change karo funny name se!",
    "Apna favourite cringe memory share karo!",
    "Apna most weird talent show karo!",
    "Kisi bhi contact ko chhod kar 2 din mat text karo!",
    "Apna favourite filter laga ke selfie bhejo!",
    "Kisi se ankh milake 'I hate you' bolo!",
    "Apne saath walo ko disturb karo without reason!",
    "Apna favourite childhood cartoon ka theme song sunao!",
    "Kisi bhi stranger se road par smile karo!",
    "Apne din ki 10 boring events shared karo!",
    "Kisi bhi inanimate object se baat karo!",
    "Apna ringtone public mein bajne do!",
    "Kisi ko 'I can read your mind' bolke kuch random batao!",
    "Apna last received gift ka photo bhejo!",
    "Apni bucket list se ek item aaj complete karo!",
    "Kisi bhi sad song pe tharak wala dance karo!",
    "Apne aap ko VIP style mein introduce karo!",
    "Kisi bhi contact ki bio padh ke sunao!",
    "Apna favourite actor/actress ka mimic karo!",
    "Kisi ke saath photo le kar bina caption dalo!",
    "Apni dua/mannat share karo!",
    "Kisi random restaurant mein order karo and cancel!",
    "Apna last cry reason batao!",
    "Apni favourite candle fragrance batao!",
    "Kisi ke saath unka milk carton face banake photo lo!",
    "Apna photo without any filter bhejo!",
    "Kisi ke comment section mein funny reply karo!",
    "Apne 3 future goals likh ke bhejo!",
    "Kisi bhi ad ko dekh ke sirf emoji se react karo!",
    "Apne 5 negative qualities honest batao!",
    "Kisi friend ko pretend karo ki tum upset ho!",
    "Apna favourite weather batao aur kyun!",
];

const SHIP_NAMES_FIRST = [
    "Swe", "Lo", "An", "Em", "Star", "Moon", "Sun", "Cup", "Love", "Bae",
    "Cute", "Hey", "Neo", "Vib", "Jaz", "Flo", "Gle", "Pix", "Zoe", "My",
];
const SHIP_NAMES_SECOND = [
    "eetheart", "vely", "gel", "ber", "light", "shine", "flower", "id", "bird", "pie",
    "y", "ster", "nia", "es", "zy", "rax", "am", "ie", "la", "ny",
];
const COMPLIMENTS = [
    "Your presence is literally a vibe. No cap.",
    "You light up the room like your phone screen at 2AM — bright and impossible to ignore.",
    "You're the human version of a warm paratha on a rainy day.",
    "You're so cool, even ice wants your autograph.",
    "Your smile is more contagious than a WhatsApp forward.",
    "You're literally the main character and everyone else is an NPC.",
    "You have the energy of a golden retriever who just got treats.",
    "You're so fine, they should put you in a museum.",
    "Your brain is on 5G while everyone else is on 2G.",
    "You're the McFlurry to my McDonald's — the best part of the meal.",
    "You're the kind of beautiful that makes the sunrise jealous.",
    "You're not just a star, you're the whole constellation.",
    "Your vibe attracts your tribe — and you're attracting the whole town.",
    "You're better than a 100% battery notification.",
    "If confidence was a person, it would be you.",
    "You're the WiFi everyone wants to connect to.",
    "You're proof that God is a perfectionist.",
    "You don't need a filter, you ARE the filter.",
    "You're like a fine wine — gets better and better.",
    "Your personality is a 10/10, no debate.",
    "You're the reason people believe in love at first sight.",
    "You're breathtaking — and yes, that's a Keanu Reeves reference.",
    "You're the prettiest notification I've received all day.",
    "Your energy is the definition of good vibes only.",
    "You're so talented, it's almost unfair.",
    "You're like a magician — you make problems disappear.",
    "You're the Google of friendship — you have all the answers.",
    "You're a walking ray of sunshine with a WiFi connection.",
    "You glow differently, and everyone notices.",
    "You're the kind of person everyone wants in their corner.",
    "You have the heart of a lion and the charm of a puppy.",
    "You're so smart, it's scary — in a good way.",
    "Your laugh is my new favourite song.",
    "You're the blueprint. Everyone else is just copying.",
    "You're more addictive than TikTok.",
    "You're the whole package, plus free shipping.",
    "You're a masterpiece that no one can replicate.",
    "You're the type of person clouds tell stories about.",
    "If kindness had a face, it'd be yours.",
    "You're better than a cold drink on a hot day.",
    "Your style is unmatched and unbeatable.",
    "You're so genuine, it's refreshing.",
    "You're the eye of the storm — calm and beautiful.",
    "You have more rizz than the entire universe.",
    "You're the human version of a standing ovation.",
    "You're the chill to my thrill.",
    "You make ordinary moments feel special.",
    "You're the spark that starts the fire.",
    "You're not just a catch, you're the whole ocean.",
    "You're the kind of pretty that breaks calculators.",
    "You're a whole vibe, not just a mood.",
    "You're the rose that grew from concrete.",
];

const PICKUP_LINES_1 = [
    "Are you a time traveler? Because I see you in my future.",
    "Are you made of copper and tellurium? Because you're Cu-Te.",
    "Do you have a Band-Aid? Because I just scraped my knee falling for you.",
    "Is your name Wi-Fi? Because I'm feeling a connection.",
    "Are you a magician? Because whenever I look at you, everyone else disappears.",
    "Do you have a map? I keep getting lost in your eyes.",
    "Are you a parking ticket? Because you've got FINE written all over you.",
    "If you were a vegetable, you'd be a cute-cumber.",
    "Are you Angel? Because you fell from heaven.",
    "Are you a camera? Every time I look at you, I smile.",
    "Do you believe in love at first sight, or should I walk by again?",
    "You must be tired because you've been running through my mind all day.",
    "Is there an airport nearby or is it just my heart taking off?",
    "Are you Netflix? Because I could watch you for hours.",
    "You're so beautiful that you made me forget my pickup line.",
    "Do you have a name or can I call you mine?",
    "Is your dad a baker? Because you're a cutie pie.",
    "Are you a bank loan? Because you have my interest.",
    "You must be a Snickers because you satisfy all my cravings.",
    "Are you a dictionary? Because you add meaning to my life.",
    "Did it hurt when you fell from heaven?",
    "Are you Google? Because you have everything I'm searching for.",
    "Is your name WhatsApp? Because you're my favourite chat.",
    "Are you a charger? Because without you, I'd die.",
    "You must be a star because your light reaches me even from far away.",
    "Are you a keyboard? Because you're just my type.",
    "Do you like Star Wars? Because Yoda only one for me.",
    "You're so sweet, you're giving me diabetes.",
    "Are you an alien? Because you've abducted my heart.",
    "Is your aura made of gold? Because you're glowing.",
    "Can I follow you home? Because my parents told me to follow my dreams.",
    "Are you a cat? Because I'm feline a connection.",
    "Do you have a pencil? Because I want to erase your past and write our future.",
    "You're like a dictionary — you make life meaningful.",
    "Are you a snowflake? Because you're one of a kind.",
    "Do you play soccer? Because you're a keeper.",
    "Are you a rainbow? Because you brighten my darkest days.",
    "If beauty was a crime, you'd be serving life.",
    "Are you coffee? Because you keep me up at night.",
    "Are you a twin? Because you're twice as nice.",
    "Is your name Google Maps? Because I'm lost in you.",
    "You're like a bookmark — you mark the best part of my story.",
    "Are you a beaver? Because da-yum.",
    "Can I borrow a kiss? I promise to return it.",
    "Do you believe in fate? Because I think we were meant to meet.",
    "Are you a pizza? Because I've got a crust on you.",
    "Your hand looks heavy — here, let me hold it for you.",
    "You're so hot that fire extinguishers are scared of you.",
    "Are you a lighthouse? Because you guide me home.",
    "If you were a fruit, you'd be a fine-apple.",
];

const PICKUP_LINES_2 = [
    "Tumhare chehre ki rosni ne mera din bana diya.",
    "Tumhari aankhon mein kho jaun to pata bhi na chale.",
    "Tum agar music ho to main loop mein sunne wala fan hoon.",
    "Tumhari smile dekh ke lagta hai ab aur kuch nahi chahiye.",
    "Tum se baat karna winner mein 10000 points jitne jaisa hai.",
    "Tumhare dimaag ki sharpness dekh ke lagta hai tum Google ho.",
    "Tumhare liye main apna last slice of pizza bhi sacrifice kardun.",
    "Tumse milke lagta hai main lottery jeet gaya.",
    "Tumhare personality ka no competition hai.",
    "Tumhara naam sun ke hi mera mood bright ho jata hai.",
    "Tumhari baatein sunke lagta hai ASMR sun raha hoon.",
    "Tumhara vibe aisa hai ki log automatically tumhari taraf khinchte hain.",
    "Tumhari presence bomb ho jaati hai, literally.",
    "Tumse har baat karna ek adventure hai.",
    "Tumhara style aisa hai ki fashion police bhi tumhe salaam kare.",
    "Tumhare saath waqt bitana favourite show dekhne jaisa hai.",
    "Tumse milke pata chala ki perfection possible hai.",
    "Tumhara lajawab sense of humour hai yar.",
    "Tumhari baaton mein magic hai, pata hai tumhe?",
    "Tum ek full-on green flag ho, no red flags at all.",
    "Tumse baat karna ek refreshing breeze jaisa hai.",
    "Tumhari energy contagious hai — positive way mein.",
    "Tumhara laugh sunke dil garden garden ho jata hai.",
    "Tum kitne bhi busy ho, tumhara message aate hi smile aa jati hai.",
    "Tumhare jaisa dost milna ek blessing hai.",
    "Tumhara presence sabko calm kar deta hai — literally therapy.",
    "Tumhari soch aur perspective dono next level hain.",
    "Tumhara sense of style always on point rehta hai.",
    "Tumhara dimaag sharp hai, koi tumhe fool nahi kar sakta.",
    "Tumse milke lagta hai main universe ka favourite hoon.",
];

const ROASTS = [
    "Your WiFi password is probably 'password123'. Clown behaviour.",
    "You're the reason shampoo bottles say 'lather, rinse, repeat' — because some people need extra instructions.",
    "I've seen better decisions made by a coin flip.",
    "You type with one finger. That explains everything.",
    "Your personality has the energy of a dead phone battery.",
    "Even Google can't find a reason to be impressed by you.",
    "You're the human equivalent of a loading screen that never ends.",
    "People slow clap for you sarcastically and you think it's real.",
    "You peaked at birth, and even that's debatable.",
    "Your common sense must be on airplane mode — permanently.",
    "You could get lost in a one-room apartment.",
    "Your brain cells have a restraining order against each other.",
    "You're about as useful as a screen door on a submarine.",
    "You think 'lol' is a proper response to everything. Tragic.",
    "You're the type to reply 'k' and think you're deep.",
    "If stupidity had a mascot, it'd call in sick and send you instead.",
    "You're giving main character energy in a deleted scene.",
    "Your confidence is impressive considering your track record.",
    "You're a walking 'could've been' story.",
    "Even autocorrect gave up on fixing your messages.",
    "You're so slow, even a snail overtakes you.",
    "Your life is a sitcom but nobody's laughing.",
    "You're the reason God created the 'mute' button.",
    "If you were a vegetable, you'd be a 'loser-root'.",
    "Your search history is more interesting than your personality.",
    "You bring everyone so much joy — when you leave.",
    "You're like a cloud. When you disappear, it's a beautiful day.",
    "Somewhere a village is missing its idiot.",
    "You're not stupid; you're just genetically disadvantaged.",
    "Your secrets are safe with me. I don't listen anyway.",
];

const INSULTS = [
    "Tu itna boring hai ki coffee bhi tujhse door bhaagti hai.",
    "Tera personality itna flat hai ki 2D bhi tujhse aage hai.",
    "Tumhara dimaag WiFi jaisa hai — kabhi connect hota hai, kabhi nahi.",
    "Tu uss exam ki tarah hai jo koi pass nahi karna chahta.",
    "Tumhara swag temporary hai but cringe permanent.",
    "Tu itna irritating hai ki alarm clock bhi respect maange.",
    "Tumhara attitude aisa hai jaise kuch ho, lekin ho kuch nahi.",
    "Tu uss notification ki tarah hai jo koi nahi padhna chahta.",
    "Tumse better AI bhi jokes likh leta hai.",
    "Tu ek backup plan bhi nahi hai, tu to plan C hai.",
    "Tumhara existence hi ek error hai.",
    "Tu itna fake hai ki 3D printer tujhse real banata hai.",
    "Tumhara face unmatch hai aur personality bhi.",
    "Tu aisa dost hai jaise emergency contact — zaroorat nahi hoti.",
    "Tumhara fashion sense kidnapped hai aur ransom nahi maanga.",
    "Tu itna predictable hai ki autofill teri life likh deta hai.",
    "Tumhari energy zero hai, minus bhi nahi.",
    "Tu aisa lagta hai jaise beta version jo kabhi shipp nahi hua.",
    "Tumhara dialogue delivery robot se bhi robotic hai.",
    "Tu 'loading…' hai, kabhi end nahi hota.",
    "Tumhara sense of humor missing ho gaya hai.",
    "Tu offline ho ya online, same vibe — no vibe.",
    "Tumhe dekh ke lagta hai ki mirror broken hai.",
    "Tu uss font ki tarah hai jo koi use nahi karta.",
    "Tumhara presence hi unwanted hai — everywhere.",
    "Tu 10% attitude, 90% nothing.",
    "Tumhari awkward silence bhi awkward lagti hai.",
    "Tu itna cringe hai ki 2000s ke fashion ko bhi shame aati hai.",
    "Tumhara life update nahi aata kyunki koi interested nahi.",
    "Tu 'reply expected' sticker hai jisko koi nahi lagata.",
];

const RIDDLES = [
    { q: "Main hoon jo hamesha aage badhta hoon, kabhi peeche nahi aata. Main din raat kaat ta hoon. Kya hoon main?", a: "Samay (Time)" },
    { q: "Mere paas city hain but ghar nahi, forest hain but ped nahi, paani hain but samandar nahi. Kya hoon main?", a: "Naqsha (Map)" },
    { q: "Jo bhi mujhe banata hai, wo chupke se banata hai. Jo mujhe khareedta hai, wo mujhe use nahi karta. Jo mujhe use karta hai, wo nahi jaanta. Kya hoon main?", a: "Taboot (Coffin)" },
    { q: "Main raat ko aati hoon aur subah chali jaati hoon. Main duniya ko roshan karti hoon. Kya hoon main?", a: "Chandni (Moonlight)" },
    { q: "Mere andर dalo to main aur bhari ho jaati hoon. Kya hoon main?", a: "Pani mein boora (Rice in water - cooks and expands)" },
    { q: "Aisi cheez jo itni keemti hai ke ₹1 ki bhi nahi milti lekin free mein milti hai?", a: "Hawaa (Air / Hawa)" },
    { q: "Seedha khara hota hai, upar neeche karo to seedha rehta hai. Kya hai?", a: "Morna (Turn / A road that's straight)" },
    { q: "Jitna zyada tum lete ho, utna zyada tum chhodte ho. Kya hoon main?", a: "Qadam (Footsteps)" },
    { q: "Mere baal hain but sar nahi. Mere naak hai but muh nahi. Kya hoon main?", a: "Chai ki patti (Tea strainer?)" },
    { q: "Tumhara hoon, lekin tumse zyada doosre use karte hain. Kya hoon main?", a: "Tumhara naam (Your name)" },
    { q: "Ek aisi cheez jo sookhi ho to 2 kilo, geeli ho to 1 kilo, aur jal gayi to 3 kilo.", a: "Sulphur (Gandhak)" },
    { q: "Jo aadmi bana aur ₹7 mein becha?",
        a: "Muqaddar (Fate - no, this riddle doesn't fit)..." },
    { q: "Ek gadhe ke 2 sar hain, ek muh, do pair. Kya hai?", a: "Tulsi ka ped? / A person riding?" },
    { q: "Aisa konsa darwaza hai jisko koi khol nahi sakta?", a: "Anda (Egg)" },
    { q: "Aisa konsa ful hai jo kabhi khilta nahi?", a: "Govind? — Phool jhadi?" },
    { q: "Upar se neela, neeche se hara, beech mein kya hai?", a: "VIT university Delhi — no. Actually 'Pani' (water in sea - blue above, green below)" },
    { q: "Mujhe koi pakad nahi sakta, lekar bhi nahi ja sakta. Lekin tumhe chhoda bhi nahi jaata. Kya hoon main?", a: "Saya (Shadow)" },
    { q: "Aisa kaunsa number hai jiska aadha 5 nahi hai?", a: "10 (aadha 5 hota hai but 10 ka aadha 5 hi hai)" },
    { q: "Aise konsi 2 cheezein hain jo tum kha nahi sakte lekin kharid sakte ho?", a: "Joota aur mausam (Shoes and weather)" },
    { q: "Konsa janwar subah char pair per, dopahar do pair per aur sham teen pair per chalta hai?", a: "Insaan (Human - crawling, walking, stick)" },
    { q: "Aisa kaunsa darakht hai jisme pani nahi hota?", a: "Sookha darakht / patthar ka darakht" },
    { q: "Kya aisi cheez hai jo kabhi khatam nahi hoti?", a: "Waqt / Duniya ghoomna" },
    { q: "Sooraj ke saamne konsa graha hai?", a: "Buddh (Mercury)" },
    { q: "Choron ka baap kaun hai?", a: "Mauka (Opportunity)" },
    { q: "Aisa konsa shabd hai jo galat hi sahi hai?", a: "Ghalat (Wrong) — the word itself is wrong" },
    { q: "Konsi cheez hai jo garam hone par jamti hai?", a: "Anda (Egg)" },
    { q: "Konsa aisa jaanwar hai jo apni aankhein nahi khol sakta?", a: "Neend ka janwar / worm" },
    { q: "Ek maa hai, 4 bete hain. Har bete ke 2 haath, ek pair. Kya hai?", a: "Gaay (Cow?) / Kursi (Chair?)" },
    { q: "Aisa konsa shabd hai jisme 'G' nahi hai lekin 'G' liye bina use likhte hain?", a: "'G' letter itself" },
    { q: "Tum mujhe andar rakhne ke liye bahar rakhte ho. Kya hoon main?", a: "Chabi (Key)" },
    { q: "Tumhari ungliyaan meri taraf ishaara karti hain lekin tum meri taraf nahi aate. Kya hoon main?", a: "Dard / Sui (Needle)" },
    { q: "Bina aankhon ke dekhti hoon, bina pair ke daudti hoon. Kya hoon main?", a: "Hawa (Wind)" },
    { q: "Jitna tum lete ho utna badhta hai, lekin kabhi bharta nahi. Kya hai?", a: "Qarz (Debt)" },
    { q: "Aisa konsa ghar hai jisme koi darwaza nahi?", a: "Ghar " },
];

const RIDDLES_CLEAN = [
    { q: "Main hoon jo hamesha aage badhta hoon, kabhi peeche nahi aata. Kya hoon main?", a: "Samay (Time)" },
    { q: "Mere paas city hain but ghar nahi, forest hain but ped nahi, paani hain but samandar nahi. Kya hoon main?", a: "Naqsha (Map)" },
    { q: "Jo mujhe banata hai wo chupke se banata hai. Jo mujhe khareedta hai wo mujhe use nahi karta. Jo mujhe use karta hai wo nahi jaanta. Kya hoon main?", a: "Taboot (Coffin)" },
    { q: "Main raat ko aati hoon aur subah chali jaati hoon. Main duniya ko roshan karti hoon. Kya hoon main?", a: "Chandni (Moonlight)" },
    { q: "Aisi cheez jo itni keemti hai ke nahi milti lekin free mein milti hai?", a: "Hawaa (Air)" },
    { q: "Jitna zyada tum lete ho, utna zyada tum chhodte ho. Kya hoon main?", a: "Qadam (Footsteps)" },
    { q: "Tumhara hoon, lekin tumse zyada doosre use karte hain. Kya hoon main?", a: "Tumhara naam (Your name)" },
    { q: "Mujhe koi pakad nahi sakta, lekar bhi nahi ja sakta. Lekin tumhe chhoda bhi nahi jaata. Kya hoon main?", a: "Saya (Shadow)" },
    { q: "Konsa janwar subah chaar pair per, dopahar do pair per aur shaam teen pair per chalta hai?", a: "Insaan (Human)" },
    { q: "Aisa konsa shabd hai jo galat hi sahi hai?", a: "Ghalat (Wrong)" },
    { q: "Konsi cheez hai jo garam hone par jamti hai?", a: "Anda (Egg)" },
    { q: "Tum mujhe andar rakhne ke liye bahar rakhte ho. Kya hoon main?", a: "Chabi (Key)" },
    { q: "Bina aankhon ke dekhti hoon, bina pair ke daudti hoon. Kya hoon main?", a: "Hawa (Wind)" },
    { q: "Jitna tum lete ho utna badhta hai, lekin kabhi bharta nahi. Kya hai?", a: "Qarz (Debt)" },
    { q: "Aisa konsa ghar hai jisme koi darwaza nahi?", a: "Kacchi gar (Egg shell?)" },
];

const WYR_QUESTIONS = [
    "Would you rather have the ability to fly but only 1 meter above the ground, or run at 100 km/h but only in circles?",
    "Would you rather live in a house made of chocolate or a house made of cheese?",
    "Would you rather have a rewind button on your life or a pause button?",
    "Would you rather be able to talk to animals or speak every human language?",
    "Would you rather always be 10 minutes late or always be 20 minutes early?",
    "Would you rather lose your phone or lose your wallet?",
    "Would you rather have unlimited sushi for life or unlimited pizza for life?",
    "Would you rather be famous and poor or unknown and rich?",
    "Would you rather be able to teleport anywhere but only to places you've been before, or be able to time travel but only to the past?",
    "Would you rather never use social media again or never watch YouTube again?",
    "Would you rather have a pet dragon or a pet unicorn?",
    "Would you rather be invisible or be able to read minds?",
    "Would you rather live on the beach or in the mountains?",
    "Would you rather give up bathing for a month or give up sleeping for a week?",
    "Would you rather have a clone of yourself or be able to shapeshift?",
    "Would you rather always have to sing instead of speaking, or dance instead of walking?",
    "Would you rather be able to control fire or water?",
    "Would you rather know the date of your death or the cause of your death?",
    "Would you rather have your childhood pet come back to life or meet a new magical creature?",
    "Would you rather be stuck in an elevator with your ex or with a crying baby?",
    "Would you rather have internet without WiFi or WiFi without internet?",
    "Would you rather be able to stop time for everyone except yourself, or travel through time but can't change anything?",
    "Would you rather be a famous musician or a famous athlete?",
    "Would you rather have a personal chef or a personal driver?",
    "Would you rather live in a treehouse or in a submarine?",
    "Would you rather always be cold or always be hot?",
    "Would you rather be able to talk to your past self or your future self?",
    "Would you rather lose all your memories from the past 5 years or never be able to make new memories again?",
    "Would you rather have a flying carpet or a talking mirror?",
    "Would you rather be able to heal any illness but only for animals, or understand any technology instantly?",
    "Would you rather be able to breathe underwater or have super strength?",
    "Would you rather be forced to dance every time you hear music, or laugh every time you see a red object?",
    "Would you rather never be able to use emojis again or never be able to use punctuation again?",
    "Would you rather have a million followers on Instagram but no real friends, or 5 real friends and no online presence?",
    "Would you rather be able to change your eye color anytime or change your hair length anytime?",
    "Would you rather live in a world without music or a world without movies?",
    "Would you rather have a memory like a computer or a computer like a memory?",
    "Would you rather be able to fly but only when nobody is watching, or be able to breathe underwater but only in a pool?",
    "Would you rather have the power to instantly learn any skill, or the power to instantly earn any amount of money once?",
    "Would you rather be the funniest person in the room or the smartest person in the room?",
    "Would you rather have dinner with your ancestors or with your descendants?",
    "Would you rather be able to speak to ghosts or see 5 minutes into the future?",
    "Would you rather have a never-ending backpack that always has exactly what you need, or a key that opens any door?",
    "Would you rather live in a world where there are no lies, or a world where there are no secrets?",
    "Would you rather be able to taste colors or see sounds?",
    "Would you rather have the ability to never need sleep, or never need to eat?",
    "Would you rather be the best player on a losing team or the worst player on a winning team?",
    "Would you rather find true love or win a billion rupees?",
    "Would you rather your shirts always be slightly too tight or your pants always be slightly too loose?",
    "Would you rather be able to pause time for 1 hour per day or rewind time for 10 seconds per day?",
    "Would you rather have unlimited data but no charger, or unlimited charger but no data?",
    "Would you rather be scared of everything or be scared of nothing?",
    "Would you rather always be the center of attention or always be ignored?",
    "Would you rather your pet live forever or your favorite food be available everywhere?",
];

const NEVERHAVEIEVER = [
    "Never have I ever lied to my best friend.",
    "Never have I ever stalked someone on social media.",
    "Never have I ever cheated on a test.",
    "Never have I ever pretended to like a gift.",
    "Never have I ever ghosted someone.",
    "Never have I ever sent a text to the wrong person.",
    "Never have I ever eavesdropped on a conversation.",
    "Never have I ever blamed something on my sibling.",
    "Never have I ever eaten food off the floor.",
    "Never have I ever stalked my ex's new partner.",
    "Never have I ever fallen asleep in a movie theater.",
    "Never have I ever faked a laugh at a bad joke.",
    "Never have I ever picked a wedgie in public.",
    "Never have I ever sung in the shower.",
    "Never have I ever danced in front of a mirror.",
    "Never have I ever farted in an elevator.",
    "Never have I ever cried during a movie.",
    "Never have I ever had a crush on a friend's ex.",
    "Never have I ever been caught picking my nose.",
    "Never have I ever used someone else's password without asking.",
    "Never have I ever lied about my age online.",
    "Never have I ever broken something and blamed it on someone else.",
    "Never have I ever said 'I'm on my way' when I hadn't even left.",
    "Never have I ever re-gifted a present.",
    "Never have I ever kept a library book.",
    "Never have I ever eaten something that fell on the floor.",
    "Never have I ever googled myself.",
    "Never have I ever taken a picture of myself in a public bathroom mirror.",
    "Never have I ever worn socks with sandals.",
    "Never have I ever said 'I love you' and not meant it.",
    "Never have I ever snuck food into a cinema.",
    "Never have I ever pretended to be sick to skip something.",
    "Never have I ever used someone else's WiFi without permission.",
    "Never have I ever had a dream about someone I know.",
    "Never have I ever lied about my height.",
    "Never have I ever saved someone's number under a fake name.",
    "Never have I ever looked through someone's phone without permission.",
    "Never have I ever kissed someone I met online.",
    "Never have I ever written a love letter.",
    "Never have I ever recorded a video of myself crying.",
    "Never have I ever snuck out of the house without telling anyone.",
    "Never have I ever pretended to understand a movie when I didn't.",
    "Never have I ever stolen something from a store.",
    "Never have I ever broken a bone.",
    "Never have I ever had a secret Instagram account.",
    "Never have I ever watched a reality TV show and got invested.",
    "Never have I ever talked to myself in the mirror.",
    "Never have I ever tried to look through someone's window.",
    "Never have I ever told a secret I promised to keep.",
    "Never have I ever wished a bad haircut on someone.",
    "Never have I ever sent a risky message and immediately regretted it.",
    "Never have I ever made a fake account to stalk someone.",
    "Never have I ever had a parasocial crush on a YouTuber.",
    "Never have I ever used incognito mode for something silly.",
    "Never have I ever pretended to be on my phone to avoid someone.",
    "Never have I ever talked badly about someone while smiling at them.",
];

const FLIRT_LINES = [
    "Kya tumhara GPS hai? Kyunki main tum mein kho gaya hoon.",
    "Tumhari aankhen itni gehri hain, main unmein doob raha hoon.",
    "Tumhara naam sirf contacts mein nahi, dil mein bhi save hai.",
    "Tumhari smile dekh ke lagta hai poora din ban gaya.",
    "Tum chaand ho to main chaandni, saath mein purein.",
    "Tumhara hath pakadna zindagi ka sabse acha feel hai.",
    "Tumse baat karna kisi khoobsurat khwab jaisa hai.",
    "Tumhari baaton mein wo mithaas hai jo shayar nahi bayan kar sakte.",
    "Tumhara face dekh ke lagta hai Allah ne apna best kaam kiya hai.",
    "Tum jaisa koi mile to life set ho jaaye.",
    "Tumhara dimaag tumhari beauty se bhi zyada attractive hai.",
    "Tumhari awaaz sunke pata chalta hai ke sukoon kya hota hai.",
    "Tumhare saath waqt bitana favourite movie se better hai.",
    "Tumhari adaaon mein wo style hai jo sabko impress kare.",
    "Tumse milke maine jaana ki 'love at first sight' real hai.",
    "Tumhari soorat aur seerat dono number one hain.",
    "Tum kaise itne perfect ho? Koi flaw hai bhi ya nahi?",
    "Tumhara hath tham loon to raaste bhi apne lagte hain.",
    "Tumse milkar zindagi mein colours aa gaye.",
    "Tumhari ek jhalak dekhne ke liye main door tak aa jaaon.",
    "Tumhara muskurahat jahan ho, wahan khushiyan hain.",
    "Tumhare baare mein sochna mera guilty pleasure hai.",
    "Tumhari personality ka koi alternative nahi hai yar.",
    "Tum itni cute ho ke cute-cumber bhi sharma jaye.",
    "Tumhara smile infinity times better hai Instagram filters se.",
    "Tumhari baatein mera mood instantly lift kar deti hain.",
    "Tumhare aankhon mein dekhte hi dil ki dhadkan badh jaati hai.",
    "Tumhara naam loon to dil garden garden ho jata hai.",
    "Tumhari presence kisi bhi jagah ko special bana deti hai.",
    "Tum kitne bhi serious ho, tumhara dil bohat soft hai.",
    "Tumhara style itna neat hai ke log copy karne ki koshish karein.",
    "Tumhe dekh ke trust issues bhi khatam ho jaate hain.",
    "Tumse baat karte waqt time pata nahi chalta.",
    "Tumhara confidence aur simplicity dono deadly combo hai.",
    "Tumhari awaaz mein melody hai jo gaane se bhi khoobsurat hai.",
    "Tumhara laugh sunke lagta hai ke life worth living hai.",
    "Tum saathi ho to kya kami hai aur kya zaroorat hai.",
    "Tumhari company mein waqt ruk jaata hai.",
    "Tumhare saath walk karna apne aap mein ek adventure hai.",
    "Tumhara smile mera favourite view hai.",
    "Tumhari goodness dekh ke lagta hai duniya mein abhi bhi ummeed hai.",
    "Tumhara face card kabhi decline nahi hota.",
    "Tumhari personality ke aage flowers bhi fade ho jaate hain.",
    "Tum jaisa koi ho to main roz milne aaun.",
    "Tumhare khayalon mein khona din ka best part hai.",
    "Tumhari beauty ke saath confidence bhi deadly hai.",
    "Tumhara presence sukoon ka ek alag level hai.",
    "Tumhara hath pakadna mera naya goal hai.",
    "Tum itni special ho ke celebrate karne ke liye ek naya din chahiye.",
    "Tumhare saath har lamha memorable ban jaata hai.",
];

const HACK_STAGES = [
    { text: "🔍 Target acquired: @user", percent: 0 },
    { text: "📡 Connecting to satellite network...", percent: 5 },
    { text: "🔐 Bypassing firewall layer 1...", percent: 10 },
    { text: "🛜 Routing through anonymous proxy chains...", percent: 15 },
    { text: "🔓 Cracking WPA2 encryption...", percent: 22 },
    { text: "🕳️ Exploiting kernel vulnerability...", percent: 30 },
    { text: "🧬 Injecting malicious payload...", percent: 38 },
    { text: "🔄 Spoofing MAC address...", percent: 45 },
    { text: "📂 Accessing system32 files...", percent: 53 },
    { text: "🔑 Brute-forcing password hash... 56% complete", percent: 60 },
    { text: "💀 Extracting private data...", percent: 68 },
    { text: "📸 Accessing front camera... just kidding 👀", percent: 75 },
    { text: "🕵️ Downloading chat history...", percent: 82 },
    { text: "🗑️ Deleting system logs...", percent: 88 },
    { text: "📤 Uploading data to secure server...", percent: 94 },
    { text: "✅ HACK COMPLETE. @user has been fully compromised.", percent: 100 },
];

export default {
    name: 'fungames',
    aliases: ['truth', 'dare', 'ship', 'bomb', 'flirt', 'compliment', 'praise', 'roast', 'insult', 'riddle', 'wyr', 'neverhaveiever', 'pickupline', 'hack', 'clac'],
    description: 'Fun games & activities — truth, dare, ship, bomb, flirt, compliment, roast, insult, riddle, wyr, neverhaveiever, hack, clac & more',
    category: 'Fun',
    run: async (context) => {
        const { client, m, command, text, args, prefix } = context;
        const fq = getFakeQuoted(m);
        const mentionedUser = m.mentionedJid?.length ? m.mentionedJid[0]
            : m.quoted?.sender ? m.quoted.sender
            : null;

        const cmd = command.toLowerCase();

        // ─── TRUTH ───
        if (cmd === 'truth') {
            const item = TRUTHS[Math.floor(Math.random() * TRUTHS.length)];
            await client.sendMessage(m.chat, { react: { text: '🤫', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭─ *Tʀᴜᴛʜ*\n├\n│ 🤫 ${item}\n╰─ Codex-MD`
            }, { quoted: fq });
        }

        // ─── DARE ───
        if (cmd === 'dare') {
            const item = DARES[Math.floor(Math.random() * DARES.length)];
            await client.sendMessage(m.chat, { react: { text: '🔥', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭─ *Dᴀʀᴇ*\n├\n│ 🔥 ${item}\n╰─ Codex-MD`
            }, { quoted: fq });
        }

        // ─── SHIP ───
        if (cmd === 'ship') {
            const parts = text.split(/[,&\s]+/).filter(Boolean);
            let name1, name2;
            if (parts.length >= 2) {
                name1 = parts[0].trim();
                name2 = parts.slice(1).join(' ').trim();
            } else if (mentionedUser) {
                name1 = text ? text.trim() : m.pushName || 'Someone';
                name2 = `@${mentionedUser.split('@')[0]}`;
            } else {
                return client.sendMessage(m.chat, {
                    text: `╭─ *Sʜɪᴘ*\n├\n│ Usage: ${prefix}ship <name1> <name2>\n╰─ Codex-MD`
                }, { quoted: fq });
            }

            const compatibility = Math.floor(Math.random() * 41) + 60;
            const shipFirst = SHIP_NAMES_FIRST[Math.floor(Math.random() * SHIP_NAMES_FIRST.length)];
            const shipSecond = SHIP_NAMES_SECOND[Math.floor(Math.random() * SHIP_NAMES_SECOND.length)];
            const shipName = shipFirst + shipSecond;

            const loveDesc = [
                "Made for each other — no cap!",
                "Bhai yeh dono to perfect couple hain!",
                "Love at first sight type vibes ✨",
                "Destiny ne likha hai saath hai yeh dono.",
                "True love exists because of these two!",
                "Power couple loading... 100% complete.",
                "Ye dono ek doosre ke liye bane hain yar!",
                "Relationship goals tbh!",
                "Chemistry itni strong ki lab mein measure nahi ho sakti.",
                "Bollywood movie script lagti hai yeh dono ki story!",
            ][Math.floor(Math.random() * 10)];

            await client.sendMessage(m.chat, { react: { text: '💕', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭─ *Sʜɪᴘ*\n├\n│ 💕 ${name1} × ${name2}\n│ 🏷️ Ship Name: *${shipName}*\n│ ❤️ Compatibility: *${compatibility}%*\n├\n│ *${loveDesc}*\n╰─ Codex-MD`
            }, { quoted: fq });
        }

        // ─── BOMB ───
        if (cmd === 'bomb') {
            const sessionKey = `bomb_${m.sender}`;
            const number = parseInt(args[0]);

            if (number && !isNaN(number) && number >= 1 && number <= 100) {
                const session = global.sessionBomb?.[m.sender];
                if (!session) {
                    return client.sendMessage(m.chat, {
                        text: `╭─ *Bᴏᴍʙ*\n├\n│ 💣 Pehle \`${prefix}bomb\` type karo game start karne ke liye!\n╰─ Codex-MD`
                    }, { quoted: fq });
                }
                const { target, attempts } = session;
                if (number === target) {
                    delete global.sessionBomb[m.sender];
                    await client.sendMessage(m.chat, { react: { text: '💥', key: m.reactKey } });
                    return client.sendMessage(m.chat, {
                        text: `╭─ *Bᴏᴍʙ*\n├\n│ 💥 *KABOOM!*\n│ 🔢 Number: ${target}\n│ 💀 You picked ${number} and... BOOM!\n│ You exploded after ${attempts} guesses! Haha.\n╰─ Codex-MD`
                    }, { quoted: fq });
                }
                session.attempts = attempts + 1;
                const hint = number < target ? 'Higher ⬆️' : 'Lower ⬇️';
                await client.sendMessage(m.chat, { react: { text: '💣', key: m.reactKey } });
                return client.sendMessage(m.chat, {
                    text: `╭─ *Bᴏᴍʙ*\n├\n│ 💣 ${hint}\n│ 🔢 Guesses: ${session.attempts}\n╰─ Codex-MD`
                }, { quoted: fq });
            }

            // start new game
            const target = Math.floor(Math.random() * 100) + 1;
            if (!global.sessionBomb) global.sessionBomb = {};
            global.sessionBomb[m.sender] = { target, attempts: 0 };
            await client.sendMessage(m.chat, { react: { text: '💣', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭─ *Bᴏᴍʙ*\n├\n│ 💣 A bomb has been planted!\n│ Guess a number between 1-100.\n│ Type \`${prefix}bomb <number>\` to guess.\n│ Pick wrong — I'll say Higher ⬆️ or Lower ⬇️\n│ Pick right — you explode! 💥\n╰─ Codex-MD`
            }, { quoted: fq });
        }

        // ─── FLIRT ───
        if (cmd === 'flirt') {
            const line = FLIRT_LINES[Math.floor(Math.random() * FLIRT_LINES.length)];
            await client.sendMessage(m.chat, { react: { text: '😏', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭─ *Fʟɪʀᴛ*\n├\n│ 😏 ${line}\n╰─ Codex-MD`
            }, { quoted: fq });
        }

        // ─── PICKUPLINE ───
        if (cmd === 'pickupline') {
            const pool = [...PICKUP_LINES_1, ...PICKUP_LINES_2];
            const line = pool[Math.floor(Math.random() * pool.length)];
            await client.sendMessage(m.chat, { react: { text: '💘', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭─ *Pɪᴄᴋᴜᴘ Lɪɴᴇ*\n├\n│ 💘 ${line}\n╰─ Codex-MD`
            }, { quoted: fq });
        }

        // ─── COMPLIMENT / PRAISE ───
        if (cmd === 'compliment' || cmd === 'praise') {
            const target = mentionedUser ? `@${mentionedUser.split('@')[0]}` : m.pushName || 'You';
            const line = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
            await client.sendMessage(m.chat, { react: { text: '✨', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭─ *Cᴏᴍᴘʟɪᴍᴇɴᴛ*\n├\n│ ✨ ${target}: ${line}\n╰─ Codex-MD`,
                mentions: mentionedUser ? [mentionedUser] : []
            }, { quoted: fq });
        }

        // ─── ROAST ───
        if (cmd === 'roast') {
            const target = mentionedUser ? `@${mentionedUser.split('@')[0]}`
                : m.quoted?.sender ? `@${m.quoted.sender.split('@')[0]}`
                : m.pushName || 'You';
            const targetJid = mentionedUser || m.quoted?.sender || m.sender;
            const roast = ROASTS[Math.floor(Math.random() * ROASTS.length)];
            await client.sendMessage(m.chat, { react: { text: '🔥', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭─ *Rᴏᴀsᴛ*\n├\n│ 🎯 Target: ${target}\n│ 🔥 ${roast}\n╰─ Codex-MD`,
                mentions: [targetJid]
            }, { quoted: fq });
        }

        // ─── INSULT ───
        if (cmd === 'insult') {
            const target = mentionedUser ? `@${mentionedUser.split('@')[0]}`
                : m.quoted?.sender ? `@${m.quoted.sender.split('@')[0]}`
                : m.pushName || 'You';
            const targetJid = mentionedUser || m.quoted?.sender || m.sender;
            const insult = INSULTS[Math.floor(Math.random() * INSULTS.length)];
            await client.sendMessage(m.chat, { react: { text: '😤', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭─ *Iɴsᴜʟᴛ*\n├\n│ 🎯 Target: ${target}\n│ 😤 ${insult}\n╰─ Codex-MD`,
                mentions: [targetJid]
            }, { quoted: fq });
        }

        // ─── RIDDLE ───
        if (cmd === 'riddle') {
            const riddle = RIDDLES_CLEAN[Math.floor(Math.random() * RIDDLES_CLEAN.length)];
            if (riddle.q) {
                await client.sendMessage(m.chat, { react: { text: '🧩', key: m.reactKey } });
                return client.sendMessage(m.chat, {
                    text: `╭─ *Rɪᴅᴅʟᴇ*\n├\n│ 🧩 ${riddle.q}\n│ 📌 Reply with \`${prefix}riddle answer\` to reveal\n╰─ Codex-MD`
                }, { quoted: fq });
            }
        }

        if (cmd === 'riddle' && args[0]?.toLowerCase() === 'answer') {
            return client.sendMessage(m.chat, {
                text: `╭─ *Rɪᴅᴅʟᴇ Aɴsᴡᴇʀ*\n├\n│ 🤔 The answer is hidden in the bot's brain. Ask again lol\n╰─ Codex-MD`
            }, { quoted: fq });
        }

        // ─── WYR ───
        if (cmd === 'wyr') {
            const q = WYR_QUESTIONS[Math.floor(Math.random() * WYR_QUESTIONS.length)];
            await client.sendMessage(m.chat, { react: { text: '🤔', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭─ *Wᴏᴜʟᴅ Yᴏᴜ Rᴀᴛʜᴇʀ*\n├\n│ 🤔 ${q}\n╰─ Codex-MD`
            }, { quoted: fq });
        }

        // ─── NEVERHAVEIEVER ───
        if (cmd === 'neverhaveiever') {
            const item = NEVERHAVEIEVER[Math.floor(Math.random() * NEVERHAVEIEVER.length)];
            await client.sendMessage(m.chat, { react: { text: '🫣', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭─ *Nᴇᴠᴇʀ Hᴀᴠᴇ I Eᴠᴇʀ*\n├\n│ 🫣 ${item}\n╰─ Codex-MD`
            }, { quoted: fq });
        }

        // ─── HACK ───
        if (cmd === 'hack') {
            const target = mentionedUser ? `@${mentionedUser.split('@')[0]}`
                : m.quoted?.sender ? `@${m.quoted.sender.split('@')[0]}`
                : m.pushName || 'Unknown';
            const targetJid = mentionedUser || m.quoted?.sender || m.sender;

            await client.sendMessage(m.chat, { react: { text: '💀', key: m.reactKey } });
            let msg = await client.sendMessage(m.chat, {
                text: `╭─ *Hᴀᴄᴋɪɴɢ @${target}*\n├\n│ 💀 Initializing...\n╰─ Codex-MD`,
                mentions: [targetJid]
            }, { quoted: fq });

            for (const stage of HACK_STAGES) {
                await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
                const displayText = stage.text.replace(/@user/g, target);
                try {
                    await client.sendMessage(m.chat, {
                        edit: msg.key,
                        text: `╭─ *Hᴀᴄᴋɪɴɢ @${target}*\n├\n│ ${'▓'.repeat(Math.floor(stage.percent / 5))}${'░'.repeat(20 - Math.floor(stage.percent / 5))} ${stage.percent}%\n│ ${displayText}\n╰─ Codex-MD`,
                        mentions: [targetJid]
                    });
                } catch {
                    msg = await client.sendMessage(m.chat, {
                        text: `╭─ *Hᴀᴄᴋɪɴɢ @${target}*\n├\n│ ${'▓'.repeat(Math.floor(stage.percent / 5))}${'░'.repeat(20 - Math.floor(stage.percent / 5))} ${stage.percent}%\n│ ${displayText}\n╰─ Codex-MD`,
                        mentions: [targetJid]
                    }, { quoted: fq });
                }
            }

            await client.sendMessage(m.chat, { react: { text: '☠️', key: m.reactKey } });
            return;
        }

        // ─── CLAC (Coin Flip) ───
        if (cmd === 'clac') {
            const result = Math.random() < 0.5 ? '🪙 Heads' : '🪙 Tails';
            await client.sendMessage(m.chat, { react: { text: '🪙', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭─ *Cᴏɪɴ Fʟɪᴘ*\n├\n│ ${result}\n├\n│ Chalo, decision ho gaya!\n╰─ Codex-MD`
            }, { quoted: fq });
        }
    }
};
