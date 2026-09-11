// Every event the club has hosted or will host. Newest last; the row number
// on the events page is the array index + 1.
//
// The join form ends with an RSVP for the next upcoming event (see nextEvent
// and rsvpQuestion). The yes/no lands in event_responses keyed by `slug`.

export const events = [
  {
    slug: 'quan-huynh',
    name: 'Quan Huynh',
    tag: 'YC W26',
    date: '2026-09-10',
    time: '6 p.m.',
    img: '/quan.png',
    link: 'https://www.linkedin.com/in/quanmhuynh/',
    transcript: null,
    transcriptLink: 'https://notes.granola.ai/t/bda2a7ed-8d72-49d6-af29-438148c23d77',
    recap: [
      {
        title: 'The session',
        paragraphs: [
          'Harivansh hosted Quan Huynh, co-founder of Halodeer (YC W26), for a conversation about finding a problem, acquiring customers, and building a team. David, assistant dean for entrepreneurship, briefly joined and mentioned the Venture Forward accelerator and Tech Week in October.',
        ],
      },
      {
        title: 'Finding Halodeer',
        paragraphs: [
          'Halodeer builds logistics software for warehouse efficiency and supply chain optimization. Quan described a team of five, including two hires, with clients across Los Angeles, Salt Lake City, Italy, and Germany. He said their first YC contract was six figures; before logistics, they sold boutique R environments to major AI labs.',
          'The team found logistics through his co-founder’s research at Princeton. They saw an industry with substantial room for innovation.',
        ],
      },
      {
        title: 'The path to YC',
        paragraphs: [
          'Quan started with hackathons in high school, sneaking into college competitions. His first product was a Chrome extension that parsed terms and conditions before signing. After losing at a UVA hackathon, he built a cheating-detection tool, sold it to MIT and Hopkins, and got a YC interview—but did not get in initially.',
          'The shift came when he stopped optimizing for YC and started asking what problem he could actually solve. During the batch, the team generated ten ideas per person per day and pitched across industries, exploring evolutionary algorithms, COBOL translation, and conversations with companies such as JP Morgan and Walmart. Sales cycle length and willingness to pay helped them eliminate ideas and arrive at logistics.',
        ],
      },
      {
        title: 'Failure, pressure, and resilience',
        paragraphs: [
          'Quan estimated that he had failed about twenty times with real effort before landing on logistics. Long sales cycles and customers unwilling to pay the target price were signals to move on. In his experience, capital was rarely the blocker: most experiments cost less than $400.',
          'He described pressure as a signal that you care and antifragility as the goal. Sales, pitching, and navigating rooms take repeated failure. His advice was to keep going: “Most startups fail because you give up, not because you tried for 10 years and nothing came out.”',
        ],
      },
      {
        title: 'Getting in the room',
        paragraphs: [
          'VCs can help with introductions, but warm introductions from happy customers become more valuable over time. Quan recommended reaching out to VPs: they know the problems and are more accessible than the C-suite. He cited a roughly 20% response rate on LinkedIn.',
          'For Halodeer’s first client, the team contacted roughly 1,000 people. One responded and became a design partner. Quan advised saving major introductions, such as Instacart, until the product is ready instead of figuring out the product with a marquee customer.',
          'Learn to ask better questions. He recommended The Mom Test and watching how strong sales representatives, including those at Brex, run calls.',
        ],
      },
      {
        title: 'Hiring and taste',
        paragraphs: [
          'Quan looks for taste, interpersonal compatibility, competency, and rate of learning. Personal websites and projects make depth of interest visible. Shallow projects presented as deep interests, or an inability to defend an opinion under pushback, are red flags.',
          'For engineers, he values breadth over mastery of a particular language and sees functional programming experience as a signal of taste. He also argued for making firing decisions quickly, especially before someone signs a lease or takes on debt: “You have to be good at firing, not just hiring.”',
        ],
      },
      {
        title: 'Advice for student founders',
        paragraphs: [
          'Talk to three people a day in an industry you care about, and iterate on ideas before building. Go deep into a niche where you have exposure or access through professors, labs, or local businesses. Quan cautioned against defaulting to obvious niches such as developer tools and edtech, where he believes much of the low-hanging fruit is gone.',
          'Do not fixate on fundraising. Quan framed a Series A raise as relevant for roughly one month of the year, mentioned YC’s 7% equity stake, and noted that other term sheets may be better. He said twenty companies had already dropped from his batch of roughly 190.',
          'Raise money to accelerate, not to validate. Revenue first, then scale.',
        ],
      },
    ],
  },
  {
    slug: 'advait-paliwal',
    name: 'Advait Paliwal',
    tag: 'Founder',
    date: '2026-09-17',
    time: null,
    location: null,
    img: '/advait.png',
    link: 'https://advaitpaliwal.com',
    linkLabel: 'Website',
    description: 'Join us for a founder Q&A with Advait Paliwal. Time and location to be announced.',
    transcript: null,
  },
]

export const eventBySlug = (slug) => events.find((e) => e.slug === slug)

// Next event on or after today (local date), else the most recent one.
export function nextEvent(today = new Date()) {
  const iso = today.toISOString().slice(0, 10)
  return events.find((e) => e.date >= iso) ?? events[events.length - 1]
}

const fmt = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })
const fmtLong = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
export const shortDate = (iso) => fmt.format(new Date(iso + 'T00:00:00Z'))
export const longDate = (iso) => fmtLong.format(new Date(iso + 'T00:00:00Z'))

const fmtMid = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })
export const midDate = (iso) => fmtMid.format(new Date(iso + 'T00:00:00Z'))
export const rsvpQuestion = (e) => `Can you make it ${midDate(e.date)}${e.time ? ` at ${e.time}` : ''}?`
