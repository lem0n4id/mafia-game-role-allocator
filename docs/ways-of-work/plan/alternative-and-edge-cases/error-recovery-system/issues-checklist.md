# Issues Creation Checklist — Error Recovery System

## Feature Issue
- [ ] Create "Feature: Error Recovery System"
- [ ] Labels: `feature`, `priority-medium`, `value-medium`, `state`
- [ ] Dependencies: Allocation, Reveal, Reset
- [ ] Acceptance: Idempotent actions; disable during processing; reset works

## Stories/Enablers
- [ ] Story: Guard rapid double-taps
- [ ] Story: Disable buttons when processing
- [ ] Enabler: Integrate Reset as escape hatch

## Tests
- [ ] Double-tap allocate/reveal/reset remains consistent

## DoD
- [ ] Docs updated
