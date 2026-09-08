# First gathering email

Draft for review. Nothing has been sent.

**Subject:** builders@uva | Thursday, September 10 — Olsson 103

**Preheader:** Join us at 5:30 p.m. in Olsson 103. Quan Huynh joins virtually at 6:00 p.m.

Use index.html as the HTML body and plain.txt as the plain-text alternative. Set the subject separately in the sending tool.

## Copy

Written for people who already signed up. Venue, room, contact address, and the corrected ~$5 million seed funding figure follow Hari’s instructions. The draft specifies the guest session ending at 6:30; it makes no claim about activity between 6:30 and 7. Sender and Reply-To still need configuration in the sending tool.

## Design

Charcoal background, the website’s hosted ASCII hands graphic as the masthead, Berkeley Mono, muted labels, and thin rules. Essential layout styles are inline and use presentation tables. There is no separate title or schedule block. Each sentence has its own paragraph, and only venue and times are bold. Quan and Y Combinator are linked. The masthead is 240 by 126 pixels.

Berkeley Mono loads from the website in supported clients; Courier New/Courier/monospace are fallbacks. The hosted image has alternate text, and all event information remains live text when images are blocked. Custom fonts and dark-mode behavior vary between email clients.

References: [Mailchimp HTML email CSS guidance](https://mailchimp.com/help/css-in-html-email/) and [email testing guidance](https://mailchimp.com/help/preview-and-test-your-email-campaign/).

## Validation

Run from the repository root:

    node emails/kickoff/check.mjs --ready

On September 8, 2026, checks passed for event details, placeholder removal, link schemes, image fallback metadata, and the HTML size budget. The graphic URL returned HTTP 200 with image/png. Chromium loaded Berkeley Mono successfully. Desktop and mobile screenshots were reviewed; widths of 320, 390, 600, and 1000px showed no horizontal overflow. With font and image requests blocked, contact text and layout remained accessible.

These checks are not real inbox delivery tests. Before sending, test through the chosen sender to approved test addresses, then inspect the delivered HTML/plain text, links, image loading, font fallback, and light/dark rendering in the available email clients. Configure recipient privacy, reply routing, and the sender’s opt-out mechanism before distribution.
