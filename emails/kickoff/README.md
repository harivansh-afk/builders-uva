# First gathering email

Draft for review. Nothing has been sent.

**Subject:** See you Thursday — builders@uva kicks off at 5:30

**Preheader:** Our first gathering: 5:30 p.m. at Olsson Hall. Quan Huynh joins us virtually at 6.

`index.html` is the HTML body. `plain.txt` is the equivalent plain-text body for a multipart/alternative message. The subject is set separately in the sending tool.

## Editorial choices

The email welcomes existing signups, separates the in-person arrival from the virtual guest’s start, and gives the talk and Q&A their own times. The date and guest spelling come from `src/lib/events.js`; the speaker’s background and schedule come from Hari’s brief. Olsson Hall is the draft spelling of the dictated venue and needs confirmation alongside the room.

The invitation to bring a question or building idea makes conversation easier. Team selection and private meetings belong in individual follow-ups after the event, not in this welcome email. A useful approach at the gathering is to ask what people are working on, what they want to try, and whether they would enjoy helping organize the next event. Follow-through on a small task gives better evidence than confidence in a first conversation.

## Details to finish

- Confirm Olsson Hall and replace `{{ROOM}}` in both files.
- Confirm the sending service, From name/address, and a monitored Reply-To.
- Confirm whether the 6:30 finish is just the guest session or the whole gathering before promising anything afterward.
- Decide whether attendance needs reconfirmation. The draft asks for no additional RSVP; signups already have an event RSVP in the site.
- When using a mailing platform, add its native unsubscribe footer/link. For a personal send, agree on a reply-based opt-out and use a monitored address. Keep recipient addresses private.

## Design and compatibility

A warm paper body and charcoal masthead echo the site’s restrained typography. Body copy is 17px with 27px line height; schedule copy is 16px and footer text 13px. All critical styles are inline. Layout uses presentation tables, a fluid 600px container, and an Outlook conditional wrapper. System fonts and live text mean blocked images and remote fonts cannot remove content. No scripts, tracking, external stylesheet, or image downloads.

References: [Mailchimp: CSS in HTML email](https://mailchimp.com/help/css-in-html-email/) and [preview and test](https://mailchimp.com/help/preview-and-test-your-email-campaign/). Browser previews do not establish Outlook, Gmail, Apple Mail, or dark-mode compatibility.

## Validation

Run from the repository root:

```sh
node emails/kickoff/check.mjs
node emails/kickoff/check.mjs --ready
```

The second command deliberately fails until draft placeholders are resolved. These checks cover content essentials, absolute HTTPS links, unsupported layout dependencies, and a conservative HTML size budget; they do not emulate email clients.

Validated September 8, 2026: static checks passed; the readiness check correctly rejected `{{ROOM}}`. Chromium previews at 320, 390, 600, and 1000px had no horizontal overflow. Desktop and mobile screenshots were visually reviewed. The schedule stacks below 480px; removing head styles leaves a readable two-column fallback, also checked at 320px. No real inbox delivery, client-specific rendering, or forced dark-mode transformation has been tested yet.

Before sending to signups, import the HTML using the chosen sender’s supported method and send a test only to explicitly approved test recipients. Inspect the delivered message in Gmail, Outlook, and Apple Mail where available, including mobile and light/dark modes. Check that the actual sender preserves formatting, the preheader stays out of the body, the plain-text part reads correctly, links work, and the room/date/times are final. Review recipient selection and reply routing in the sending tool. No sending integration or test delivery is part of this draft.
