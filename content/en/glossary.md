# Glossary

[Back to home](README.md)

| Term | Meaning in this Wiki |
|---|---|
| Working agent | An agent that selects and executes methods for a concrete task, such as retrieval, writing, or tool calls |
| Governance agent | An agent assigned one or more governance responsibilities that judges, coordinates, or intervenes within the corresponding authority |
| Governance system | The people, organizations, procedures, and technical controls that jointly perform governance; broader than a single governance agent |
| Mandate | A valid agreement formed by aligning user needs with system capabilities, applicable rules, and authority; it specifies task requirements, division of work, action conditions, completion evidence, governance authority, and decision arrangements |
| Governance rules | Requirements and conditions in the mandate that must be checked during execution, including task obligations, permissions, prerequisites, and recovery and completion conditions; they may come from existing policies or valid decisions and need not be program code |
| Mandate Alignment | Confirms delivery conditions and execution boundaries through interactive negotiation, operationalizes commitments as checks, controls, and review duties, and continuously maintains their validity |
| Delivery conditions | The committed outputs, acceptance requirements, and evidence supporting acceptance |
| Execution boundaries | Permitted operations, resource limits, delegation scope, and decisions reserved for an authorized party |
| Authorization | Permission from an authorized party for a participant to act within a specified scope and under specified conditions; technical capability does not automatically confer authority |
| Performance obligation | Work required after accepting a responsibility, such as reporting a fault, returning evidence, or completing a designated delivery |
| Execution fault | A step or run that does not work as expected, such as a query timeout; it need not involve a violation |
| Stalling | A lack of recognizable, reasonable progress under the task and resource conditions, such as repeating the same failed action |
| Governance failure | Failure to fulfill an assigned governance responsibility under its stated conditions; not equivalent to task failure |
| Recovery | Removing an execution blockage so that the relevant work can continue under permitted conditions; performing a recovery action does not establish that recovery conditions have been met |
| Fault Resolution | Investigates failed or nonconforming execution, corrects operating conditions that cause or sustain the problem, and restores affected state |
| Failure Attribution | Uses execution evidence to explain contributing conditions, consequential decisions, and propagation paths; retains hypotheses that have not been established |
| Operational Remediation | Adjusts plans, calls, tools, or operating conditions to restore reasonable execution in response to a diagnosed or suspected fault |
| State Restoration | Repairs memory, artifacts, and external resources affected by a fault, preserving still-valid changes and identifying effects that cannot be remedied |
| Multi-Agent Coordination | Organizes interdependent work among agents and human participants under the valid mandate through sub-task allocation, dependency management, and consistency maintenance |
| Correction | Changes behavior, results, or governance arrangements that depart from requirements; the object being changed must be identified |
| Escalation | Transfers an issue to a person or system with the required authority, capability, or responsibility, with arrangements for waiting and takeover |
| Execution Oversight | Uses risk monitoring, supervisory intervention, and outcome verification to determine whether activity may continue and whether actual effects support continuation or completion |
| Verification | Relates evidence about current state, actions, and results to applicable rules to judge whether task requirements, permissions, or recovery and completion conditions hold; it occurs throughout execution |
| Acceptance | Determines whether a task or deliverable can be accepted against previously established conditions |
| External effect | An actual change caused by a tool in a business system, such as a credited refund, placed purchase order, or changed customer record, rather than merely issuing a request |
| Duplicate prevention | Prevents the same operation from producing repeated effects under stated business identifiers and service conditions; it must not be assumed to be available in every tool |
| Handoff | Transfers a task, current authority, pending decisions, and follow-up duties to a recipient; sending a message does not establish that someone has taken over |
| Sharing permissions | Access relationships granted to other participants on business records; whether they change when an owner changes must be checked for the particular system |
| Pending confirmation | Current evidence is insufficient to determine whether a condition holds; further support is needed, and the condition cannot automatically be classified as satisfied or unsatisfied |
| Unknown outcome | The actual effect remains unconfirmed; it cannot be treated as an action that did not occur or has already failed |
| Rollback | Restores reversible state to an earlier state; it must not be assumed to reverse every external effect |
| Remedial action | Follow-up treatment of effects that have already occurred, such as issuing a correction or contacting the responsible party; it may not eliminate the original effect |
| Responsibility Attribution | Links actual actions to principals, executors, approvers, and reviewers, tracing their authority and assigned duties; it does not automatically constitute a ruling on liability |
| Auditability Assurance | Enables execution reconstruction, responsibility attribution, and compliance assessment based on records; evidence integrity, retention, and authorized retrieval support all three |
| Execution Reconstruction | Reconstructs the relationships among context, decisions, tool actions, and external effects from linked records, distinguishing proposals, dispatch, acknowledgment, and actual occurrence |
| Compliance Assessment | Relates actions and data use in the realized trajectory to the requirements and authority applicable at the time, producing supported findings while retaining unresolved matters |
| Evidence Preservation | Retains required records and their objects, times, versions, and dependencies; a supporting mechanism for Auditability Assurance |
| Traceability | The ability to reconstruct key events and participation from retained evidence; linked evidence supports this capability required for Auditability Assurance |
| Harness | The runtime layer organizing an agent's loop, tool calls, state, and controls; the main draft uses the term harness |
| Governance decision rights | Who makes governance judgments, rule changes, and decisions about continuation; distinct from a working agent's task autonomy |
| Autonomous action within delegated authority | The governance agent autonomously adjusts, continues, or terminates tasks within delegated governance authority; authorized rule changes do not require waiting for a human decision |
| Setting with human involvement | People may participate in rule changes or issue new decisions; the system must specify waiting states, response arrangements, and follow-up responsibility |
| Termination | Stops future task execution under current conditions while explaining its grounds and unresolved matters; it does not automatically reverse previous actions or effects already in flight |

English terminology is retained where comparison with the survey is needed. The meaning of a concrete operation depends on the task, service capabilities, and current authority.
