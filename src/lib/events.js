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
    video: { youtube: 'N1GfBds-8lc', title: 'Vaibhav Gupta at builders@uva, September 17, 2026' },
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
    img: '/harsha.jpg',
    link: 'https://www.linkedin.com/in/harsha-gaddipati-032bb820a/',
    description: 'Harsha Gaddipati is the co-founder and CEO of Slashy. A conversation about his path from a college dating app to AI email, knowing when to change direction, and building something people come back to. Time and location to be announced.',
  },
  {
    slug: 'dan-hall',
    name: 'Dan Hall',
    tag: 'Kyrus / Legion',
    date: '2026-10-01',
    img: '/events/dan-hall/kyrus.png',
    imgType: 'logo',
    imgAlt: 'Kyrus Technology logo',
    link: 'https://www.kyrus-tech.com/',
    linkLabel: 'Kyrus Tech',
    description: 'Dan Hall co-founded Kyrus Tech, a cybersecurity firm acquired by SIXGEN in 2024, and is a managing partner at Legion Capital. He previously worked at ManTech and investigated computer crimes as a U.S. Air Force Special Agent. Time and location to be announced.',
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
