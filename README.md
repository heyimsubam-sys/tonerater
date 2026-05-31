# ToneRater 🎚️

**A tiny multimodal autorater for customer-support replies — built to learn how AI evaluation actually works.**

Live demo: _(add your Vercel URL)_ · Writeup: _(add your Substack link)_

ToneRater judges whether a support reply is good — including replies that reference a **screenshot or PDF** — and is built to make the *failure modes of evaluation itself* visible:

- **One judge can't grade two things.** A reply is good only if it's *both* empathetic *and* correct. A single "is this good?" judge follows tone and passes replies that are warm but wrong (an invented button, "refunds are always instant," "you're 100% safe" after a breach). Splitting into **isolated per-dimension judges** and requiring both catches them.
- **A thin dataset games its own accuracy.** Toggle to the "gamed" set and accuracy jumps to ~100% — the judge didn't improve, the test got easier.
- **A judge panel turns disagreement into signal.** Run tone and accuracy as a panel and the **splits** (one dimension passes, the other fails) are exactly the rows a human should review.
- **You can be the grader.** The "Be the grader" panel lets a person label replies themselves, then shows how often the AI judge agreed — calibration made tangible. Golden labels are just human judgments; this is where they come from.

Every behavior maps to a concept from Anthropic's [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents).

## How the eval concepts map

| In this tool | Concept from the article |
|---|---|
| Tone judge + accuracy judge, separately | "Grade each dimension with an isolated LLM-as-judge rather than using one to grade all dimensions." |
| Panel / split detection | Multi-judge consensus; "failures should seem fair… read the transcripts." |
| Realistic vs. gamed toggle | "Build balanced problem sets… avoid class-imbalanced evals." |
| "Unknown" option in every judge | "Give the LLM a way out… to avoid hallucinations." |
| Golden labels + accuracy + reading misses | The core calibration loop: model grader vs. human ground truth. |
| Model dropdown | Swapping models — evals are what let you adopt a new model quickly. |

## Architecture

```
tonerater/
├── index.html        ← the UI (static)
├── api/judge.js      ← Vercel serverless function; holds the API key, proxies Anthropic
├── vercel.json
└── package.json
```

The browser never sees the API key. It calls `/api/judge`, which runs server-side with the key from an environment variable. This is the safe pattern for any front-end that talks to a paid API.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **New Project → import the repo**.
3. **Settings → Environment Variables → add** `ANTHROPIC_API_KEY` = your key.
4. Deploy. (Without the key, the site still runs in a clearly-labeled illustrative mode.)

Local dev: `npm i -g vercel` then `vercel dev` (set the env var first).

## Multimodal

Attach a PNG/JPG screenshot or a PDF in the "Grade your own reply" panel — or click one of the **built-in samples** (a 403 error dialog, a duplicate-charge receipt, a crash log) to try it with no upload. The file is base64-encoded in the browser and sent as an `image` or `document` content block to the judge, so the judge grades the reply **in the context of what the customer actually sent**. The sample screenshots are self-contained SVGs rasterized to PNG in-browser before sending (the API takes raster images, not SVG), so there are no external asset files to manage.

Each sample is designed to show a different verdict: the 403 reply is *warm but wrong* (it blames an expired session, but the screenshot shows a missing-role error), the receipt reply is *good*, and the crash-log reply is *cold but correct* — a nice case to run through the judge panel and watch tone and accuracy split.

## Data note

Examples are hand-written, modeled on common public support-conversation patterns — not real customer data. To scale, you'd ingest a public support corpus and label a representative, balanced sample.

---
MIT License · a learning project, not a product.
