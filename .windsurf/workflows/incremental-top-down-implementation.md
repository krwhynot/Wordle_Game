---
description: Incremental Top-Down Implementation
---

# Workflow: Incremental, Top-Down Implementation

<!--
This workflow breaks development into vertical slices. Each feature is developed and tested end-to-end.
It is copy-ready and compliant with your `.windsurf/workflows/` requirements.
-->

## Description

Implement project features one slice at a time — from UI to backend — while continuously documenting progress and validating output.

---

## Steps

1. **Select a Feature Slice**
   - Choose one vertical feature (e.g. authentication, dashboard).
   - Add a feature context summary in markdown.

2. **Provide Requirements to AI**
   - Supply relevant background and standards from planning phase.
   - Include diagrams or interface expectations if needed.

3. **Generate Code**
   - Use AI to draft full implementation for the selected slice.
   - Output must be testable and self-contained.

4. **Review and Test**
   - Manually test code.
   - If bugs or issues arise, prompt AI for fixes or make edits.

5. **Document the Feature**
   - Update markdown documentation with:
     - Feature description
     - Dependencies
     - How to test

6. **Repeat for Next Slice**
   - Once stable, move to the next feature slice.

---

## Notes

<!--
- Ideal for agile, modular development.
- Keeps codebase and docs aligned throughout.
- This file is copy-ready and compliant with your `.windsurf/workflows/` directory format.
-->

## Current Implementation Status

### Active Feature Slice: Game Board Accessibility
**Selected Feature**: Core Game Board with full accessibility support
**Context**: Building upon existing GameBoard, Row, and Tile components to add comprehensive ARIA attributes and keyboard navigation.

#### Requirements Provided to AI:
- Follow WCAG 2.1 AA accessibility guidelines
- Implement proper ARIA grid structure (role="grid", role="row", role="gridcell")
- Add descriptive labels for screen readers
- Support keyboard navigation
- Maintain existing animation and styling functionality

#### Current Progress:
- ✅ GameBoard component: Added ARIA grid role and dynamic status labels
- ✅ Row component: Added ARIA row attributes and contextual labeling
- 🔄 Tile component: In progress - adding ARIA gridcell attributes
- ⏳ Testing: Pending component completion
- ⏳ Documentation: Pending testing completion

### Next Feature Slices (Planned):
1. **Virtual Keyboard Enhancement**: Complete keyboard component with accessibility
2. **Game Logic Integration**: Connect components with game state management
3. **Animation Polish**: Enhance visual feedback and transitions
4. **Statistics Modal**: User game statistics and sharing
5. **Settings Panel**: Theme switching and preferences
6. **Help System**: Tutorial and rules explanation

### Feature Documentation Template:
```markdown
## Feature: [Feature Name]

### Description
Brief description of what this feature does and why it's needed.

### Dependencies
- List of other features/components this depends on
- External libraries or services required

### Implementation Details
- Key components/files modified or created
- Important design decisions
- Performance considerations

### Testing Instructions
1. Step-by-step testing guide
2. Expected behaviors
3. Edge cases to verify

### Accessibility Notes
- ARIA attributes used
- Keyboard navigation support
- Screen reader compatibility

### Known Issues
- Any limitations or temporary workarounds
- Future improvements planned
```

## Workflow Execution Notes

### Current Slice Execution Log:
**Date**: 2025-05-31
**Feature**: Game Board Accessibility
**Status**: In Progress

**Steps Completed**:
1. ✅ Selected Feature Slice: Game Board Accessibility enhancement
2. ✅ Provided Requirements: WCAG 2.1 AA compliance, ARIA grid structure
3. 🔄 Generating Code: 
   - GameBoard.tsx: Added role="grid", aria-label with dynamic status
   - Row.tsx: Added role="row", aria-rowindex, contextual labels
   - Tile.tsx: Adding role="gridcell", position indicators (in progress)

**Next Steps**:
4. Complete Tile component accessibility implementation
5. Test accessibility with screen reader simulation
6. Document feature implementation and testing guide
7. Update task status in Taskmaster
8. Move to next feature slice

### Quality Gates for Each Slice:
- [ ] Code compiles without TypeScript errors
- [ ] All existing functionality preserved
- [ ] New functionality works as specified
- [ ] Accessibility requirements met
- [ ] Documentation updated
- [ ] Manual testing completed
- [ ] Ready for next slice

### Integration Points:
- Each slice must maintain compatibility with existing code
- Follow established coding standards and patterns
- Update relevant documentation and task tracking
- Ensure performance targets are maintained
