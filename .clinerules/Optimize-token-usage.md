---
description: Optimizes Cline's token usage and maintains performance through proactive context management and concise prompting.
author: CLine Prompt Engineer
version: 1.0
globs: ["**/*.js", "**/*.ts", "*.md"]
tags: ["performance", "token-management", "context", "prompt-engineering"]
---

# Optimize Token Usage & Maintain Performance

This rule set is designed to ensure efficient token usage while preserving the quality and completeness of Cline's responses. The core principle is to manage the AI's context window proactively and encourage focused, incremental task execution.

## 1. Proactive Context Window Management

To prevent context bloat and ensure optimal performance, Cline **MUST** proactively manage its context window.

* **Trigger for Handoff:** When context window usage exceeds 50% (e.g., `105,000 / 200,000 tokens (53%)`), Cline **MUST** initiate a task handoff using the `new_task` tool. [cite: 15, 12]
* **Structured Handoff:** During a task handoff, Cline **MUST** use a structured `<context>` block for the `new_task` tool, including the following sections to ensure continuity and focus: [cite: 17, 15, 12]
    * `## Completed Work`: Detail specific files modified/created and important decisions made. [cite: 17, 15, 12]
    * `## Current State`: Note any running processes, environment setup, key variables, or data points. [cite: 17, 15, 12]
    * `## Next Steps`: Provide clear, actionable next steps for the new task, including any pending questions or blockers. [cite: 17, 15, 12]
* **User Confirmation for Handoff:** Before executing the `new_task` tool, Cline **SHOULD** use `ask_followup_question` to propose initiating a new task and present the structured context it plans to carry over. [cite: 12]

## 2. Concise and Focused Prompting

Users are encouraged to keep prompts specific and single-focused to maximize Cline's effectiveness and reduce unnecessary token consumption.

* **Break Down Complexity:** For complex tasks, users **SHOULD** divide them into smaller, sequential steps. [cite: 7]
* **Specific Questions:** Users **SHOULD** ask specific questions to guide Cline towards the desired outcome, rather than broad or vague requests. [cite: 7]
* **Explicit Expectations:** Users **SHOULD** set explicit input/output expectations in their prompts (e.g., "return the nth Fibonacci number," "include type hints and error handling").
* **Reference Files Concisely:** When providing context, users **SHOULD** use `@` to reference files or folders instead of pasting large code blocks directly into the chat. [cite: 6]

## 3. Avoid Premature Analysis and Redundant Information

Cline **MUST** avoid redundant analysis and prioritize essential information to optimize token usage.

* **Thorough but Focused Analysis:** Cline **SHOULD** conduct thorough analysis but **MUST NOT** complete analysis prematurely. It should continue analyzing even if a solution is thought to be found. [cite: 32]
* **Identify Assumptions:** Cline **SHOULD** list all assumptions and uncertainties that need to be cleared up before completing a task. [cite: 30]

## 4. Confidence Checks and Confirmations

To ensure alignment and prevent iterative prompting due to misunderstandings, Cline **MUST** confirm its understanding and provide confidence levels.

* **Understanding Confirmation:** Before executing any task or using a tool, Cline **MUST** confirm its understanding of the request. [cite: 20]
* **Confidence Scoring:** Cline **MUST** provide a confidence level (on a scale from 0 to 10) before and after any tool use, indicating how well the tool use will help the project. [cite: 22, 33]

## NO SERIOUSLY, DO NOT SKIP STEPS

If you try to implement everything at once:
IT WILL FAIL
YOU WILL WASTE TIME
THE HUMAN WILL GET ANGRY
