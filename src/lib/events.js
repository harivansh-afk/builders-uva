// Every event the club has hosted or will host. Newest last; the row number
// on the events page is the array index + 1.
//
// Upcoming event rows link to /events/<slug>/register.
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
    img: '/vaibhav.jpeg',
    link: 'https://www.linkedin.com/in/vaigup/',
    description: 'Vaibhav Gupta is the co-founder and CEO of Boundary, the team behind BAML. A conversation about his path from Microsoft and Google to building a programming language, finding a problem worth sticking with, and creating tools for developers. Time and location to be announced.',
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
]

export const eventBySlug = (slug) => events.find((e) => e.slug === slug)

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
