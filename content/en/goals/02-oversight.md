# Execution Oversight

[Back to home](../README.md)

**Execution Oversight uses the valid mandate and execution evidence to determine whether activity may proceed, which restrictions are needed, and whether actual effects support continuation or completion.** Risk monitoring identifies risks and uncertainty in actions and execution trajectories; supervisory intervention turns judgments into permission, restrictions, pauses, or escalation; outcome verification checks the effects of actions, interventions, and repairs. These functions recur as the evidence changes.

Continuing the computer purchase example: the system is authorized to autonomously purchase five computers that meet the specification standard, with a total including tax and delivery of no more than CNY 30,000 and arrival before Friday. The working agent queries suppliers, orders, pays, and tracks delivery; the designated recipient inspects the goods. The governance agent may query transactions and hold payments whose conditions are unmet. Requirements, authority, and the necessary capabilities are already established.

## Risk Monitoring

An approved supplier quotes CNY 28,000, requiring a CNY 2,000 deposit to reserve the stock and the remaining CNY 26,000 once the goods are ready. Existing authorization permits this arrangement and requires the seller's readiness confirmation before full payment. After initiating the deposit payment, the working agent encounters a network interruption and cannot obtain the result. When asked, the seller replies, “We have not received the deposit.”

The call record establishes only that payment was initiated; the seller's reply does not establish that the transaction failed. The current state should be recorded as “deposit payment for this order: result unconfirmed,” while the original transaction and receipt of funds are checked. Simply waiting for the goods to be prepared could miss the delivery deadline, while making another payment could pay twice. Monitoring must connect the uncertain state to both consequences and determine which evidence to obtain first.

This requires recognizing more than a tool error. The supplier's descriptions of “deposit,” “balance,” and “goods ready” must be mapped to this order's payment obligations and delivery conditions. Payment receipts, seller messages, and order status may also update at different times. Budget checks detect excess spending, while transaction identifiers and idempotency mechanisms prevent repeated execution of the same request. They cannot alone determine whether a new payment request would fulfill the same obligation twice. A model can help interpret messages, but transaction evidence is still needed.

## Supervisory Intervention

While the original transaction's result is unknown, the governance agent should use payment controls to hold any additional deposit payment and arrange a query of the original transaction. Unaffected checks on delivery information may continue. Payment may be initiated again under the original authorization only after the first transaction is confirmed to have failed; if receipt is confirmed, the task moves to waiting for the goods to be ready. This intervention need not wait for routine retries to fail: the issue is whether the next action could increase uncertain consequences.

Before paying the balance, the current order, recipient, amount, and evidence that the goods are ready should be checked. “Deposit received” supports only the payment status; “preparing to arrange the goods” does not meet a condition requiring that the goods already be ready. The governance agent must relate the meaning of the messages to valid rules, then use an effective control to release payment or keep it on hold. Being within budget is not sufficient for release, and merely reminding the working agent does not establish that payment has been blocked.

When existing authorization covers the action and its conditions are met, the working agent may continue autonomously. If waiting will affect delivery before Friday, the governance agent should decide the next step within its authority. Changes to the budget or delivery commitment require a new decision by an authorized party. Autonomous execution grants no additional authority; with human involvement, the pending decision and arrangements during the wait should also be clear.

## Outcome Verification

After issuing a hold instruction, the system must confirm that the controlled payment path has actually paused. If a request has already been sent, its actual effect must still be checked. A successful response to the instruction does not prove that a payment in progress has been canceled, and one successful later query does not automatically prove that no duplicate payment occurred earlier.

Confirmation that the deposit arrived supports only completion of that payment. Confirmation that the goods are ready supports the corresponding condition for paying the balance. Even successful completion of all payments does not establish that the five computers were delivered as required. Final verification should connect order, transaction, and receiving evidence to check quantity, specifications, cost, and arrival time. Without the physical inspection results, the outcome remains unconfirmed; a delivery signature cannot replace the agreed acceptance checks.

Verification also covers the state after intervention or repair. Existing valid evidence may be reused, but it must still correspond to the current order and artifacts. The challenge is to determine which conclusion each piece of evidence supports and whether a changed state invalidates an earlier conclusion. A model's statement that the task is “complete” cannot replace external facts, and a few successful status fields do not establish that the whole task is complete.
