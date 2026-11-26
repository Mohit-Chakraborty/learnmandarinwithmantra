# Dictionary data

`hsk.json` powers the "Look up a word" page. It has 12,623 entries covering every word in the HSK 2.0 and HSK 3.0 exam vocabularies (about 11,500 words, with one entry per reading).

Each entry is `[simplified, pinyin, meanings, frequency rank, HSK level]`, sorted from most to least common. The HSK level is the lowest new-HSK level the word appears in (7 means levels 7 to 9), or the old-HSK level if it is only in the old lists.

## Source and license

It is a trimmed copy of `complete.min.json` from [complete-hsk-vocabulary](https://github.com/drkameleon/complete-hsk-vocabulary) by Yanis Zafirópulos (MIT License).

The English meanings come from [CC-CEDICT](https://cc-cedict.org/wiki/), which is licensed under [Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/). This file is therefore also shared under CC BY-SA 4.0, and the lookup page credits CC-CEDICT.

To rebuild it, download `complete.min.json` from that repository and keep, for each word form: the simplified characters, the tone-marked pinyin, the meanings, the frequency rank and the HSK level.
