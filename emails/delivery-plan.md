# Kickoff email delivery investigation and plan

Researched September 9, 2026. This is a proposal; no additional emails, account changes, DNS changes, or contact uploads were made during the investigation.

## Follow-up: received headers and image implementation

After the research, Hari supplied the original UVA test headers. They show SPF
passing at UVA's gateway for the SES sender `54.240.48.185`, then softfailing at
Microsoft when it checks UVA's relay `52.254.56.82`. DKIM for `uva.builders`, DMARC,
and composite authentication pass at Microsoft. `IPV:CAL` and `SFV:SKN` indicate
filtering bypass through an allowed IP/mail-flow rule; `CAT:NONE` records no threat
category. `dest:I` is consistent with Inbox delivery at that processing stage.
These headers do not establish why the user subsequently observed Junk, nor prove
current mailbox placement. They do not justify modifying the sender's SPF to add
UVA's relay. Check the actual newest message, mailbox/client rules, and any later
filtering action if the discrepancy persists. [Microsoft header definitions](https://learn.microsoft.com/en-us/defender-office-365/message-headers-eop-mdo)

The next authorized test preserves the approved copy/layout and embeds the existing
PNG through Resend's individual-send CID support. Tests verify exact image bytes,
unchanged body content apart from the image reference, and failure on missing image
files or unmatched sources. Recipient-side rendering remains the acceptance gate.
The earlier sections below retain the original research context; the statement
that headers were unavailable no longer applies.

## Recommendation

Keep the full-list send paused. Obtain the original UVA message headers, then test the actual UVA Outlook account as the urgent fallback while diagnosing Resend. Test an embedded image separately. Choose a route based on untouched UVA inbox results, not on an API acceptance response. For recurring announcements, keep the reviewed template in this repository and use Resend Broadcasts with managed subscription state if the desired image format is supported; do not assume the single-send API's attachment support extends to Broadcasts.

There is no sender-side setting that guarantees inbox placement or automatic image display across every recipient policy. The acceptance target is authenticated delivery, no observed junk placement in the agreed test inboxes, and complete readable event information even when images and custom fonts are unavailable. This is evidence of readiness, not a statistical guarantee for the whole list.

## Evidence from this project

Live read-only checks during this investigation:

- Postgres contains 31 members and 31 distinct normalized email addresses. The UVA test recipient is a member, so its prior test must be accounted for in campaign delivery records. Recount before a real send because new signups can arrive.
- The hosted masthead returns HTTP 200 directly with `Content-Type: image/png`. It is 59,856 bytes, 1200 by 630 pixels, and byte-identical to `public/email-hands-horizontal.png`. SHA-256: `3bcf07701d015af67e65c6102564a569f7c775c2c91a42dd148a09ea7089f23b`. This verifies public availability from this host, not access through UVA's or Microsoft's image proxy.
- The HTML displays that HTTPS image at 600 by 315 pixels. It has alternative text; all event details are live text. The design also requests a remote custom font and falls back to Courier. The large image appears before the message, so an image-blocked client can leave an unhelpful opening area.
- `send.uva.builders` publishes `v=spf1 include:amazonses.com ~all`; `resend._domainkey.uva.builders` publishes a public key; `_dmarc.uva.builders` publishes `v=DMARC1; p=none`.
- The root SPF record authorizes ImprovMX and Google. Its lack of an SES include is not, by itself, a defect: Resend normally uses the `send` subdomain as its Return-Path. Actual headers must confirm the envelope sender and authentication alignment. [Resend domain documentation](https://resend.com/docs/dashboard/domains/introduction)
- The existing Resend key was confirmed to be send-only earlier in this session. It cannot inspect provider settings or retrieve delivery diagnostics. Its permission error is not a delivery error.
- The user observed junk placement and missing automatic image loading in the UVA test. We do not have its raw headers, Outlook version, download banner, or recipient settings. No specific filtering cause is established.

## Why the image can be blocked

The file is publicly reachable, so a broken source URL is not the leading explanation. Outlook has independent recipient-controlled image policies: classic Outlook blocks Internet picture downloads by default; new Outlook has a setting that can block pictures, links, and attachments from senders outside the safe list; mobile can block external images through user or administrator settings. These behaviors are client-specific. Do not extrapolate one Outlook version's defaults to all versions. [Classic Outlook](https://support.microsoft.com/en-us/outlook/block-or-unblock-automatic-picture-downloads-in-classic-outlook-email-messages), [new Outlook settings](https://support.microsoft.com/en-us/outlook/links-are-disabled-in-outlook-for-windows-email-messages), [mobile](https://support.microsoft.com/en-US/Outlook/why-am-i-seeing-some-images-were-blocked-when-i-open-certain-emails)

Embedding the PNG as a CID attachment replaces the remote image fetch with image bytes inside the email. Resend's individual-send endpoint supports a matching `cid:` HTML reference and attachment `content_id`. Microsoft explicitly says Outlook Mobile's external-image blocking setting does not block images embedded as attachments. This makes CID worth testing; it does not establish immunity to spam filtering, attachment policy, or other clients' rendering differences. [Resend inline images](https://resend.com/docs/dashboard/emails/embed-inline-images), [Microsoft embedded-image distinction](https://support.microsoft.com/en-US/Outlook/what-is-block-external-images-in-settings)

Resend documents that the batch endpoint does not support attachments. The current Create Broadcast request documentation does not expose an attachment field, so Broadcast CID support is unverified and must not be promised. [Attachment limitations](https://resend.com/docs/dashboard/emails/attachments), [Broadcast API](https://resend.com/docs/api-reference/broadcasts/create-broadcast)

Keep the artwork if its tested rendering works, but reduce the masthead's footprint or move it below a live-text event summary so the message remains useful with images blocked. Preserve Hari's approved wording unless a specific change is approved. A simpler no-image version is the fallback, not a claim that the current design caused junk placement. Do not replace the email with a single screenshot.

## Why junk placement needs separate diagnosis

UVA documents both Fortinet and Office 365 filtering. Outlook is the visible client, not proof of which layer assigned the verdict. Authentication records being present in DNS is also not proof the received message passed SPF, DKIM, or DMARC. [UVA spam filtering](https://security.virginia.edu/about-spam)

Collect the raw headers, especially `Received`, `Return-Path`, `Authentication-Results`, `DKIM-Signature`, `X-Forefront-Antispam-Report`, `X-Microsoft-Antispam`, and any gateway-specific fields. Inspect SPF/DKIM/DMARC and alignment, composite authentication, and available category/verdict fields. Microsoft cautions against interpreting SCL alone as the complete filtering decision. If the headers do not explain the action, UVA ITS can inspect message tracing; Resend support can inspect its sending route using the provider ID. [Microsoft header reference](https://learn.microsoft.com/en-us/defender-office-365/message-headers-eop-mdo)

The UVA test's Resend ID is `74756631-d7b0-4432-bd75-2973af3519fe`. Provider `delivered` means acceptance by the recipient server, not placement in the Inbox. [Resend delivery meaning](https://resend.com/docs/knowledge-base/what-if-an-email-says-delivered-but-the-recipient-has-not-received-it)

Sender reputation, filtering policy, and message content remain hypotheses. Do not label the domain new, the sending IP blocklisted, the image spammy, or authentication broken without evidence. Do not change DMARC from monitoring to enforcement as an inbox-placement experiment: enforcement addresses authentication failures, and legitimate Google/ImprovMX flows need assessment before any policy change. [Resend DMARC documentation](https://resend.com/docs/dashboard/domains/dmarc)

## Execution plan for this announcement

1. **Capture the original evidence.** In Outlook open the message's More actions menu, then View, then View message details; retain the complete headers or original `.eml`. Record client/version, initial folder, and exact image warning. Capture this before changing safe-sender settings or marking the message not junk. [Microsoft instructions](https://support.microsoft.com/en-us/outlook/view-internet-message-headers-in-outlook)
2. **Fix a demonstrated authentication or routing fault first.** Verify domain status and tracking in the Resend dashboard or with an appropriately scoped key. Leave open/click tracking disabled for this workflow unless there is a concrete need; its current setting is unknown. Resend documents tracking as opt-in and describes how it modifies links. [Tracking documentation](https://resend.com/docs/dashboard/domains/tracking)
3. **Compare sending routes without changing the content simultaneously.** Send one approved test through the actual UVA Outlook account, retaining the event copy and subject. Compare with the existing Resend test. This is a feasible urgent fallback for this 31-person list, subject to UVA's account policy and access, not a guarantee. Do not put a UVA From address into Resend or collect a mailbox password for a custom SMTP workaround.
4. **Test image packaging as a separate variable.** Through a chosen route, compare the current hosted PNG against an inline/CID PNG using the same approved body. Observe automatic rendering before clicking Download Pictures. CID success proves that path/client combination, not all Outlook installations. If it fails, use an image-optional or no-image presentation for the time-sensitive announcement.
5. **Validate the selected final message in fresh recipient conditions.** Use at least two explicitly approved UVA test inboxes as a practical smoke test, including one that has not safe-listed the sender or interacted with earlier tests. Add Gmail as a rendering comparison. Do not use repeated tests to the already-trained inbox as evidence of general deliverability. Check initial folder, image behavior, plain-text alternative, links, reply routing, mobile width, and legibility in light/dark modes. No new test addresses are authorized by this research request.
6. **Send only after the exact final version passes.** Freeze subject, HTML/text, sender, image bytes, and recipient snapshot. Recount members and handle the existing UVA tester explicitly to avoid an unintended duplicate. For the urgent route, prefer individual messages or a supported UVA distribution workflow so member addresses are private. If the UVA route is selected, keep its delivery evidence in the same campaign record. If both routes still land in junk, escalate to UVA ITS instead of blasting the list.
7. **Recheck the date immediately before release.** The copy says tomorrow and the event is September 10. Permit that wording only when the send date is September 9 in America/New_York; revise if the send slips. Separate successful provider submission from observed inbox placement in the final status.

## Recurring campaign pipeline

Use repository-owned content and metadata, a read-only member export, Resend Contacts/Segments for a reviewed audience, and a draft Broadcast followed by an explicit send. Include the actual Resend unsubscribe URL token; it is not enough to select the Broadcast API and omit the link. Preserve unsubscribes on every sync, and reconcile audience membership without automatically re-subscribing contacts. Keep all signup members in scope unless the campaign explicitly selects an RSVP subset. [Contacts](https://resend.com/docs/dashboard/audiences/contacts), [Segments and unsubscribe token](https://resend.com/docs/dashboard/segments/introduction)

The exact delivery format is an architecture decision: prefer Broadcasts with an image-optional hosted image for managed subscriptions. If reliable embedded artwork becomes a hard requirement and Broadcasts still cannot carry it, individual sends require a real local unsubscribe/suppression pipeline and durable recipient ledger. Do not bolt a list loop onto the current test script and call that complete.

Persist campaign ID, provider broadcast/email IDs, content hash, audience snapshot/count, per-recipient state, and timestamps in durable storage with a single-send guard. Tests and production sends must be separate states; content edits must not silently reset production delivery history. Resend's request idempotency lasts 24 hours, so it does not replace the campaign ledger. The current gitignored local receipts guard identical tests in one checkout only. [Idempotency documentation](https://resend.com/docs/dashboard/emails/idempotency-keys)

Receive verified provider webhooks and handle replays idempotently for delivery, delay, bounce, complaint, failure, and suppression. Keep visible unsubscribe handling and never overwrite a suppression during contact synchronization. Report recipient-server delivery separately from Inbox evidence; open tracking is not an acceptance gate. [Webhook event types](https://resend.com/docs/webhooks/event-types), [Suppression behavior](https://resend.com/docs/dashboard/emails/email-suppressions)

Tests should cover dry-run behavior, audience freezing, no duplicate sends after partial failure, webhook replay, unsubscribe persistence across sync, date wording, and template fidelity. The current test command covers basic CLI safety and template checks, not the full pipeline.

Do not purchase a dedicated IP for 31 contacts. Resend warns that low volume can make dedicated IPs less useful; this would add reputation work without evidence it addresses the observed problem. Likewise, changing email providers or buying artificial warm-up engagement is not a measured fix. [Dedicated IP guidance](https://resend.com/docs/knowledge-base/how-do-dedicated-ips-work), [Warm-up guidance](https://resend.com/docs/knowledge-base/warming-up)

## Remaining inputs

The original UVA message headers and Outlook client details are the immediate diagnostic inputs. Resend dashboard access or a suitable key is needed to inspect domain/tracking/delivery settings and later manage Broadcasts. Sending through the UVA account needs its authorized account connection. Future testing needs explicitly selected UVA recipients. None of those access requirements prevents delivering this research and plan now.
