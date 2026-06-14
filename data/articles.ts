import { Article } from "@/lib/types";

// Short developer stories for the Reading Room. They build engineering judgment
// AND work as read-aloud practice: short, clear sentences with a natural rhythm,
// nothing too dense to say out loud. Read each one a few times — it gets smoother
// every pass.
export const articles: Article[] = [
  {
    id: "a-bug-in-plain-sight",
    slug: "the-bug-that-hid-in-plain-sight",
    title: "The Bug That Hid in Plain Sight",
    summary:
      "A story about why reading the error message — slowly — is the most underrated debugging skill.",
    minutes: 4,
    level: "Beginner",
    tags: ["debugging", "mindset"],
    body: [
      "On my first job, I spent three hours chasing a bug. The page kept crashing, and I was certain the problem was deep in the framework. I read blog posts. I rewrote a whole component. I even blamed the browser.",
      "Then a senior engineer sat down next to me. She did not touch the keyboard. She just pointed at the screen and read the error message out loud, one word at a time. \"Cannot read property name of undefined.\" Then she asked me a simple question. \"So which thing is undefined?\"",
      "I had read that error a hundred times. But I had never actually read it. My eyes slid over the words because they felt familiar. The moment I said them slowly, the answer was obvious. A user object had not loaded yet, and I was reading from it too early.",
      "The fix took one line. The lesson took three hours. The computer had been telling me exactly what was wrong the entire time. I just had not been listening.",
      "Now, whenever something breaks, I do the boring thing first. I read the error slowly. I find the file and the line number. I ask which value is missing, and where it was supposed to come from. Most bugs are not mysteries. They are messages we were too rushed to read.",
    ],
    takeaways: [
      "Read the full error message slowly before you change anything.",
      "The stack trace usually names the file and line — start there.",
      "Ask 'which value is undefined, and where should it have come from?'",
    ],
  },
  {
    id: "a-boring-code-wins",
    slug: "why-boring-code-wins",
    title: "Why Boring Code Wins",
    summary:
      "Clever code feels great to write and terrible to read six months later. A case for the obvious solution.",
    minutes: 5,
    level: "Intermediate",
    tags: ["readability", "craft"],
    body: [
      "Early on, I loved clever code. I wanted every function to be a small magic trick. If I could collapse five lines into one dense, tricky line, I felt smart. I thought that was what good engineers did.",
      "Then I had to fix a bug in my own code from a year earlier. I opened the file and could not understand it. The clever one-liner that once felt brilliant now felt like a locked door. I had outsmarted my future self, and my future self had lost.",
      "Here is the thing about code. You write it once, but you read it many times. You read it when you add a feature. You read it when you hunt a bug at midnight. A teammate reads it when you are on vacation. Code is read far more often than it is written.",
      "So the question is not, how clever can this be? The question is, how fast can the next person understand it? And the next person is often you, tired, in six months, with no memory of what you were thinking today.",
      "Boring code is a gift. A plain loop that anyone can follow beats a tower of chained tricks. A long, clear variable name beats a short, mysterious one. The goal is not to look smart. The goal is to be understood.",
      "These days, when I finish something clever, I pause and ask one question. Could I make this more obvious? Usually I can. And almost every time, the boring version is the one I am glad to find later.",
    ],
    takeaways: [
      "Code is read far more often than it is written — optimize for the reader.",
      "The next reader is often you, with no memory of today's context.",
      "When something feels clever, ask: can I make this more obvious?",
    ],
  },
  {
    id: "a-naming-is-hard",
    slug: "naming-is-the-hard-part",
    title: "Naming Is the Hard Part",
    summary:
      "Why a good name is really a clear thought, and how naming things forces you to understand them.",
    minutes: 4,
    level: "Beginner",
    tags: ["naming", "design"],
    body: [
      "There is an old joke that there are only two hard things in computer science. Cache invalidation, and naming things. People laugh, but they rarely ask why naming is so hard.",
      "Here is my answer. A name is not just a label. A name is a thought made small. When you cannot name a thing, it usually means you do not yet understand the thing. The struggle to name it is really the struggle to understand it.",
      "I once had a function called handleData. It did three jobs at once. It fetched users, filtered them, and sorted them. The name was vague because the function was vague. The day I split it into fetchUsers, keepActiveUsers, and sortByName, the code got clearer — but more importantly, my thinking got clearer.",
      "Good names tell a small story. A reader should be able to guess what a function does before they read a single line inside it. If the name needs a comment to explain it, the name is doing only half its job.",
      "So when a name feels hard, do not just pick something and move on. Slow down. The difficulty is a signal. It is telling you that the idea underneath is still fuzzy. Sharpen the name, and you sharpen the idea.",
    ],
    takeaways: [
      "A name is a thought made small — vague names hint at vague thinking.",
      "A reader should guess what a function does from its name alone.",
      "If naming feels hard, the underlying idea is probably still unclear.",
    ],
  },
  {
    id: "a-event-loop-story",
    slug: "the-log-that-taught-me-the-event-loop",
    title: "The console.log That Taught Me the Event Loop",
    summary:
      "Four lines of code, an output I did not expect, and the day asynchronous JavaScript finally clicked.",
    minutes: 5,
    level: "Intermediate",
    tags: ["async", "event-loop", "javascript"],
    body: [
      "I thought I understood JavaScript until four small lines proved me wrong. I had a console.log, a setTimeout with a delay of zero, a resolved Promise, and another console.log. I was sure the order would match the order I wrote them.",
      "It did not. The two plain logs printed first. Then the Promise. Then the timeout, dead last, even though its delay was zero. I stared at the screen and felt the ground shift a little.",
      "A friend explained it with a picture. JavaScript runs on a single thread, he said. Think of a worker who can only do one thing at a time. First the worker finishes all the work right in front of them. That is the synchronous code, and that is why the plain logs ran first.",
      "Then, before taking on anything new from the outside world, the worker clears a small stack of urgent sticky notes. Those are microtasks, and Promise callbacks live there. That is why the Promise printed before the timer.",
      "Only after every sticky note is cleared does the worker pick up the next big task from the queue. Timers and events wait there. So setTimeout, even with zero delay, never jumps the line. It waits its turn behind the microtasks.",
      "Once I saw it that way, a dozen confusing bugs from my past suddenly made sense. The event loop was not magic. It was just an order of operations, and I had finally learned to read it.",
    ],
    takeaways: [
      "Synchronous code runs first, to completion.",
      "Microtasks (Promise callbacks) drain fully before any timer or event.",
      "setTimeout(…, 0) still waits behind all pending microtasks.",
    ],
  },
  {
    id: "a-code-review-gift",
    slug: "code-review-is-a-gift",
    title: "Code Review Is a Gift, Not a Verdict",
    summary:
      "How I stopped reading review comments as attacks and started reading them as free mentorship.",
    minutes: 5,
    level: "Intermediate",
    tags: ["collaboration", "growth", "mindset"],
    body: [
      "My first code reviews felt like a test I kept failing. Every comment landed like a small accusation. I would read \"why did you do it this way?\" and hear \"you are not good enough.\" I would get defensive, argue in the comments, and end the day tired and small.",
      "It took me a long time to see what was really happening. A senior engineer was spending their own time reading my code, thinking about it carefully, and writing down how to make it better. That is not an attack. That is mentorship, offered for free, line by line.",
      "The change was not in the reviews. The change was in how I read them. I started to assume good intent. I started to treat each comment as a small lesson rather than a small wound. When I did not understand a suggestion, I asked a real question instead of defending my first draft.",
      "Something surprising happened. I got better much faster. The same comments that used to sting were now the quickest way I had ever found to learn. A reviewer can spot in seconds what might have taken me months to discover alone.",
      "I also learned to separate myself from my code. The code is not me. It is a thing I made, and like anything made, it can be improved. When someone finds a flaw in it, they are not finding a flaw in me. They are helping the work get better.",
      "Now, when I open a review full of comments, I do not feel dread. I feel lucky. Someone cared enough to read closely and tell me the truth. That is one of the kindest things a colleague can do.",
    ],
    takeaways: [
      "Assume good intent — most review comments are mentorship, not attacks.",
      "Separate yourself from your code; a flaw in it is not a flaw in you.",
      "Ask a real question when you disagree, instead of defending the first draft.",
    ],
  },
];
