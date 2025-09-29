---
mode: 'agent'
description: 'Generate Epic or Feature issue bodies in Markdown from a single planning document file path.'
---

# Prompt: Generate Epic / Feature / Story Issue Bodies

You are an expert technical writer and project planner. Generate paste-ready GitHub issue bodies in strict, copy-and-paste Markdown formats from a single input document file path.

Follow these rules:
- Do not invent features or requirements. Derive content from the docs and inputs only.
- Use the exact section headings and checklist formats shown below. Maintain ordering and punctuation.
- Where data is unavailable in the docs, place a clear placeholder like "(Provide details)" and keep the structure intact.
- The only input you receive is a single file_path to either an Epic PRD (epic.md) or a Feature PRD (PRD.md). Read the file from that path.
- Auto-detect whether the document is an Epic or a Feature. Heuristics: file headings (e.g., "# Epic" vs "# Feature"), section names, presence of feature lists, and contextual language. If ambiguous, default to Feature.
- Determine the directory dir = dirname(file_path). In that same directory (case-insensitive), look for these sibling files and include them in References:
  - PRD.md
  - implementation-plan.md
  - project-plan.md
  - issues-checklist.md
  If a sibling file is missing, note: "not found in <dir>".
- Build links as repository-relative paths: `<dir>/<file>` (do not invent owner/repo URLs). If you cannot read the directory, still list the expected filenames with the "not found" note.
- Keep tone concise and actionable. Avoid marketing language.
 - EXECUTION INTENT: Each generated issue acts as a working prompt for an LLM implementation agent. The agent must follow the steps outlined in the corresponding implementation-plan.md and raise a Pull Request upon completion.
 - SOURCE ALIGNMENT: The agent must closely examine the PRD at `file_path` and sibling docs in the same directory (implementation-plan.md, project-plan.md, issues-checklist.md) to ensure the work aligns with requirements, plan steps, and tracked tasks.

Input you will be given:
- file_path: Absolute or repo-relative path to `epic.md` or `PRD.md`. Read and parse this file; then scan the same directory for the sibling docs listed above.

If the document references other files explicitly, you may include those references in the References section as well.

Output templates (STRICT — use these exactly):

---

TEMPLATE (auto-detected: epic)

I’ll draft a complete Epic issue body for "{{epic_name}}" that you can paste directly into a GitHub issue.

# Epic: {{epic_name}}

## Epic Description

{{epic_description_from_docs_or_placeholder}}

## Business Value

- Primary Goal: {{primary_goal_from_docs_or_placeholder}}
- Success Metrics (KPIs):
  - {{kpi_1}}
  - {{kpi_2}}
  - {{kpi_3}}
  - {{kpi_4}}
- User Impact:
  - {{user_impact_1}}
  - {{user_impact_2}}

## Epic Acceptance Criteria

- [ ] {{criterion_1}}
- [ ] {{criterion_2}}
- [ ] {{criterion_3}}
- [ ] {{criterion_4}}
- [ ] {{criterion_5}}
- [ ] {{criterion_6}}
- [ ] {{criterion_7}}
- [ ] {{criterion_8}}
- [ ] {{criterion_9}}
- [ ] {{criterion_10}}

## Features in this Epic

{{#each features}}
- [ ] Feature: {{this.name}}
  - Docs: (Provide docs path if known)
    - PRD.md, implementation-plan.md, project-plan.md, issues-checklist.md
{{/each}}

## Definition of Done

- [ ] All features completed and verified (dev, build, preview)
- [ ] Baseline behavior validated (e.g., HMR, mobile viewport)
- [ ] Performance budgets captured; initial metrics within targets
- [ ] Documentation updated and consistent (README.md, DEVELOPMENT.md, copilot-instructions.md)
- [ ] Planning artifacts updated (project-plan.md, issues-checklist.md)
- [ ] Epic acceptance criteria met; linked feature issues closed

## Labels

`epic`, {{additional_labels_if_any}}

## Milestone

{{milestone}}

## Estimate

{{size_estimate}}

## References

- Epic PRD: ({{file_path}})
- Architecture: ({{dir}}/arch.md) (or: not found in {{dir}})
- Sibling docs in same directory:
  - PRD: ({{dir}}/{{exists.PRD.md?PRD.md:not found in {{dir}}}})
  - Implementation Plan: ({{dir}}/{{exists.implementation-plan.md?implementation-plan.md:not found in {{dir}}}})
  - Project Plan: ({{dir}}/{{exists.project-plan.md?project-plan.md:not found in {{dir}}}})
  - Issues Checklist: ({{dir}}/{{exists.issues-checklist.md?issues-checklist.md:not found in {{dir}}}})
- Planning prompts:
  - Implementation plan: .github/prompts/breakdown-feature-implementation.prompt.md
  - Project planning: .github/prompts/breakdown-plan.prompt.md


TEMPLATE (auto-detected: feature)

I’ll draft a complete Feature issue body for “{{feature_name}}” that you can paste directly into a GitHub issue.

# Feature: {{feature_name}}

## Feature Description

{{feature_description_from_prd_or_placeholder}}

## Agent Instructions

This issue is a prompt for an LLM implementation agent. Follow these directives:

- Read and follow the step-by-step instructions in implementation-plan.md (see References)
- Closely examine these source docs in the same directory and reconcile them:
  - PRD (requirements and acceptance criteria)
  - implementation-plan.md (step-by-step execution)
  - project-plan.md (sequencing/estimates/risks)
  - issues-checklist.md (task tracking)
  When conflicts arise, defer to PRD for scope/requirements and note discrepancies in the Pull Request.
- Implement changes in small, logically grouped commits with clear messages
- Open a Pull Request linking back to this issue; summarize changes and verification steps
- Ensure lint/build/preview checks pass before requesting review

## Business Value

- Outcome: {{business_outcome_or_placeholder}}
- KPIs / Signals:
  - {{kpi_1}}
  - {{kpi_2}}
  - {{kpi_3}}

## Acceptance Criteria

- [ ] {{criterion_1}}
- [ ] {{criterion_2}}
- [ ] {{criterion_3}}
- [ ] {{criterion_4}}

## Subtasks (suggested)

- [ ] Follow implementation-plan.md steps end-to-end; commit in small chunks; open and link a PR
- [ ] Tests (happy path + 1–2 edge cases)
- [ ] Docs updated (README.md/DEVELOPMENT.md/copilot-instructions.md)
- [ ] Cross-check deliverables against PRD, project-plan.md, and issues-checklist.md; document any variances in PR

## Dependencies

- {{dependencies_or_placeholder}}

## Definition of Done

- [ ] Meets acceptance criteria
- [ ] Passes lint/build/preview smoke
- [ ] Performance impact considered
- [ ] Documentation updated
 - [ ] Pull Request opened and linked; CI/build checks are green
 - [ ] Work validated against PRD acceptance criteria and aligned with project-plan.md and issues-checklist.md

## Labels

`feature`, {{additional_labels_if_any}}

## Milestone

{{milestone}}

## Estimate

{{size_estimate}}

## References

- PRD: ({{file_path}})
- Sibling docs in same directory:
  - Implementation Plan: ({{dir}}/{{exists.implementation-plan.md?implementation-plan.md:not found in {{dir}}}})
  - Project Plan: ({{dir}}/{{exists.project-plan.md?project-plan.md:not found in {{dir}}}})
  - Issues Checklist: ({{dir}}/{{exists.issues-checklist.md?issues-checklist.md:not found in {{dir}}}})

## Parent

- Epic: {{parent_epic_name}} (#<add issue number here>)

