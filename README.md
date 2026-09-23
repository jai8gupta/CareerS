# CareerSpeak

A mobile-first prototype for practising career English through short, repeatable speaking drills.

## Run locally

From this directory:

```sh
python3 -m http.server 4173 --directory dist
```

Then open `http://localhost:4173`.

The prototype uses the browser's speech-recognition API when available and always provides a text fallback. Practice history is stored only in the browser using `localStorage`.
