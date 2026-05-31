# I built a tiny AI grader in a weekend, and it taught me the thing nobody tells you about evals

*Most of the time the model isn't wrong. Your test is.*

---

For a while now I've been putting AI into a real product — the kind of work where a model answers a user's question and you quietly hope it's right. For months my "evaluation process" was what I suspect most people's actually is: read a bunch of outputs, wince at the bad ones, tweak the prompt, repeat. It works, sort of. It also doesn't scale past your own attention span.

So I wanted to feel the real version of that loop — the one where a second model *grades* the first one, and you measure how often it's right. People call this an autorater, or an LLM-as-judge. I built a tiny one that grades customer-support replies, gave it the ability to read screenshots and PDFs, and put it online. It taught me more than a month of reading had.

Here's what broke, in order.

## The first thing that broke: one judge, two jobs

A good support reply has to be two things at once. **Kind** — not dismissive, not robotic. And **correct** — actually solves the problem.

My first judge was the obvious one: *"Is this a good reply? 1 or 0."* It looked like it worked. Then I read the cases it got wrong, and they were all the same flavor:

> **Customer:** "Can I get a refund? I cancelled yesterday."
> **Reply:** "Absolutely, no worries at all, refunds are always instant and automatic!"

Warm. Friendly. Completely wrong. My judge passed it, because it *sounded* lovely. It was grading tone and calling it quality.

The fix turned out to be a documented best practice: grade each dimension with its **own isolated judge**. One judge sees only tone and ignores facts. Another sees only accuracy and ignores warmth. A reply passes only if both say yes. The warm-but-wrong replies that sailed through before got caught immediately.

The model never changed. The *eval design* changed. That's the whole game, and I didn't understand it until I watched it happen.

## The second thing that broke: the test that lies to you

Feeling good, I added a smaller, "easier" dataset to sanity-check. Accuracy jumped to nearly 100%.

For about thirty seconds I felt great. Then I looked at what was in it: only the obvious cases. None of the warm-but-wrong traps that had exposed my first judge. The set was easy, so *any* judge would ace it.

That's the trap, and it's everywhere: **a high accuracy number on a thin dataset isn't a good grader, it's a flattering mirror.** I made it a toggle in the tool, because I wanted to *see* it — flip to the easy set, watch the score inflate, flip back, watch it tell the truth.

## The third thing, which was the most interesting

I tried running the two judges as a **panel** and looking at where they *disagreed* — one dimension passing, the other failing. I'd assumed disagreement was a problem to suppress. It's the opposite. The splits are precisely the replies a human should look at: the warm-but-wrong ones, the cold-but-correct ones. **Disagreement isn't noise. It's the tool telling you where it's least sure.**

## The lesson I actually walked away with

Here's the part that reframed everything: **most of the time, when an eval says the model failed, the model didn't fail — the test did.** The rubric was too literal, or graded the wrong thing, or the dataset was rigged in my favor without my noticing.

So the skill isn't writing a clever judge. It's the unglamorous habit of *reading the disagreements* and asking, every time: is the model wrong here, or am I? It's a strangely human lesson to get from a machine grading a machine. But it's the one that stuck.

---

*The tool is open-source and live — you can grade your own support replies, screenshots and PDFs included, [here](#). It's deliberately small; the point was never the code, it was the loop.*

*If you build AI into products, I'd love to hear how you've handled the dataset-distribution problem — the part everyone underestimates, me included, until this weekend.*
