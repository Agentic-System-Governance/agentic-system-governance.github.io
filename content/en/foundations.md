# Governance Objects and Responsibility Boundaries

[Back to home](README.md)

## Why governance is needed

Users usually give an agent a goal rather than a fixed list of every operation. To achieve that goal, the agent selects information, calls tools, revises plans, and may retain memories or delegate to other agents. These choices exercise authority, consume resources, and may affect people outside the task.

“Prepare a quote for this customer” does not automatically specify whether the internal price floor may be disclosed, how much discount may be promised, or whether the email needs confirmation. “Refund this order” does not resolve whether to retry after a timeout or whether the money has already been returned. These are questions of authority, execution, and responsibility in ordinary business tasks; a security incident is not needed to make them relevant.

**Governance concerns delegated tasks, authority, conduct and its consequences, and the responsibility relationships surrounding them.** Models, context, tools, memory, and collaboration networks are the places where these requirements must take effect.

## Boundaries and fulfillment both matter

Behavioral boundaries specify what must not be exceeded, such as disclosing an internal price floor or increasing a purchasing budget without authority. Fulfillment requirements specify what must be accomplished once a task is accepted, such as including every designated store in a report or transferring every target record in a customer handoff.

Neither substitutes for the other. A report that never exceeds its permissions but omits a store may still fail to fulfill the task. A quote that wins the sale while disclosing another customer's information is not a legitimate completion either.

Governance must also determine whether the conditions for completing the task still hold. If authorized data cannot be obtained or the budget is exhausted, the governance agent should adjust or terminate the task according to the agreed decision rights, or obtain a new decision through human involvement, while identifying what remains unfinished.

## Three roles

| Role | Main work | Example in a customer refund |
|---|---|---|
| Working agent | Selects and executes methods for completing the task | Checks the order, initiates an authorized refund, and queries its result |
| Governance agent | Makes governance judgments within its responsibilities, and coordinates and supervises the response | Checks amounts and recipient routes, detects timeouts, controls retries, and requires evidence of results |
| Human or responsible organization | Assigns and revises responsibilities, and bears the associated management and remedial duties | Defines refund authority, approves exceptions, and takes over disputes that cannot be handled automatically |

The governance system includes these participants, procedures, and technical controls. A governance agent performs some of this work; it is not the entire governance system. A fixed permission checker can also contribute to governance, but running independently does not automatically make it an agent.

One system may serve several roles, provided the basis for its decisions remains distinguishable. A working agent's self-check is useful; where independent approval is required, it cannot replace approval from the authorized party.

## How the five responsibilities work together

The five responsibilities are distinguished by what they judge and the work they undertake. They can share evidence, tools, and execution mechanisms. They are not five sequential stages, and each does not require a separate agent.

| Responsibility | Central judgment | Required result |
|---|---|---|
| [Mandate Alignment](goals/01-mandate.md) | What the system commits to deliver, how it may act, and how the agreement is implemented and kept valid | Negotiated delivery conditions and execution boundaries, with corresponding checks, controls, and review duties |
| [Execution Oversight](goals/02-oversight.md) | Whether current risks allow activity to continue and whether actual effects support continuation or completion | Risk judgments, appropriate release decisions or intervention, and evidence-backed outcome verification |
| [Fault Resolution](goals/03-troubleshooting.md) | Why execution failed or departed from requirements, how contributing conditions can be corrected, and how existing damage can be repaired | Supported failure attribution, operational remediation, and restoration of affected state, with unresolved matters retained |
| [Multi-Agent Coordination](goals/04-coordination.md) | Who owns pending work, whether prerequisites hold, and whether the states and contributions used by participants are compatible | Assignment of subtasks and follow-up duties, dependency management, and consistency maintenance |
| [Auditability Assurance](goals/05-accountability.md) | What actually happened, whose authority supported it, and whether conduct met the requirements applicable at the time | Reviewable execution reconstruction, responsibility attribution, and compliance assessment, with explicit evidence gaps |

Mandate Alignment establishes and maintains delivery conditions and execution boundaries. Execution Oversight monitors risks, determines how to intervene, and verifies actual effects. When execution fails or does not meet requirements, Fault Resolution investigates the causes, corrects execution methods, and repairs affected state; routine retries need not be exhausted first. Multi-Agent Coordination organizes work involving divisions of responsibility, dependencies, or state compatibility across agents and human participants. Auditability Assurance requires linked evidence to be retained during execution so that these processes and their authority relationships can be reconstructed and assessed in a review.

Overlap does not require duplicate checks. Coordination assigns a writing agent to revise an outdated conclusion, while execution oversight verifies whether the revised report satisfies delivery conditions; one check can supply the evidence needed by both. Fault resolution repairs artifacts and their dependencies, while outcome verification checks what was actually restored. Responsibility attribution in an audit traces participants' authority and assigned duties; failure attribution in fault resolution explains the conditions that contributed to failure. Neither replaces the other. The three aspects of each responsibility appear in the [survey map](survey-map.md).

## Governance decision rights and decisions about continuation

A working agent's autonomous execution and governance decision rights must be specified separately. A working agent's ability to pay automatically does not give the governance agent authority to change the budget. Authority to terminate a task does not require the governance agent to perform every business operation itself.

When authorized to act autonomously, the governance agent handles state changes, decides adjustments, and terminates the task when continuation is no longer possible, using the valid mandate and its delegated governance authority. It can make authorized rule changes and update the mandate without turning every difficulty into a wait for a human.

In a setting with human involvement, a person may revise rules or issue a new decision. Requests should identify the matter and its supporting grounds. While waiting, the system retains task state, response arrangements, and follow-up responsibility; affected actions pause while other authorized work may continue. Once a decision arrives, valid changes must reach the relevant executors.

Termination requires an explanation of its grounds, completed and unfinished work, and external effects that have occurred or remain unconfirmed. Stopping future execution does not cancel actions already in flight. Related queries and follow-up work still require the authority specified in the mandate, and decisions and their effects should be retained for later tracing.

## What counts as governance intervention

A working agent that detects a network error and retries under an existing rule is exercising an ordinary execution capability. A governance system that specifies which failures must be reported, supervises retry limits, decides whether to use a different tool, and verifies subsequent results is governing that execution. Both may use the same retry mechanism; their responsibilities and decision authority differ.

A governance agent can guide recovery without possessing the expertise to solve every specialist problem. It may arrange replanning or a service change, make authorized adjustments and termination decisions in autonomous action within delegated authority, or request the relevant decision when humans are involved. When it rewrites a quote or generates a report itself, it also takes on a working role.

## Task failure and governance failure

Repeated failure to query one store is an execution fault. Governance may still have fulfilled its responsibilities if it promptly detects the problem, attempts authorized recovery, avoids treating missing data as zero, and terminates the task or requests a new decision according to the agreed decision rights, while explaining partial results and pending work. An unfinished task does not necessarily mean oversight failed. What matters also includes whether the assigned duties to detect, respond, and hand over were fulfilled.

Conversely, governance problems can exist even when a task happens to finish: data obtained without authority may prove useful, or an inactive supervisory system may escape consequences on this occasion.

Assessing governance failure requires specifying the assigned responsibility, the observation and control capabilities available or required, the conditions and time within which a response was due, and the particular duty that was not fulfilled. A checker responsible only for disclosure in attachments cannot alone be expected to prove that an entire quote was calculated correctly.

## The governance system also needs constraints

A governance agent should have a defined observation scope, intervention authority, resource budget, and escalation path. Permission to pause a task does not imply permission to change the user's goal. Permission to inspect information does not permit unlimited collection of personal data.

After the original task ends or is cancelled, queries about outstanding requests, reviews, and remedial work also need explicit authority. The need to address residual effects does not automatically keep all original permissions valid.

The system must also arrange for its own faults: whether monitoring has stopped, responses remain unassigned, or legitimate work is repeatedly blocked. Fixed health checks, independent review, and human responsibility arrangements can address these issues without adding an endless hierarchy of supervisory agents. Any guarantee ultimately depends on clearly stated trusted components and operating conditions.

## Continue reading

Use the [responsibility guide](README.md#read-by-responsibility) to explore each responsibility through a task, its decision evidence, and its boundaries. [Shared challenges](challenges.md) explain why combining these responsibilities is difficult.
