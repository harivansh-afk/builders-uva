# First gathering email

Final template. A test was accepted by Resend on September 9, 2026, addressed only to rathiharivansh@gmail.com. Full-list distribution has not run. Inbox rendering and delivery still need recipient verification.

**Subject:** builders@uva | Thursday, September 10 — Olsson 103

**Preheader:** Join us at 5:30 p.m. in Olsson 103. Quan Huynh joins virtually at 6:00 p.m.

Use index.html as the HTML body and plain.txt as the plain-text alternative. `campaign.json` configures the subject, sender, and Reply-To for the sending script.

The script embeds the masthead PNG as a CID attachment using `inline_images` in
`campaign.json`. The source HTML retains its HTTPS URL for browser previews; the
outgoing HTML uses the matching `cid:` reference. The attachment bytes are included
in the send hash. Missing files, unmatched image sources, invalid PNG signatures,
and missing CID attachments stop payload construction. The copy and visual layout
are unchanged. Run `node --test tests/email.test.js` for payload fidelity and failure
checks. This removes the remote image download dependency, but Outlook inbox
placement and automatic display still require checking in the received test.

## Sending a test

Put `RESEND_API_KEY` in the gitignored root `.env.local`. From the repository root:

```sh
# Validate and preview the envelope without sending.
npm run email -- --campaign kickoff --test-to rathiharivansh@gmail.com

# Send the exact final HTML, text, and subject to this one address.
npm run email -- --campaign kickoff --test-to rathiharivansh@gmail.com --send
```

The script requires one explicit recipient, runs the campaign check before sending,
and rejects unknown flags. There is no full-list mode. It saves private receipts
in gitignored `emails/.receipts/`, and refuses a repeated identical test even after
Resend's 24-hour idempotency window. Preserve those receipts. They are local to this
checkout, so they are not a shared campaign ledger across machines.

A pending receipt means the request may have reached Resend: inspect its dashboard
before any retry. Do not delete pending receipts blindly. An accepted receipt records
the provider ID; acceptance does not establish inbox delivery. The current API key
is send-only and cannot read delivery status or manage contacts.

## Full-list pipeline

For recurring membership announcements, use Resend Contacts, a Segment, and
Broadcasts so subscriptions and unsubscribe handling live with the sending service.
Keep these HTML/text files and campaign metadata as the reviewed source. A future
command should read members from Postgres, sync contacts without resetting existing
unsubscribes, and create a draft broadcast for the membership segment. Record its ID
and content hash durably, inspect the audience count and test delivery, then send
that same draft explicitly. Delivery/bounce/complaint events should update the
campaign record. This needs a key with contact/broadcast access; the current
send-only key cannot implement it. No contacts have been uploaded or broadcasts
created by the test command.

Resend provides both a [CLI](https://resend.com/docs/cli) and an
[HTTP API](https://resend.com/docs/api-reference/emails/send-email).
This script uses the API through Node's built-in fetch, without another dependency.

## Copy

Written for people who already signed up. Venue, room, contact address, and the seed-round wording follow Hari’s instructions. The email specifies the guest session ending at 6:30; it makes no claim about activity between 6:30 and 7. Sender is builders@uva <team@uva.builders>, with Reply-To team@uva.builders.

## Design

Charcoal background, the website’s hosted ASCII hands graphic as the masthead, Berkeley Mono, muted labels, and thin rules. Essential layout styles are inline and use presentation tables. There is no separate title or schedule block. Each sentence has its own paragraph, and only venue and times are bold. Quan and Y Combinator are linked. The masthead fills the 600px email width, using public/email-hands-horizontal.png rendered from the website’s native field on #000000. Both image and email backgrounds are pure black. The arms enter from the left and right; the top and bottom pixel rows are entirely black.

Berkeley Mono loads from the website in supported clients; Courier New/Courier/monospace are fallbacks. The hosted image has alternate text, and all event information remains live text when images are blocked. Custom fonts and dark-mode behavior vary between email clients.

References: [Mailchimp HTML email CSS guidance](https://mailchimp.com/help/css-in-html-email/) and [email testing guidance](https://mailchimp.com/help/preview-and-test-your-email-campaign/).

## Validation

Run from the repository root:

    node emails/kickoff/check.mjs --ready

On September 8, 2026, checks passed for event details, placeholder removal, link schemes, image fallback metadata, and the HTML size budget. The graphic URL returned HTTP 200 with image/png. Chromium loaded Berkeley Mono successfully. Desktop and mobile screenshots were reviewed; widths of 320, 390, 600, and 1000px showed no horizontal overflow. With font and image requests blocked, contact text and layout remained accessible.

These checks are not real inbox delivery tests. Before sending, test through the chosen sender to approved test addresses, then inspect the delivered HTML/plain text, links, image loading, font fallback, and light/dark rendering in the available email clients. Configure recipient privacy, reply routing, and the sender’s opt-out mechanism before distribution.
