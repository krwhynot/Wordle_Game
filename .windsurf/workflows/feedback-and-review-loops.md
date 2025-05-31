---
description: Feedback and Review Loops
---

# Workflow: Feedback and Review Loops

<!--
This workflow enforces structured code review cycles using AI and human feedback.
It is copy-ready and compliant with your `.windsurf/workflows/` requirements.
-->

## Description

Create quality gates using multi-agent or self-reflective review cycles. This ensures the AI-generated code is critiqued before integration.

---

## Steps

1. **Collect Code for Review**
   - Take generated code from the current implementation step.
   - Save in a temporary `.tmp` or staging file.

2. **Choose Review Strategy**
   - Decide:
     - `self-review`: AI critiques its own code.
     - `multi-agent`: Use another AI to provide external feedback.

3. **Identify Issues**
   - Request detection of:
     - Code smells
     - Inefficient logic
     - Violated standards from planning phase

4. **Refactor Code**
   - Apply AI-suggested improvements.
   - Request explanation for every major change.

5. **Manual Review**
   - Perform human review.
   - Decide to accept, revise, or reject proposed code.

6. **Summarize Decisions**
   - Store review outcomes in `Chatlog.md` or `review-log.md`.

---

## Notes

<!--
- Helps catch errors early and improve AI quality.
- Encourages collaboration between agents and developers.
- This file is copy-ready and compliant with your `.windsurf/workflows/` directory format.
-->

## Review Templates

### Self-Review Template
```markdown
## Self-Review: [Component/Feature Name]
**File**: `path/to/file.tsx`  
**Date**: YYYY-MM-DD

### Code Quality Assessment
- [ ] Follows project coding standards
- [ ] TypeScript types are properly defined
- [ ] No console.log statements in production code
- [ ] Error handling is appropriate
- [ ] Performance considerations addressed

### Accessibility Review
- [ ] ARIA attributes correctly implemented
- [ ] Keyboard navigation works as expected
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Screen reader announcements are clear and helpful

### Suggested Improvements
1. [Area for improvement]
   - Current implementation: [brief description]
   - Suggested change: [proposed solution]
   - Benefit: [why this is an improvement]

### Final Assessment
[Overall assessment of code quality and readiness]
```

### Multi-Agent Review Template
```markdown
## Multi-Agent Review: [Component/Feature Name]
**Reviewer**: [Agent Name/ID]  
**Date**: YYYY-MM-DD

### Code Review
- **Strengths**:
  - [List positive aspects]
- **Areas for Improvement**:
  - [List issues found]

### Security Assessment
- [ ] Input validation in place
- [ ] No sensitive data exposure
- [ ] Authentication/authorization checks
- [ ] Rate limiting considered

### Performance Analysis
- [ ] No unnecessary re-renders
- [ ] Efficient data fetching
- [ ] Bundle size impact considered

### Recommendations
1. [Specific recommendation]
   - Impact: [High/Medium/Low]
   - Effort: [S/M/L]
   - Priority: [P0/P1/P2]

### Review Outcome
[Approve/Request Changes/Reject]
```

## Implementation Guidelines

### When to Use This Workflow
- After completing a feature implementation
- Before creating a pull request
- When refactoring critical components
- When introducing new architectural patterns

### Review Checklist
- [ ] Code compiles without errors/warnings
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Performance benchmarks met
- [ ] Accessibility requirements satisfied

### Version Control Integration
1. Create a feature branch: `git checkout -b feature/name`
2. Commit changes with conventional commit message
3. Push to remote: `git push origin feature/name`
4. Create pull request with template
5. Request review from team members

### Automated Checks
- ESLint/Prettier formatting
- TypeScript type checking
- Unit test coverage
- E2E test suite
- Bundle size analysis

## Review Log

| Date | Component | Review Type | Issues Found | Status |
|------|-----------|-------------|--------------|--------|
| 2025-05-31 | GameBoard | Self-Review | 2 minor | ✅ Fixed |
| 2025-05-30 | Keyboard | Multi-Agent | 1 critical | ⏳ In Progress |

## Continuous Improvement

### Metrics to Track
- Time to complete reviews
- Number of issues found per review
- Time to resolve identified issues
- Reviewer feedback quality

### Process Improvements
- Regularly update review checklists
- Share learnings in team retrospectives
- Adjust review process based on metrics

---

*Last Updated: 2025-05-31*
