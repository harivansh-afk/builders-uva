// Every event the club has hosted or will host. Newest last; the row number
// on the events page is the array index + 1.
//
// Upcoming event rows link to /events/<slug>/register while registrationOpen().
// Registrations live in event_responses, independently of membership.

export const events = [
  {
    slug: 'quan-huynh',
    name: 'Quan Huynh',
    tag: 'YC W26',
    date: '2026-09-10',
    time: '6 p.m.',
    img: '/quan.png',
    photos: [
      { file: 'dsc04129', alt: 'Harivansh speaking with Quan Huynh on the classroom display.', width: 1600, height: 2400 },
      { file: 'dsc04128', alt: 'Students gathered around the classroom tables during the founder Q&A.', width: 2400, height: 1600 },
      { file: 'dsc04120', alt: 'Harivansh and an attendee in conversation at the front of the room.', width: 2400, height: 1600 },
    ],
    link: 'https://www.linkedin.com/in/quanmhuynh/',
    transcript: null,
    recap: [
      {
        title: 'The session',
        paragraphs: [
          'A co-founder of Haladir joined us for a conversation about finding a problem, acquiring customers, and building a team.',
        ],
      },
      {
        title: 'Finding Haladir',
        paragraphs: [
          'Haladir builds logistics software for warehouse efficiency and supply chain optimization.',
          'The team found logistics through research. They saw an industry with substantial room for innovation.',
        ],
      },
      {
        title: 'Finding direction',
        paragraphs: [
          'He started with hackathons in high school, sneaking into college competitions. His first product was a browser extension that parsed terms and conditions before signing. Early projects led to an accelerator interview—but he did not get in initially.',
          'The shift came when he stopped optimizing for accelerator admission and started asking what problem he could actually solve. During the batch, the team generated ideas daily and pitched across industries. Sales cycle length and willingness to pay helped them eliminate ideas and arrive at logistics.',
        ],
      },
      {
        title: 'Failure, pressure, and resilience',
        paragraphs: [
          'He described repeated failures despite real effort before landing on logistics. Long sales cycles and customers unwilling to pay the target price were signals to move on. In his experience, capital was rarely the blocker: experiments could be inexpensive.',
          'He described pressure as a signal that you care and antifragility as the goal. Sales, pitching, and navigating rooms take repeated failure. His advice was to keep going: “Most startups fail because you give up, not because you tried for 10 years and nothing came out.”',
        ],
      },
      {
        title: 'Getting in the room',
        paragraphs: [
          'VCs can help with introductions, but warm introductions from happy customers become more valuable over time. He recommended reaching out to VPs: they know the problems and are more accessible than the C-suite.',
          'For Haladir’s first client, the team reached out widely and found a design partner. He advised saving major introductions until the product is ready instead of figuring out the product with a marquee customer.',
          'Learn to ask better questions. He recommended watching how strong sales representatives run calls.',
        ],
      },
      {
        title: 'Hiring and taste',
        paragraphs: [
          'He looks for taste, interpersonal compatibility, competency, and rate of learning. Personal websites and projects make depth of interest visible. Shallow projects presented as deep interests, or an inability to defend an opinion under pushback, are red flags.',
          'For engineers, he values breadth over mastery of a particular language and sees functional programming experience as a signal of taste. He also argued for making firing decisions quickly, especially before someone signs a lease or takes on debt: “You have to be good at firing, not just hiring.”',
        ],
      },
      {
        title: 'Advice for student founders',
        paragraphs: [
          'Talk to three people a day in an industry you care about, and iterate on ideas before building. Go deep into a niche where you have exposure or access through professors, labs, or local businesses. He cautioned against defaulting to obvious niches such as developer tools and edtech, where he believes much of the low-hanging fruit is gone.',
          'Do not fixate on fundraising. Consider the terms carefully and keep fundraising in perspective.',
          'Raise money to accelerate, not to validate. Revenue first, then scale.',
        ],
      },
    ],
  },
  {
    slug: 'vaibhav-gupta',
    name: 'Vaibhav Gupta',
    tag: 'YC W23',
    date: '2026-09-17',
    time: '6 p.m.',
    img: '/vaibhav.jpeg',
    link: 'https://www.linkedin.com/in/vaigup/',
    registration: 'closed',
    video: { youtube: 'N1GfBds-8lc', title: 'Vaibhav Gupta at builders@uva, September 17, 2026', thumbnail: '/events/vaibhav-gupta/thumbnail.jpg' },
    photos: [
      { file: 'pivots', alt: 'Boundary\u2019s timeline of pivots from 2021 to BAML, from the 5 years, 12 pivots blog post.', width: 1660, height: 1132, fit: 'contain' },
      { file: 'room', alt: 'Students around the classroom tables listening to the talk.', width: 1280, height: 720 },
    ],
    transcript: null,
    recap: [
      {
        title: 'The session',
        paragraphs: [
          'The co-founder of Boundary and creator of BAML joined us over Google Meet for a conversation about pivoting, picking a co-founder, and how to grow fast early in a career.',
        ],
      },
      {
        title: 'From robots to Boundary',
        paragraphs: [
          'He graduated from UT in 2015 after a college spent on robotics: a quadcopter with a home-built flight controller that only knew how to go up, and legged robots he taught to walk with reinforcement learning.',
          'At 21 he joined the team at Microsoft that became HoloLens, then left to run a coding bootcamp, Life++, which made about $70,000 in six months before he decided he did not want to make money in edtech. He went on to lead performance work on face unlock for the Pixel 4 at Google, then wrote optimization code at D. E. Shaw that took one system from 33 hours to under five minutes.',
          'After a breakup and some questioning of his life choices, he realized he wanted to start a company. His co-founder Aaron had already jumped in; he followed four months later.',
        ],
      },
      {
        title: 'Twelve pivots to BAML',
        paragraphs: [
          'The company went through YC Winter 2023 as Gloo and then through what he called pivot hell: video game software, HR tech, Twitch ads, a Slack competitor, custom embeddings, automated drive-thrus. Custom embeddings reached $15,000 in monthly revenue, but it felt like white-glove consulting rather than a product with a billion-dollar outcome, so they walked away.',
          'BAML started on August 10, 2023, out of frustration with the code quality of the AI tooling they were using. The bet is historical: Java arrived with operating systems and JavaScript with the browser, so a new platform, where humans no longer write or read most code, needs its own language.',
          'For months the user count stayed in the single digits, which he described as miserable. What kept them going was retention: the people who did adopt it deleted large amounts of old code and did not leave.',
        ],
      },
      {
        title: 'The college startup decision',
        paragraphs: [
          'In college he worked on Light Labs, a non-invasive glucometer, and interviewed with Paul Graham at YC in 2014. He let offers from Facebook and Microsoft expire to keep working on it, and someone offered $50,000, which felt like infinite money to a student.',
          'A Microsoft engineer told him the real problem was that he was not making a decision. He slept on it, woke up wanting to work for that person, and took the job to be around people he could learn from. He does not regret either the attempt or the choice.',
        ],
      },
      {
        title: 'Co-founders and delusion',
        paragraphs: [
          'He optimizes for fun: \u201cLife is a dopamine maximization engine.\u201d A good co-founder covers your weaknesses, thinks differently, and makes the lows better. He met Aaron in Seattle a year out of college and, seven years later, sent him a Facebook message proposing they start something. Their core strength is being able to disagree strongly, in public and in private, without taking it personally. Co-founder breakups are the number one reason companies fail.',
          'On conviction versus market signal: \u201cTo be a founder, you have to be somewhat delusional. You have to believe something no one else believes, or someone would have done it already.\u201d The check is measurement against your own runway. If you have a year, do not pick a company that requires you to be delusional for five.',
        ],
      },
      {
        title: 'Hiring',
        paragraphs: [
          'Boundary hires rarely and asks for one thing instead of a resume: an email titled \u201cWhy I\u2019m awesome\u201d with the three most incredible things you have ever done. They look for people who like hard problems, and they have helped their own people take other offers, because the team should grow rather than be used.',
        ],
      },
      {
        title: 'Big tech or a startup',
        paragraphs: [
          'Maximize your growth rate and find a manager you genuinely want to work for, whatever the company size. Early in a career, 45 to 50 hours a week on problems you find exciting produces outsized output relative to peers, and annual promotions are a reasonable measure of whether you are growing faster than they are.',
          'Autonomy is earned the same way everywhere: produce value and your scope expands. He had greenfield work at both Microsoft and Google. The difference between big tech and a startup is the consequence of failure, a missed promotion versus a business that stops existing.',
        ],
      },
      {
        title: 'AI and junior engineers',
        paragraphs: [
          'He called this a golden age for junior engineers. It took him years to get good because every question waited hours for a senior engineer to answer. Now nothing stops a junior from getting better except their own willingness to learn. Use AI to close the gap, then bring experts specific, well-researched questions.',
        ],
      },
      {
        title: 'Applying to YC',
        paragraphs: [
          'The advice is the same as for building a business: find users, find people, build something people want. A student rarely has an accomplishment that stands out against a 40-year-old who has built four companies, so apply with the users you got, the metrics you have, and the hustle you did.',
          'He is always hiring interns and full-timers. Send him the three most incredible things you have done.',
        ],
      },
    ],
  },
  {
    slug: 'harsha-gaddipati',
    name: 'Harsha Gaddipati',
    tag: 'YC S25',
    date: '2026-09-24',
    time: '6 p.m.',
    img: '/harsha.jpg',
    link: 'https://www.linkedin.com/in/harsha-gaddipati-032bb820a/',
    registration: 'closed',
    video: { youtube: 'xWbcvfpUOn0', title: 'Harsha Gaddipati at builders@uva, September 24, 2026', thumbnail: '/events/harsha-gaddipati/thumbnail.jpg?v=smile' },
    photos: [
      { file: 'selfie', alt: 'Students gathered for a group selfie in the classroom after Harsha’s talk.', width: 1600, height: 2133 },
    ],
    transcript: null,
    recap: [
      {
        title: 'The session',
        paragraphs: [
          'The co-founder and CEO of Slashy joined us over Google Meet for a conversation about campus startups, pivoting from general agents to email, and what engineers need to know when AI writes the code.',
        ],
      },
      {
        title: 'Getting the first users',
        paragraphs: [
          'His first campus project started after a friend showed him Northwestern’s Marriage Pact. Georgia Tech did not have an equivalent, so he spent the next twelve hours researching matchmaking and launched a first version with friends in about two days. They called it Georgia Tech Dating Blind, which became GT Match. He later worked on college dating apps including Bubble Date.',
          'Posting online brought roughly 50 to 100 signups. Then he spent several hours putting flyers on buildings across campus, and the project spread. The lesson was the unglamorous work: founders say they cannot get users, but often have not tried the straightforward things that put a product in front of people.',
        ],
      },
      {
        title: 'Choosing a co-founder',
        paragraphs: [
          'Friendship does not tell you whether someone will work well with you. He looks for intelligence, trust, and a willingness to do the boring work reliably. You learn whether someone will finish compliance paperwork by Tuesday by working with them, not by simulating a company together.',
          'He had known his current co-founder for about a day when they started working together. His advice was to start testing the working relationship sooner. For solo founders, the question is whether bringing someone in improves the company’s chances enough to justify the equity. At the earliest stage, speed and finding out whether the idea works matter more than protecting a percentage of something that may be worth nothing.',
        ],
      },
      {
        title: 'From general agents to email',
        paragraphs: [
          'Slashy’s general agent had users who loved it but used it less each week. They tried ChatGPT or Claude first, and as those products improved, fewer tasks reached Slashy. That mattered more than the positive feedback: he did not see a durable business competing with the model labs on general work.',
          'The team pivoted after raising its seed round. Investors supported the change; in his account, they had backed the founders and their ability to build agents more than the original idea. Working at the edge of a new field had built skills they could carry into a different product.',
          'The email client is a bet on an interface people will keep using. He expects email-heavy professions, such as recruiting and executive search, to need a familiar workspace for several more years. The goal is to build an assistant around that work, including scheduling and browser tasks, while earning enough distribution to adapt as habits change.',
        ],
      },
      {
        title: 'The bar for junior engineers',
        paragraphs: [
          'He was less optimistic about the traditional junior role than about capable people coming out of college. AI can already handle much of the small implementation work that used to give juniors time to learn. His expectation at a startup is that a new hire can contribute immediately, reason about architecture, and design good systems with AI.',
          'That does not mean students have no advantage. They may know the tools better than experienced founders who spend their days running companies. But the role looks more like a founding engineer than a long apprenticeship. He distinguished this from big tech, where he still sees more room for gradual training.',
        ],
      },
      {
        title: 'Owning the work',
        paragraphs: [
          '“Talk to my agent” is not a sufficient answer inside his team. If he asks an engineer about an important decision, he expects the engineer to understand it. The reason to hire someone is to have another person thinking deeply about a problem the rest of the team does not have the bandwidth to own.',
          'He sees more value in agents talking directly in support workflows, where two people may otherwise spend their time passing questions and answers between their AIs. Inside a team, handing off the explanation can mean nobody owns the knowledge.',
        ],
      },
      {
        title: 'Reading code and building intuition',
        paragraphs: [
          'He said startup incentives push engineers toward shipping without reading every line, but he reads the code in his own pull requests. When he is coding, it is usually because something important needs attention.',
          'One example was slow email rendering. Reading the code exposed repeated comparisons of large HTML strings and helped him find a cheaper check. The broader point was that AI can write the implementation while a person’s technical intuition still determines where to look. Learn the fundamentals, read generated code deliberately, and keep thinking while the agent works.',
        ],
      },
      {
        title: 'Choosing a startup to join',
        paragraphs: [
          'Look closely at the founders: do you trust them, and will they fight for your career? He described long hours at his own company, with more emphasis on output than on tracking when people take a break. Expectations vary, and the founder’s habits shape the team’s even when they are not explicit rules.',
          'He argued that the tradeoff of a startup only makes sense if the founders help you grow. That can include introductions, support for your next job, or help starting a company of your own. A founder who treats ordinary personal commitments as a problem is someone he would avoid working for.',
        ],
      },
      {
        title: 'Finding an advantage',
        paragraphs: [
          'Building a product is easier; building a successful business still requires doing something better than the alternatives. That advantage might be distribution, willingness to do tedious work, or the time to pursue a market. It does not have to be being the smartest founder in the room.',
          'He advised students not to wait until they feel like experts. Spending months working deeply in a field can create the expertise they think they need before starting. Whether the problem is worth solving still has to be learned by talking to customers and trying to solve it.',
        ],
      },
      {
        title: 'Sales, marketing, and the human work',
        paragraphs: [
          'He expects more roles around customers as engineering becomes more productive. Slashy deliberately keeps people involved in parts of customer support because the human attention helps win business. Automating everything is not the goal if it makes the company less effective.',
          'On marketing, he pointed to small teams using AI to manage creative work and larger advertising budgets. Performance marketing also makes it easier to connect that work to revenue. He was less certain about how far sales can scale: relationships still take attention, and each additional deal competes for it.',
          'Slashy was not hiring at the time of the talk, but he invited students to email him for introductions to friends who were.',
        ],
      },
    ],
  },
  {
    slug: 'dan-hall',
    name: 'Dan Hall',
    date: '2026-10-01',
    img: '/events/dan-hall/kyrus.png',
    imgType: 'logo',
    imgAlt: 'Kyrus Technology logo',
    link: 'https://www.kyrus-tech.com/',
    linkLabel: 'Kyrus Tech',
    description: 'Dan Hall co-founded Kyrus Tech, a cybersecurity firm acquired by SIXGEN in 2024, and is a managing partner at Legion Capital.',
    photos: [
      { file: 'conversation', alt: 'The room during our conversation with Dan Hall, with the speaker blurred for privacy.', width: 2400, height: 1800 },
    ],
    recap: [
      {
        title: 'TL;DR',
        paragraphs: [
          'Dan joined us as our first in-person guest speaker for a conversation about his journey through tech, building companies, and the experience of selling them. It was a great evening at the Foundry—thanks to Dan and everyone who came out.',
          'We kept the conversation unrecorded to respect Dan’s preference for privacy. This photo captures a little of the evening.',
        ],
      },
    ],
  },
  {
    slug: 'steve-morin',
    name: 'Steve Morin',
    date: '2026-10-08',
    img: '/steve-morin.webp',
    link: 'https://www.linkedin.com/in/stevebmorin/',
    // Bio: https://stevemorin.com/ (checked October 6, 2026).
    // Portrait: his linked GitHub account, https://github.com/smorin.
    description: 'Steve Morin is VP of Engineering at Flox. He has led engineering teams at Instagram, Asana, and Yahoo, and was CTO of Tripping.com through its acquisition by HomeToGo.',
    registration: 'closed',
    photos: [
      { file: 'room', alt: 'Harivansh, Nathan, and members in the room during the call with Steve Morin.', width: 2400, height: 1236 },
      { file: 'steve', alt: 'Steve Morin joining over Google Meet.', width: 1020, height: 1360 },
    ],
    recap: [
      {
        title: 'TL;DR',
        paragraphs: [
          'Steve joined us over Google Meet for a conversation about his career and leading engineering teams. We talked about being CTO of Tripping.com through its acquisition, what separates a good acquisition from a bad one, and how founders can negotiate terms that protect their team.',
          'From there we got into treating founding engineers well, the difference between leading Instagram Shopping at Meta and working at a smaller startup, how he measures engineers, hiring for culture, and handling scope creep on large teams. Thanks to Steve and everyone who came out.',
        ],
      },
    ],
  },
  {
    slug: 'maxwell-nardi',
    name: 'Maxwell Nardi',
    date: '2026-10-22',
    img: '/maxwell-nardi.webp',
    link: 'https://www.linkedin.com/in/maxwellnardi/',
    // Bio and portrait: his LinkedIn profile (checked October 7, 2026).
    description: 'Maxwell Nardi is building Runlayer, which helps companies connect AI agents to their tools and data securely. He studied at UVA and joins us in person for a Q&A. Time and location to be announced.',
  },
]

export const eventBySlug = (slug) => events.find((e) => e.slug === slug)

// Registration is open while the event is today or later, unless it has been
// closed explicitly with `registration: 'closed'` (full, or the event is over).
export const registrationOpen = (e, today = new Date()) =>
  Boolean(e) && e.registration !== 'closed' && e.date >= today.toISOString().slice(0, 10)

// Next event on or after today (UTC date), or undefined if none is upcoming.
export function nextEvent(today = new Date()) {
  const iso = today.toISOString().slice(0, 10)
  return events.find((e) => e.date >= iso)
}

const fmt = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })
const fmtLong = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
export const shortDate = (iso) => fmt.format(new Date(iso + 'T00:00:00Z'))
export const longDate = (iso) => fmtLong.format(new Date(iso + 'T00:00:00Z'))

const fmtMid = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })
export const midDate = (iso) => fmtMid.format(new Date(iso + 'T00:00:00Z'))
export const rsvpQuestion = (e) => `Can you make it ${midDate(e.date)}${e.time ? ` at ${e.time}` : ''}?`
