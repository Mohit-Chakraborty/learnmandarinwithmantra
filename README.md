# Learn Mandarin with Mantra

A static website for learning and practicing Mandarin from zero: characters, words, phrases, numbers and tones, at three levels (Beginner, Early learner, Expert). It has no build step.

Learners can also practice writing any character or word in stroke order: watch it animated, then trace it (Beginner and Early learner) or write it from memory (Expert).

The "Look up a word" page turns English (or pinyin, or characters) into Mandarin using a built-in dictionary of about 11,500 HSK words. Learners can save results to "My words" and study them as flashcards or in a quiz.

Live site: https://learnmandarinwithmantra.vercel.app

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. You can also open `index.html` directly.

## Files

- `index.html`: page shell (title, header, footer)
- `styles.css`: design, with light and dark themes and a responsive layout
- `data.js`: all learning content (characters, words, phrases, number tips, tones). Add items here.
- `app.js`: study cards, quizzes, number generator, progress, XP and streaks (saved in the browser's localStorage)
- `vendor/hanzi-writer/`: [Hanzi Writer](https://github.com/chanind/hanzi-writer) 3.7.3, which draws and checks the strokes (MIT license)
- `dict/hsk.json`: the lookup dictionary, loaded only when the lookup page is opened (CC BY-SA 4.0, see `dict/README.md`)
- `strokes/`: stroke data for every character used in the Characters and Words lessons, from [hanzi-writer-data](https://github.com/chanind/hanzi-writer-data) (Arphic Public License, see `strokes/README.md`)

## Adding characters

If you add a new character or word to `data.js`, also copy its stroke file into `strokes/`, or the writing panel will say it can't load the strokes:

```bash
npm pack hanzi-writer-data@2.0.1 && tar -xzf hanzi-writer-data-2.0.1.tgz
cp package/汉.json strokes/
```

## Deploying

The site is hosted on Vercel as a plain static site (no framework, no build command). Connecting this repository to the `learnmandarinwithmantra` Vercel project makes every push to `main` deploy automatically.
