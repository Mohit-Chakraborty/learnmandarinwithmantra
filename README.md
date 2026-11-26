# Learn Mandarin with Mantra

A static website for learning and practising Mandarin from zero: characters, words, phrases and numbers, at three levels (Beginner, Early learner, Expert). It has no build step and no dependencies.

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

## Deploying

The site is hosted on Vercel as a plain static site (no framework, no build command). Connecting this repository to the `learnmandarinwithmantra` Vercel project makes every push to `main` deploy automatically.
