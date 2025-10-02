---
mode: 'agent'
description: 'Git commit and push automation prompt that commits all changed files with appropriate commit messages and pushes to remote repository.'
---

# Git Commit & Push Automation Prompt

## Goal

Act as a Git workflow automation specialist. Your task is to analyze changed files, generate appropriate commit messages following conventional commit standards, commit all changes, and push to the remote repository. This prompt automates the complete git workflow from staging to remote push.

## Git Workflow Best Practices

### Conventional Commit Message Format

Follow the conventional commit specification for consistent, semantic commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature for the user
- `fix`: Bug fix for the user
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc; no production code change
- `refactor`: Refactoring production code, eg. renaming a variable
- `test`: Adding missing tests, refactoring tests; no production code change
- `chore`: Updating grunt tasks etc; no production code change
- `perf`: Performance improvements
- `ci`: Changes to CI configuration files and scripts
- `build`: Changes that affect the build system or external dependencies

### Commit Message Guidelines

- **Keep the first line under 50 characters**
- **Use imperative mood** ("Add feature" not "Added feature")
- **Capitalize the first letter** of the description
- **No period at the end** of the description
- **Include scope when relevant** (component, file, or area affected)
- **Use body for context** when the change needs explanation
- **Reference issues/PRs** when applicable

### Multi-File Change Strategy

When multiple files are changed:
- **Group related changes** into logical commits when possible
- **Use a single commit** for cohesive changes across multiple files
- **Separate commits** for unrelated changes (docs vs code vs tests)
- **Use clear scope** to indicate the area of change

## 🚨 CRITICAL: MANDATORY DOCUMENTATION PROTOCOL

### **⚠️ STOP: DOCUMENTATION ENFORCEMENT - NO EXCEPTIONS ⚠️**

**BEFORE COMMITTING ANY CHANGE, YOU MUST COMPLETE THIS CHECKLIST:**

**🔥 MANDATORY DOCUMENTATION UPDATES (NEVER SKIP):**

✅ **1. UPDATE DEVELOPMENT.md:**
- [ ] Add entry to Architectural Decision Log with implementation details
- [ ] Update Current Architecture Status section with completed work
- [ ] Mark completed features/phases with ✅ status
- [ ] Update file structure documentation if files added/modified
- [ ] Document any breaking changes or migration steps

✅ **2. UPDATE copilot-instructions.md:**
- [ ] Update Current Architecture Status section (around line 1100+)
- [ ] Add/modify relevant code patterns and examples if new patterns introduced
- [ ] Update component patterns if new architectural patterns added
- [ ] Add new development guidelines if applicable
- [ ] Update file organization or maintenance guidelines if structure changed

✅ **3. VALIDATE DOCUMENTATION CONSISTENCY:**
- [ ] Ensure no conflicting patterns between old and new documentation
- [ ] Verify all code examples work with current implementation
- [ ] Check that documentation reflects actual codebase state
- [ ] Remove or update any deprecated examples or instructions

**🎯 DOCUMENTATION ENFORCEMENT RULES:**
- **ZERO commits without documentation updates** - Every code change requires corresponding documentation
- **Documentation commits must be included** - Stage and commit documentation changes alongside code changes
- **No "documentation debt"** - Documentation must be updated BEFORE committing code changes
- **Architecture changes require comprehensive documentation** - Any new patterns, components, or utilities must be fully documented

**💥 IF DOCUMENTATION IS NOT UPDATED:**
- **Your commit is incomplete and must be rejected**
- **Future developers will be misled by outdated documentation**
- **Project architecture will deteriorate through inconsistency**
- **Development velocity will decrease due to confusion and rework**

### **📋 Documentation Checklist Verification:**
Before proceeding with any commit, ask yourself:
- ❓ Have I documented this change in DEVELOPMENT.md?
- ❓ Have I updated copilot-instructions.md if patterns changed?
- ❓ Could a new team member understand the current state from the docs?
- ❓ Are there any conflicting or outdated instructions in the documentation?

**If ANY answer is "No" or "Unsure", you MUST update documentation first!**

---

## Task Instructions

1. **Analyze Changed Files**: Use `get_changed_files` to identify all modified, added, or deleted files
2. **Categorize Changes**: Group changes by type (code, docs, tests, config, etc.)
3. **🚨 ENFORCE DOCUMENTATION**: Verify documentation has been updated according to mandatory protocol above
4. **Generate Commit Message**: Create appropriate conventional commit message(s) based on the changes
5. **Stage and Commit**: Add ALL changes (including documentation) and commit with the generated message
6. **Push to Remote**: Push the commit(s) to the remote repository

## Execution Steps

### Step 1: Analyze Changes
```bash
# Check for changed files and analyze their nature
git status --porcelain
git diff --name-only
```

### Step 2: 🚨 MANDATORY DOCUMENTATION VERIFICATION
**CRITICAL: Check if documentation has been updated:**
- Scan changed files for any code changes (src/, components/, hooks/, utils/)
- If ANY code changes exist, verify documentation updates in:
  - `DEVELOPMENT.md` (Architectural Decision Log, Current Architecture Status)
  - `.github/copilot-instructions.md` (Current Architecture Status, patterns, examples)
- **REJECT COMMIT** if code changes exist without corresponding documentation updates
- **REQUIRE** documentation updates before proceeding

### Step 3: Determine Commit Strategy
- **Single logical change**: One commit for all related files (including documentation)
- **Multiple unrelated changes**: Separate commits for different areas (but always include docs)
- **Mixed changes**: Prioritize by impact (code + docs > config > tests)
- **Documentation-first**: Always include documentation changes with code changes

### Step 4: Generate Commit Message
Based on the file analysis:
- **Source code changes**: `feat:`, `fix:`, `refactor:`, `perf:` (must include documentation)
- **Documentation changes**: `docs:` (when updating docs without code changes)
- **Configuration changes**: `chore:`, `ci:`, `build:`
- **Test changes**: `test:`
- **Mixed changes**: Use the most significant change type + documentation

### Step 5: Commit and Push
```bash
# Stage all changes (including documentation)
git add .

# Commit with generated message (must include both code and documentation changes)
git commit -m "<conventional commit message>"

# Push to remote
git push origin <current-branch>
```

## Message Templates

### Feature Implementation
```
feat(<scope>): implement <feature-name>

- Add <component/functionality>
- Integrate with <existing-system>
- Include <tests/docs> for <feature>
```

### Documentation Update
```
docs: update <documentation-area>

- Update <specific-docs>
- Add <new-sections>
- Fix <inconsistencies>
```

### Bug Fix
```
fix(<scope>): resolve <issue-description>

- Fix <specific-problem>
- Update <affected-components>
- Add <regression-tests>
```

### Refactoring
```
refactor(<scope>): improve <area>

- Simplify <component/logic>
- Extract <reusable-parts>
- Optimize <performance-aspect>
```

### Configuration/Build
```
chore: update <config-area>

- Update <dependencies/tools>
- Modify <build-scripts>
- Configure <development-environment>
```

## Error Handling

### Common Issues and Solutions

1. **Merge Conflicts**: Resolve before committing
2. **Large File Warning**: Consider .gitignore updates
3. **Remote Rejection**: Pull and rebase if needed
4. **Authentication Issues**: Verify git credentials
5. **Branch Protection**: Ensure compliance with branch rules

### Fallback Strategy

If automatic push fails:
1. Commit locally with appropriate message
2. Provide manual push instructions
3. Include troubleshooting steps for common issues

## Success Criteria

- ✅ All changed files are properly staged and committed
- ✅ **MANDATORY: Documentation has been updated for all code changes**
- ✅ **MANDATORY: DEVELOPMENT.md includes new architectural decisions**
- ✅ **MANDATORY: copilot-instructions.md reflects current architecture state**
- ✅ Commit message follows conventional commit standards
- ✅ Changes are successfully pushed to remote repository
- ✅ No conflicts or errors in the git workflow
- ✅ Repository history remains clean and meaningful
- ✅ **Documentation and code are committed together (no documentation debt)**

## Usage

Invoke this prompt when you need to:
- Commit all current changes with appropriate messaging
- Push changes to remote repository
- Automate the complete git workflow
- Ensure consistent commit message standards
- Handle multiple file changes efficiently

The prompt will analyze your changes, generate appropriate commit messages, and complete the full git workflow from staging to remote push.