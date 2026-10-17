---
name: fdl-persona-review
description: Review FDL's current home page and documentation using the prospective user personas defined in docs/user-personas.md, with a separate subagent for each persona. Use for FDL user-persona reviews and follow-up reviews, rather than the five-expert design panel.
---

# FDL user-persona review

Evaluate whether prospective developers can recognize their problem, understand
FDL's value and limits, and complete a first meaningful task without hidden
repository knowledge. These are simulated evaluations, not actual user research
or evidence of market fit.

## Establish the target

- Resolve the repository root from this skill's location (`../../..`). Read
  `AGENTS.md`, `docs/design-principles.md`, and `docs/user-personas.md` there.
  The persona document is authoritative: use its current names, backgrounds,
  expectations, and evaluation tasks. Do not substitute famous design experts
  or maintain a second copy of the persona definitions in this skill.
- Record branch, commit, and working-tree state. Review current files, including
  applicable uncommitted changes; preserve existing work.
- Review relevant previous findings and explicit user decisions when available.
  Recheck findings against current behavior and respect deliberately removed
  features. Do not assume an older review still describes the site.
- Use the local documentation site in `examples/fdl-input/`. Start it with
  `npm run docs:dev` if needed and use the printed URL. Include `README.md` and
  linked repository documentation where a persona's journey calls for them.

## Assign one reviewer per persona

Create a separate subagent for every persona currently defined in the document.
Run in waves if concurrency is limited; wait for each wave to finish before
starting the next. Do not replace independent persona reviews with a single
agent switching roles.

If creating a reviewer returns an agent-limit error, wait for a running
reviewer to complete, collect its result, and then retry creating a separate
reviewer for the next unassigned persona. Use the agent completion/wait tools;
do not repeatedly retry creation without a completion or other capacity change.
Continue in waves until every persona has a completed review. An agent-limit
error alone is not a reason to end the review early. If creation still fails
after the existing reviewers have completed and no further capacity can be
released with the available tools, disclose that persistent runtime limitation
and identify the reviews that remain incomplete.

Give each reviewer the following bounded brief:

- Read the authoritative persona document, then evaluate only the assigned
  persona's goals and evaluation tasks. Use the persona's technical background
  and tolerance for setup when judging what is understandable.
- Supply the repository root, snapshot, local URL, relevant prior decisions,
  and read-only scope. Do not supply a desired verdict or another reviewer's
  findings. Use available model-selection guidance; inheritance is suitable
  unless a concrete reason calls for an override.
- Follow the journey from first encounter to a meaningful task, then inspect
  reference material or return navigation as relevant. Treat source inspection
  as diagnostic evidence, not knowledge the prospective visitor already has.
- Return an assessment of each assigned evaluation task (supported, partial,
  obstructed, or unverified), strengths to preserve, and material findings.
  For each finding include priority, goal, specific evidence and location,
  consequence, and the smallest useful remedy. Distinguish observed behavior,
  source evidence, and inference. Include prior findings' disposition where
  applicable, verification limits, and changed files (normally none).

The review itself is read-only. Local example interactions are permitted;
implementation, commits, publishing, and external submissions require separate
authorization. A request to create or update this skill authorizes that skill
change, not implementation of the resulting site recommendations.

## Verify and synthesize

Use the running site for claims about visible layout, interaction, state
continuity, focus, and feedback. Avoid shared-browser interference by using
separate tabs or assigning live checks to the coordinator. Source-only reviews
remain useful, but label their limits. Reproduce material interaction findings
when feasible; do not mistake an unsettled initial render or unexpanded shadow
root for missing content. Claims about accessibility must be bounded by the
checks actually performed; a simulated persona pass is not an accessibility
audit or assistive-technology test.

Wait for every persona before consolidating. Lead with the overall assessment,
summarize each persona's task outcomes, and deduplicate findings into an
actionable order. Include precise source links or reproducible local routes,
verification and limitations, the reviewed snapshot, and whether files changed.
Separate material blockers from optional enhancements; do not invent a quota,
numeric score, or fresh backlog on a follow-up pass. “No further material
findings” is a valid result. Stop after the requested review unless the user
also authorized implementation.
