# CIO application policy review

**Reviewed September 29, 2026. Recommendation: do not submit yet.** The application has substantial supporting material, but the website certification cannot yet be supported by the inspected site, and the roster needs names. There are also material approval risks around brand use, recurring membership, and the non-duplication case.

This is a detailed application-readiness review, not a prediction of approval or a legal opinion. No substantive answers, website code, signatures, or submission were changed during this audit. The two nondiscrimination boxes that Nathan had checked were saved by advancing to the next page. The newly revealed non-affiliation/electronic-signature checkbox remains **unchecked**.

## Read this first

| Priority | Finding | Status and smallest next step |
| --- | --- | --- |
| Stop before signing | Required non-affiliation notice is absent from inspected public pages | Add the prescribed notice prominently to every club website page and cover club-owned social/communications channels before certifying compliance. |
| High | UVA wordmark appears on the home page; brand/domain questions remain | Remove the standard UVA wordmark or produce the required written authorization. Resolve the `builders@uva` / `uva.builders` naming question with UVA Brand/Student Engagement. |
| High | 49 of 51 roster entries have no displayed first or last name | Populate names or complete the platform profile/acceptance process that supplies them; use the existing private member export to reconcile. |
| High | Counts do not document a core of ten regularly engaged students | Retain attendance-by-date and evidence of the three mission-related sessions. |
| High review risk | VEO overlaps materially with the proposed mission and programs | Ground the distinction in actual open participation and programs; update the comparison to its current directory profile. Do not rely on future demos alone. |
| Confirm before certifying | Adoption and initial officer/signing authority have not been evidenced | Keep the actual founding approval/selection record. Confirm Hari's authority and whether Nathan may execute the remaining declaration as designee. |
| Clarify | “Other Grants/Awards” is saved despite no funds received | Keep the no-funds explanation and obtain the permitted way to record this required field. Do not imply a grant exists. |

## What was inspected

- The **saved print view** of [submission 114977930](https://hoosinvolved.virginia.edu/submitter/register/print/114977930), including all answers, 51 roster rows, upload filenames, selected declarations, and the informational text for section 11. The exact current answers are in [the answer snapshot](builders-cio-application-draft.md).
- The interactive document pages. The current gate is the **Non-Affiliation Agreement**, still inside section 10. The final section's information can be read in the normal print view, but its interactive step has not been reached.
- The **uploaded four-page constitution**, preserved here as [Markdown](builders-constitution-2026-2027-draft.md) and [PDF](builders-constitution-2026-2027-draft.pdf). The earlier five-page review copy is not the uploaded version.
- The locally supplied, uploaded **2026–2027 CIO Agreement**, ten pages. It names the club and Harivansh Rathi and shows his signature. References below use its section and PDF page numbers. This was a visual/content check, not cryptographic signature validation. The signed file and signature image are not committed.
- The live club home, Apply, Events, and three completed-event pages; the matching site footer/logo source at this branch's `origin/main` base. No live social-account inventory, mailbox delivery test, venue booking records, attendance register, voting minutes, or student enrollment records were supplied.
- Current UVA policy and branding pages, Student Council's application criteria, the current VEO directory entry, and VVF's own website. An independent [constitution review](constitution-policy-research-2026-09-29.md) provides the article-by-article analysis.

**Evidence limits:** a saved field proves what the application says, not that an activity occurred or an attestation is true. A UVA email is not proof of current enrollment. A roster count is not proof of recurring participation. A date typed into a constitution is not a record of its adoption. These are gaps in the material reviewed, not findings that the user gave false information.

## Primary sources and version handling

- **Application:** authenticated [saved draft](https://hoosinvolved.virginia.edu/submitter/register/print/114977930), especially sections 6, 7, 8, 10, and 11. The full export, including member emails, remains local.
- **Agreement A:** uploaded 2026–2027 CIO Agreement, §§1–20, pp.1–10. The [official training route](https://view.genially.com/69b24785e3daa7c855c2a53b) supplies this annual document.
- **Policy P:** [STAF-002](https://uvapolicy.virginia.edu/policy/STAF-002), revised **August 17, 2026**, especially II.B–C, III–IV, and VI. Read directly in the browser.
- **Brand B:** [For Students](https://brand.virginia.edu/design-assets/logos/for-students), the current student-branding page. The older student-organizations URL linked in the agreement rendered a generic brand home page; the current page was found through that site's own search.
- **Recognition R:** [Student Council's application guide](https://www.uvastudco.com/org-rec), criteria and application process. It asks for ten committed, regularly participating students, three relevant prior programs, established student leadership, a current consistent constitution, and a non-duplicative mission. The current fall window is August 26–October 31.
- **Renewal U:** [2026 CIO instructions](https://studentaffairs.virginia.edu/subsite/student-engagement/cio-support/renew). Used for current annual wording and operational guidance, while distinguishing renewal from a new application.
- **Comparisons:** [VEO's current Hoos Involved profile](https://hoosinvolved.virginia.edu/organization/virginiaentrepreneurshiporganization); its [October 2024 post](https://veovirginia.substack.com/p/veo-updates-101); [VVF's website](https://www.virginiaventurefund.com/).

The older sample and application-guide nondiscrimination lists differ from the current agreement and the live upload instructions. The uploaded constitution correctly uses the newer HRM-009-reference clause. Do not replace it with the old enumerated list. The live financial introduction also has older reimbursement wording that conflicts with A §12. Those conflicts are documented, not silently treated as settled law.

## Findings and actions

### 1. The next declaration cannot be supported by the inspected website

**Observed:** the home, Apply, Events, and three September-event pages have no full independence notice. The footer contains copyright/brand text and a clock. The source in [Footer.svelte](../src/lib/Footer.svelte) confirms that structure. The home page displays University/program logos. See [the live home screenshot](evidence/website-2026-09-29.jpg).

**Requirement:** P II.B requires the prescribed statement prominently on every club website page and in the covered communications. A §6, pp.3–4 covers websites, social media, publications, messages, and third-party dealings. The next live declaration certifies that this has been done and also acts as an electronic signature. See [the declaration screenshot](evidence/non-affiliation-gate-2026-09-29.jpg).

**Action:** put the exact current notice in the common site footer or another prominent shared area, verify every public route, and cover organization-owned social pages and routine external email/message templates. Where a social platform has no room, the live form permits a link to a page carrying the notice. Do not substitute “student-led,” a small “unofficial” tag, or the constitution's shorter independence sentence for the prescribed notice.

No organization-owned social pages are listed in the application. The visible LinkedIn/X links are labeled as the founders' personal accounts. This review does not treat every personal page as a club account; identify which channels actually speak for the club. A site code change without deployment would not make the declaration true. This PR documents the defect; it does not fix or deploy the site.

### 2. The default branding rules do not cover the displayed UVA wordmark

**Observed:** the home page renders `/uva.svg` as a standard “University of Virginia” wordmark. It also displays The Foundry and UVA Engineering VentureForward logos as a row of linked marks. [App.svelte](../src/App.svelte) contains those three assets/links. No written permission or club partnership record was supplied.

**Requirement:** B distinguishes CIOs from University agency/special-status groups: the ordinary University logo system is not the default permission for a CIO. It permits the customized split-V route and approved organization naming. P II.C addresses prior written permission and restrictive use of names/marks; A §7, p.4 gives the club-specific terms.

**Action:** remove the standard UVA wordmark unless there is applicable written authorization; do not infer permission merely from linking it to virginia.edu. Check the separate permissions and actual relationship for the Foundry and VentureForward marks. This review does not claim those programs refused permission, nor that an individual founder's participation establishes a club partnership. A plain link to a useful resource is easier to distinguish from a sponsor/partner claim.

**Naming:** “Builders at UVA” matches R's stated abbreviated convention. The alias `builders@uva`, the main site's branding, and the `uva.builders` domain require clarification: no inspected source expressly approves the `@` substitution, and the domain leads with UVA. P/A/B use a stricter full University-name convention, while R accepts “at UVA.” Do not label the formal application name itself definitively invalid based on that inconsistency. Ask UVA Brand/Student Engagement specifically about the alias, domain, and custom email before undertaking a migration. The shared email is club-controlled in intent, but its domain inherits the naming question.

### 3. Bulk roster import omitted names

**Observed, counted from the rendered saved table:** 51 rows; **49 have both name fields blank**. Hari and Veera have names; Nathan and all 48 bulk-imported member rows do not. This was a limitation of the email-only import performed during this task. The President and Treasurer UI checks pass, but those checks do not establish complete compliance.

**Requirement:** A §15, p.9 explicitly calls for the roster to include each member's name, and for changes to be reflected within 48 hours. A §1 also requires the student-member minimum and student-officer eligibility.

**Action:** reconcile the existing private signup names to the saved entries. Use the supported profile/invitation or roster-edit process that actually populates the names; do not create duplicate people. Verify Nathan's own profile display as well. If name fields are controlled by the user's profile or an accepted invitation, determine that workflow with Student Engagement rather than assuming blank rows are acceptable. The supplied names already cover the 48 entries; a new survey should not be needed merely to recover them.

All saved addresses have the UVA domain, which is supportive but not independent enrollment evidence. Confirm actual current student status and that Hari, Nathan, and Veera meet the agreement's degree-program/fee/enrollment conditions. Do not alter roles or use another member merely to fill a count. Conrad remains excluded as requested.

### 4. Event totals are good evidence of activity, but not the full sustainability case

**Observed:** the three saved events are September 10, 17, and 24, all at 6 p.m., with attendance of 25, 17, and 13 supplied by Nathan. Each has a public recap and event photos; the later two pages also expose a recording control. The listed topics support the club's educational mission. The October 1 event is appropriately excluded from completed-event evidence on September 29.

**Remaining gap:** the material does not identify a core of at least ten students who regularly participate across the program. An email list and three totals alone do not demonstrate that. R specifically excludes listserv-only/interest-only membership from its active-member test and asks for relevant prior programming, not social gatherings.

**Action:** retain a private attendance table by event and supporting recaps/photos/agendas, and identify the recurring active cohort. Do not invent names, count the invited speaker as a student member, or count RSVP records as attendance without a basis. The public photos support that events happened; this review did not infer attendance numbers or student identity from faces. If the program is sustained by different audiences each week, explain that honestly and ask the committee what participation evidence it needs.

Venue names in the application are plausible meeting plans, not verified room bookings. Retain the actual Olsson/Foundry reservation or permission information if asked. No fixed multi-semester booking was claimed.

### 5. The non-duplication answer needs stronger evidence

**Current VEO evidence:** its live Hoos Involved profile describes support for side projects/startups, MVP/pitch workshops, entrepreneur speakers, and structured learning. It also lists **Interview** and **Somewhat Selective**, with prior-knowledge expectations. Those facts are more useful than relying only on the October 2024 newsletter. The profile's linked older `v1virginia.com` domain did not resolve during this review; that is not proof that VEO has dissolved. Lack of displayed officers/upcoming events is also not proof of inactivity.

**Current VVF evidence:** its website describes investment-oriented analyst training, partner-firm experience, and an impact fund. The existing comparison against VVF is broadly supported. Avoid presenting the website as proof of a current admission rule that was not checked.

**Risk:** Builders' existing talks and proposed peer work overlap with VEO's listed activity. “Side projects” does not necessarily mean commercial companies, so a noncommercial-project emphasis alone may not establish a separate mission. Planned demos do not prove a program has operated. R's non-duplication decision depends on real mission/activity comparisons; only the committee can determine sufficiency.

**A grounded proposed revision, for leadership review rather than automatic insertion:**

> VEO's current Hoos Involved profile lists an interview and selective entry. Builders at UVA offers open participation with no prior technical experience, interview, or company requirement. Both groups offer founder learning and project support. Our proposed distinction is sustained, accessible peer practice for students' self-chosen commercial or noncommercial projects. We will describe the work sessions and outcomes we actually run and coordinate with related groups rather than claiming that founder talks alone are unique.

This still needs concrete operating evidence or a clear approved plan. If the committee sees duplication, collaboration with VEO may be more credible than asserting differences that do not exist. Do not claim a partnership without consent.

### 6. Adoption and signing authority are factual checks, not formatting tasks

**Observed:** the constitution states adoption on September 29 because Nathan requested that date. The signed agreement names Hari; the application submitter/primary contact is Nathan, now Vice-President. No initial member adoption/selection/authorization record was provided. Several saved governance answers still begin “Proposed rule,” while an uploaded constitution gives those rules as operative.

**Requirement/evidence issue:** A §1, p.1 represents that the signatory is the elected President or authorized designee and has member authorization. R describes the President submitting. P VI allows an authorized person to execute the agreement. These do not establish Nathan's actual authorization simply because he is Vice-President or because Hari signed the PDF.

**Action:** confirm the actual initial approval and officer selection, retain a brief truthful record, and confirm whether Hari should finalize the application or Nathan is the authorized designee. Remove “Proposed rule” and “constitution draft” only after the rules are actually adopted. Do not invent a retroactive vote, notification, or quorum.

The new constitution's 14-day voting rule should not automatically be applied backward to invalidate its first adoption. For later votes, clarify actual membership dates versus Hoos Involved import dates. Once 51 members are eligible, a majority quorum is 26; the recorded talk totals do not themselves establish that a business vote could meet that quorum. Plan an actual business meeting/remote voting process when needed. The initial September officers and the normal May–April cycle also deserve a short factual transition record.

### 7. Funding choice is procedurally valid but one answer is misleading without context

**Observed:** future SAF/Cav use is No; existing supplier/account is No; the explicit opt-out acknowledgement is saved. The costs answer says there are no funds, no account, and no committed trip. The current-source answer is **Other Grants/Awards**, selected by Nathan after no option accurately represented “none yet.”

**Assessment:** the opt-out branch and A §12, pp.7–8 support not opening an account simply to complete a no-funding application. But a source labeled Grants/Awards can be read as money already received. Passing a required-field validator does not resolve that ambiguity.

**Action:** ask the committee how it wants a newly unfunded club represented; preserve the explicit no-funds explanation. If an actual award exists later, report its real source and conditions. No-SAF/no-Cav does not mean every other University funding stream is exempt from account/supplier rules. A §12 applies those conditions when University money is allocated directly to the CIO.

The signed agreement also says Alumni Hall accounts are automatically registered as suppliers and permits individual reimbursements under specified conditions. The older financial introduction says otherwise. Record the conflict and use Student Engagement's current route-specific instructions if money is later sought. There is no reason to open an account just to remove an obsolete TODO from this packet.

Zero required member costs is consistent with the present no-dues/no-committed-trip answer. If a future trip requires members to pay, make its optional nature and costs clear and update the profile. A detailed hypothetical San Francisco budget is not required by the inspected cost field, which accepts a list.

### 8. Smaller clarity issues

- **Apply versus open membership:** the public page says Apply and asks about experience, but does not visibly explain that everyone may join. Nathan says it is a survey. The inspected source validator accepts both true and false experience answers, which supports that intent; it does not prove later operating practice. Labeling the form as open registration/survey would reduce reviewer confusion. There is no observed basis to allege actual experience discrimination.
- **Shared email:** `team@uva.builders` addresses continuity better than a personal inbox. Its delivery and officer access were not tested; ensure the responsible officers monitor it. Its naming question is covered above.
- **Constitution publication:** Article II's independence summary is not the prescribed full notice. The template does not separately demand a new constitutional article for that notice, but publishing/sending the constitution is covered by the broader communication rule. Include the full official notice in the publication context or document as appropriate.
- **Internal rules:** the constitution is much more detailed than the minimum template. Members must be able to follow its notice, quorum, expense, removal, and amendment rules. Distinguish majority changes to subordinate bylaws from two-thirds constitutional amendments; do not call a constitutional change a bylaw change to bypass the threshold.

## Section-by-section disposition

| Application section | Review result |
| --- | --- |
| 1 Instructions/applicant | Nathan is primary contact; verify designee/final-signature authority. |
| 2 Profile | Confirmed contact/founding/schedule/events are saved. Formal name is improved; alias/domain, recurring-participation evidence, and public brand use remain issues. Blank optional social/profile fields are not invented. |
| 3 Categories | Professional, Special Interest, and No Application/Interviewed Required fit the stated open model. No sport/fraternal classification issue observed. |
| 4 Mission/origin/cost/email | Factual September founding and three talks are clear. Future work is described as planned. No-funds wording is clear. Record rather than infer shared mailbox access and venue permissions. |
| 5 Details/governance/non-duplication | Current constitution and many mechanics align. Proposed-language/adoption status and the VEO comparison need attention. |
| 6 Administration | No intake period, no non-UVA minors, no sport, April handover are coherent. Current-source checkbox needs clarification. A voting-eligibility wait is not automatically a pledge/intake period. |
| 7 Financial planning | No/No plus opt-out are saved. This removes account setup as a current procedural blocker, not future financial obligations. |
| 8 Roster | Three distinct officers and 51 entries are saved; 49 name fields missing. Eligibility and recurring activity remain separate checks. |
| 9 Image | Optional and blank; not a blocker. Do not upload an unapproved UVA logo merely to fill it. |
| 10 Documents | Signed agreement and correctly named four-page constitution uploaded. Current nondiscrimination clause is present; Nathan's two declarations are selected. Non-affiliation/e-signature declaration is unselected and must not be falsely certified. |
| 11 Final page | Informational text read via normal print view. It describes review/vote steps, 4–8 weeks, and a 72-hour response deadline for temporary denials, with two temporary-denial rounds. Interactive completion remains behind the signature gate. No final submission. |

## Ongoing obligations to assign now

These are operational duties from the signed agreement, not extra application fields. Hari should own or delegate the required notices and education, Veera the financial records if funds arise, and Nathan the roster/meeting records under the constitution.

- A §3, p.2: at least two executive members take the specified annual education, plus the described Summit/Roundtable participation. The public portal showed a September 12–13 summit notice; a newly applying club should ask about the next orientation/make-up requirement instead of claiming it attended.
- A §4, p.3 and P III: distribute the annual hazing notice to the covered current and prospective participants. Open membership does not remove that duty.
- A §9, p.5: issue the liability/insurance notice. UVA does not automatically insure club trips or defend the club's claims.
- A §§1,15, pp.1,9: keep roster/profile changes current within 48 hours.
- A §§13–14, pp.8–9: obtain event/venue approvals when applicable and monitor the official mailbox. No-minors does not exempt a staff-designated risky event from insurance requirements. Future travel/speaker contracts need their own review.

## Recommended order before submission

1. Fix/deploy the website notice and resolve default-prohibited logo use; inventory actual club communications/social channels.
2. Complete roster names and keep attendance evidence for the active cohort.
3. Confirm adoption/initial officers/designee authority and make saved governance wording match the adopted document.
4. Strengthen the non-duplication answer using the current VEO profile and actual program evidence; get guidance on the funding-source field and name/domain questions.
5. The authorized person reviews and accepts the non-affiliation/e-signature declaration only when true, then checks the final screen. Submit only after a separate explicit decision to do so.

**What this PR does:** preserves the current answer snapshot and uploaded constitution, adds this review and its supporting document analysis, and keeps substantive findings visible for co-leader decisions. It does not publish the signed agreement or member list, change the live site/application answers during the audit, or certify that all prerequisites have been met.
