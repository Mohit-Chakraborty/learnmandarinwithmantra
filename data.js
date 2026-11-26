// Content for 小步 Xiǎobù.
// Character/word pinyin is written one syllable per character (space separated)
// so syllables can be tone-coloured and matched to their characters.
window.DATA = {
  characters: {
    beginner: [
      { hz: "人", py: "rén", en: "person", note: "Looks like a person walking: two legs striding apart." },
      { hz: "大", py: "dà", en: "big", note: "A person (人) stretching their arms out wide: big!" },
      { hz: "小", py: "xiǎo", en: "small", note: "A tiny stroke in the middle with two little dots beside it." },
      { hz: "口", py: "kǒu", en: "mouth", note: "A wide-open mouth, drawn as a square." },
      { hz: "山", py: "shān", en: "mountain", note: "Three peaks rising from the ground." },
      { hz: "水", py: "shuǐ", en: "water", note: "A stream in the middle with water splashing on both sides." },
      { hz: "火", py: "huǒ", en: "fire", note: "Flames leaping up, with sparks flying off the sides." },
      { hz: "日", py: "rì", en: "sun; day", note: "Once drawn as a circle with a dot. Squared off over time." },
      { hz: "月", py: "yuè", en: "moon; month", note: "A crescent moon. A month is one turn of the moon." },
      { hz: "木", py: "mù", en: "tree; wood", note: "A trunk with branches above and roots below." },
      { hz: "女", py: "nǚ", en: "woman", note: "From an ancient drawing of a kneeling woman." },
      { hz: "子", py: "zǐ", en: "child", note: "A baby wrapped up, with its arms stretched out." },
      { hz: "中", py: "zhōng", en: "middle", note: "A line straight through the middle of a box. 中国 = the Middle Kingdom, China." },
      { hz: "上", py: "shàng", en: "up; above", note: "A short mark above the ground line." },
      { hz: "下", py: "xià", en: "down; below", note: "A mark hanging below the line: the mirror of 上." },
      { hz: "天", py: "tiān", en: "sky; heaven", note: "A big person (大) with a line above their head: the sky." },
      { hz: "我", py: "wǒ", en: "I; me", note: "Originally a hand holding a weapon. Now the everyday word for “I”." },
      { hz: "你", py: "nǐ", en: "you", note: "The left side 亻 is the “person” radical, a squashed 人." },
      { hz: "好", py: "hǎo", en: "good", note: "Woman 女 + child 子 = good. A family together is good!" },
      { hz: "心", py: "xīn", en: "heart", note: "The chambers of a heart. It appears inside many feeling words." }
    ],
    early: [
      { hz: "学", py: "xué", en: "to study", note: "A child 子 learning under a roof." },
      { hz: "爱", py: "ài", en: "love", note: "The traditional form 愛 hides a heart 心 in the middle." },
      { hz: "家", py: "jiā", en: "home; family", note: "A roof 宀 over a pig 豕: in old China a home had livestock." },
      { hz: "吃", py: "chī", en: "to eat", note: "The 口 mouth on the left marks things you do with your mouth." },
      { hz: "喝", py: "hē", en: "to drink", note: "Another 口 mouth character: eat 吃, drink 喝." },
      { hz: "看", py: "kàn", en: "to look; to watch", note: "A hand 手 shading an eye 目 to look into the distance." },
      { hz: "说", py: "shuō", en: "to speak", note: "The 讠 radical on the left means speech or words." },
      { hz: "书", py: "shū", en: "book", note: "Shows up in 书店 shūdiàn (bookshop)." },
      { hz: "车", py: "chē", en: "vehicle; car", note: "Simplified from a chariot seen from above: axle and wheels." },
      { hz: "雨", py: "yǔ", en: "rain", note: "Raindrops falling from a cloud under the sky." },
      { hz: "门", py: "mén", en: "door; gate", note: "A swinging double door." },
      { hz: "马", py: "mǎ", en: "horse", note: "Once a full drawing of a galloping horse with its mane." },
      { hz: "鱼", py: "yú", en: "fish", note: "Head on top, scaly body in the middle, tail at the bottom." },
      { hz: "年", py: "nián", en: "year", note: "过年 guònián means celebrating the New Year." },
      { hz: "明", py: "míng", en: "bright", note: "Sun 日 + moon 月 = bright." },
      { hz: "朋", py: "péng", en: "friend", note: "Two moons side by side: two friends together." },
      { hz: "想", py: "xiǎng", en: "to think; to want", note: "Has 心 heart at the bottom. Thinking with your heart." },
      { hz: "买", py: "mǎi", en: "to buy", note: "Careful: 买 mǎi = buy, 卖 mài = sell. Only the tone differs!" },
      { hz: "去", py: "qù", en: "to go", note: "我去学校 = I go to school." },
      { hz: "来", py: "lái", en: "to come", note: "Originally a picture of a wheat plant." }
    ],
    expert: [
      { hz: "龙", py: "lóng", en: "dragon", note: "A symbol of power and good fortune, not a monster." },
      { hz: "梦", py: "mèng", en: "dream", note: "Two trees 林 over 夕 (evening): dreaming at night." },
      { hz: "熊", py: "xióng", en: "bear", note: "熊猫 xióngmāo, “bear-cat”, is the panda." },
      { hz: "警", py: "jǐng", en: "to warn; alert", note: "警察 jǐngchá = police officer." },
      { hz: "赞", py: "zàn", en: "to praise", note: "Has 贝, the shell radical once used for money and value." },
      { hz: "忘", py: "wàng", en: "to forget", note: "亡 lost + 心 heart = gone from the heart." },
      { hz: "懒", py: "lǎn", en: "lazy", note: "The 忄 heart radical plus 赖, to rely on others." },
      { hz: "稳", py: "wěn", en: "steady; stable", note: "The 禾 grain radical on the left: a steady harvest." },
      { hz: "赢", py: "yíng", en: "to win", note: "A dense character built from 亡, 口, 月, 贝 and 凡." },
      { hz: "疑", py: "yí", en: "to doubt", note: "怀疑 huáiyí = to suspect." },
      { hz: "尊", py: "zūn", en: "to respect; honour", note: "Once a drawing of hands raising a wine vessel in offering." },
      { hz: "感", py: "gǎn", en: "to feel", note: "Heart 心 at the bottom again. 感谢 = to thank." },
      { hz: "意", py: "yì", en: "meaning; idea", note: "Sound 音 over heart 心: the meaning behind words." },
      { hz: "情", py: "qíng", en: "emotion; feeling", note: "Heart radical 忄 + 青 (which gives the sound “-ing”)." },
      { hz: "灵", py: "líng", en: "spirit; clever", note: "灵感 línggǎn = inspiration." },
      { hz: "慢", py: "màn", en: "slow", note: "慢慢来 = take your time." },
      { hz: "鼠", py: "shǔ", en: "rat; mouse", note: "The first animal of the Chinese zodiac." },
      { hz: "蔬", py: "shū", en: "vegetables", note: "The grass radical 艹 on top marks plants." },
      { hz: "境", py: "jìng", en: "border; boundary", note: "Earth radical 土 + 竟, the end: where the land ends." },
      { hz: "键", py: "jiàn", en: "key (on a keyboard)", note: "Metal radical 钅. 键盘 jiànpán = keyboard." }
    ]
  },

  words: {
    beginner: [
      { hz: "你好", py: "nǐ hǎo", en: "hello", note: "Literally “you good”. The most useful word to start with." },
      { hz: "谢谢", py: "xiè xie", en: "thank you", note: "The second syllable is light and short (neutral tone)." },
      { hz: "再见", py: "zài jiàn", en: "goodbye", note: "Literally “again see”: see you again." },
      { hz: "朋友", py: "péng you", en: "friend" },
      { hz: "老师", py: "lǎo shī", en: "teacher", note: "老 means old, a sign of respect." },
      { hz: "学生", py: "xué sheng", en: "student", note: "学 study + 生 life/person." },
      { hz: "中国", py: "zhōng guó", en: "China", note: "Middle 中 + country 国." },
      { hz: "妈妈", py: "mā ma", en: "mum; mother" },
      { hz: "爸爸", py: "bà ba", en: "dad; father" },
      { hz: "水果", py: "shuǐ guǒ", en: "fruit", note: "Water 水 + fruit 果: juicy fruit." },
      { hz: "米饭", py: "mǐ fàn", en: "cooked rice" },
      { hz: "茶", py: "chá", en: "tea" },
      { hz: "猫", py: "māo", en: "cat", note: "Sounds a bit like a cat's meow." },
      { hz: "狗", py: "gǒu", en: "dog" },
      { hz: "今天", py: "jīn tiān", en: "today" },
      { hz: "明天", py: "míng tiān", en: "tomorrow", note: "Bright 明 + day 天." },
      { hz: "是", py: "shì", en: "to be (is, am, are)" },
      { hz: "不", py: "bù", en: "no; not" },
      { hz: "喜欢", py: "xǐ huan", en: "to like" },
      { hz: "名字", py: "míng zi", en: "name" }
    ],
    early: [
      { hz: "电脑", py: "diàn nǎo", en: "computer", note: "Literally “electric brain”." },
      { hz: "手机", py: "shǒu jī", en: "mobile phone", note: "Literally “hand machine”." },
      { hz: "飞机", py: "fēi jī", en: "aeroplane", note: "Literally “flying machine”." },
      { hz: "医院", py: "yī yuàn", en: "hospital" },
      { hz: "学校", py: "xué xiào", en: "school" },
      { hz: "工作", py: "gōng zuò", en: "work; job" },
      { hz: "天气", py: "tiān qì", en: "weather", note: "Sky 天 + air 气." },
      { hz: "时间", py: "shí jiān", en: "time" },
      { hz: "漂亮", py: "piào liang", en: "pretty; beautiful" },
      { hz: "便宜", py: "pián yi", en: "cheap", note: "便 is read pián here, not biàn." },
      { hz: "好吃", py: "hǎo chī", en: "delicious", note: "Good 好 + eat 吃. 好喝 = tasty (for drinks)." },
      { hz: "认识", py: "rèn shi", en: "to know (a person)" },
      { hz: "觉得", py: "jué de", en: "to feel; to think" },
      { hz: "已经", py: "yǐ jīng", en: "already" },
      { hz: "一起", py: "yì qǐ", en: "together" },
      { hz: "火车站", py: "huǒ chē zhàn", en: "train station", note: "Fire 火 + vehicle 车 = train, + 站 station." },
      { hz: "衣服", py: "yī fu", en: "clothes" },
      { hz: "生日", py: "shēng rì", en: "birthday", note: "Birth 生 + day 日." },
      { hz: "咖啡", py: "kā fēi", en: "coffee", note: "A loanword that sounds like “coffee”." },
      { hz: "运动", py: "yùn dòng", en: "exercise; sport" }
    ],
    expert: [
      { hz: "环境", py: "huán jìng", en: "environment" },
      { hz: "经济", py: "jīng jì", en: "economy" },
      { hz: "机会", py: "jī huì", en: "opportunity" },
      { hz: "文化", py: "wén huà", en: "culture" },
      { hz: "发展", py: "fā zhǎn", en: "to develop" },
      { hz: "责任", py: "zé rèn", en: "responsibility" },
      { hz: "影响", py: "yǐng xiǎng", en: "influence; to affect", note: "Literally “shadow + echo”." },
      { hz: "坚持", py: "jiān chí", en: "to persist; keep at it" },
      { hz: "尊重", py: "zūn zhòng", en: "to respect" },
      { hz: "效率", py: "xiào lǜ", en: "efficiency" },
      { hz: "独立", py: "dú lì", en: "independent" },
      { hz: "传统", py: "chuán tǒng", en: "tradition" },
      { hz: "竞争", py: "jìng zhēng", en: "competition" },
      { hz: "理解", py: "lǐ jiě", en: "to understand (deeply)" },
      { hz: "鼓励", py: "gǔ lì", en: "to encourage" },
      { hz: "复杂", py: "fù zá", en: "complicated" },
      { hz: "解决", py: "jiě jué", en: "to solve" },
      { hz: "建议", py: "jiàn yì", en: "suggestion; to suggest" },
      { hz: "马马虎虎", py: "mǎ mǎ hū hū", en: "so-so; careless", note: "Literally “horse horse tiger tiger”." },
      { hz: "一举两得", py: "yì jǔ liǎng dé", en: "two birds with one stone", note: "A four-character idiom (成语): one act, two gains." }
    ]
  },

  phrases: {
    beginner: [
      { hz: "你好吗？", py: "Nǐ hǎo ma?", en: "How are you?", note: "吗 at the end turns a statement into a yes/no question." },
      { hz: "我很好。", py: "Wǒ hěn hǎo.", en: "I'm fine.", note: "Literally “I very good”. Chinese doesn't need “am” here." },
      { hz: "你叫什么名字？", py: "Nǐ jiào shénme míngzi?", en: "What's your name?" },
      { hz: "我叫小明。", py: "Wǒ jiào Xiǎo Míng.", en: "My name is Xiao Ming.", note: "Swap in your own name: 我叫……" },
      { hz: "谢谢你！", py: "Xièxie nǐ!", en: "Thank you!" },
      { hz: "不客气。", py: "Bú kèqi.", en: "You're welcome." },
      { hz: "对不起。", py: "Duìbuqǐ.", en: "I'm sorry." },
      { hz: "没关系。", py: "Méi guānxi.", en: "It's okay. / No problem." },
      { hz: "早上好！", py: "Zǎoshang hǎo!", en: "Good morning!" },
      { hz: "晚安。", py: "Wǎn'ān.", en: "Good night." },
      { hz: "我不懂。", py: "Wǒ bù dǒng.", en: "I don't understand." },
      { hz: "多少钱？", py: "Duōshao qián?", en: "How much is it?" }
    ],
    early: [
      { hz: "你会说中文吗？", py: "Nǐ huì shuō Zhōngwén ma?", en: "Can you speak Chinese?" },
      { hz: "厕所在哪里？", py: "Cèsuǒ zài nǎlǐ?", en: "Where is the toilet?" },
      { hz: "请再说一遍。", py: "Qǐng zài shuō yí biàn.", en: "Please say that again." },
      { hz: "我想要这个。", py: "Wǒ xiǎng yào zhège.", en: "I'd like this one." },
      { hz: "太贵了！", py: "Tài guì le!", en: "Too expensive!", note: "太……了 = too …! A handy pattern for markets." },
      { hz: "现在几点？", py: "Xiànzài jǐ diǎn?", en: "What time is it now?" },
      { hz: "你住在哪儿？", py: "Nǐ zhù zài nǎr?", en: "Where do you live?" },
      { hz: "我饿了。", py: "Wǒ è le.", en: "I'm hungry." },
      { hz: "请给我菜单。", py: "Qǐng gěi wǒ càidān.", en: "The menu, please." },
      { hz: "买单！", py: "Mǎidān!", en: "The bill, please!" },
      { hz: "祝你生日快乐！", py: "Zhù nǐ shēngrì kuàilè!", en: "Happy birthday!" },
      { hz: "慢慢来。", py: "Mànmàn lái.", en: "Take your time." }
    ],
    expert: [
      { hz: "好久不见！", py: "Hǎojiǔ bú jiàn!", en: "Long time no see!", note: "The English phrase may come from this one." },
      { hz: "加油！", py: "Jiāyóu!", en: "Keep going! You can do it!", note: "Literally “add oil”. Shouted at races and exams." },
      { hz: "随便。", py: "Suíbiàn.", en: "Whatever. / Up to you.", note: "Can sound careless, so mind your tone." },
      { hz: "不好意思，打扰一下。", py: "Bù hǎoyìsi, dǎrǎo yíxià.", en: "Sorry to bother you…" },
      { hz: "说来话长。", py: "Shuō lái huà cháng.", en: "It's a long story." },
      { hz: "我无所谓。", py: "Wǒ wúsuǒwèi.", en: "I don't mind either way." },
      { hz: "入乡随俗。", py: "Rù xiāng suí sú.", en: "When in Rome, do as the Romans do.", note: "Literally “enter village, follow customs”." },
      { hz: "一路平安！", py: "Yílù píng'ān!", en: "Have a safe journey!" },
      { hz: "百闻不如一见。", py: "Bǎi wén bùrú yí jiàn.", en: "Seeing is believing.", note: "Hearing 100 times is not as good as seeing once." },
      { hz: "失败是成功之母。", py: "Shībài shì chénggōng zhī mǔ.", en: "Failure is the mother of success." },
      { hz: "恭喜发财！", py: "Gōngxǐ fācái!", en: "Wishing you prosperity!", note: "The classic Chinese New Year greeting." },
      { hz: "千里之行，始于足下。", py: "Qiān lǐ zhī xíng, shǐ yú zú xià.", en: "A journey of a thousand miles begins with a single step.", note: "From the Dàodéjīng. Fitting for this site!" }
    ]
  },

  numberTips: {
    beginner: [
      ["Ten digits do all the work", "Learn 零 to 十 and you can already build every number up to 99."],
      ["Hand signs", "In China, 6 to 10 have their own one-hand gestures, handy in noisy markets."]
    ],
    early: [
      ["Teens are “ten-one, ten-two…”", "11 = 十一 (ten + one), 15 = 十五."],
      ["Tens are “two-ten, three-ten…”", "20 = 二十, 47 = 四十七 (four-ten-seven)."],
      ["零 fills the gap", "101 = 一百零一. Say 零 when a zero sits in the middle."]
    ],
    expert: [
      ["Think in 万, not thousands", "Chinese groups digits in fours. 10,000 = 一万, 100,000 = 十万 (ten 万)."],
      ["两 before big units", "2,000 is usually 两千 and 20,000 is 两万, rather than 二千 or 二万."],
      ["One 零 per gap", "3,005 = 三千零五: many zeros in a row are read as a single 零."]
    ]
  },

  numberStudy: {
    beginner: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    early: [11, 12, 15, 20, 21, 38, 99, 100, 101, 110, 250, 608, 999],
    expert: [1000, 2000, 2026, 3005, 10000, 10500, 20000, 100000, 1000000, 3456789, 10000000, 99999999]
  },

  tones: [
    { n: 1, py: "mā", hz: "妈", en: "mother", how: "High and flat, like holding a note in a song.", path: "M10 18 L110 18" },
    { n: 2, py: "má", hz: "麻", en: "hemp", how: "Rises, like asking “huh?”", path: "M10 52 Q70 46 110 12" },
    { n: 3, py: "mǎ", hz: "马", en: "horse", how: "Dips low, then comes back up.", path: "M10 34 Q45 70 70 62 T110 20" },
    { n: 4, py: "mà", hz: "骂", en: "to scold", how: "Falls sharply, like a firm “No!”", path: "M10 10 Q60 16 110 62" },
    { n: 5, py: "ma", hz: "吗", en: "question particle", how: "Neutral tone: light, short and relaxed.", path: "M50 44 L70 44" }
  ]
};
