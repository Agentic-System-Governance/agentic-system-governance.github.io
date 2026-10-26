# Challenges Across Responsibilities

[Back to home](README.md) · [Responsibility guide](README.md#read-by-responsibility)

Each of the five responsibilities can have local mechanisms. A further difficulty is whether they continue to work together within one task, across multiple tools and executors. The following are problems this responsibility framework needs to address; they are not automatically research gaps established by the literature.

Each responsibility page uses one task to explain the problem, concrete judgments, and boundaries. This page examines the shared difficulties of sustaining those responsibilities through composition, handoffs, and change, without introducing a separate set of cases.

## Task requirements are hard to express completely

Users express purposes; execution produces parameters, files, messages, and state changes. Governance must connect these, avoiding both overly broad interpretations of vague goals and mistaken rejection of legitimate work. When delivery criteria conflict with permissions, it must expose the conflict rather than let separate local checks pass.

This affects authorization, monitoring, and acceptance. A testable question is whether judgments remain consistent when the same requirement is expressed through a different tool path or set of parameters.

## The supervisor cannot see every fact

The refund service knows processing status, the order system knows order progress, and the approval system knows the scope of approval. The supervisor may not see all of them at once. A missing receipt also does not prove that money has not been returned.

This affects fault judgments, recovery choices, and completion reports. A testable question is whether, when key evidence is missing, the system can state what is unknown, seek information, and avoid presenting guesses as established results.

## Governance decisions must precede the effects they control

Authorization present when an action is proposed may change before execution. By the time an alert arrives, an effect may already have occurred. Without an explicit temporal relationship among permission checks, revocation, and commitment of an action, it is impossible to determine which decision constrained which action.

This affects authorization, intervention, and later tracing. A testable question is whether changing the order of revocation and commitment preserves the stated rules, rather than working only under an ideal sequence.

## Safe stopping and task progress must be considered together

Banning all refunds prevents duplicate refunds but also prevents legitimate customers from being served. Retrying every timeout can instead cause overpayment. Governance should select recovery actions using current facts, authority, and service capabilities. When continuation is impossible, the agreed decision rights determines whether the governance agent terminates the task or a human intervenes with a new decision.

This affects responses, escalation, and acceptance. A testable question is which improper effects are reduced, how much legitimate work is preserved, and how many previously blocked tasks are resolved under the same task and resource conditions.

## Local correctness does not ensure an acceptable whole

A quotation agent selects an offer while the ordering agent does not know that an additional budget has yet to be approved. A CRM customer owner is updated successfully while specified old sharing permissions remain. A final quote omits the internal price floor while its attachment includes the price-floor table. Local checks may pass while critical task conditions remain unmet.

This affects multi-agent coordination, fault propagation, and recovery verification. A testable question is whether shared restrictions and evidence requirements remain effective when task branches merge, results are handed over, or state is reused.

## System changes can invalidate earlier judgments

Changing a model, updating a tool, installing a skill, or reusing new memories can change actual behavior. Previous monitoring and acceptance results do not automatically cover the new configuration. A recovery that changes persistent configuration may also affect future tasks.

This affects the continuing validity of every responsibility. A testable question is whether the system can identify judgments affected by an update, revalidate only the relevant parts, and withdraw invalid state and the downstream consequences that depend on it.

## The governance system can itself fail

A governance agent may misjudge, be influenced by untrusted content, stop responding, or lack a usable execution channel. Working agents and supervisors may also share similar blind spots. Adding an external agent does not automatically provide independence, reliability, or the ability to stop an action.

This requires identifying trusted components, checking monitoring health, and arranging usable control channels and fault handling; settings with human involvement also need explicit takeover conditions. A testable question is whether the system can detect supervisory failure or repeated false blocking and preserve the agreed state within the declared time and fault boundaries.

## Which issues should become research questions

First make the problem concrete: what property must hold under which task, observation, authority, timing, and fault conditions? Then compare the guarantees and assumptions of the most relevant existing mechanisms. If they already satisfy the requirements under equivalent conditions, integration and teaching demonstrations may be appropriate. If they do not, define the missing guarantee more precisely.

“Interfaces can fail,” “logs are incomplete,” and “recovery is needed” establish reasons to address a problem; they do not alone prove the need for a new method. The [survey map](survey-map.md) identifies existing material and places for further verification.
