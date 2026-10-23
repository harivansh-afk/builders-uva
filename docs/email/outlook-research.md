# Outlook and UVA delivery research

Researched 2026-09-09. Research only: no messages sent and no service settings changed.

## Assessment

Junk placement and an invisible remote image are separate observations; neither proves a broken template or that non-Outlook domains are inherently disfavored. The actual recipient message, client/version, and folder state are needed to distinguish filtering from image privacy settings. Passing sender DNS checks is not equivalent to authentication passing on the received message.

UVA publicly documents **Fortinet and Office 365 anti-spam technology**, including protection for student accounts with contracted vendors. Therefore, treat this as a UVA-managed delivery path, not simply consumer Outlook.com. The public description does not establish the precise route or verdict for this test. [UVA Information Security](https://security.virginia.edu/about-spam)

## Images

- Classic Outlook defaults to blocking automatic downloads of Internet pictures. A recipient can download pictures for one message or trust a sender. This is a privacy choice, so changing sender HTML cannot guarantee automatic loading. [Microsoft classic Outlook picture settings](https://support.microsoft.com/en-us/outlook/block-or-unblock-automatic-picture-downloads-in-classic-outlook-email-messages)
- New Outlook has a security option blocking attachments, pictures, and links from anyone outside Safe Senders. Thus an image can remain blocked even when its public URL works. Do not assume identical behavior across classic, new, web, and mobile Outlook. [Microsoft new/classic Outlook link and content settings](https://support.microsoft.com/en-us/outlook/links-are-disabled-in-outlook-for-windows-email-messages)
- Outlook Mobile specifically says its Block External Images setting does **not** block pictures embedded as attachments. A MIME inline PNG referenced with `cid:` is therefore a useful candidate to test against the remote PNG. This is a narrower claim than promising universal rendering or bypassing junk protections. [Microsoft Outlook Mobile external images](https://support.microsoft.com/en-US/Outlook/what-is-block-external-images-in-settings)
- Microsoft documents `cid:` image representation in new Outlook/web as well as classic Outlook. That establishes a supported representation, not unconditional display. [Microsoft inline-image representation](https://devblogs.microsoft.com/microsoft365dev/changes-to-inline-images-in-outlook/)

Recommended diagnostic: preserve the original junk message and headers first; capture the exact blocked-content notice; compare the original in Junk, after marking Not junk, and after explicitly loading pictures. If it then renders, public image hosting or PNG encoding is unlikely to be the cause. If it still fails, inspect received HTML/MIME for modified URLs or missing attachment references and compare web versus the affected client. Maintain every event detail and sender identity in live text so the message works without images.

## Evidence to collect

Obtain full original headers or the original message, not an ordinary forwarded copy. In new Outlook/web: More actions → View → View message details. Classic Outlook: open message → File → Properties → Internet headers. [Microsoft header instructions](https://support.microsoft.com/en-us/outlook/view-internet-message-headers-in-outlook)

Read `Authentication-Results` for SPF and its envelope domain, DKIM and its signing domain, DMARC and From alignment, and `compauth`. Read `X-Forefront-Antispam-Report` for `CAT`, `DIR`, `SFV`, `CIP`, and `SFTY`, plus `X-Microsoft-Antispam` for `BCL`. Preserve the Received chain and gateway headers. Microsoft now cautions that SCL alone does not determine cloud verdict/action; `CAT` and `DIR` matter. `SFV:SPM` means spam filtering marked spam; `SFV:BLK` means a user's blocked sender; `SFV:SKS` can identify a prior spam decision; `SRV:BULK` identifies bulk filtering. [Microsoft anti-spam header reference](https://learn.microsoft.com/en-us/defender-office-365/message-headers-eop-mdo)

Recipient reporting as Not junk and adding the sender to Safe Senders can remediate that mailbox, but they are not evidence of ordinary delivery for the rest of the list. UVA administrators can examine the trace and submit false positives to Microsoft; any allow entry belongs with the administrator and observed verdict. Do not propose broad filtering disablement. [Microsoft false-positive handling](https://learn.microsoft.com/en-us/defender-office-365/step-by-step-guides/how-to-handle-false-positives-in-microsoft-defender-for-office-365)

## Urgent delivery and ongoing list ownership

The coordinating agent measured 31 distinct signup addresses. For this small opted-in announcement, a simple, text-led message sent through Hari's **actual UVA account** is a reasonable alternate path to test. It might benefit from the institutional route and established account; that is an inference, not a delivery guarantee. Do not change the Resend From field to an address Resend is not authorized to send for. Use Bcc or individual recipients to avoid disclosing the signup list. A test must arrive naturally in Inbox before relying on this path; a recipient who already safe-listed the sender is not an independent test.

Generic Exchange Online limits list 10,000 recipients/day, 30 messages/minute, and a per-message recipient limit configurable up to 1,000; these are not verified UVA account settings. Thirty-one recipients are below those published service ceilings, but actual mailbox restrictions and outbound spam protection still apply. Microsoft recommends specialist providers for ongoing bulk commercial mail. [Exchange Online limits](https://learn.microsoft.com/en-us/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits)

UVA has a real Sympa service with owner-managed subscribers, bounces, moderation, and archives. It could be the long-term option if institutional list ownership is preferred. New lists require listmaster approval, so creating one cannot be assumed to solve tomorrow's delivery. [UVA list creation](https://lists.virginia.edu/sympa/help/admin-createlist.html) Owners can add multiple subscribers and remove them, with subscription notice controls. [UVA subscriber management](https://lists.virginia.edu/sympa/help/admin-members.html)

UVA also publishes a mass digital communications policy and a process for requesting institutional audience distributions. This research does not establish that an opted-in 31-person student-club reminder requires a university-wide distribution approval; avoid conflating those scopes. [UVA IRM-006](https://uvapolicy.virginia.edu/policy/irm-006)

## Proposed acceptance gate

1. Freeze content, audience snapshot, and sender; get original junk-message evidence.
2. Test a text-led message from the actual UVA account for the urgent fallback, and a corrected Resend variant only after evidence identifies a useful change. All sends require current authorization.
3. Record natural Inbox/Junk placement separately from pictures loading, client/version, and authentication. Check an untouched UVA mailbox where available; test desktop/web and mobile if they are used by recipients.
4. Send the chosen version once to the frozen list after accepting the evidence. Keep a recipient ledger across providers so a fallback never resends the full campaign blindly.
5. Resolve the Resend/UVA false positive and image strategy for later campaigns with recipient-side evidence. Provider acceptance/delivery is never proof of Inbox placement or visible images.
