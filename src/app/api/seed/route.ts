import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Post } from "@/models/Post";

const SEED_POSTS = [
  {
    title: "The Art of Deep Work in a Distracted World",
    excerpt: "How to reclaim your focus and produce your most meaningful work in an age of constant interruption.",
    coverImage: "https://picsum.photos/seed/deepwork/1200/600",
    tags: ["productivity", "focus", "mindset"],
    content: `<h2>Why focus is the new superpower</h2><p>In an era where the average person checks their phone 96 times a day, the ability to focus deeply on a single task has become extraordinarily rare — and extraordinarily valuable.</p><p>Cal Newport coined the term <strong>deep work</strong> to describe professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit. These efforts create new value, improve your skill, and are hard to replicate.</p><h2>The shallow work trap</h2><p>Most of us spend our days in a frenzy of emails, Slack messages, and meetings — what Newport calls <em>shallow work</em>. This work is necessary but not sufficient. It keeps the lights on but rarely moves the needle.</p><blockquote>The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy.</blockquote><h2>Building your deep work practice</h2><p>Start small. Block just 90 minutes each morning before checking email. Treat this block as sacred. Over time, extend it. The compound effect of consistent deep work sessions is staggering.</p><p>The key insight is this: your environment shapes your behavior more than your willpower does. Design your workspace to make deep work the path of least resistance.</p>`,
  },
  {
    title: "Why TypeScript Is Worth the Learning Curve",
    excerpt: "A practical case for adopting TypeScript in your next project, even if you're a JavaScript purist.",
    coverImage: "https://picsum.photos/seed/typescript/1200/600",
    tags: ["typescript", "javascript", "development"],
    content: `<h2>The case against TypeScript (and why it's wrong)</h2><p>I used to be a TypeScript skeptic. "It's just JavaScript with extra steps," I'd say. "It slows you down." I was wrong on both counts.</p><p>After shipping three production applications in TypeScript, I can say with confidence: the upfront investment pays dividends that compound over time.</p><h2>What TypeScript actually gives you</h2><p>TypeScript isn't just about catching bugs at compile time — though it does that brilliantly. It's about <strong>making your code self-documenting</strong>. When you define an interface, you're writing a contract that every developer on your team (including future you) can rely on.</p><h2>The refactoring superpower</h2><p>The real magic of TypeScript reveals itself when you refactor. Change a type in one place and TypeScript immediately shows you every single place in your codebase that needs updating. In a large JavaScript codebase, that kind of refactor is terrifying. In TypeScript, it's routine.</p>`,
  },
  {
    title: "Designing for Emotion: Beyond Usability",
    excerpt: "Great design doesn't just work — it makes people feel something. Here's how to design for emotional resonance.",
    coverImage: "https://picsum.photos/seed/design/1200/600",
    tags: ["design", "ux", "psychology"],
    content: `<h2>The feeling is the feature</h2><p>We've spent decades optimizing for usability. Can users complete the task? Is the flow intuitive? These are necessary questions. But they're not sufficient.</p><p>The products we love — the ones we recommend to friends, the ones we'd miss if they disappeared — don't just work well. They make us <em>feel</em> something.</p><h2>Don Norman's three levels of design</h2><p>In his seminal book <strong>Emotional Design</strong>, Don Norman describes three levels at which design operates:</p><ul><li><strong>Visceral</strong> — the immediate, gut-level reaction to appearance</li><li><strong>Behavioral</strong> — the pleasure and effectiveness of use</li><li><strong>Reflective</strong> — the meaning and personal satisfaction of ownership</li></ul><p>Most design work focuses on the behavioral level. The opportunity lies in the reflective level — designing products that become part of someone's identity.</p><h2>Practical emotional design</h2><p>Small moments of delight compound. A loading animation that makes you smile. An error message that's human and kind. A success state that feels like a celebration. These micro-moments add up to a product that people love rather than merely use.</p>`,
  },
  {
    title: "The Quiet Revolution of Remote-First Culture",
    excerpt: "Remote work isn't just about where you work — it's a fundamentally different philosophy about how work gets done.",
    coverImage: "https://picsum.photos/seed/remote/1200/600",
    tags: ["remote work", "culture", "future of work"],
    content: `<h2>Remote-first vs remote-friendly</h2><p>There's a crucial distinction that most companies miss: being <em>remote-friendly</em> means you tolerate remote workers. Being <em>remote-first</em> means you design your entire organization around the assumption that people are distributed.</p><p>The difference shows up in everything: how decisions are made, how information flows, how trust is built, how careers advance.</p><h2>The documentation imperative</h2><p>Remote-first companies write everything down. Not because they distrust their people, but because they understand that <strong>knowledge that lives only in someone's head is a liability</strong>.</p><blockquote>If it isn't written down, it didn't happen.</blockquote><h2>Async by default</h2><p>The most productive remote teams default to asynchronous communication. Meetings are a last resort, not a first instinct. This respects the deep work time of every team member and creates a more inclusive environment for people across time zones.</p>`,
  },
  {
    title: "MongoDB Schema Design Patterns You Should Know",
    excerpt: "The decisions you make about your MongoDB schema will shape your application's performance for years. Get them right.",
    coverImage: "https://picsum.photos/seed/mongodb/1200/600",
    tags: ["mongodb", "database", "backend"],
    content: `<h2>Embedding vs referencing</h2><p>The most fundamental decision in MongoDB schema design is whether to embed related data or reference it. Unlike relational databases, MongoDB gives you a choice — and the right answer depends entirely on your access patterns.</p><p><strong>Embed when:</strong> you always access the data together, the embedded data is bounded in size, and the relationship is one-to-few.</p><p><strong>Reference when:</strong> the related data is large, unbounded, or accessed independently.</p><h2>The extended reference pattern</h2><p>A common pattern is to store a subset of frequently-accessed fields from a referenced document directly in the referencing document. For example, storing the author's name alongside their ID in a post document eliminates a join for the common case of displaying a post list.</p><h2>The bucket pattern</h2><p>For time-series data, grouping documents into buckets dramatically reduces document count and improves query performance. This pattern is used by some of the largest MongoDB deployments in the world.</p>`,
  },
  {
    title: "Building in Public: The Unexpected Benefits of Radical Transparency",
    excerpt: "Sharing your journey openly — the wins, the failures, the numbers — is one of the most powerful growth strategies available to indie makers.",
    coverImage: "https://picsum.photos/seed/building/1200/600",
    tags: ["startups", "indie hacking", "growth"],
    content: `<h2>What building in public actually means</h2><p>Building in public means sharing your journey as it happens — revenue numbers, user counts, failures, pivots, and lessons learned. It's uncomfortable. It's vulnerable. And it works.</p><p>The indie maker community has proven this repeatedly. Founders who share openly consistently grow faster than those who operate in stealth.</p><h2>Why it works</h2><p>Transparency builds trust at scale. When potential customers can see your journey — including your struggles — they root for you. They become invested in your success. They tell their friends.</p><blockquote>Your story is your marketing. The product is almost secondary.</blockquote><h2>What to share</h2><p>Share your <strong>milestones</strong>, your <strong>failures</strong>, and your <strong>process</strong>. The more specific and honest, the more valuable. The fear that competitors will steal your ideas is almost always unfounded. Execution is everything.</p>`,
  },
  {
    title: "The Science of Sleep: Why Your Best Ideas Come After Rest",
    excerpt: "Sleep isn't downtime — it's when your brain does its most important work. Here's what the science says about rest, creativity, and performance.",
    coverImage: "https://picsum.photos/seed/sleep/1200/600",
    tags: ["health", "science", "creativity"],
    content: `<h2>The myth of grinding through</h2><p>There's a pervasive myth in hustle culture that sleep is for the weak. The most successful people, the story goes, sleep four hours and outwork everyone else. The science tells a completely different story.</p><p>Matthew Walker, a neuroscientist at UC Berkeley and author of <strong>Why We Sleep</strong>, has spent his career studying what happens to the brain during sleep. His conclusion is unambiguous: sleep is the single most effective thing you can do to reset your brain and body health.</p><h2>What actually happens when you sleep</h2><p>During deep sleep, your brain runs a remarkable cleaning cycle. The glymphatic system flushes out toxic waste products that accumulate during waking hours, including the proteins associated with Alzheimer's disease.</p><p>During REM sleep, your brain does something even more extraordinary: it replays the day's experiences, strengthening important memories and discarding irrelevant ones. It also makes unexpected connections between distant pieces of information — which is why you often wake up with solutions to problems that stumped you the night before.</p><blockquote>Sleep is the Swiss Army knife of health. When sleep is deficient, there is sickness and disease. And when sleep is abundant, there is vitality and health.</blockquote><h2>The creativity connection</h2><p>Studies have shown that people who sleep before tackling a creative problem are <strong>three times more likely</strong> to find an elegant solution than those who stay awake. The next time you're stuck on a hard problem, the most productive thing you can do might be to close your laptop and go to sleep.</p><h2>Practical sleep hygiene</h2><p>Keep a consistent sleep schedule — even on weekends. Keep your bedroom cool (around 18°C). Avoid screens for 30 minutes before bed. These aren't suggestions; they're the conditions your brain needs to do its best work.</p>`,
  },
  {
    title: "Minimalism in Code: The Case for Writing Less",
    excerpt: "The best code isn't the cleverest code — it's the code that does exactly what's needed and nothing more. A meditation on simplicity in software.",
    coverImage: "https://picsum.photos/seed/minimal/1200/600",
    tags: ["programming", "clean code", "software design"],
    content: `<h2>Complexity is the enemy</h2><p>Every line of code you write is a line someone has to read, understand, debug, and maintain. Every abstraction you introduce is a concept someone has to hold in their head. Every dependency you add is a surface area for bugs and security vulnerabilities.</p><p>The best engineers I've worked with share one trait: they are ruthless about simplicity. They don't write code to show off. They write code to solve problems — and they stop the moment the problem is solved.</p><h2>The YAGNI principle</h2><p><strong>You Aren't Gonna Need It.</strong> This principle from Extreme Programming is one of the most violated in software development. We build for imagined future requirements that never materialize, creating complexity that haunts us for years.</p><blockquote>Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away. — Antoine de Saint-Exupéry</blockquote><h2>What minimalist code looks like</h2><p>Minimalist code has short functions that do one thing. It has names so clear that comments are unnecessary. It has no dead code, no commented-out blocks, no "just in case" parameters. It reads like prose.</p><p>When you find yourself writing a comment to explain what a piece of code does, that's a signal: the code itself should be clearer. Rename the variable. Extract the function. Make the intent obvious.</p><h2>The deletion mindset</h2><p>The most underrated skill in programming is deletion. Every week, ask yourself: what can I remove? The codebases that age well are the ones where engineers felt empowered to delete. The ones that become unmaintainable are the ones where everyone only ever added.</p>`,
  },
  {
    title: "How Stoicism Can Make You a Better Engineer",
    excerpt: "Ancient philosophy has surprising practical applications for modern software development — from handling production incidents to navigating team conflict.",
    coverImage: "https://picsum.photos/seed/stoicism/1200/600",
    tags: ["philosophy", "career", "mindset"],
    content: `<h2>What the Stoics actually believed</h2><p>Stoicism is often misunderstood as emotionless endurance — gritting your teeth and bearing it. The actual philosophy is far more nuanced and, frankly, more useful.</p><p>The Stoics — Marcus Aurelius, Epictetus, Seneca — were obsessed with one question: what is within our control, and what is not? Focus exclusively on what you can control (your thoughts, actions, responses), and practice radical acceptance of everything else.</p><h2>The dichotomy of control in engineering</h2><p>This maps beautifully onto software engineering. A production incident hits at 2am. The database is down. Users are angry. What's in your control? Your response. Your communication. The quality of your debugging. Your calm.</p><p>What's not in your control? That the incident happened. Stoicism says: accept those facts instantly and spend zero energy resisting them. Put all your energy into what you can actually change.</p><blockquote>You have power over your mind, not outside events. Realize this, and you will find strength. — Marcus Aurelius</blockquote><h2>Negative visualization</h2><p>One of the most powerful Stoic practices is <em>premeditatio malorum</em> — the premeditation of evils. Before a major deployment, imagine everything that could go wrong. Not to catastrophize, but to prepare. Write the runbook. Test the rollback. Brief the team.</p><p>Engineers who practice this aren't pessimists. They're the calmest people in the room when things go sideways — because they've already been there in their minds.</p>`,
  },
  {
    title: "The Future of AI: What Developers Need to Know Right Now",
    excerpt: "AI isn't coming for your job — but a developer who knows how to work with AI might be. Here's how to stay ahead of the curve.",
    coverImage: "https://picsum.photos/seed/aitech/1200/600",
    tags: ["ai", "machine learning", "future of tech"],
    content: `<h2>The shift has already happened</h2><p>If you're still debating whether AI will change software development, you've missed the memo. It already has. GitHub Copilot, Claude, GPT-4 — these tools are already in the workflows of millions of developers. The question isn't whether to engage with AI, but how.</p><p>The developers who will thrive in the next decade aren't the ones who resist these tools. They're the ones who learn to use them as force multipliers — handling the boilerplate, the documentation, the first drafts — while humans focus on architecture, judgment, and creativity.</p><h2>What AI is genuinely good at</h2><p>AI excels at pattern completion. It's remarkably good at writing tests for existing code, translating between frameworks, explaining unfamiliar codebases, generating boilerplate, and suggesting fixes for well-understood error patterns.</p><h2>What AI still can't do</h2><p>AI cannot understand your business context. It doesn't know why your system is architected the way it is, what constraints you're operating under, or what tradeoffs matter most to your users. It can't exercise judgment about what to build — only how to build what you describe.</p><blockquote>The goal is not to replace human intelligence but to augment it — to handle the mechanical so humans can focus on the meaningful.</blockquote><h2>How to stay ahead</h2><p>Learn to write excellent prompts — this is a genuine skill that compounds. Understand the fundamentals deeply enough to evaluate AI output critically. Specialize in domains where context and judgment matter most. And above all, keep shipping: the developers who build things with AI will always outpace those who only theorize about it.</p>`,
  },
];

export async function GET(req: NextRequest) {
  await connectDB();

  let author = await User.findOne({ email: "editorial@inkwell.com" });
  if (!author) {
    author = await User.create({
      name: "Inkwell Editorial",
      email: "editorial@inkwell.com",
      password: "Inkwell2024!",
      role: "author",
    });
  }

  await Post.deleteMany({ author: author._id });

  const posts = await Promise.all(
    SEED_POSTS.map((p, i) =>
      Post.create({
        ...p,
        slug:
          p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") +
          "-" + (Date.now() + i),
        author: author._id,
        status: "published",
        likes: [],
      })
    )
  );

  return NextResponse.json({
    message: `Seeded ${posts.length} stories successfully.`,
    login: { email: "editorial@inkwell.com", password: "Inkwell2024!" },
  });
}
