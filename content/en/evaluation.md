# Evaluating Governance

[Back to home](README.md) · [Shared challenges](challenges.md)

## What to evaluate

Evaluation should establish whether the governance system fulfilled its stated responsibilities and at what cost. A working agent's final success rate is relevant, but it cannot alone show whether authorization, oversight, recovery, and accountability worked.

At a minimum, specify the task, authority, fault scope, visible information, available controls, and resource budget. Effects that cannot be observed must not silently disappear from the evaluation; report unknown states separately.

## Checks for the five responsibilities

The following are suggested evaluation dimensions for this responsibility framework, not a summary of metrics used in existing papers.

| Responsibility | Possible checks | What to report alongside them |
|---|---|---|
| Mandate Alignment | Vary requirements, system capabilities, and authority; check whether negotiated delivery conditions and execution boundaries are implemented correctly and remain valid | Unresolved decisions, semantic omissions, correspondence between capabilities and permissions, check and control coverage, and propagation of revisions |
| Execution Oversight | Vary risks and visible evidence; check whether interventions are timely and appropriate and whether actual effects support continuation or completion | Detection and false-positive rates, intervention timing and scope, legitimate progress, unknown outcomes, and incorrect completion claims |
| Fault Resolution | Check the evidence supporting a failure explanation, corrections to contributing conditions, and whether affected state was actually restored | Attribution evidence and uncertainty, recovery rate and cost, restoration coverage, residual damage, new effects, and grounds for termination |
| Multi-Agent Coordination | Change one participant's result or assignment; check whether subtask ownership, dependencies, and shared outputs are updated accordingly | Unowned or duplicated work, prerequisite validity, dependency coverage, scope of pauses, and versions actually used |
| Auditability Assurance | Have an authorized reviewer reconstruct execution, trace authority and responsibility, and examine actual conduct against the requirements applicable at the time | Reconstructable trajectory scope, links to delegation and approval, rule versions, grounds for compliance findings, unresolved obligations, and evidence gaps |

## How to test whether a responsibility is necessary

Each [responsibility page](README.md#read-by-responsibility) illustrates judgments and actions through one case. Subsequent evaluation can extract the relevant requirements and checkpoints, specify which functions are removed, and check whether equivalent functions remain elsewhere. The five responsibilities should not be assumed to be disjoint modules.

Removing a module called a “monitoring agent” while retaining functionally equivalent polling and responses does not remove oversight. Execution Oversight includes risk monitoring, supervisory intervention, and outcome verification. These capabilities can be evaluated separately, but a system retaining equivalent verification cannot be treated as having no verification. A system that can still alert but cannot stop actions has not retained full intervention capability either. Comparisons must specify which function has actually been removed.

These comparisons test which functions have an indispensable role under the stated conditions. They are not experiments already conducted here, and they do not alone establish that a particular governance agent outperforms fixed rules or human arrangements.

## How to define task recovery rate

One bounded metric can be defined as follows: among faulty tasks declared in advance to have a recovery path, the proportion in which the governance system enables recovery and the task ultimately passes its original acceptance conditions.

Before execution, specify the included faults, resource limits, permitted recovery methods, acceptance conditions, and observation window. Do not remove unrecovered tasks afterward and then claim a high recovery rate.

This metric does not represent all aspects of fault resolution. Even after progress resumes, previously damaged artifacts, contaminated memory, or unconfirmed external effects may remain; report state-restoration coverage separately. For tasks that were inherently unrecoverable, separately evaluate the grounds and results of autonomous termination in autonomous action within delegated authority, or requests for decisions, waiting, and follow-up implementation when humans are involved. Results obtained through unauthorized access must not count as successful compliant recovery.

In the main draft's current metrics table, Recovery R. concerns whether protected data can later be elicited, an information-leakage measure. It is not the task fault-recovery rate defined here. The two should use different names.

## How to isolate the contribution of governance

With the same working agent, task, tools, and resources, compare execution under the working agent's own strategy, fixed fault-handling rules, and coordination by a governance agent with bounded authority. Fixed rules may also be effective; the comparison should not be restricted to executors with no recovery capability.

If the governance component receives additional state queries, a larger budget, or more powerful tools, identify these capabilities separately and compare other arrangements with the same capabilities. Otherwise, not all gains can be attributed to governance judgment.

## Which scenarios are needed

Extract normal and failure states from the single motivating case on each responsibility page while keeping the original task and authority conditions unchanged. When extending the scenarios, first vary observations, time limits, or execution results within the same case. Avoid adding many new rules at once and losing a clear comparison boundary.

A teaching simulator can retain actual state as an independent evaluation reference. The governance component being evaluated may read only the information allowed by the scenario; it must not use hidden state to decide. Evaluation should also avoid treating that component's own “allowed” or “completed” declaration as ground truth.

## How to report results

Report improper effects, legitimate task completion, fault recovery, accurate termination reports, human effort, and operating costs together, and identify the denominator of every rate. Detection latency needs a specified starting event. Tasks whose outcomes remain unknown at the end of the observation window should be listed separately.

Consequence measures should correspond to the failure points described on the responsibility pages. Report improper conduct, missing task outcomes, waiting, and evidence availability separately instead of compressing different consequences into an apparently unified success score.

The five responsibilities may involve tradeoffs. Fewer false positives alongside more missed risks, or more recovery alongside uncontrolled costs, must both be visible. Adding checks does not guarantee improvement in every measure.

## Continue reading

The [worksheet](worksheet.md) helps define responsibility and evaluation boundaries. The responsibility pages provide the motivating tasks and execution scenarios. The [survey map](survey-map.md) explains the relationship between evaluation in the current Chapter 5 and the responsibilities in Chapter 3.
